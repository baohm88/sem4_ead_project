package com.t2404e.newscrawler.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ArticleDetailDTO {

    private Long id;
    private String title;
    private String slug;
    private String description;
    private String content;

    private String imageUrl;

    private String categoryName;
    private String sourceName;

    private LocalDateTime createdAt;
}
