package com.t2404e.newscrawler.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> content;
    private Integer currentPage;
    private Integer pageSize;
    private Integer totalPages;
    private Long totalElements;

    // optional để FE debug/truy vấn thêm
    private String keyword;
    private String sortBy;
    private String direction;
}
