package com.t2404e.newscrawler.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "article_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên danh mục (VD: Thể thao, Công nghệ)
    @Column(nullable = false, unique = true)
    private String name;

    // Một Category có nhiều nguồn bài báo (VnExpress, Dân trí...)
    @OneToMany(mappedBy = "articleCategory", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ArticleSource> sources;
}
