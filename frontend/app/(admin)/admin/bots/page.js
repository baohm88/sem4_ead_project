"use client";

import { useEffect, useState, useRef } from "react";
import { fetchBotStatuses, runBot } from "@/services/botApi";

const BOT_DEFS = [
  { code: "bot1", label: "BOT1 - Crawl Links" },
  { code: "bot2", label: "BOT2 - Crawl Articles" },
  { code: "bot3", label: "BOT3 - Reset ERROR → NEW" },
];

export default function BotControlPage() {
  const [statuses, setStatuses] = useState([]);
  const [loadingBot, setLoadingBot] = useState(null); // bot đang chạy từ UI
  const [logs, setLogs] = useState([]);
  const terminalRef = useRef(null);

  // Auto scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const pushLog = (line) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${line}`,
    ]);
  };

  const loadStatuses = async () => {
    try {
      const res = await fetchBotStatuses();
      setStatuses(res?.data || []);
    } catch (err) {
      console.error(err);
      pushLog("⚠ Lỗi load BOT status từ server.");
    }
  };

  useEffect(() => {
    loadStatuses();
  }, []);

    const handleRunBot = async (botCode) => {
        setLoadingBot(botCode);
        pushLog(`>>> Gọi ${botCode.toUpperCase()}...`);

        try {
            const res = await runBot(botCode);
            console.log("RUN BOT: ", res);

            const { success, message, data } = res;

            if (success) {
                pushLog(`✅ ${message}`);
                if (data?.lastAffected != null) {
                    pushLog(
                        `   → Affected: ${data.lastAffected}, time: ${
                            data.lastDurationMs ?? "N/A"
                        } ms`
                    );
                }
            } else {
                pushLog(`❌ ${message || `${botCode.toUpperCase()} chạy lỗi`}`);
            }

            await loadStatuses();
        } catch (err) {
            console.error(err);
            pushLog(`❌ Call ${botCode.toUpperCase()} lỗi: ${err}`);
        } finally {
            setLoadingBot(null);
        }
    };

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bots Control Panel</h1>
          <p className="text-sm text-gray-500">
            Điều khiển BOT1/BOT2/BOT3. Nút ở trên, log/terminal ở bên dưới.
          </p>
        </div>
        <button
          onClick={loadStatuses}
          className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          Refresh Status
        </button>
      </div>

      {/* TOP: BUTTONS + STATUS TABLE */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Cột: Buttons */}
        <div className="space-y-3">
          {BOT_DEFS.map((bot) => (
            <button
              key={bot.code}
              onClick={() => handleRunBot(bot.code)}
              disabled={loadingBot === bot.code}
              className={`w-full px-4 py-2 rounded text-white font-semibold flex items-center justify-center gap-2 ${
                bot.code === "bot1"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : bot.code === "bot2"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-purple-600 hover:bg-purple-700"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loadingBot === bot.code && (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{bot.label}</span>
            </button>
          ))}
        </div>

        {/* Cột: Status table (chiếm 2 cột trên desktop) */}
        <div className="md:col-span-2">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b bg-gray-50 flex justify-between items-center">
              <span className="font-semibold text-sm">Bots Status</span>
              <span className="text-xs text-gray-400">
                In-memory, cập nhật mỗi lần chạy / refresh
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Bot</th>
                    <th className="px-3 py-2 text-left">Last Message</th>
                    <th className="px-3 py-2 text-left">Running</th>
                    <th className="px-3 py-2 text-left">Last Run</th>
                    <th className="px-3 py-2 text-left">Duration</th>
                    <th className="px-3 py-2 text-left">Affected</th>
                  </tr>
                </thead>
                <tbody>
                  {statuses.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-4 text-center text-gray-400"
                      >
                        Chưa có dữ liệu BOT.
                      </td>
                    </tr>
                  )}
                  {statuses.map((s) => (
                    <tr key={s.code} className="border-t">
                      <td className="px-3 py-2 font-semibold">
                        {s.code}{" "}
                        <span className="text-xs text-gray-500">{s.name}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {s.lastMessage}
                      </td>
                      <td className="px-3 py-2">
                        {s.running ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            RUNNING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            IDLE
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {s.lastRunAt
                          ? new Date(s.lastRunAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {s.lastDurationMs != null
                          ? `${s.lastDurationMs} ms`
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {s.lastAffected != null ? s.lastAffected : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Nếu có lỗi gần nhất của BOT nào đó, hiển thị dưới cùng */}
            {statuses.some((s) => s.lastError) && (
              <div className="px-4 py-2 border-t bg-red-50 text-xs text-red-700">
                {statuses
                  .filter((s) => s.lastError)
                  .map((s) => (
                    <div key={s.code}>
                      <span className="font-semibold">{s.code}:</span>{" "}
                      {s.lastError}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM: TERMINAL LOG */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm">Bots Logs (Client-side)</span>
          <button
            onClick={() => setLogs([])}
            className="text-xs px-2 py-1 border rounded border-gray-300 hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
        <div
          ref={terminalRef}
          className="bg-black text-green-400 font-mono text-xs md:text-sm p-3 rounded-lg h-64 overflow-auto shadow-inner"
        >
          {logs.length === 0 ? (
            <div className="text-gray-500">
              # Chưa có log. Bấm nút BOT phía trên để chạy và xem log tại đây.
            </div>
          ) : (
            logs.map((line, idx) => <div key={idx}>{line}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
