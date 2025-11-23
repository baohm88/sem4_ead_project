"use client";

export default function PopupConfirm({ open, onClose, onConfirm, title, message }) {
    if (!open) return null;

    return (
        <div className="neo-popup-overlay">
            <div className="neo-popup">

                {/* ICON */}
                <div className="neo-popup-icon">
                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                        <path strokeWidth="2"
                              d="M12 9v4m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"/>
                    </svg>
                </div>

                <h3>{title}</h3>
                <p dangerouslySetInnerHTML={{ __html: message }} />

                <div className="neo-popup-actions">
                    <button className="neo-cancel" onClick={onClose}>Hủy</button>
                    <button className="neo-delete" onClick={onConfirm}>Xóa</button>
                </div>
            </div>
        </div>
    );
}
