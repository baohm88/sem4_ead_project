package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
