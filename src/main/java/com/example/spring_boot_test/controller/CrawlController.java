package com.example.spring_boot_test.controller;

import com.example.spring_boot_test.service.ContentCrawlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/crawl")
public class CrawlController {

    @Autowired
    private ContentCrawlService crawlService;

    @GetMapping("/start")
    public ResponseEntity<String> startCrawl() {
        // Chạy Service cào nội dung
        crawlService.startContentCrawling();

        // Trả về response ngay lập tức (quá trình cào chạy ngầm)
        return ResponseEntity.ok("Quá trình cào nội dung đã được kích hoạt thành công (kiểm tra logs để xem chi tiết).");
    }
}