import { api } from "./api";

// 🔥 ADMIN – lấy ALL (NEW + ERROR + CRAWLED)
export const getAllArticles = async (
    page = 0,
    size = 10,
    keyword = "",
    sortBy = "createdAt",
    direction = "DESC"
) => {
    return api.get(
        `/articles/admin?page=${page}&size=${size}&keyword=${keyword}&sortBy=${sortBy}&direction=${direction}`
    );
};

// CLIENT – chỉ lấy CRAWLED
export const getPublicArticles = async (
    page = 0,
    size = 5,
    keyword = "",
    sortBy = "createdAt",
    direction = "DESC"
) => {
    return api.get(
        `/articles/public?page=${page}&size=${size}&keyword=${keyword}&sortBy=${sortBy}&direction=${direction}`
    );
};

// DELETE
export const deleteArticle = (id) => api.delete(`/articles/${id}`);