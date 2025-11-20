package com.t2404e.springagaint2404e.controller;

import com.t2404e.springagaint2404e.entity.Article;
import com.t2404e.springagaint2404e.entity.ArticleCategory;
import com.t2404e.springagaint2404e.entity.ArticleSource;
import com.t2404e.springagaint2404e.repository.ArticleCategoryRepository;
import com.t2404e.springagaint2404e.repository.ArticleRepository;
import com.t2404e.springagaint2404e.repository.ArticleSourceRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/article-sources")
public class ArticleSourceController {

    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private ArticleSourceRepository articleSourceRepository;
    @Autowired
    private ArticleCategoryRepository articleCategoryRepository;

    @RequestMapping(method = RequestMethod.POST)
    public ArticleSource create() {
        ArticleCategory articleCategory = articleCategoryRepository.findById(1L).get();
        ArticleSource articleSource = new ArticleSource();
        articleSource.setArticleCategory(articleCategory);
        articleSource.setTitle("Chuyên mục thể thao vnexpress.net");
        articleSource.setUrl("https://vnexpress.net/the-thao");
        articleSource.setLinkSelector("h3.title-news a[href]");
        articleSource.setTilteSelector("h1.title-detail");
        articleSource.setDescriptionSelector("p.description");
        articleSource.setImageSelector("figure picture img");
        articleSource.setContentSelector("article.fck_detail");
        articleSource.setStatus(1);
        articleSourceRepository.save(articleSource);
        return articleSource;
    }

    @RequestMapping(method = RequestMethod.GET, path = "bot2")
    public String runBot2() {
        ArticleSource articleSource = articleSourceRepository.findById(1L).get();
        List<Article> articleList = articleRepository.findNotCrawledArticle();
        try {
            for (Article article : articleList) {
               Document document = Jsoup.connect(article.getUrl()).get();
               article.setTitle(document.select(articleSource.getTilteSelector()).text());
               article.setDescription(document.select(articleSource.getDescriptionSelector()).text());
               article.setImageUrl(document.select(articleSource.getImageSelector()).attr("src"));
               article.setCrawled(true);
               article.setStatus(1);
            }
            articleRepository.saveAll(articleList);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return "Okie";
    }

    @RequestMapping(method = RequestMethod.GET)
    public String runBot() {
        List<ArticleSource> sourceList = articleSourceRepository.findAll();
        try {
            for (ArticleSource articleSource : sourceList) {

                Document document = Jsoup.connect(articleSource.getUrl()).get();
                Elements elements = document.select(articleSource.getLinkSelector());
                HashSet<String> links = new HashSet<>();
                for (Element element : elements) {
                    String href = element.attr("href");
                    if(href.contains("vnexpress.net")){
                        links.add(href);
                    }
                }
                List<Article> articles = new ArrayList<>();
                for (String link : links) {
                    Article article = new Article();
                    article.setArticleCategory(articleSource.getArticleCategory());
                    article.setUrl(link);
                    article.setCrawled(false);
                    System.out.println(link);
                    articles.add(article);
                }
                articleRepository.saveAll(articles);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return "Okie";
    }
}
