package com.t2404e.newscrawler.controller;

import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.ArticleCategory;
import com.t2404e.newscrawler.repository.ArticleCategoryRepository;
import com.t2404e.newscrawler.repository.ArticleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/v1/categories")
public class CategoryController {

    private final ArticleCategoryRepository categoryRepo;
    private final ArticleRepository articleRepo;

    public CategoryController(ArticleCategoryRepository categoryRepo, ArticleRepository articleRepo) {
        this.categoryRepo = categoryRepo;
        this.articleRepo = articleRepo;
    }

    // --- Lấy tất cả category ---
    @GetMapping
    public List<ArticleCategory> getAll() {
        return categoryRepo.findAll();
    }

    // --- Lấy tất cả bài viết theo category ---
    @GetMapping("/{id}/articles")
    public List<Article> getArticlesByCategory(@PathVariable Long id) {
        return articleRepo.findByArticleCategoryId(id);
    }

    // --- Tạo category mới ---
    @PostMapping
    public ArticleCategory createCategory(@RequestBody ArticleCategory category) {
        return categoryRepo.save(category);
    }

    // --- Cập nhật category theo id ---
    @PutMapping("/{id}")
    public ResponseEntity<ArticleCategory> updateCategory(@PathVariable Long id,
                                                          @RequestBody ArticleCategory updatedCategory) {
        Optional<ArticleCategory> optionalCategory = categoryRepo.findById(id);
        if (!optionalCategory.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        ArticleCategory category = optionalCategory.get();
        category.setName(updatedCategory.getName()); // cập nhật tên
        categoryRepo.save(category);
        return ResponseEntity.ok(category);
    }

    // --- Lấy category theo id ---
    @GetMapping("/{id}")
    public ArticleCategory getCategory(@PathVariable Long id) {
        Optional<ArticleCategory> optionalCategory = categoryRepo.findById(id);
        if (!optionalCategory.isPresent()) {
            return null;
        }
        return optionalCategory.get();
    }

    // --- Xoá category theo id ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (!categoryRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
