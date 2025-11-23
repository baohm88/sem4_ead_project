package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    // Xem bài theo category ID
    List<Article> findByArticleCategory_Id(Long categoryId);

    // Tránh lưu trùng URL
    boolean existsByUrl(String url);

    // Kiểm tra category có bài viết hay không
    int countByArticleCategory_Id(Long categoryId);

    // Tìm bài chưa crawl nội dung (Bot2)
    @Query("SELECT a FROM Article a WHERE a.status = com.t2404e.newscrawler.entity.ArticleStatus.NEW")
    List<Article> findNewArticles();

    @Query("SELECT a FROM Article a WHERE a.status = com.t2404e.newscrawler.entity.ArticleStatus.NEW")
    List<Article> findTop10NewArticles(org.springframework.data.domain.Pageable pageable);

    List<Article> findByStatus(ArticleStatus status);
}
