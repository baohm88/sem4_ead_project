package com.t2404e.newscrawler.service;

import com.t2404e.newscrawler.dto.SourceRequest;
import com.t2404e.newscrawler.entity.Category;
import com.t2404e.newscrawler.entity.Source;
import com.t2404e.newscrawler.repository.CategoryRepository;
import com.t2404e.newscrawler.repository.SourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SourceService {

    private final SourceRepository sourceRepo;
    private final CategoryRepository categoryRepo;

    public SourceService(SourceRepository sourceRepo, CategoryRepository categoryRepo) {
        this.sourceRepo = sourceRepo;
        this.categoryRepo = categoryRepo;
    }

    public List<Source> getByCategory(Long categoryId) {
        return sourceRepo.findByArticleCategory_Id(categoryId);
    }

    public Source create(SourceRequest dto) {
        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Source source = Source.builder()
                .title(dto.getTitle())
                .domain(dto.getDomain())
                .path(dto.getPath())
                .linkSelector(dto.getLinkSelector())
                .titleSelector(dto.getTitleSelector())
                .descriptionSelector(dto.getDescriptionSelector())
                .contentSelector(dto.getContentSelector())
                .imageSelector(dto.getImageSelector())
                .removeSelector(dto.getRemoveSelector())
                .status(dto.getStatus())
                .articleCategory(category)
                .build();

        return sourceRepo.save(source);
    }

    public Source update(Long id, SourceRequest dto) {
        Source source = sourceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Source not found"));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepo.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            source.setArticleCategory(category);
        }

        source.setTitle(dto.getTitle());
        source.setDomain(dto.getDomain());
        source.setPath(dto.getPath());
        source.setLinkSelector(dto.getLinkSelector());
        source.setTitleSelector(dto.getTitleSelector());
        source.setDescriptionSelector(dto.getDescriptionSelector());
        source.setContentSelector(dto.getContentSelector());
        source.setImageSelector(dto.getImageSelector());
        source.setRemoveSelector(dto.getRemoveSelector());
        source.setStatus(dto.getStatus());

        return sourceRepo.save(source);
    }

    public void delete(Long id) {
        sourceRepo.deleteById(id);
    }
}
