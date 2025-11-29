package com.t2404e.newscrawler.service;

import com.t2404e.newscrawler.entity.Category;
import com.t2404e.newscrawler.repository.ArticleRepository;
import com.t2404e.newscrawler.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepo;
    private final ArticleRepository articleRepo;

    public List<Category> findAll() {
        return categoryRepo.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public int countArticles(Long categoryId) {
        return articleRepo.countByArticleCategory_Id(categoryId);
    }

    public List<Category> getPublicCategories() {
        return categoryRepo.findCategoriesWithCrawledArticles();
    }
}
