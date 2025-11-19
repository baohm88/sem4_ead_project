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
                // Nếu không phải bài viết chi tiết (trang danh mục), tìm link bài viết chi tiết.
                discoverArticleLinks(doc);
            }

        } catch (IOException e) {
            System.err.println("❌ Lỗi kết nối/phân tích HTML tại: " + url + " - " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("❌ Luồng bị ngắt.");
        }
    }

    /**
     * Phương thức tập trung tìm kiếm các link bài viết chi tiết (.html)
     */
    private void discoverNewUrls(Document doc) {
        // Selector: Kết hợp các khu vực chứa link liên quan/bài viết chi tiết
        String articleLinkSelector = "h3.title_news a[href], h2.title_news a[href], div.sidebar_1.items-list-wrapper a[href], div.list-news-subpage a[href], article.item-news a[href]";

        Elements links = doc.select(articleLinkSelector);
        int linksFound = 0;

        for (Element link : links) {
            if (JsuopDemo.isMaxUrlsReached()) break;

            String absUrl = link.absUrl("href");

            // Chỉ thêm vào nếu link là một URL bài viết chi tiết (chứa .html)
            if (absUrl.endsWith(".html") && JsuopDemo.addNewUrl(absUrl)) {
                linksFound++;
            }
        }
        System.out.printf("   ➡️ Đã khám phá thêm %d URL liên quan/chi tiết.\n", linksFound);
    }

    /**
     * Phương thức thay thế (tương tự discoverNewUrls) để xử lý trang danh mục/trang chủ.
     */
    private void discoverArticleLinks(Document doc) {
        // Dùng cùng selector vì mục đích là tìm ra link bài viết chi tiết (.html)
        discoverNewUrls(doc);
    }

    /**
     * Trích xuất thông tin bài viết và xác định xem đây có phải là trang bài viết chi tiết không.
     */
    private ArticleInfo extractArticleData(Document doc) {
        try {
            // Lấy dữ liệu Tiêu đề và Thời gian
            String title = doc.select("h1.title-detail").text();
            String time = doc.select("span.date").text();

            // 1. Lấy Sapo (Mô tả) - Thường là thẻ p.description
            String description = doc.select("p.description").text().trim();

            // 2. Xử lý Nội dung Chính
            // Loại bỏ các thẻ quảng cáo, liên quan ra khỏi nội dung
            doc.select("article.fck_detail > p.editor_note, article.fck_detail > p.inner-article-link").remove();

            // ✅ ĐIỀU CHỈNH CHÍNH: Lặp qua các thẻ block (p, div, h2) để lấy đầy đủ nội dung
            StringBuilder contentBuilder = new StringBuilder();

            // Selector bao quát: Chọn tất cả các thẻ con dạng block trong fck_detail
            Elements contentBlocks = doc.select("article.fck_detail > p, article.fck_detail > div, article.fck_detail > h2");

            for (Element block : contentBlocks) {
                String blockText = block.text().trim();
                // Chỉ thêm nếu đoạn văn bản có độ dài đáng kể và không phải là ảnh chú thích
                if (!blockText.isEmpty() && blockText.length() > 5 && !block.hasClass("img_desc")) {
                    contentBuilder.append(blockText).append("\n\n");
                }
            }
            String content = contentBuilder.toString().trim();
            // KẾT THÚC PHẦN SỬA ĐỔI LẤY NỘI DUNG


            // Lấy URL ảnh trong nội dung
            Elements imageElements = doc.select("article.fck_detail img[src]");
            List<String> imageUrls = new ArrayList<>();
            for (Element img : imageElements) {
                imageUrls.add(img.absUrl("src"));
            }

            // Kiểm tra tính hợp lệ
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