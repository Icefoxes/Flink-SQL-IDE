package com.spyduck.websocket.model.response;

import com.spyduck.websocket.model.shared.SessionResponseStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SessionResponse {
    private SessionResponseStatus status;

    private String payload;

    private String error;

    public static SessionResponse ok(String payload) {
        return SessionResponse.builder()
                .status(SessionResponseStatus.OK)
                .error(null)
                .payload(payload)
                .build();
    }


    public static SessionResponse badRequest(String msg) {
        return SessionResponse.builder()
                .status(SessionResponseStatus.ERROR)
                .error(msg)
                .payload(null)
                .build();
    }
}
