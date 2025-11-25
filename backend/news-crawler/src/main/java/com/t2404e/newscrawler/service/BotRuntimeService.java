package com.t2404e.newscrawler.service;

import com.t2404e.newscrawler.dto.BotStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BotRuntimeService {

    private final Map<String, BotStatus> statusMap = new ConcurrentHashMap<>();

    public BotRuntimeService() {
        initBot("bot1", "BOT1 - Crawl Links (Source → Article NEW)");
        initBot("bot2", "BOT2 - Crawl Article Content");
        initBot("bot3", "BOT3 - Reset ERROR → NEW");
    }

    private void initBot(String code, String name) {
        statusMap.put(code.toLowerCase(), BotStatus.builder()
                .code(code.toUpperCase())
                .name(name)
                .running(false)
                .lastMessage("Chưa chạy lần nào")
                .lastRunAt(null)
                .lastDurationMs(null)
                .lastAffected(null)
                .lastError(null)
                .build());
    }

    public BotStatus start(String code, String message) {
        String key = code.toLowerCase();
        long now = System.currentTimeMillis();

        BotStatus current = statusMap.get(key);
        if (current == null) {
            initBot(code, code);
            current = statusMap.get(key);
        }

        BotStatus updated = BotStatus.builder()
                .code(current.getCode())
                .name(current.getName())
                .running(true)
                .lastMessage(message)
                .lastRunAt(now)              // tạm dùng làm startTime
                .lastDurationMs(null)
                .lastAffected(null)
                .lastError(null)
                .build();

        statusMap.put(key, updated);
        return updated;
    }

    public BotStatus success(String code, String message, int affected, long startTime) {
        String key = code.toLowerCase();
        long end = System.currentTimeMillis();

        BotStatus current = statusMap.get(key);
        if (current == null) {
            initBot(code, code);
            current = statusMap.get(key);
        }

        BotStatus updated = BotStatus.builder()
                .code(current.getCode())
                .name(current.getName())
                .running(false)
                .lastMessage(message)
                .lastRunAt(end)
                .lastDurationMs(end - startTime)
                .lastAffected(affected)
                .lastError(null)
                .build();

        statusMap.put(key, updated);
        return updated;
    }

    public BotStatus error(String code, String message, Throwable e, long startTime) {
        String key = code.toLowerCase();
        long end = System.currentTimeMillis();

        BotStatus current = statusMap.get(key);
        if (current == null) {
            initBot(code, code);
            current = statusMap.get(key);
        }

        BotStatus updated = BotStatus.builder()
                .code(current.getCode())
                .name(current.getName())
                .running(false)
                .lastMessage(message)
                .lastRunAt(end)
                .lastDurationMs(end - startTime)
                .lastAffected(null)
                .lastError(e != null ? e.getMessage() : null)
                .build();

        statusMap.put(key, updated);
        return updated;
    }

    public List<BotStatus> getAll() {
        return new ArrayList<>(statusMap.values());
    }

    public BotStatus getOne(String code) {
        return statusMap.get(code.toLowerCase());
    }
}