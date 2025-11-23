import BotCard from "./components/BotCard";
import LogModal from "./components/LogModal";
import { useState } from "react";

export default function BotPage() {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🤖 Quản lý Bots</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <BotCard
          title="BOT1: Crawl Links"
          desc="Lấy danh sách URLs từ các trang báo nguồn"
          startApi="http://localhost:8080/api/v1/crawler/links"
        />

        <BotCard
          title="BOT2: Crawl Articles"
          desc="Crawl toàn bộ nội dung bài viết chi tiết"
          startApi="http://localhost:8080/api/v1/crawler/articles"
        />
      </div>

      <button
        onClick={() => setShowLogs(true)}
        className="px-4 py-2 bg-gray-700 text-white rounded"
      >
        📜 Xem Logs
      </button>

      <LogModal open={showLogs} onClose={() => setShowLogs(false)} />
    </div>
  );
}
