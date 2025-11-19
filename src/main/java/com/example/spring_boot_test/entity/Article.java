package com.example.spring_boot_test.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "article")
public class Article {
    @Id
    @Column(name = "url", length = 512, nullable = false)
    private String url; // URL là Primary Key theo DB Dump

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "crawled", nullable = false)
    private Boolean crawled; // bit(1) được ánh xạ thành Boolean trong JPA

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "image_url", length = 255)
    private String imageUrl; // Chỉ lưu một ảnh đại diện

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "title", length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ArticleCategory category;

    // Constructors
    public Article() {
        this.crawled = false; // Mặc định chưa cào
    }

    // Getters and Setters
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getCrawled() {
        return crawled;
    }

    public void setCrawled(Boolean crawled) {
        this.crawled = crawled;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ArticleCategory getCategory() {
        return category;
    }

    public void setCategory(ArticleCategory category) {
        this.category = category;
    }
}
