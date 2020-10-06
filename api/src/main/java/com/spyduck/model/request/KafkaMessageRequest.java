package com.spyduck.model.request;

import lombok.Data;

@Data
public class KafkaMessageRequest {
    private String messageId;

    private String broker;

    private String key;

    private String value;

    private String topic;
}
