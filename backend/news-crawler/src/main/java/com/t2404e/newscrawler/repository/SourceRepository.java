package com.t2404e.newscrawler.repository;

import com.t2404e.newscrawler.entity.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SourceRepository extends JpaRepository<Source, Long> {

    // Lấy tất cả nguồn theo Category ID
    List<Source> findByArticleCategory_Id(Long categoryId);

    // Kiểm tra duplicate title trong cùng category
    boolean existsByTitleAndArticleCategory_Id(String title, Long categoryId);
}
