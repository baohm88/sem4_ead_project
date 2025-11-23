import { api } from "./api";

// GET All
export const fetchCategories = async () => api.get("/categories");

// CREATE
export const addCategory = (name) => api.post("/categories", { name });

// GET One
export const getCategoryById = (id) => api.get(`/categories/${id}`);

// UPDATE
export const updateCategory = (id, name) =>
  api.put(`/categories/${id}`, { name });

// DELETE
export const deleteCategory = (id) => api.delete(`/categories/${id}`);