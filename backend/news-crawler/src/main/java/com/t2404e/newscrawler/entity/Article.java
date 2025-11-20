package com.t2404e.newscrawler.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "article")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {

    // URL chính là Primary Key
    @Id
    @Column(length = 512)
    private String url;

    // Mỗi bài viết thuộc 1 category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ArticleCategory articleCategory;

    private String title;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url")
    private String imageUrl;

    // false = chưa crawl nội dung, chỉ có URL
    private boolean crawled;

    private int status;
}
