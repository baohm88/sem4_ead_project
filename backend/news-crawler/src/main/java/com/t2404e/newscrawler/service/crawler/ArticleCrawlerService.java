package com.t2404e.newscrawler.service.crawler;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleStatus;
import com.t2404e.newscrawler.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.util.List;

// BOT Kéo hết các articles về 1 lượt
//@Service
//@RequiredArgsConstructor
//public class ArticleCrawlerService {
//
//    private final ArticleRepository articleRepo;
//
//    public int crawlContent() {
//        int updatedCount = 0;
//
//        // 🔥 Chỉ lấy bài NEW, KHÔNG lấy ERROR/CRAWLING
//        List<Article> articles = articleRepo.findNewArticles();
//
//        for (Article a : articles) {
//            try {
//                // 1. Đánh dấu đang xử lý
//                a.setStatus(ArticleStatus.CRAWLING);
//                articleRepo.save(a);
//
//                // 2. Fetch HTML
//                Document doc = Jsoup.connect(a.getUrl())
//                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
//                        .timeout(15000)
//                        .get();
//
//                // 3. Remove garbage nếu có
//                if (a.getSource().getRemoveSelector() != null &&
//                        !a.getSource().getRemoveSelector().isBlank()) {
//                    doc.select(a.getSource().getRemoveSelector()).remove();
//                }
//
//                // 4. Extract data theo selector từ DB
//                String title = doc.select(a.getSource().getTitleSelector()).text();
//                String desc = doc.select(a.getSource().getDescriptionSelector()).text();
//                String content = doc.select(a.getSource().getContentSelector()).html();
//
//                // 5. Extract image: ưu tiên meta[itemprop=url] -> img fallback
//                String image = doc.select(a.getSource().getImageSelector()).attr("content");
//                if (image == null || image.isBlank()) {
//                    image = doc.select("meta[itemprop=url]").attr("content");
//                }
//                if (image == null || image.isBlank()) {
//                    image = doc.select("img[itemprop=contentUrl]").attr("src");
//                }
//
//                // 6. Save data
//                a.setTitle(safeStr(title));
//                a.setDescription(safeStr(desc));
//                a.setContent(content);
//                a.setImageUrl(image);
//                a.setSlug(generateSlug(title, a.getUrl()));
//                a.setStatus(ArticleStatus.CRAWLED);
//
//                articleRepo.save(a);
//                updatedCount++;
//
//                // 7. Prevent 429 -> random delay
//                Thread.sleep(800 + (int) (Math.random() * 1200));
//
//            } catch (Exception ex) {
//                // ❌ Lỗi thì mark ERROR, khác với retry
//                a.setStatus(ArticleStatus.ERROR);
//                articleRepo.save(a);
//
//                System.out.println("❌ Lỗi crawl bài: " + a.getUrl());
//                ex.printStackTrace();
//            }
//        }
//        return updatedCount;
//    }
//
//    // ======================= UTIL ==========================
//
//    private String safeStr(String s) {
//        return (s == null || s.isBlank()) ? null : s.trim();
//    }
//
//    // 🔥 Tạo slug từ title, fallback bằng URL
//    private String generateSlug(String title, String url) {
//        if (title != null && !title.isBlank()) {
//            return title.toLowerCase()
//                    .replaceAll("[^a-zA-Z0-9\\s-]", "")
//                    .trim()
//                    .replaceAll("\\s+", "-");
//        }
//        // fallback từ URL
//        return url.substring(url.lastIndexOf('/') + 1)
//                .replaceAll("[^a-zA-Z0-9-]", "");
//    }
//}

// BOT kéo 10 articles 1
@Service
@RequiredArgsConstructor
public class ArticleCrawlerService {

    private final ArticleRepository articleRepo;

    public int crawlContent() {
        int updatedCount = 0;

        // 🔥 Chỉ lấy 10 bài một lần
        List<Article> articles = articleRepo.findTop10NewArticles(PageRequest.of(0, 10));

        if (articles.isEmpty()) return 0;

        for (Article a : articles) {
            try {
                a.setStatus(ArticleStatus.CRAWLING);
                articleRepo.save(a);

                Document doc = Jsoup.connect(a.getUrl())
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
                        .timeout(15000)
                        .get();

                if (a.getSource().getRemoveSelector() != null && !a.getSource().getRemoveSelector().isBlank()) {
                    doc.select(a.getSource().getRemoveSelector()).remove();
                }

                String title = doc.select(a.getSource().getTitleSelector()).text();
                String desc = doc.select(a.getSource().getDescriptionSelector()).text();
                String content = doc.select(a.getSource().getContentSelector()).html();

                String image = doc.select(a.getSource().getImageSelector()).attr("content");
                if (image == null || image.isBlank()) {
                    image = doc.select("meta[itemprop=url]").attr("content");
                }
                if (image == null || image.isBlank()) {
                    image = doc.select("img[itemprop=contentUrl]").attr("src");
                }

                a.setTitle(safeStr(title));
                a.setDescription(safeStr(desc));
                a.setContent(content);
                a.setImageUrl(image);
                a.setSlug(generateSlug(title, a.getUrl()));
                a.setStatus(ArticleStatus.CRAWLED);

                articleRepo.save(a);
                updatedCount++;

                Thread.sleep(800 + (int) (Math.random() * 1200)); // tránh bị block

            } catch (Exception ex) {
                a.setStatus(ArticleStatus.ERROR);
                articleRepo.save(a);
                System.out.println("❌ Lỗi crawl bài: " + a.getUrl());
                ex.printStackTrace();
            }
        }
        return updatedCount;
    }

    private String safeStr(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    private String generateSlug(String title, String url) {
        if (title != null && !title.isBlank()) {
            return title.toLowerCase()
                    .replaceAll("[^a-zA-Z0-9\\s-]", "")
                    .trim()
                    .replaceAll("\\s+", "-");
        }
        return url.substring(url.lastIndexOf('/') + 1)
                .replaceAll("[^a-zA-Z0-9-]", "");
    }
}