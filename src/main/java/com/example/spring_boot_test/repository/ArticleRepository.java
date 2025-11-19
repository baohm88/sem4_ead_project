package com.example.spring_boot_test.repository;

import com.example.spring_boot_test.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> { // Key là String (url)

    // Phương thức custom để lấy các bài viết chưa được cào, giới hạn 25 bài
    List<Article> findTop25ByCrawledFalseAndStatus(Integer status);
}
