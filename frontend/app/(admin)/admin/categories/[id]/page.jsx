"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/admin/Card";
import Link from "next/link";

import "@/styles/admin/category-view.css";
import { deleteCategory, getCategoryById } from "@/services/categoryService";

/* ICONS (SVG Premium) */
const IconBack = () => (
  <svg viewBox="0 0 24 24" className="view-icon">
    <path
      d="M15 18l-6-6 6-6"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
    />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 24 24" className="view-icon">
    <path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const IconDelete = () => (
  <svg viewBox="0 0 24 24" className="view-icon">
    <path
      d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M5 7h14l-1 13H6L5 7z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default function ViewCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fetchedCategory = await getCategoryById(id);
        setCategory(fetchedCategory);
      } catch {
        setCategory(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
      <div className="cv-wrap fade-in">
        <Card className="cv-card">
          <p>Đang tải...</p>
        </Card>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="cv-wrap fade-in">
        <Card className="cv-card">
          <p>Không tìm thấy dữ liệu.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="cv-wrap fade-in">
      {/* HEADER */}
      <div className="cv-header">
        {/* Trái */}
        <Link href="/admin/categories/list" className="cv-btn-back">
          <IconBack /> Quay lại
        </Link>

        {/* Phải */}
        <div className="cv-actions-right">
          <button
            className="cv-btn-edit"
            onClick={() => router.push(`/admin/categories/${id}/edit`)}
          >
            <IconEdit /> Sửa
          </button>

          <button
            className="cv-btn-delete"
            onClick={() => setShowDeletePopup(true)}
          >
            <IconDelete /> Xoá
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <Card className="cv-card">
        <h2 className="cv-title">Thông tin Category</h2>

          <div className="cv-table">

              {/* ID */}
              <div className="cv-row">
                  <span className="cv-label">ID</span>
                  <span className="cv-value">{category.id}</span>
              </div>

              {/* Name */}
              <div className="cv-row">
                  <span className="cv-label">Tên Category</span>
                  <span className="cv-value">{category.name}</span>
              </div>

              {/* Slug */}
              <div className="cv-row">
                  <span className="cv-label">Slug</span>
                  <span className="cv-value cv-badge">{category.slug}</span>
              </div>

              {/* Posts Count */}
              <div className="cv-row">
                  <span className="cv-label">Số bài viết</span>
                  <span className="cv-value cv-badge-blue">{category.postsCount}</span>
              </div>

              {/* Link xem bài viết trong category */}
              <div className="cv-row">
                  <span className="cv-label">Danh sách bài viết</span>
                  <Link
                      href={`/admin/articles?category=${category.id}`}
                      className="cv-link"
                  >
                      👉 Xem bài viết trong mục này
                  </Link>
              </div>

              {/* Created */}
              <div className="cv-row">
                  <span className="cv-label">Ngày tạo</span>
                  <span className="cv-value">
      {category.createdAt
          ? new Date(category.createdAt).toLocaleString()
          : "--"}
    </span>
              </div>

              {/* Updated */}
              <div className="cv-row">
                  <span className="cv-label">Cập nhật cuối</span>
                  <span className="cv-value">
      {category.updatedAt
          ? new Date(category.updatedAt).toLocaleString()
          : "--"}
    </span>
              </div>
          </div>


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
