package com.t2404e.newscrawler.service;

import com.t2404e.newscrawler.dto.*;
import com.t2404e.newscrawler.entity.Category;
import com.t2404e.newscrawler.entity.Source;
import com.t2404e.newscrawler.repository.CategoryRepository;
import com.t2404e.newscrawler.repository.SourceRepository;
import org.springframework.stereotype.Service;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.List;

@Service
public class SourceService {

    private final SourceRepository sourceRepo;
    private final CategoryRepository categoryRepo;

    public SourceService(SourceRepository sourceRepo, CategoryRepository categoryRepo) {
        this.sourceRepo = sourceRepo;
        this.categoryRepo = categoryRepo;
    }

    public List<SourceResponse> getAll() {
        return sourceRepo.findAll().stream()
                .map(this::toResponse)
                .toList();
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

    /** ========== PREVIEW LINKS ========== */
    public List<String> previewLinks(SourceLinkPreviewRequest req) {
        try {
            if (req.getDomain() == null || req.getPath() == null || req.getLinkSelector() == null) {
                throw new RuntimeException("Thiếu domain / path / linkSelector");
            }

            int limit = (req.getLimit() != null && req.getLimit() > 0) ? req.getLimit() : 10;

            String url = req.getDomain().replaceAll("/$", "") + "/" +
                    req.getPath().replaceAll("^/", "");

            Document doc = Jsoup.connect(url).get();

            Set<String> urls = new LinkedHashSet<>();
            for (Element a : doc.select(req.getLinkSelector())) {
                String link = a.attr("abs:href");
                link = normalizeUrl(link);

                if (link == null || !link.startsWith("http")) continue;
                if (urls.add(link) && urls.size() >= limit) break;
            }

            return new ArrayList<>(urls);

        } catch (Exception e) {
            throw new RuntimeException("Preview links error: " + e.getMessage(), e);
        }
    }

    /** ========== PREVIEW ARTICLE ========== */
    public ArticlePreviewResponse previewArticle(ArticlePreviewRequest req) {
        try {
            if (req.getUrl() == null || req.getContentSelector() == null) {
                throw new RuntimeException("Thiếu url / contentSelector");
            }

            Document doc = Jsoup.connect(req.getUrl())
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
                    .timeout(15000)
                    .get();

            // Remove garbage nếu có
            if (req.getRemoveSelector() != null && !req.getRemoveSelector().isBlank()) {
                doc.select(req.getRemoveSelector()).remove();
            }

            String title = req.getTitleSelector() != null
                    ? doc.select(req.getTitleSelector()).text()
                    : null;

            String desc = req.getDescriptionSelector() != null
                    ? doc.select(req.getDescriptionSelector()).text()
                    : null;

            String contentHtml = doc.select(req.getContentSelector()).html();

            // Image ưu tiên selector FE nhập, fallback meta / img
            String image = null;
            if (req.getImageSelector() != null && !req.getImageSelector().isBlank()) {
                image = doc.select(req.getImageSelector()).attr("content");
                if (image == null || image.isBlank()) {
                    image = doc.select(req.getImageSelector()).attr("src");
                }
            }
            if (image == null || image.isBlank()) {
                image = doc.select("meta[itemprop=url]").attr("content");
            }
            if (image == null || image.isBlank()) {
                image = doc.select("img[itemprop=contentUrl]").attr("src");
            }

            return ArticlePreviewResponse.builder()
                    .url(req.getUrl())
                    .title(title)
                    .description(desc)
                    .imageUrl(image)
                    .contentHtml(contentHtml)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Preview article error: " + e.getMessage(), e);
        }
    }

    // ========== helper ==========
    private String normalizeUrl(String url) {
        if (url == null) return null;
        return url.split("#")[0].trim();
    }

    private SourceResponse toResponse(Source s) {
        return SourceResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .domain(s.getDomain())
                .path(s.getPath())
                .linkSelector(s.getLinkSelector())
                .titleSelector(s.getTitleSelector())
                .descriptionSelector(s.getDescriptionSelector())
                .contentSelector(s.getContentSelector())
                .imageSelector(s.getImageSelector())
                .removeSelector(s.getRemoveSelector())
                .status(s.getStatus())
                .categoryId(s.getArticleCategory() != null ? s.getArticleCategory().getId() : null)
                .build();
    }

}
