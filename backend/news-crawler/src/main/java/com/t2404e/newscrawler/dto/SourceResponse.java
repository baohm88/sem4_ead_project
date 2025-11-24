package com.t2404e.newscrawler.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SourceResponse {
    private Long id;
    private String title;
    private String domain;
    private String path;
    private String linkSelector;
    private String titleSelector;
    private String descriptionSelector;
    private String contentSelector;
    private String imageSelector;
    private String removeSelector;
    private int status;
    private Long categoryId; // 🔥 trả về categoryId
}