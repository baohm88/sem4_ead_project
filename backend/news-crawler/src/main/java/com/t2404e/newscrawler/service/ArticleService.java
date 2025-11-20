package com.t2404e.newscrawler.service;

import com.t2404e.newscrawler.entity.*;
import com.t2404e.newscrawler.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
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

    public void delete(Long id) {
        articleRepository.deleteById(id);
    }
}
