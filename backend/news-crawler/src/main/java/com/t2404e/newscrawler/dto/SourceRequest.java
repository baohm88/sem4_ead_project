package com.t2404e.newscrawler.dto;

import lombok.Data;

@Data
public class SourceRequest {

    private String title;
    private String domain;
    private String path;

    private String linkSelector;
    private String titleSelector;
    private String descriptionSelector;
    private String contentSelector;
    private String imageSelector;
    private String removeSelector;

    private Long categoryId;
    private Integer status; // 1 active, 0 inactive
}
