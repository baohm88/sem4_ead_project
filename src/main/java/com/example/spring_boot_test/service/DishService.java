package com.example.spring_boot_test.service;

import com.example.spring_boot_test.entity.Category;
import com.example.spring_boot_test.entity.Dish;
import com.example.spring_boot_test.entity.helper.DishStatus;
import com.example.spring_boot_test.repository.CategoryRepository;
import com.example.spring_boot_test.repository.DishRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Lấy danh sách món ăn có lọc + sort + phân trang
     */
    public Page<Dish> findAll(
            String keyword,
            Long categoryId,
            String status,
            Double minPrice,
            Double maxPrice,
            String sortBy,
            String sortDir,
            int page,
            int limit
    ) {

        Specification<Dish> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. keyword theo tên
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(
                        cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%")
                );
            }

            // 2. lọc theo category
            if (categoryId != null) {
                // vì entity là: private Category category;
                predicates.add(
                        cb.equal(root.get("category").get("id"), categoryId)
                );
            }

            // 3. lọc theo status (enum string)
            if (status != null && !status.isEmpty()) {
                // nếu truyền lên "ON_SALE" hoặc "STOPPED" thì sẽ vào đây
                predicates.add(
                        cb.equal(root.get("status"), DishStatus.valueOf(status))
                );
            }

            // 4. giá min
            if (minPrice != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice)
                );
            }

            // 5. giá max
            if (maxPrice != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice)
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // sort
        Sort sort = Sort.by(sortBy != null ? sortBy : "id");
        sort = "asc".equalsIgnoreCase(sortDir) ? sort.ascending() : sort.descending();

        // paging
        Pageable pageable = PageRequest.of(page, limit, sort);

        Page<Dish> dishPage = dishRepository.findAll(spec, pageable);

        // Ở đây bạn đang trả thẳng entity → thật ra không cần map lại
        // nhưng bạn muốn “làm sạch” entity trả về thì map nhẹ thế này là đủ
        return dishPage.map(dish -> {
            Dish res = new Dish();
            res.setId(dish.getId());
            res.setName(dish.getName());
            res.setDescription(dish.getDescription());
            res.setImageUrl(dish.getImageUrl());
            res.setPrice(dish.getPrice());
            res.setStartDate(dish.getStartDate());
            res.setLastModifiedDate(dish.getLastModifiedDate());
            res.setStatus(dish.getStatus());
            res.setCategory(dish.getCategory());
            return res;
        });
    }

    /**
     * Lấy 1 món ăn theo id
     */
    public Dish getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found with id: " + id)
                );

        Dish res = new Dish();
        res.setId(dish.getId());
        res.setName(dish.getName());
        res.setDescription(dish.getDescription());
        res.setImageUrl(dish.getImageUrl());
        res.setPrice(dish.getPrice());
        res.setStartDate(dish.getStartDate());
        res.setLastModifiedDate(dish.getLastModifiedDate());
        res.setStatus(dish.getStatus());
        res.setCategory(dish.getCategory());
        return res;
    }

    /**
     * Tạo mới món ăn
     */
    public Dish saveDish(Dish dish) {
        // category bắt buộc
        if (dish.getCategory() == null || dish.getCategory().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "categoryId là bắt buộc");
        }

        // check category tồn tại
        Category category = categoryRepository.findById(dish.getCategory().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Category not found with id: " + dish.getCategory().getId()
                ));

        // gán category đã validate
        dish.setCategory(category);

        // server fill thời gian
        Date now = new Date();
        dish.setStartDate(now);
        dish.setLastModifiedDate(now);

        // nếu client không gửi status thì set ON_SALE
        if (dish.getStatus() == null) {
            dish.setStatus(DishStatus.ON_SALE);
        }

        return dishRepository.save(dish);
    }

    /**
     * Cập nhật món ăn
     */
    public Dish updateDish(long id, Dish updates) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Món ăn không tồn tại"
                ));

        if (dish.getStatus() == DishStatus.DELETED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Không thể cập nhật món ăn đã bị xóa"
            );
        }

        // name
        if (updates.getName() != null) {
            String newName = updates.getName().trim();
            if (newName.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên món ăn không được để trống");
            }
            if (newName.length() <= 7) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên món ăn phải dài hơn 7 ký tự");
            }
            dish.setName(newName);
        }

        // description
        if (updates.getDescription() != null) {
            if (updates.getDescription().length() > 500) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mô tả không được vượt quá 500 ký tự");
            }
            dish.setDescription(updates.getDescription());
        }

        // imageUrl
        if (updates.getImageUrl() != null) {
            if (!updates.getImageUrl().matches("^https?://.+")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "URL ảnh không hợp lệ");
            }
            dish.setImageUrl(updates.getImageUrl());
        }

        // price
        if (updates.getPrice() != null) {
            if (updates.getPrice() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giá phải lớn hơn 0");
            }
            dish.setPrice(updates.getPrice());
        }

        // đổi category
        if (updates.getCategory() != null && updates.getCategory().getId() != null) {
            Category category = categoryRepository.findById(updates.getCategory().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Category không tồn tại"
                    ));
            dish.setCategory(category);
        }

        // đổi status
        if (updates.getStatus() != null) {
            if (updates.getStatus() == DishStatus.DELETED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể đặt DELETED qua update");
            }
            if (updates.getStatus() != DishStatus.ON_SALE &&
                    updates.getStatus() != DishStatus.STOPPED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái chỉ có thể là ON_SALE hoặc STOPPED");
            }
            dish.setStatus(updates.getStatus());
        }

        // đổi startDate (nếu cần)
        if (updates.getStartDate() != null) {
            Date newStart = updates.getStartDate();
            Date now = new Date();
            if (newStart.after(now)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startDate không được là ngày trong tương lai");
            }
            dish.setStartDate(newStart);
        }

        // update last modified
        dish.setLastModifiedDate(new Date());

        return dishRepository.save(dish);
    }

    /**
     * Xóa mềm món ăn
     */
    public void deleteDish(long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Món ăn không tồn tại với id: " + id
                ));

        if (dish.getStatus() == DishStatus.DELETED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Món ăn đã bị xóa từ trước (trạng thái DELETED)"
            );
        }

        dish.setStatus(DishStatus.DELETED);
        dish.setLastModifiedDate(new Date());

        dishRepository.save(dish);
    }
}
