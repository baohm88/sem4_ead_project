// services/categoryService.js

/** ================= API BASE ================= */
const CATEGORY_ENDPOINT = "/api/categories";

/** ================= GET LIST ================= */
export async function fetchCategories(page = 1, limit = 20, q = "") {
    const url = `${CATEGORY_ENDPOINT}?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");

    return res.json();
}

/** ================= CREATE ================= */
export async function addCategory(data) {
    const res = await fetch(CATEGORY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
}

/** ================= GET ONE ================= */
export async function getCategoryById(id) {
    const res = await fetch(`${CATEGORY_ENDPOINT}/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Category not found");
    return res.json();
}

/** ================= UPDATE (FINAL VERSION) ================= */
export async function updateCategory(id, data) {
    const res = await fetch(`${CATEGORY_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update category");
    return res.json();
}

/** ================= DELETE ================= */
export async function deleteCategory(id) {
    const res = await fetch(`${CATEGORY_ENDPOINT}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete category");
    return true;
}

/** ================= CHECK SLUG UNIQUE ================= */
export async function checkSlugUnique(slug, id = null) {
    const url = id
        ? `/api/categories/check-slug?slug=${slug}&id=${id}`
        : `/api/categories/check-slug?slug=${slug}`;

    const res = await fetch(url);
    if (!res.ok) return false;

    const json = await res.json();
    return json.exists;
}
