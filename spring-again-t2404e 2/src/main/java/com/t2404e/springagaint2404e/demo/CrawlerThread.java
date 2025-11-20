package com.t2404e.springagaint2404e.demo;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import java.io.IOException;

public class CrawlerThread extends Thread {
    private String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public void run() {
        try {
            // 1️⃣ Lấy nội dung HTML từ URL
            Document d = Jsoup.connect(this.url).get();

            // 2️⃣ Trích xuất dữ liệu bằng CSS Selector
            String title = d.select("h1.title-detail").text();
            String description = d.select("p.description").text();
            String imageUrl = d.select("figure picture img").attr("src");
            String content = d.select("article.fck_detail").text();

            // 3️⃣ In kết quả ra console
            System.out.println("Finish link: " + this.url);
            System.out.println("Title: " + title);
            System.out.println("Description: " + description);
            System.out.println("Image: " + imageUrl);
            System.out.println("Content length: " + content);
            System.out.println("Status: isCrawled: True");
            System.out.println("=====================================================");

        } catch (IOException e) {
            System.err.println("Error fetching: " + this.url + " → " + e.getMessage());
        }
    }
}
