package com.t2404e.newscrawler.dto;

import lombok.Data;

@Data
public class SourceLinkPreviewRequest {
    private String domain;
    private String path;
    private String linkSelector;
    // optional: giới hạn số link preview
    private Integer limit;
}