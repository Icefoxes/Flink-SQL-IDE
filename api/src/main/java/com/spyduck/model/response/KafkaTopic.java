package com.spyduck.model.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KafkaTopic {
    private String topic;

    private List<TopicPartitionInfo> partitions;
}
