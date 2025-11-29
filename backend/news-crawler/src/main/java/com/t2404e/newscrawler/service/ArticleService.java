package com.t2404e.newscrawler.service;

import com.t2404e.newscrawler.dto.PageResponse;
import com.t2404e.newscrawler.entity.*;
import com.t2404e.newscrawler.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;

    // Convert title -> slug
    private String toSlug(String text) {
        String slug = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("-+$", "")
                .replaceAll("^-+", "");
        return slug;
    }

    public List<Article> findAll() {
        return articleRepository.findAll();
    }

    @Transactional
    public Article create(Article article) {
        article.setSlug(toSlug(article.getTitle()));
        if (article.getStatus() == null) article.setStatus(ArticleStatus.NEW);
        return articleRepository.save(article);
    }

    @Transactional
    public Article update(Long id, Article newData) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (!article.getTitle().equals(newData.getTitle())) {
            article.setSlug(toSlug(newData.getTitle()));
        }

        article.setTitle(newData.getTitle());
        article.setDescription(newData.getDescription());
        article.setContent(newData.getContent());
        article.setImageUrl(newData.getImageUrl());
        article.setStatus(newData.getStatus());

        return articleRepository.save(article);
    }

    public Page<Article> search(String keyword, Pageable pageable) {
        if(keyword == null || keyword.isBlank()) {
            return articleRepository.findAll(pageable);
        }
        return articleRepository.search(keyword, pageable);
    }

    public PageResponse<Article> getAllArticles(int page, int size, String keyword, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("ASC")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending()
        );

        Page<Article> articlePage =
                (keyword == null || keyword.isBlank())
                        ? articleRepository.findAll(pageable)
                        : articleRepository.search(keyword, pageable);

        return PageResponse.<Article>builder()
                .content(articlePage.getContent())
                .currentPage(articlePage.getNumber())
                .pageSize(articlePage.getSize())
                .totalPages(articlePage.getTotalPages())
                .totalElements(articlePage.getTotalElements())
                .keyword(keyword)
                .sortBy(sortBy)
                .direction(direction)
                .build();
    }

    public PageResponse<Article> getCrawledArticles(int page, int size, String keyword, String sortBy, String direction) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("ASC")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending()
        );

        Page<Article> articlePage;

        if (keyword == null || keyword.isBlank()) {
            articlePage = articleRepository.findByStatus(ArticleStatus.CRAWLED, pageable);
        } else {
            articlePage = articleRepository.search(keyword, pageable)
                    .map(a -> a.getStatus() == ArticleStatus.CRAWLED ? a : null); // lọc bằng search
        }

        return PageResponse.<Article>builder()
                .content(articlePage.getContent())
                .currentPage(articlePage.getNumber())
                .pageSize(articlePage.getSize())
                .totalPages(articlePage.getTotalPages())
                .totalElements(articlePage.getTotalElements())
                .keyword(keyword)
                .sortBy(sortBy)
                .direction(direction)
                .build();
    }

    public void delete(Long id) {
        articleRepository.deleteById(id);
    }
}
