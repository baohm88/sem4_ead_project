package com.t2404e.newscrawler.controller;

import com.t2404e.newscrawler.dto.ApiResponse;
import com.t2404e.newscrawler.dto.BotStatus;
import com.t2404e.newscrawler.service.BotRuntimeService;
import com.t2404e.newscrawler.service.crawler.ArticleCrawlerService;
import com.t2404e.newscrawler.service.crawler.LinkCrawlerService;
import com.t2404e.newscrawler.service.crawler.ErrorResetService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.function.Supplier;

@Tag(name = "Bot Control", description = "API điều khiển BOT1/BOT2/BOT3 từ Admin UI")
@RestController
@RequestMapping("api/v1/bots")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BotController {

    private final LinkCrawlerService bot1;      // Crawl links
    private final ArticleCrawlerService bot2;   // Crawl article content
    private final ErrorResetService bot3;       // Reset ERROR → NEW
    private final BotRuntimeService botRuntime;

    // ======================================
    //           GET ALL BOT STATUS
    // ======================================
    @GetMapping
    public ResponseEntity<ApiResponse<List<BotStatus>>> getAllStatuses() {
        List<BotStatus> list = botRuntime.getAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // ======================================
    //        GENERIC RUNNER FOR BOTS
    // ======================================
    private ResponseEntity<ApiResponse<BotStatus>> runBot(
            String name,
            String startMessage,
            Supplier<Integer> action
    ) {
        long start = System.currentTimeMillis();
        botRuntime.start(name, startMessage);

        try {
            int affected = action.get();

            BotStatus status = botRuntime.success(
                    name,
                    startMessage.replace("đang", "xong").replace("...", "") + ": " + affected,
                    affected,
                    start
            );
            return ResponseEntity.ok(ApiResponse.success(status));

        } catch (Exception e) {
            BotStatus status = botRuntime.error(
                    name,
                    name.toUpperCase() + " lỗi: " + e.getMessage(),
                    e,
                    start
            );
            return ResponseEntity
                    .internalServerError()
                    .body(ApiResponse.fail(status.getLastMessage(), status));
        }
    }

    // ======================================
    //            BOT 1 - RUN
    // ======================================
    @PostMapping("/bot1/run")
    public ResponseEntity<ApiResponse<BotStatus>> runBot1() {
        return runBot(
                "bot1",
                "BOT1 đang crawl links từ Sources...",
                bot1::crawlLinks
        );
    }

    // ======================================
    //            BOT 2 - RUN
    // ======================================
    @PostMapping("/bot2/run")
    public ResponseEntity<ApiResponse<BotStatus>> runBot2() {
        return runBot(
                "bot2",
                "BOT2 đang crawl content cho bài viết NEW...",
                bot2::crawlContent
        );
    }

    // ======================================
    //            BOT 3 - RUN
    // ======================================
    @PostMapping("/bot3/run")
    public ResponseEntity<ApiResponse<BotStatus>> runBot3() {
        return runBot(
                "bot3",
                "BOT3 đang reset các bài ERROR để retry...",
                () -> bot3.resetErrorToNewAndLimit(40)
        );
    }
}