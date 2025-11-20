package com.t2404e.newscrawler.dto;

import lombok.Data;

@Data
public class ArticleSourceRequest {
    private Long categoryId;
    private String title;
    private String url;
    private String linkSelector;
    private String titleSelector;
    private String descriptionSelector;
    private String imageSelector;
    private String contentSelector;
}