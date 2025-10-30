package com.example.spring_boot_test.controller;

import com.example.spring_boot_test.entity.Category;
import com.example.spring_boot_test.repository.CategoryRepository;
import com.example.spring_boot_test.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @RequestMapping(method = RequestMethod.GET)
    public List<Category> getAllCategories() {
        List<Category> categories = categoryService.findAll();
        return categories;
    }
}