package com.example.spring_boot_test.repository;

import com.example.spring_boot_test.entity.ArticleSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleSourceRepository extends JpaRepository<ArticleSource, Long> {

    // Phương thức custom để tìm nguồn tin dựa trên Domain
    Optional<ArticleSource> findByDomain(String domain);
}
