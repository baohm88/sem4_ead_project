package com.t2404e.newscrawler.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên hiển thị cho nguồn (ví dụ: "VnExpress - Thể thao")
    private String title;

    // Domain (ví dụ: https://vnexpress.net)
    private String domain;

    // Path (ví dụ: "/the-thao")
    private String path;

    // CSS selector lấy link bài viết từ trang danh mục
    private String linkSelector;

    // CSS selector lấy title bài báo
    private String titleSelector;

    // CSS selector lấy mô tả bài báo
    private String descriptionSelector;

    // CSS selector lấy nội dung bài báo
    private String contentSelector;

    // CSS selector lấy ảnh bài báo
    private String imageSelector;

    // CSS selector dùng để remove các phần thừa trong nội dung
    private String removeSelector;

    // Mỗi nguồn thuộc 1 category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category articleCategory;

    // 1 = active, 0 = inactive
    private int status;
}
