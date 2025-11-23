"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/categoryApi";

export default function SourceModal({ show, data, onClose, onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    domain: "",
    path: "",
    linkSelector: "",
    titleSelector: "",
    descriptionSelector: "",
    contentSelector: "",
    imageSelector: "",
    removeSelector: "",
    categoryId: "",
    status: 1,
  });

  /** =============== Fetch Category List =============== */
  useEffect(() => {
    if (show) {
      fetchCategories().then((res) => {
        setCategories(res); // API đã wrap => data.data => axios trả res.data = {data:...}
      });
    }
  }, [show]);

  /** =============== Load data when editing =============== */
  useEffect(() => {
    if (data) setForm(data);
    else
      setForm({
        title: "",
        domain: "",
        path: "",
        linkSelector: "",
        titleSelector: "",
        descriptionSelector: "",
        contentSelector: "",
        imageSelector: "",
        removeSelector: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        status: 1,
      });
  }, [data, categories]);

  /** =============== Close Modal =============== */
  if (!show) return null;

  /** =============== Handle Input Change =============== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** =============== Submit =============== */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-auto z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <h2 className="text-xl font-bold mb-4">
          {data ? "Edit Source" : "Add Source"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/*========== Category Selector ==========*/}
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/*========== Common Inputs ==========*/}
          {[
            "title",
            "domain",
            "path",
            "linkSelector",
            "titleSelector",
            "descriptionSelector",
            "contentSelector",
            "imageSelector",
            "removeSelector",
          ].map((key) => (
            <div key={key}>
              <label className="block font-semibold mb-1 capitalize">
                {key}
              </label>
              <input
                name={key}
                value={form[key] ?? ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}

          {/*========== Status ==========*/}
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          {/*========== Actions ==========*/}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}