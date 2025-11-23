package com.t2404e.newscrawler.service.crawler;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleStatus;
import com.t2404e.newscrawler.entity.Source;
import com.t2404e.newscrawler.repository.ArticleRepository;
import com.t2404e.newscrawler.repository.SourceRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LinkCrawlerService {

    private final SourceRepository sourceRepo;
    private final ArticleRepository articleRepo;

    public int crawlLinks() {
        int savedCount = 0;
        List<Source> sources = sourceRepo.findAll();

        for (Source src : sources) {
            try {
                if (src.getLinkSelector() == null || src.getLinkSelector().isBlank()) {
                    System.out.println("⚠ Source thiếu linkSelector: " + src.getTitle());
                    continue;
                }

                // Build URL safely
                String url = src.getDomain().replaceAll("/$", "")
                        + src.getPath().replaceAll("^/", "/");

                Document doc = Jsoup.connect(url).get();

                for (Element a : doc.select(src.getLinkSelector())) {
                    String link = a.attr("abs:href");
                    link = normalizeUrl(link);

                    // Bỏ link rác hoặc trùng
                    if (link == null || !link.startsWith("http")) continue;
                    if (articleRepo.existsByUrl(link)) continue;

                    // Lưu vào DB
                    Article article = Article.builder()
                            .url(link)
                            .articleCategory(src.getArticleCategory())
                            .source(src)
                            .status(ArticleStatus.NEW)
                            .build();

                    articleRepo.save(article);
                    savedCount++;

                    // 💤 Sleep tránh bị 429 hoặc chặn
                    try {
                        Thread.sleep(500 + (int) (Math.random() * 1000)); // 0.5s → 1.5s
                    } catch (InterruptedException ignored) {}
                }


            } catch (Exception e) {
                System.out.println("⚠ Lỗi crawl source: " + src.getDomain() + src.getPath());
                e.printStackTrace();
            }
        }
        return savedCount;
    }

    // Normalize URL (remove #,...)
    private String normalizeUrl(String url) {
        if (url == null) return null;
        return url.split("#")[0].trim();
    }
}
