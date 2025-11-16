Chúng ta sẽ xây dựng một chương trình Java sử dụng Jsoup để lấy tiêu đề (`<title>`) của một danh sách các trang web theo hai cách:
1.  **Tuần tự (Synchronous):** Chạy trên một luồng duy nhất, crawl lần lượt từng link.
2.  **Đa luồng (Asynchronous):** Sử dụng `ExecutorService` để quản lý một nhóm luồng, crawl nhiều link cùng lúc.

---

### 1. Chuẩn bị: Thêm Dependency Jsoup vào `pom.xml`

Bạn cần thêm thư viện Jsoup vào dự án Maven của mình.

```xml
<dependencies>
    <!-- Jsoup library for HTML parsing -->
    <dependency>
        <groupId>org.jsoup</groupId>
        <artifactId>jsoup</artifactId>
        <version>1.17.2</version> <!-- Hoặc phiên bản mới nhất -->
    </dependency>
</dependencies>

<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
</properties>
```

---

### 2. Code ví dụ

Chúng ta sẽ tạo một class `WebCrawlerManager` để điều khiển toàn bộ quá trình.

```java
// File: WebCrawlerManager.java

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

public class WebCrawlerManager {

    public static void main(String[] args) throws InterruptedException {
        List<String> urlsToCrawl = List.of(
                "https://en.wikipedia.org/wiki/Java_(programming_language)",
                "https://www.oracle.com/java/",
                "https://stackoverflow.com/questions",
                "https://github.com/",
                "https://www.baeldung.com/java-executor-service-tutorial",
                "https://www.reddit.com/",
                "https://news.ycombinator.com/",
                "https://docs.spring.io/spring-framework/docs/current/reference/html/"
        );

        System.out.println("Bắt đầu crawl " + urlsToCrawl.size() + " trang web...");
        System.out.println("=====================================================");

        // --- CÁCH 1: CRAWL TUẦN TỰ (SINGLE-THREAD) ---
        crawlSequentially(urlsToCrawl);

        System.out.println("\n=====================================================");
        System.out.println("=====================================================\n");

        // --- CÁCH 2: CRAWL ĐA LUỒNG (MULTI-THREAD) ---
        crawlConcurrently(urlsToCrawl);
    }

    /**
     * Phương thức crawl tuần tự, sử dụng một luồng duy nhất (luồng main).
     */
    public static void crawlSequentially(List<String> urls) {
        System.out.println(">>> Bắt đầu CRAWL TUẦN TỰ...");
        long startTime = System.currentTimeMillis();

        for (String url : urls) {
            String title = scrapeUrl(url);
            System.out.println("    - [TUẦN TỰ] Title: " + title);
        }

        long endTime = System.currentTimeMillis();
        System.out.println(">>> CRAWL TUẦN TỰ hoàn thành trong: " + (endTime - startTime) + " ms");
    }

    /**
     * Phương thức crawl đa luồng, sử dụng ExecutorService để quản lý luồng.
     */
    public static void crawlConcurrently(List<String> urls) throws InterruptedException {
        System.out.println(">>> Bắt đầu CRAWL ĐA LUỒNG...");
        long startTime = System.currentTimeMillis();

        // Tạo một Thread Pool với số luồng cố định.
        // Ví dụ: 5 luồng sẽ chạy song song. Khi 1 luồng xong, nó sẽ lấy việc tiếp theo.
        int numberOfThreads = 5;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);

        // Dùng một list các Future để lưu trữ kết quả sẽ trả về từ mỗi luồng.
        List<Future<String>> futures = new ArrayList<>();

        // Giao việc cho từng luồng trong Thread Pool
        for (String url : urls) {
            // executor.submit() sẽ nhận một tác vụ (Callable) và trả về ngay một Future.
            // Future là một "lời hứa" về một kết quả sẽ có trong tương lai.
            // Lambda `() -> scrapeUrl(url)` là một Callable<String>.
            Future<String> future = executor.submit(() -> scrapeUrl(url));
            futures.add(future);
        }

        // Chờ và lấy kết quả từ tất cả các Future
        for (Future<String> future : futures) {
            try {
                // future.get() là một hành động BLOCKING.
                // Nó sẽ chờ cho đến khi tác vụ của luồng tương ứng hoàn thành và trả về kết quả.
                String title = future.get();
                System.out.println("    - [ĐA LUỒNG] Title: " + title);
            } catch (ExecutionException e) {
                System.err.println("Lỗi khi thực thi tác vụ: " + e.getCause().getMessage());
            }
        }
        
        // Rất quan trọng: Phải shutdown ExecutorService sau khi dùng xong.
        // Nó sẽ không nhận thêm task mới và sẽ tự kết thúc khi các task hiện tại hoàn thành.
        executor.shutdown();

        long endTime = System.currentTimeMillis();
        System.out.println(">>> CRAWL ĐA LUỒNG hoàn thành trong: " + (endTime - startTime) + " ms");
    }


    /**
     * Hàm lõi, thực hiện crawl dữ liệu từ một URL duy nhất bằng Jsoup.
     * @param url Link trang web cần crawl.
     * @return Tiêu đề của trang web.
     */
    private static String scrapeUrl(String url) {
        try {
            // In ra tên của luồng đang thực thi để thấy rõ sự khác biệt
            String threadName = Thread.currentThread().getName();
            System.out.printf("    [%s] Đang crawl: %s%n", threadName, url);
            
            // Kết nối tới URL và lấy Document HTML
            Document doc = Jsoup.connect(url).timeout(10000).get(); // Timeout 10s
            
            // Trả về thẻ <title>
            return doc.title();
        } catch (IOException e) {\;
            // Xử lý lỗi nếu không kết nối được (404, timeout, etc.)
            return "Lỗi khi crawl '" + url + "': " + e.getMessage();
        }
    }
}
```

### 3. Phân tích kết quả

Khi bạn chạy chương trình, output sẽ tương tự như sau (thời gian có thể khác nhau):

```
Bắt đầu crawl 8 trang web...
=====================================================
>>> Bắt đầu CRAWL TUẦN TỰ...
    [main] Đang crawl: https://en.wikipedia.org/wiki/Java_(programming_language)
    - [TUẦN TỰ] Title: Java (programming language) - Wikipedia
    [main] Đang crawl: https://www.oracle.com/java/
    - [TUẦN TỰ] Title: Java | Oracle
    ... (lần lượt từng trang) ...
    [main] Đang crawl: https://docs.spring.io/spring-framework/docs/current/reference/html/
    - [TUẦN TỰ] Title: Spring Framework Documentation
>>> CRAWL TUẦN TỰ hoàn thành trong: 8532 ms

=====================================================
=====================================================

>>> Bắt đầu CRAWL ĐA LUỒNG...
    [pool-1-thread-1] Đang crawl: https://en.wikipedia.org/wiki/Java_(programming_language)
    [pool-1-thread-3] Đang crawl: https://stackoverflow.com/questions
    [pool-1-thread-2] Đang crawl: https://www.oracle.com/java/
    [pool-1-thread-4] Đang crawl: https://github.com/
    [pool-1-thread-5] Đang crawl: https://www.baeldung.com/java-executor-service-tutorial
    (Bạn sẽ thấy 5 luồng bắt đầu gần như cùng lúc)
    
    ... (Các luồng hoàn thành và lấy task mới) ...
    [pool-1-thread-1] Đang crawl: https://www.reddit.com/
    
    - [ĐA LUỒNG] Title: Java (programming language) - Wikipedia
    - [ĐA LUỒNG] Title: Java | Oracle
    - [ĐA LUỒNG] Title: Newest Questions - Stack Overflow
    ... (thứ tự trả về kết quả không nhất thiết giống thứ tự ban đầu) ...
    - [ĐA LUỒNG] Title: Spring Framework Documentation
>>> CRAWL ĐA LUỒNG hoàn thành trong: 2154 ms
```

### 4. Giải thích và các điểm cần lưu ý

1.  **Tại sao Đa luồng nhanh hơn?**
    *   Trong cách tuần tự, luồng `main` phải chờ cho tác vụ mạng (tải trang web) của link 1 xong rồi mới bắt đầu link 2. Phần lớn thời gian là **chờ đợi (waiting)**.
    *   Trong cách đa luồng, khi `thread-1` đang chờ mạng của link 1, CPU rảnh và có thể để `thread-2` bắt đầu yêu cầu mạng cho link 2, `thread-3` cho link 3... Các khoảng thời gian chờ đợi được tận dụng để thực hiện các yêu cầu khác.

2.  **`ExecutorService` là gì?**
    *   Đây là một framework của Java để quản lý luồng một cách hiệu quả.
    *   Thay vì tự tạo `new Thread()` một cách thủ công (dễ gây lỗi, khó quản lý), `ExecutorService` cung cấp một **"bể luồng" (Thread Pool)**. Bạn chỉ cần "giao việc" cho nó, nó sẽ tự điều phối các luồng có sẵn để thực hiện.
    *   `Executors.newFixedThreadPool(5)` tạo ra một bể có đúng 5 luồng. Khi cả 5 luồng đều bận, các công việc tiếp theo sẽ phải chờ trong một hàng đợi.

3.  **`Callable` và `Future`**
    *   `Runnable`: Dùng cho các tác vụ không trả về kết quả.
    *   `Callable<V>`: Dùng cho các tác vụ **có trả về kết quả** (trong ví dụ này là `String` title).
    *   Khi bạn `submit` một `Callable`, `ExecutorService` trả về một `Future<V>`. `Future` là một đối tượng giữ chỗ cho kết quả sẽ có sau này. Bạn có thể gọi `future.get()` để lấy kết quả khi nó đã sẵn sàng.

4.  **Lời khuyên khi crawl dữ liệu:**
    *   **Be a good citizen:** Đừng tạo quá nhiều luồng (ví dụ 1000 luồng) để tấn công một trang web. Điều này có thể làm server của họ quá tải và bạn có thể bị chặn IP. Một số lượng nhỏ (5-10 luồng) thường là hợp lý.
    *   **Thêm độ trễ:** Nếu crawl nhiều trang từ cùng một domain, bạn nên thêm một khoảng `Thread.sleep()` nhỏ giữa các request để giảm tải cho server của họ.
    *   **Xử lý lỗi:** Luôn bọc code Jsoup trong `try-catch` vì kết nối mạng rất dễ gặp lỗi (timeout, 404, 500...).