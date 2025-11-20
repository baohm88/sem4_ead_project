package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.ArticleSource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleSourceRepository extends JpaRepository<ArticleSource, Long> {

    // Lấy tất cả nguồn theo category
    List<ArticleSource> findByArticleCategoryId(Long categoryId);
}
