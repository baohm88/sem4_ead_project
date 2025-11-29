package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByArticleCategory_Id(Long categoryId);

    boolean existsByUrl(String url);

    int countByArticleCategory_Id(Long categoryId);

    @Query("SELECT a FROM Article a WHERE a.status = com.t2404e.newscrawler.entity.ArticleStatus.NEW")
    List<Article> findNewArticles();

    @Query("SELECT a FROM Article a WHERE a.status = com.t2404e.newscrawler.entity.ArticleStatus.NEW")
    List<Article> findTop10NewArticles(org.springframework.data.domain.Pageable pageable);

    List<Article> findByStatus(ArticleStatus status);
    Page<Article> findByStatus(ArticleStatus status, Pageable pageable);

    @Query("""
    SELECT a FROM Article a 
    WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<Article> search(@Param("keyword") String keyword, Pageable pageable);

    // 👉 THÊM HÀM NÀY CHO BOT3 LIMIT RESET
    @Query("SELECT a FROM Article a WHERE a.status = :status")
    List<Article> findByStatusLimited(ArticleStatus status,
                                      org.springframework.data.domain.Pageable pageable);

    @Query("""
    SELECT a FROM Article a
    WHERE (:keyword IS NULL OR :keyword = '' 
           OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(a.slug) LIKE LOWER(CONCAT('%', :keyword, '%')))
      AND (:categoryId IS NULL OR a.articleCategory.id = :categoryId)
      AND (:status IS NULL OR a.status = :status)
""")
    Page<Article> searchAdmin(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("status") ArticleStatus status,
            Pageable pageable
    );

    @Query("""
    SELECT a FROM Article a
    WHERE a.status = 'CRAWLED'
      AND (:keyword = '' OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
      AND a.articleCategory.id = :categoryId
""")
    Page<Article> findByStatusAndCategory(ArticleStatus articleStatus, Long categoryId, String keyword, Pageable pageable);

    @Query("""
    SELECT a FROM Article a
    WHERE a.status = 'CRAWLED'
      AND (:keyword = '' OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
""")
    Page<Article> findCrawled(String keyword, Pageable pageable);
    Optional<Article> findBySlugAndStatus(String slug, ArticleStatus status);
}