"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({ text, full }) {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const ref = useRef(null);

    const show = () => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();

        setPos({
            top: rect.bottom + window.scrollY + 6,
            left: rect.left + window.scrollX,
        });

        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    return (
        <>
            <span
                ref={ref}
                className="tooltip-short"
                onMouseEnter={show}
                onMouseLeave={hide}
            >
                {text}
            </span>

            {visible &&
                createPortal(
                    <div className="tooltip-panel" style={{ top: pos.top, left: pos.left }}>
                        {full}
                    </div>,
                    document.body
                )}
        </>
    );
}
