package com.t2404e.newscrawler.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BotStatus {
    private String code;          // "BOT1", "BOT2", "BOT3"
    private String name;          // "Crawl Links", ...
    private boolean running;      // true nếu đang chạy
    private String lastMessage;   // mô tả lần chạy gần nhất
    private Long lastRunAt;       // timestamp ms
    private Long lastDurationMs;  // thời gian chạy ms
    private Integer lastAffected; // số record xử lý được
    private String lastError;     // message lỗi lần gần nhất (nếu có)
}