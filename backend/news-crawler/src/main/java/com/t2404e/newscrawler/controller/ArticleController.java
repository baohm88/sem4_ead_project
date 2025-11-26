package com.t2404e.newscrawler.controller;

import com.t2404e.newscrawler.dto.ApiResponse;
import com.t2404e.newscrawler.dto.ErrorResponse;
import com.t2404e.newscrawler.dto.PageResponse;
import com.t2404e.newscrawler.entity.Article;
import com.t2404e.newscrawler.repository.ArticleRepository;
import com.t2404e.newscrawler.service.ArticleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Tag(name = "Article Management", description = "CRUD cho bài viết")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleRepository articleRepo;
    private final ArticleService articleService;

    // ===================== GET ALL ==============================
    // ADMIN – XEM TẤT CẢ
    @GetMapping("/admin")
    public ApiResponse<PageResponse<Article>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        return ApiResponse.success(articleService.getAllArticles(page, size, keyword, sortBy, direction));
    }


    // CLIENT – CHỈ THẤY CRAWLED
    @GetMapping("/public")
    public ApiResponse<PageResponse<Article>> getPublicArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        return ApiResponse.success(articleService.getCrawledArticles(page, size, keyword, sortBy, direction));
    }

    // ===================== GET ONE ==============================
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id) {
        Optional<Article> opt = articleRepo.findById(id);
        return opt.<ResponseEntity<?>>map(article -> ResponseEntity.ok(
                        ApiResponse.<Article>builder()
                                .success(true)
                                .message("Lấy bài viết thành công")
                                .data(article)
                                .build()
                ))
                .orElse(errorNotFound("Bài viết không tồn tại!"));
    }

    // ===================== CREATE ================================
    @PostMapping
    public ResponseEntity<ApiResponse<Article>> create(@RequestBody Article article) {
        Article saved = articleService.create(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<Article>builder()
                        .success(true)
                        .message("Tạo bài viết thành công")
                        .data(saved)
                        .build()
        );
    }

    // ===================== UPDATE ================================
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Article newData) {
        if (!articleRepo.existsById(id)) {
            return errorNotFound("Bài viết không tồn tại!");
        }

        Article updated = articleService.update(id, newData);

        return ResponseEntity.ok(
                ApiResponse.<Article>builder()
                        .success(true)
                        .message("Cập nhật bài viết thành công")
                        .data(updated)
                        .build()
        );
    }

    // ===================== DELETE ================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!articleRepo.existsById(id)) {
            return errorNotFound("Bài viết không tồn tại!");
        }

        articleRepo.deleteById(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xoá bài viết thành công")
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
