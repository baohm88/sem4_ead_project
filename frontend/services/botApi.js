import { api } from "./api";

// GET list status các BOT
export const fetchBotStatuses = () => api.get("/bots");

// Chạy BOT theo code: "bot1" | "bot2" | "bot3"
export const runBot = (botCode) => {
  return api.post(
    `/bots/${botCode}/run`,
    {},
    botCode === "bot2" ? { timeout: 0 } : {}
  );
};
