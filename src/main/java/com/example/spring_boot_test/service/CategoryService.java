package com.example.spring_boot_test.service;

import com.example.spring_boot_test.entity.Category;
import com.example.spring_boot_test.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        // bổ sung logic sau vào đây.
        return categoryRepository.findAll();
    }
}
