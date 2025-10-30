package com.example.spring_boot_test.controller;

import com.example.spring_boot_test.entity.Category;
import com.example.spring_boot_test.entity.Dish;
import com.example.spring_boot_test.service.CategoryService;
import com.example.spring_boot_test.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/dishes")
public class DishController {

    @Autowired
    private DishService dishService;

    @RequestMapping(method = RequestMethod.GET)
    public Page<Dish> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        // validate
        Page<Dish> dishes = dishService.findAll(keyword, categoryId, status, minPrice, maxPrice, sortBy, sortDir, page, limit);
        return dishes;
    }

    @RequestMapping(method = RequestMethod.GET, path = "generate-seed")
    public String generateSeedData(){
        dishService.generateSeedData();
        return "DONE";
    }

}
