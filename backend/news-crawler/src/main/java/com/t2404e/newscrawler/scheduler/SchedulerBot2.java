package com.t2404e.newscrawler.scheduler;

import com.t2404e.newscrawler.service.crawler.ArticleCrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SchedulerBot2 {

    private final ArticleCrawlerService articleCrawlerService;

    // Every 10 minutes
    @Scheduled(cron = "0 */10 * * * *")
    public void runBot2() {
        int count = articleCrawlerService.crawlContent();
        System.out.println("📰 BOT2 Done. + " + count + " articles crawled");
    }
}
