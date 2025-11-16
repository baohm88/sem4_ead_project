package com.t2404e.springagaint2404e.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ArticleSource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    // general information
    private String title;
    @ManyToOne(fetch = FetchType.LAZY) // LAZY: chỉ load User khi thực sự cần đến
    @JoinColumn(name = "category_id") // Tạo cột author_id trong bảng posts
    @JsonBackReference
    private ArticleCategory articleCategory;
    private String description;
    private String url;
    private String linkSelector;
    private String domain;
    private String path;
    // detail information
    private String tilteSelector;
    private String descriptionSelector;
    private String contentSelector;
    private String imageSelector;
    private String removeSelector;
    private int status;
}
