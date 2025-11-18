"use client";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onClose, 300);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white ${
            type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
            {message}
        </div>
    );
}
