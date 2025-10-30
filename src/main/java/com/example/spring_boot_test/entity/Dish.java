package com.example.spring_boot_test.entity;

import com.example.spring_boot_test.entity.helper.DishStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@Table(name = "dishes")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "name", length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name ="price", nullable = false)
    private Double price;

    @Column(name = "start_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @Column(name = "last_modified")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastModifiedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DishStatus status;     // ⬅ dùng đúng enum ở package helper

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;
}

