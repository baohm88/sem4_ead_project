package com.t2404e.newscrawler.entity;

public enum ArticleStatus {
    NEW,        // Link mới, chưa crawl nội dung
    CRAWLING,   // Bot2 đang xử lý
    CRAWLED,    // Đã có content
    ERROR       // Lỗi khi crawl (timeout, selector sai,...)
}
