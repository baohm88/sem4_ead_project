package com.example.spring_boot_test.repository;

import com.example.spring_boot_test.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // nếu cần thêm method thì viết ở đây
}
