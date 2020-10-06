package com.spyduck.websocket.model.shared;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Notification {
    private String level;

    private String message;
}
