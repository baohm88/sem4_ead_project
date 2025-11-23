package com.t2404e.newscrawler.dto;

import lombok.Data;

@Data
public class ArticlePreviewRequest {
    private String url;
    private String titleSelector;
    private String descriptionSelector;
    private String contentSelector;
    private String imageSelector;
    private String removeSelector;
}