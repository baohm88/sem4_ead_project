import { api } from "./api";

export const getSources = async () => await api.get("/sources");

export const createSource = (data) => api.post("/sources", data);

export const updateSource = (id, data) => api.put(`/sources/${id}`, data);

export const deleteSource = (id) => api.delete(`/sources/${id}`);

export const previewLinks = (data) => api.post("/sources/preview-links", data);

export const previewArticle = (data) => api.post("/sources/preview-article", data);
