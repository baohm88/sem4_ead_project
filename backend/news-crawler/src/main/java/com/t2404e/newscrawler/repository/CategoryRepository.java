package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
    @Query("""
        SELECT DISTINCT c
        FROM Category c
        JOIN Article a ON a.articleCategory = c
        WHERE a.status = 'CRAWLED'
        ORDER BY c.name ASC
    """)
    List<Category> findCategoriesWithCrawledArticles();
}
