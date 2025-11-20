export default function Input({ label, className="", ...props }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                {...props}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${className}`}
            />
        </div>
    );
}
