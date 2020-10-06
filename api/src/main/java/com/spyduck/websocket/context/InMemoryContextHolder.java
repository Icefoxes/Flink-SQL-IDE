package com.spyduck.websocket.context;

import com.spyduck.websocket.core.StreamContext;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryContextHolder implements ContextHolder {
    protected final ConcurrentHashMap<String, StreamContext> context = new ConcurrentHashMap<>();

    public StreamContext getStreamContextByUserId(String userId) {
        if (!context.containsKey(userId)) {
            this.context.put(userId, StreamContext.of());
        }
        return context.get(userId);
    }

    public void AddStreamContext(String userId) {
        this.AddStreamContext(userId, false);
    }

    public void AddStreamContext(String userId, Boolean forceRestart) {
        if (!context.containsKey(userId) || forceRestart) {
            this.context.put(userId, StreamContext.of());
        }
    }

    public void RestartStreamContext(String userId) {
        this.context.put(userId, StreamContext.of());
    }

    public void CloseStreamContext(String userId) {
        if (this.ContainsStreamContext(userId)) {
            this.context.remove(userId);
        }
    }

    @Override
    public Boolean ContainsStreamContext(String userId) {
        return this.context.containsKey(userId);
    }
}
