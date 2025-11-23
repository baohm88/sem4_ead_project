"use client";

import { useEffect, useRef } from "react";

export default function CkEditor({ value, onChange }) {
    const editorRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function loadEditor() {
            if (typeof window === "undefined" || !editorRef.current) return;

            // Load CDN CKEditor
            if (!window.ClassicEditor) {
                await new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src =
                        "https://cdn.ckeditor.com/ckeditor5/41.0.0/classic/ckeditor.js";
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }

            if (!isMounted || instanceRef.current) return;

            window.ClassicEditor.create(editorRef.current, {
                toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "undo",
                    "redo",
                ],
            }).then((editor) => {
                instanceRef.current = editor;

                editor.setData(value || "");

                editor.model.document.on("change:data", () => {
                    onChange(editor.getData());
                });
            });
        }

        loadEditor();

        return () => {
            isMounted = false;

            if (instanceRef.current) {
                instanceRef.current.destroy().catch(() => {});
                instanceRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={editorRef}
            style={{
                background: "white",
                borderRadius: 8,
                padding: 4,
                border: "1px solid #e5e7eb",
                minHeight: 200,
            }}
        />
    );
}
