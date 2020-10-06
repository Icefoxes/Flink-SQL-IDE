package com.spyduck.websocket.context;

import com.spyduck.websocket.core.StreamContext;

public interface ContextHolder {

    StreamContext getStreamContextByUserId(String userId);

    void AddStreamContext(String userId);

    void AddStreamContext(String userId, Boolean forceRestart);

    void RestartStreamContext(String userId);

    void CloseStreamContext(String userId);

    Boolean ContainsStreamContext(String userId);
}
