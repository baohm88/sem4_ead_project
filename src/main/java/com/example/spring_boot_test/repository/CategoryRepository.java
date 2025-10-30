package com.example.spring_boot_test.repository;

import com.example.spring_boot_test.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
