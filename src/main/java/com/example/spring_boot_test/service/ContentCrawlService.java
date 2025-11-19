package com.example.spring_boot_test.service;

import com.example.spring_boot_test.entity.Article;
import com.example.spring_boot_test.entity.ArticleSource;
import com.example.spring_boot_test.repository.ArticleRepository;
import com.example.spring_boot_test.repository.ArticleSourceRepository;
import com.example.spring_boot_test.service.task.ContentScrapingTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class ContentCrawlService {
    private static final Logger logger = LoggerFactory.getLogger(ContentCrawlService.class);
    private static final int THREAD_POOL_SIZE = 10;
    private static final int BATCH_SIZE = 25; // Số lượng link lấy ra để cào trong 1 lần chạy
    private static final Integer ACTIVE_STATUS = 1; // Giả sử status = 1 là bài viết đang hoạt động

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleSourceRepository articleSourceRepository;

    private String extractDomain(String url) throws URISyntaxException {
        URI uri = new URI(url);
        String domain = uri.getHost();
        if (domain != null) {
            return domain.startsWith("www.") ? domain.substring(4) : domain;
        }
        return null;
    }

    public void startContentCrawling() {
        // 1. Lấy danh sách link chưa cào
        List<Article> articlesToCrawl = articleRepository.findTop25ByCrawledFalseAndStatus(ACTIVE_STATUS);

        if (articlesToCrawl.isEmpty()) {
            logger.info("Không tìm thấy bài viết nào cần cào nội dung (crawled = false).");
            return;
        }

        logger.info("🚀 Bắt đầu quá trình cào nội dung cho {} bài viết...", articlesToCrawl.size());

        // 2. Khởi tạo Thread Pool
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

        for (Article article : articlesToCrawl) {
            try {
                // 3. Tìm Domain và Selector tương ứng
                String domain = extractDomain(article.getUrl());
                if (domain == null) continue;

                Optional<ArticleSource> sourceOpt = articleSourceRepository.findByDomain(domain);

                if (sourceOpt.isPresent()) {
                    // 4. Giao nhiệm vụ cào cho Task (trong luồng mới)
                    ArticleSource source = sourceOpt.get();
                    executor.submit(new ContentScrapingTask(article, source, articleRepository));
                } else {
                    logger.warn("Không tìm thấy ArticleSource cho domain: {}", domain);
                }
            } catch (URISyntaxException e) {
                logger.error("URL không hợp lệ: {}", article.getUrl());
            }
        }

        // 5. Đóng Thread Pool (chờ các luồng hoàn tất)
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) { // Chờ tối đa 60 giây
                executor.shutdownNow();
                logger.warn("Một số luồng chưa kịp hoàn tất đã bị ngắt.");
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }

        logger.info("🏁 ĐÃ HOÀN TẤT quá trình cào nội dung batch hiện tại.");
    }
}
