package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Long> {
}
