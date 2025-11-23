package com.t2404e.newscrawler.scheduler;

import com.t2404e.newscrawler.service.crawler.LinkCrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SchedulerBot1 {

    private final LinkCrawlerService linkCrawlerService;

    // Every 15 minutes
    @Scheduled(cron = "0 */15 * * * *")
    public void runBot1() {
        int count = linkCrawlerService.crawlLinks();
        System.out.println("🤖 BOT1 Done. + " + count + " NEW links");
    }
}
