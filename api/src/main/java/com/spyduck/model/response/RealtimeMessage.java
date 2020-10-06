package com.spyduck.model.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RealtimeMessage {
    private String topic;

    private String key;

    private String value;

    private long offset;

    private int partition;

    private long timestamp;
}
