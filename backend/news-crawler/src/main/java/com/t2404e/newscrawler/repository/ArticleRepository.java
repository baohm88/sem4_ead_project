package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, String> {

    // Tìm bài chưa crawl Step2
    @Query("SELECT a FROM Article a WHERE a.crawled = false")
    List<Article> findNotCrawled();

    // Xem bài theo category
    List<Article> findByArticleCategoryId(Long categoryId);

    // Tránh lưu trùng URL
    boolean existsByUrl(String url);
}
