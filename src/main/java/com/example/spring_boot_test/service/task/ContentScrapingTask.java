package com.example.spring_boot_test.service.task;

import com.example.spring_boot_test.entity.Article;
import com.example.spring_boot_test.entity.ArticleSource;
import com.example.spring_boot_test.repository.ArticleRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

public class ContentScrapingTask implements Runnable {
    private static final Logger logger = LoggerFactory.getLogger(ContentScrapingTask.class);
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    private static final int CONNECTION_TIMEOUT = 15000; // 15 giây

    private final Article article;
    private final ArticleSource articleSource;
    private final ArticleRepository articleRepository;

    public ContentScrapingTask(Article article, ArticleSource articleSource, ArticleRepository articleRepository) {
        this.article = article;
        this.articleSource = articleSource;
        this.articleRepository = articleRepository;
    }

    @Override
    public void run() {
        String url = article.getUrl();
        logger.info("🤖 Bắt đầu cào nội dung cho URL: {}", url);

        try {
            // 1. Tải trang
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(CONNECTION_TIMEOUT)
                    .followRedirects(true)
                    .get();

            // 2. Trích xuất dữ liệu bằng selectors từ DB
            extractData(doc);

            // 3. Cập nhật trạng thái và lưu vào DB
            article.setCrawled(true);
            articleRepository.save(article);
            logger.info("✅ HOÀN TẤT cào nội dung và cập nhật cho: {}", article.getTitle());

        } catch (IOException e) {
            logger.error("❌ Lỗi kết nối/phân tích HTML tại {}: {}", url, e.getMessage());
            // Có thể thêm logic retry hoặc đánh dấu status lỗi ở đây
        } catch (Exception e) {
            logger.error("❌ Lỗi chung khi xử lý URL {}: {}", url, e.getMessage());
        }
    }

    private void extractData(Document doc) {
        // Tiêu đề
        String title = Optional.ofNullable(doc.selectFirst(articleSource.getTitleSelector()))
                .map(Element::text)
                .orElse(null);
        article.setTitle(title);

        // Mô tả (Description/Sapo)
        String description = Optional.ofNullable(doc.selectFirst(articleSource.getDescriptionSelector()))
                .map(Element::text)
                .orElse(null);
        article.setDescription(description);

        // Nội dung chính
        StringBuilder contentBuilder = new StringBuilder();
        Elements contentElements = doc.select(articleSource.getContentSelector());

        for (Element element : contentElements) {
            String text = element.text().trim();
            if (!text.isEmpty()) {
                contentBuilder.append(text).append("\n\n");
            }
        }
        article.setContent(contentBuilder.toString().trim());

        // Ảnh đại diện (Lấy ảnh đầu tiên)
        String imageUrl = Optional.ofNullable(doc.selectFirst(articleSource.getImageSelector()))
                .map(e -> e.attr("abs:src"))
                .orElse(null);
        article.setImageUrl(imageUrl);
    }
}
