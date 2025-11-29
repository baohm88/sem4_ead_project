// frontend/services/articleApi.js
import { api } from "./api";

// 🔥 ADMIN – lấy ALL (NEW + ERROR + CRAWLED) + filter
export const getAllArticles = async (
    page = 0,
    size = 10,
    keyword = "",
    sortBy = "createdAt",
    direction = "DESC",
    categoryId = "",
    status = ""
) => {
    return api.get("/articles/admin", {
        params: {
            page,
            size,
            keyword,
            sortBy,
            direction,
            // chỉ gửi nếu có giá trị để tránh null/empty lung tung
            ...(categoryId && { categoryId }),
            ...(status && { status }),
        },
    });
};

// CLIENT – chỉ lấy CRAWLED (nhưng cho phép filter theo category/keyword)
export const getPublicArticles = async (
    page = 0,
    size = 5,
    keyword = "",
    sortBy = "createdAt",
    direction = "DESC",
    categoryId = ""
) => {
    return api.get("/articles/public", {
        params: {
            page,
            size,
            keyword,
            sortBy,
            direction,
            ...(categoryId && { categoryId }),
        },
    });
};

// DELETE
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Tìm article theo slug (SSR)
export const getPublicArticleBySlug = async (slug) => {
    return api.get(`/articles/public/${slug}`);
};