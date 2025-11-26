package com.t2404e.newscrawler.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<T> {
    private List<T> items;
    private long totalItems;
    private int totalPages;
    private int currentPage;
    private int pageSize;
}