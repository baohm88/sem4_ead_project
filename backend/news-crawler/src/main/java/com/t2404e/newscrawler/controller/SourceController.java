package com.t2404e.newscrawler.controller;

import com.t2404e.newscrawler.dto.*;
import com.t2404e.newscrawler.entity.Source;
import com.t2404e.newscrawler.service.SourceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Source Management", description = "CRUD cho nguồn tin tức")
@RestController
@RequestMapping("api/v1/sources")
@CrossOrigin(origins = "http://localhost:3000")
public class SourceController {

    private final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }
    // 🔹 GET all
    @GetMapping
    public ApiResponse<List<SourceResponse>> getAll() {
        return ApiResponse.success(sourceService.getAll());
    }
    // 🔹 GET by category
    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<Source>> getByCategory(@PathVariable Long categoryId) {
        return ApiResponse.success(sourceService.getByCategory(categoryId));
    }
    // 🔹 GET by id (cho Edit)
    @GetMapping("/{id}")
    public ApiResponse<Source> getOne(@PathVariable Long id) {
        return ApiResponse.success(sourceService.getById(id));
    }

    @PostMapping
    public ApiResponse<Source> create(@RequestBody SourceRequest request) {
        return ApiResponse.created(sourceService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Source> update(@PathVariable Long id, @RequestBody SourceRequest request) {
        return ApiResponse.success(sourceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        sourceService.delete(id);
        return ApiResponse.success("Deleted");
    }

    @PostMapping("/preview-links")
    public ApiResponse<List<String>> previewLinks(@RequestBody SourceLinkPreviewRequest req) {
        List<String> links = sourceService.previewLinks(req);
        return ApiResponse.success(links);
    }

    @PostMapping("/preview-article")
    public ApiResponse<ArticlePreviewResponse> previewArticle(@RequestBody ArticlePreviewRequest req) {
        ArticlePreviewResponse preview = sourceService.previewArticle(req);
        return ApiResponse.success(preview);
    }
}
