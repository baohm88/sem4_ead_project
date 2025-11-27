package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByArticleCategory_Id(Long categoryId);

    boolean existsByUrl(String url);

    int countByArticleCategory_Id(Long categoryId);

    @Query("SELECT a FROM Article a WHERE a.status = com.t2404e.newscrawler.entity.ArticleStatus.NEW")
    List<Article> findNewArticles();

    @Query("SELECT a FROM Article a WHERE a.status = com.t2404e.newscrawler.entity.ArticleStatus.NEW")
    List<Article> findTop10NewArticles(org.springframework.data.domain.Pageable pageable);

    List<Article> findByStatus(ArticleStatus status);

    // 👉 THÊM HÀM NÀY CHO BOT3 LIMIT RESET
    @Query("SELECT a FROM Article a WHERE a.status = :status")
    List<Article> findByStatusLimited(ArticleStatus status,
                                      org.springframework.data.domain.Pageable pageable);
}