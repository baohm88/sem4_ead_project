package com.example.spring_boot_test.demo;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class JsuopDemo {

    // ===========================================
    private static final int MAX_URLS = 100;         // GIỚI HẠN: Số URL tối đa bot sẽ tìm kiếm
    private static final int THREAD_POOL_SIZE = 10;      // LUỒNG: Số luồng chạy đồng thời
    private static final int CONNECTION_TIMEOUT = 15000; // TIMEOUT: Thời gian chờ kết nối (ms)
    // ===========================================

    // === CẤU HÌNH CHUNG ===
    public static final String DOMAIN = "vnexpress.net";
    private static final String BASE_URL = "https://" + DOMAIN + "/";

    // === HÀNG ĐỢI VÀ TRẠNG THÁI ===
    private static final BlockingQueue<String> urlQueue = new LinkedBlockingQueue<>();
    private static final Set<String> visitedUrls = Collections.synchronizedSet(new HashSet<>());
    private static final BlockingQueue<ArticleInfo> resultQueue = new LinkedBlockingQueue<>();
    private static final AtomicInteger urlsProcessed = new AtomicInteger(0);

    public static void main(String[] args) {
        long startTime = System.currentTimeMillis();
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

        // Khởi tạo các URL ban đầu (seed URLs)
        String seedUrl1 = "https://vnexpress.net/canh-sat-hinh-su-bi-nhom-quai-xe-dap-nga-4964406.html";
        addNewUrl(seedUrl1);
        String seedUrl2 = "https://vnexpress.net/phap-luat"; // Ví dụ: Danh mục Pháp luật
        addNewUrl(seedUrl2);

        try {
            // Dừng khi đạt giới hạn MAX_URLS HOẶC Queue trống (url == null)
            while (urlsProcessed.get() < MAX_URLS) {
                String url = urlQueue.poll(5, TimeUnit.SECONDS);

                if (url == null) {
                    System.out.println("\n*** Hết URL trong Queue và đã chờ 5s. Đóng hệ thống. ***");
                    break;
                }

                executor.submit(new ArticleScraper(url, resultQueue));
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
            System.err.println("Main loop bị ngắt.");
        } finally {
            // Tính toán tổng thời gian
            long endTime = System.currentTimeMillis();
            long totalTimeMs = endTime - startTime;
            double totalTimeSeconds = totalTimeMs / 1000.0;

            System.out.println("\n-------------------------------------------------");
            System.out.printf("🌟 TỔNG CỘNG ĐÃ KHÁM PHÁ %d/%d URL DUY NHẤT.%n", urlsProcessed.get(), MAX_URLS);
            System.out.printf("⏱️ TỔNG THỜI GIAN CHẠY: %.2f giây (với %d luồng, Timeout: %dms)%n",
                    totalTimeSeconds, THREAD_POOL_SIZE, CONNECTION_TIMEOUT);
            System.out.println("-------------------------------------------------");
            executor.shutdownNow();

            // In kết quả đã cào được (Tùy chọn)
            System.out.println("\n--- KẾT QUẢ CÀO ĐƯỢC ---");
            resultQueue.forEach(System.out::println);
        }
    }

    /**
     * Phương thức Thread-safe để thêm URL mới vào hàng đợi.
     * Trả về TRUE nếu thêm thành công, FALSE nếu thất bại hoặc đã đạt giới hạn.
     */
    public static boolean addNewUrl(String url) {
        // Kiểm tra giới hạn
        if (urlsProcessed.get() >= MAX_URLS) {
            return false;
        }

        // Kiểm tra tên miền và trùng lặp
        if (url.contains(DOMAIN) && !visitedUrls.contains(url)) {
            visitedUrls.add(url);

            try {
                urlQueue.put(url);
                urlsProcessed.incrementAndGet(); // Tăng số lượng URL đã xử lý
                // System.out.println("Crawler ➡️: Thêm link mới: " + url);
                return true;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        return false;
    }

    /**
     * Getter cho CONNECTION_TIMEOUT để ArticleScraper sử dụng.
     */
    public static int getConnectionTimeout() {
        return CONNECTION_TIMEOUT;
    }

    /**
     * Kiểm tra xem đã đạt đến giới hạn MAX_URLS chưa.
     */
    public static boolean isMaxUrlsReached() {
        return urlsProcessed.get() >= MAX_URLS;
    }
}