package com.t2404e.newscrawler.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "articles",
        indexes = {
                @Index(columnList = "url"),
                @Index(columnList = "status"),
                @Index(columnList = "category_id"),
                @Index(columnList = "source_id")
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 512)
    private String url;

    @Column(nullable = true, unique = false, length = 255)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category articleCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Source source;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;   // ✔ FIX: cho phép mô tả dài

    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;       // Nội dung crawl

    @Column(name = "image_url", length = 1024)
    private String imageUrl;      // ✔ FIX: URL có thể dài

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ArticleStatus status;

    @Column(name = "retry_count")
    private int retryCount;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}