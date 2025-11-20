package com.t2404e.newscrawler.entity;

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
                @Index(columnList = "category_id"),  // Sửa lại ở đây
                @Index(columnList = "source_id")     // Thêm nếu cần
        }
)

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Dễ quản lý, không lock bằng URL

    @Column(nullable = false, unique = true, length = 512)
    private String url; // Mỗi bài có 1 URL duy nhất

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category articleCategory; // Thuộc category nào (Thể thao,...)

    // Thuộc nguồn báo nào? (VNExpress, Dân Trí...)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    private Source source;

    private String title;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;     // Nội dung crawl

    @Column(name = "image_url")
    private String imageUrl;    // Ảnh thumbnail

    // Trạng thái bài viết: NEW -> CRAWLED -> ERROR -> APPROVED?
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ArticleStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt; // Khi URL được thêm vào

    @UpdateTimestamp
    private LocalDateTime updatedAt; // Khi crawl nội dung
}
