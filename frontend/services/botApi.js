import { api } from "./api";

// GET list status các BOT
export const fetchBotStatuses = () => api.get("/bots");

// Chạy BOT theo code: "bot1" | "bot2" | "bot3"
export const runBot = (botCode) => api.post(`/bots/${botCode}/run`);