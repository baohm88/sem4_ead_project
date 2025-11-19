package com.example.spring_boot_test.demo;

import java.util.List;

public class ArticleInfo {
    private final String url;
    private final String title;
    private final String time;
    private final String description;
    private final String content;
    private final List<String> imageUrls;

    public ArticleInfo(String url, String title, String time, String description, String content, List<String> imageUrls) {
        this.url = url;
        this.title = title;
        this.time = time;
        this.description = description;
        this.content = content;
        this.imageUrls = imageUrls;
    }

    public String getTitle() {
        return title;
    }

    @Override
    public String toString() {
        return "=============================\n" +
                "URL      : " + url + "\n" +
                "TIÊU ĐỀ  : " + title + "\n" +
                "THỜI GIAN: " + time + "\n" +
                "MÔ TẢ    : " + description + "\n" +
                "\n--- NỘI DUNG ---\n" + (content.length() > 200 ? content.substring(0, 200) + "..." : content) +
                "\n--- ẢNH TRONG BÀI (" + imageUrls.size() + ") ---\n" + String.join("\n", imageUrls);
    }
}