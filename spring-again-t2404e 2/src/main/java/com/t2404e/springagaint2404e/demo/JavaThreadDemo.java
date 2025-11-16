package com.t2404e.springagaint2404e.demo;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class JavaThreadDemo {
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        System.out.println("Start crawling data ...");


        // PHAT START
        String url = "https://vnexpress.net/the-thao";
        System.out.println("Crawling url: " + url);

        try {
            HashSet<String> links = new HashSet<String>();
            Document doc = Jsoup.connect(url).get();
            Elements els = doc.select("a[href]");
            for (Element el : els) {
                String href = el.attr("href");
                if (href.startsWith("https://vnexpress.net/")) {
                    links.add(href);
                }
            }

            List<CrawlerThread> threads = new ArrayList<>();
            for (String link : links) {
                CrawlerThread thread = new CrawlerThread();
                thread.setUrl(link);
                threads.add(thread);
            }

            for (CrawlerThread thread : threads) {
                thread.start();
            }

            for (CrawlerThread thread : threads) {
                thread.join();
            }
            // PHAT END

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }

        long end = System.currentTimeMillis();
        System.out.println("End crawling data ...");
        System.out.println("Time taken: " + (end - start) + "ms");
    }
}
