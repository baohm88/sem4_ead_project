package com.t2404e.newscrawler.controller;

import com.t2404e.newscrawler.dto.ApiResponse;
import com.t2404e.newscrawler.dto.ErrorResponse;
import com.t2404e.newscrawler.service.crawler.ArticleCrawlerService;
import com.t2404e.newscrawler.service.crawler.LinkCrawlerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Crawler BOT1", description = "Crawl link từ Source -> save Article (status=NEW)")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/crawler")
@RequiredArgsConstructor
public class CrawlerController {

    private final LinkCrawlerService linkCrawlerService;
    private final ArticleCrawlerService articleCrawlerService;


    // =================== CRAWL ALL LINKS =====================
    @PostMapping("/links")
    public ResponseEntity<?> crawlLinks() {
        try {
            int count = linkCrawlerService.crawlLinks();

            return ResponseEntity.ok(
                    ApiResponse.<Integer>builder()
                            .success(true)
                            .message("BOT1 thành công. Đã lưu " + count + " bài mới.")
                            .data(count)
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ErrorResponse.builder()
                            .success(false)
                            .status(500)
                            .message("BOT1 lỗi server: " + e.getMessage())
                            .timestamp(System.currentTimeMillis())
                            .build());
        }
    }

    // =================== CRAWL ALL NEW ARTICLES =====================
    @PostMapping("/articles")
    public ResponseEntity<ApiResponse<Integer>> crawlArticles() {
        int count = articleCrawlerService.crawlContent();
        return ResponseEntity.ok(
                ApiResponse.<Integer>builder()
                        .success(true)
                        .message("Crawl nội dung thành công")
                        .data(count)
                        .build()
        );
    }

}
