package com.t2404e.newscrawler.controller;

import com.t2404e.newscrawler.dto.ApiResponse;
import com.t2404e.newscrawler.dto.ErrorResponse;
import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.entity.Category;
import com.t2404e.newscrawler.repository.CategoryRepository;
import com.t2404e.newscrawler.repository.ArticleRepository;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Category Management", description = "CRUD cho category tin tức")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/categories")
public class CategoryController {

    private final CategoryRepository categoryRepo;
    private final ArticleRepository articleRepo;

    public CategoryController(CategoryRepository categoryRepo, ArticleRepository articleRepo) {
        this.categoryRepo = categoryRepo;
        this.articleRepo = articleRepo;
    }

    // ===================== GET ALL ==============================
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll() {
        List<Category> list = categoryRepo.findAll();
        return ResponseEntity.ok(
                ApiResponse.<List<Category>>builder()
                        .success(true)
                        .message("Lấy danh sách category thành công")
                        .data(list)
                        .build()
        );
    }

    // =================== GET ARTICLES BY CATEGORY ================
    @GetMapping("/{id}/articles")
    public ResponseEntity<?> getArticlesByCategory(@PathVariable Long id) {
        if (!categoryRepo.existsById(id)) {
            return errorNotFound("Category không tồn tại!");
        }
        List<Article> articles = articleRepo.findByArticleCategory_Id(id);
        return ResponseEntity.ok(
                ApiResponse.<List<Article>>builder()
                        .success(true)
                        .message("Lấy danh sách bài viết theo category thành công")
                        .data(articles)
                        .build()
        );
    }

    // ===================== CREATE ================================
    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        Category saved = categoryRepo.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<Category>builder()
                        .success(true)
                        .message("Tạo category thành công")
                        .data(saved)
                        .build()
        );
    }

    // ===================== UPDATE ================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,
                                            @RequestBody Category updatedCategory) {

        Optional<Category> optional = categoryRepo.findById(id);
        if (optional.isEmpty()) {
            return errorNotFound("Category không tồn tại!");
        }

        Category category = optional.get();
        category.setName(updatedCategory.getName());
        categoryRepo.save(category);

        return ResponseEntity.ok(
                ApiResponse.<Category>builder()
                        .success(true)
                        .message("Cập nhật category thành công")
                        .data(category)
                        .build()
        );
    }

    // ===================== GET ONE ================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategory(@PathVariable Long id) {
        return categoryRepo.findById(id)
                .<ResponseEntity<?>>map(cat -> ResponseEntity.ok(
                        ApiResponse.<Category>builder()
                                .success(true)
                                .message("Lấy category thành công")
                                .data(cat)
                                .build()
                ))
                .orElse(errorNotFound("Category không tồn tại!"));
    }

    // ===================== DELETE ================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {

        if (!categoryRepo.existsById(id)) {
            return errorNotFound("Category không tồn tại!");
        }

        int count = articleRepo.countByArticleCategory_Id(id);
        if (count > 0) {
            return errorBadRequest("Không thể xoá. Category đang được dùng bởi " + count + " bài viết.");
        }

        categoryRepo.deleteById(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xoá category thành công")
                        .data(null)
                        .build()
        );
    }

    // ===================== ERROR HELPERS ==========================
    private ResponseEntity<ErrorResponse> errorNotFound(String msg) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.builder()
                        .success(false)
                        .status(404)
                        .message(msg)
                        .timestamp(System.currentTimeMillis())
                        .build());
    }

    private ResponseEntity<ErrorResponse> errorBadRequest(String msg) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.builder()
                        .success(false)
                        .status(400)
                        .message(msg)
                        .timestamp(System.currentTimeMillis())
                        .build());
    }
}
