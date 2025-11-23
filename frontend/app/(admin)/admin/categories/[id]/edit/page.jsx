"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/admin/Card";

import "@/styles/admin/category-edit.css";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/services/categoryApi";

export default function EditCategoryPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  /* LOAD DATA */
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategoryById(id);

        if (!data || !data.id) {
          router.push("/admin/categories");
        } else {
          setName(data.name);
        }
      } catch (e) {
        router.push("/admin/categories");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* SAVE */
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await updateCategory(id, name);
      router.push(`/admin/categories/${id}`);
    } catch (e) {
      alert("Cập nhật thất bại!");
    }

    setSaving(false);
  }

  /* DELETE */
  async function handleDelete() {
    const res = await deleteCategory(id);

    if (res) {
      router.push("/admin/categories/list");
    } else {
      alert("Xoá thất bại!");
    }
  }

  if (loading) {
    return (
      <div className="edit-wrap fade-in">
        <Card>
          <p>Đang tải...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="edit-wrap fade-in">
      {/* HEADER */}
      <div className="edit-header">
        <h1 className="edit-title">Sửa Category</h1>

        <Link href={`/admin/categories/${id}`} className="edit-btn-back">
          ← Quay lại
        </Link>
      </div>

      {/* FORM */}
      <Card className="edit-card">
        <form onSubmit={handleSave} className="edit-form">
          <div className="edit-field">
            <label>Tên category</label>
            <input
              className="edit-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="edit-actions">
            <button type="submit" className="edit-btn-save" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>

            <button
              type="button"
              className="edit-btn-delete"
              onClick={() => setShowDeletePopup(true)}
            >
              Xoá category
            </button>
          </div>
        </form>
      </Card>

      {/* POPUP DELETE */}
      {showDeletePopup && (
        <div className="neo-popup-overlay">
          <div className="neo-popup">
            <div className="neo-popup-icon">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 9v4m0 4h.01M12 2l9 18H3L12 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3>Xoá Category?</h3>

            <p>
              Bạn chắc chắn muốn xoá category này?
              <br />
              <strong>
                Các bài viết đang dùng category này sẽ mất category.
              </strong>
            </p>

            <div className="neo-popup-actions">
              <button
                className="neo-cancel"
                onClick={() => setShowDeletePopup(false)}
              >
                Huỷ
              </button>

              <button className="neo-delete" onClick={handleDelete}>
                Xoá luôn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
