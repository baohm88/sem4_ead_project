"use client";

import { Dialog, DialogPanel } from "@headlessui/react";

export default function Modal({ open, title, children }) {
    return (
        <Dialog open={open} onClose={() => {}} className="relative z-50">
            <div className="fixed inset-0 bg-black/40" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
