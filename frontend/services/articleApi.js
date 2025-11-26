import { api } from "./api";

// 🔥 ADMIN lấy tất cả (NEW + ERROR + CRAWLED)
export const getAllArticles = async (
  page = 0,
  size = 5,
  keyword = "",
  sortBy = "createdAt",
  direction = "DESC"
) => {
  const res = await api.get(
    `/articles/public?page=${page}&size=${size}&keyword=${keyword}&sortBy=${sortBy}&direction=${direction}`
  );
  console.log("ARTICLES: ", res);
  return res;
};

// ❌ DELETE Article
export const deleteArticle = (id) => api.delete(`/articles/${id}`);
