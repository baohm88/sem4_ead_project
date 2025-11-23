package com.t2404e.newscrawler.scheduler;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleStatus;
import com.t2404e.newscrawler.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SchedulerBot3 {

    private final ArticleRepository articleRepo;

    // Every 1 hour
    @Scheduled(cron = "0 0 */1 * * *")
    public void retryErrorArticles() {

        List<Article> errors = articleRepo.findByStatus(ArticleStatus.ERROR);

        int reset = 0;

        for (Article a : errors) {
            if (a.getRetryCount() < 5) {
                a.setStatus(ArticleStatus.NEW);
                a.setRetryCount(a.getRetryCount() + 1);
                articleRepo.save(a);
                reset++;
            }
        }

        System.out.println("🔄 BOT3 Reset " + reset + " failed articles for retry");
    }
}
