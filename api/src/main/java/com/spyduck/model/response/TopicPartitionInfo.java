package com.spyduck.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopicPartitionInfo {
    private String topic;

    private int partition;
}
