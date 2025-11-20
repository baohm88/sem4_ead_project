// services/categoryService.js

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const CATEGORY_ENDPOINT = `${API_BASE}/categories`;

/** ===== CRUD ===== */

// GET All
export async function fetchCategories() {
  const res = await fetch(CATEGORY_ENDPOINT, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

// CREATE
export async function addCategory(name) {
  const res = await fetch(CATEGORY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

// GET One
export async function getCategoryById(id) {
  const res = await fetch(`${CATEGORY_ENDPOINT}/${id}`);
  if (!res.ok) throw new Error("Category not found");
  return res.json();
}

// UPDATE
export async function updateCategory(id, name) {
  const res = await fetch(`${CATEGORY_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

// DELETE
export async function deleteCategory(id) {
  console.log("ID to delete: ", id);
  
  const res = await fetch(`${CATEGORY_ENDPOINT}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete category");
  return true;
}
