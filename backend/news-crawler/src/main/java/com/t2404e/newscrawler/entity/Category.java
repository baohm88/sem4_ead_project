package com.t2404e.newscrawler.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên danh mục (VD: Thể thao, Công nghệ)
    @Column(nullable = false, unique = true, length = 100)
    private String name;
}
