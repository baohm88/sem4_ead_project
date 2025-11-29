import { api } from "./api";

// GET list status các BOT
export const fetchBotStatuses = () => api.get("/bots");

// RUN BOT
export const runBot = (botCode) => {
    const config = botCode === "bot2" ? { timeout: 0 } : {}; // timeout vô hạn BOT2
    return api.post(`/bots/${botCode}/run`, {}, config);
};