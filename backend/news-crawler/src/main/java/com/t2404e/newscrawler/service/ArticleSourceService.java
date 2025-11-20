package com.t2404e.newscrawler.service;

import com.t2404e.newscrawler.entity.*;
import com.t2404e.newscrawler.repository.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class ArticleSourceService {

    private final ArticleSourceRepository sourceRepo;
    private final ArticleRepository articleRepo;

    public ArticleSourceService(ArticleSourceRepository sourceRepo, ArticleRepository articleRepo) {
        this.sourceRepo = sourceRepo;
        this.articleRepo = articleRepo;
    }

    // Ghép domain + path → thành URL hoàn chỉnh
    private String buildSeedUrl(ArticleSource src) {
        return src.getDomain() + src.getPath();
    }

    // ===============================
    // STEP 1 — Crawl URL bài báo
    // ===============================
    public int crawlLinks() throws IOException {
        int count = 0;
        List<ArticleSource> sources = sourceRepo.findAll();

        for (ArticleSource src : sources) {

            String fullUrl = buildSeedUrl(src);
            Document doc = Jsoup.connect(fullUrl).get();

            Elements elements = doc.select(src.getLinkSelector());
            Set<String> links = new HashSet<>();

            for (Element el : elements) {
                String link = el.attr("href");

                // Nếu link không chứa http → tự ghép domain
                if (!link.startsWith("http")) {
                    link = src.getDomain() + link;
                }

                links.add(link);
            }

            // Lưu URL vào bảng Article
            for (String url : links) {
                if (articleRepo.existsByUrl(url)) continue;

                Article article = new Article();
                article.setUrl(url);
                article.setArticleCategory(src.getArticleCategory());
                article.setCrawled(false);
                article.setStatus(1);

                articleRepo.save(article);
                count++;
            }
        }

        return count;
    }

    // ===============================
    // STEP 2 — Crawl nội dung bài báo
    // ===============================
    public int crawlArticleDetails() throws IOException {
        List<Article> articles = articleRepo.findNotCrawled();
        int count = 0;

        for (Article article : articles) {

            // Lấy đúng source theo category
            List<ArticleSource> sources = article.getArticleCategory().getSources();
            if (sources.isEmpty()) continue;

            ArticleSource src = sources.get(0); // Giả sử category có 1 nguồn

            Document doc = Jsoup.connect(article.getUrl()).get();

            // Lấy title
            article.setTitle(doc.select(src.getTitleSelector()).text());

            // Lấy description
            article.setDescription(doc.select(src.getDescriptionSelector()).text());

            // Lấy content
            Element contentElement = doc.selectFirst(src.getContentSelector());
            if (contentElement != null) {

                // Xóa phần thừa
                if (src.getRemoveSelector() != null && !src.getRemoveSelector().isBlank()) {
                    contentElement.select(src.getRemoveSelector()).remove();
                }

                article.setContent(contentElement.text());
            }

            // Lấy ảnh
            article.setImageUrl(doc.select(src.getImageSelector()).attr("src"));

            // Đánh dấu đã crawl
            article.setCrawled(true);
            articleRepo.save(article);
            count++;
        }

        return count;
    }
}
