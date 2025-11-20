package com.t2404e.newscrawler.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private boolean success; // luôn là false
    private String message;  // mô tả lỗi
    private int status;      // HTTP status
    private long timestamp;  // thời điểm xảy ra lỗi
}
