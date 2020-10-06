package com.spyduck.websocket.model.shared;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SessionResponseStatus {
    OK("OK"), ERROR("ERROR");

    private final String status;

    SessionResponseStatus(String status) {
        this.status = status;
    }

    @JsonValue
    public String getStatus() {
        return status;
    }
}
