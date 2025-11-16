package com.example.spring_boot_test.demo;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

public class ArticleScraper implements Runnable {
    private final String url;
    private final BlockingQueue<ArticleInfo> resultQueue;

    // === CẤU HÌNH HEADERS TỐI ƯU VÀ HẰNG SỐ ===
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    private static final String REFERER = "https://vnexpress.net/";
    private static final long DELAY_MS = 500; // Độ trễ giữa các request

    public ArticleScraper(String url, BlockingQueue<ArticleInfo> resultQueue) {
        this.url = url;
        this.resultQueue = resultQueue;
    }

    @Override
    public void run() {
        if (JsuopDemo.isMaxUrlsReached()) {
            return;
        }

        System.out.println("🤖 Bắt đầu xử lý URL: " + url);

        try {
            Thread.sleep(DELAY_MS);

            // 1) Tải trang
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .header("Referer", REFERER)
                    .timeout(JsuopDemo.getConnectionTimeout())
                    .followRedirects(true)
                    .get();

            // 2) Trích xuất dữ liệu (Chỉ trích xuất nếu là bài viết chi tiết)
            ArticleInfo info = extractArticleData(doc);

            if (info != null) {
                // Đã trích xuất được bài viết, đưa vào hàng đợi kết quả
                resultQueue.offer(info, 1, TimeUnit.SECONDS);
                System.out.println("✅ Đã lấy dữ liệu bài: " + info.getTitle());

                // 3) Khám phá các URL liên quan (Cơ chế đào sâu)
                discoverNewUrls(doc);
            } else {
                // Nếu không phải bài viết chi tiết (có thể là trang danh mục/trang chủ),
                // ta vẫn khám phá link bài viết chi tiết để tiếp tục quá trình crawl.
                discoverArticleLinksOnCategoryPage(doc);
            }

        } catch (IOException e) {
            System.err.println("❌ Lỗi kết nối/phân tích HTML tại: " + url + " - " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("❌ Luồng bị ngắt.");
        }
    }

    /**
     * 🔎 PHƯƠNG THỨC TRỌNG TÂM: Lọc link bài viết liên quan (trong trang bài viết chi tiết)
     */
    private void discoverNewUrls(Document doc) {
        // Selector nhắm vào các khu vực chứa link bài viết liên quan trên VnExpress
        String relatedSelector = "div.sidebar_1.items-list-wrapper a[href], div.list-news-subpage a[href], article.item-news a[href]";

        Elements relatedLinks = doc.select(relatedSelector);
        int linksFound = 0;

        for (Element link : relatedLinks) {
            if (JsuopDemo.isMaxUrlsReached()) break;

            String absUrl = link.absUrl("href");

            // Chỉ thêm vào nếu link là một URL bài viết chi tiết (chứa .html)
            if (absUrl.endsWith(".html") && JsuopDemo.addNewUrl(absUrl)) {
                linksFound++;
            }
        }
        System.out.printf("   ➡️ Đã khám phá thêm %d URL liên quan.\n", linksFound);
    }

    /**
     * Phương thức dùng để xử lý các trang không phải bài viết chi tiết (danh mục/trang chủ).
     * Chỉ tìm link bài viết chi tiết (.html), tránh lan man sang link danh mục/menu.
     */
    private void discoverArticleLinksOnCategoryPage(Document doc) {
        // Selector nhắm vào các link bài viết trên trang danh mục (thường là thẻ h3 hoặc div.thumb)
        String categoryLinkSelector = "h3.title_news a[href], article.item-news a[href], div.item-news a[href]";
        Elements articleLinks = doc.select(categoryLinkSelector);
        int linksFound = 0;

        for (Element link : articleLinks) {
            if (JsuopDemo.isMaxUrlsReached()) break;

            String absUrl = link.absUrl("href");

            // Chỉ thêm vào nếu link là một URL bài viết chi tiết (chứa .html)
            if (absUrl.endsWith(".html") && JsuopDemo.addNewUrl(absUrl)) {
                linksFound++;
            }
        }
        if (linksFound > 0) {
            System.out.printf("   ➡️ (Danh mục) Tìm thấy %d URL bài viết chi tiết.\n", linksFound);
        }
    }

    /**
     * Trích xuất thông tin bài viết và xác định xem đây có phải là trang bài viết chi tiết không.
     */
    private ArticleInfo extractArticleData(Document doc) {
        try {
            // Lấy dữ liệu bài viết chi tiết VnExpress
            String title = doc.select("h1.title-detail").text();
            String time = doc.select("span.date").text();
            String description = doc.select("p.description").text();

            // Loại bỏ các thẻ quảng cáo, liên quan ra khỏi nội dung
            doc.select("article.fck_detail > p.editor_note, article.fck_detail > p.inner-article-link").remove();
            String content = doc.select("article.fck_detail").text();

            // Lấy URL ảnh trong nội dung
            Elements imageElements = doc.select("article.fck_detail img[src]");
            List<String> imageUrls = new ArrayList<>(); // Lỗi của bạn nằm ở đây (thiếu import List/ArrayList)
            for (Element img : imageElements) {
                imageUrls.add(img.absUrl("src"));
            }

            // Nếu không tìm thấy tiêu đề HOẶC nội dung, đây không phải bài viết chi tiết
            if (title.isEmpty() || content.isEmpty() || !url.endsWith(".html")) {
                return null;
            }

            return new ArticleInfo(url, title, time, description, content, imageUrls);

        } catch (Exception e) {
            System.err.println("Lỗi khi trích xuất nội dung: " + url + " - " + e.getMessage());
            return null;
        }
    }
}