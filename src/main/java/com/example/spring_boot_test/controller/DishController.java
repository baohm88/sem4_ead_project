package com.example.spring_boot_test.controller;

import com.example.spring_boot_test.entity.Dish;
import com.example.spring_boot_test.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/dishes")
public class DishController {
    @Autowired
    private DishService dishService;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAll(
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
        if (page < 0 || limit < 10) {
            return ResponseEntity.badRequest().body("Page and limit must be greater than 0");
        }
        if (!sortDir.equalsIgnoreCase("asc") && !sortDir.equalsIgnoreCase("desc")) {
            return ResponseEntity.badRequest().body("Sort direction must be 'asc' or 'desc'");
        }
        Page<Dish> dishes = dishService.findAll(keyword, categoryId, status, minPrice, maxPrice, sortBy, sortDir, page, limit);
        return ResponseEntity.ok(dishes);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        Dish dish = dishService.getDishById(id);
        return ResponseEntity.ok(dish);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody Dish dish) {
        Dish created = dishService.saveDish(dish);
        return ResponseEntity
                .created(URI.create("/api/v1/dishes/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Dish updates) {
        Dish update = dishService.updateDish(id, updates);
        return ResponseEntity.ok(update);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}

