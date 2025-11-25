package com.t2404e.newscrawler.service.crawler;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleStatus;
import com.t2404e.newscrawler.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ErrorResetService {

    private final ArticleRepository articleRepo;

    /**
     * Reset các bài ERROR thành NEW, nhưng giới hạn số lượng để tránh reset quá nhiều cùng lúc.
     */
    public int resetErrorToNewAndLimit(int limit) {
        List<Article> errors = articleRepo.findByStatusLimited(
                ArticleStatus.ERROR,
                PageRequest.of(0, limit)
        );

        int reset = 0;
        for (Article a : errors) {
            if (a.getRetryCount() < 5) {
                a.setStatus(ArticleStatus.NEW);
                a.setRetryCount(a.getRetryCount() + 1);
                articleRepo.save(a);
                reset++;
            }
        }

        return reset;
    }
}