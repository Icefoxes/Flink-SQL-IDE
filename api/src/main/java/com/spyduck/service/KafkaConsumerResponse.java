package com.spyduck.service;

import lombok.Builder;
import lombok.Data;
import org.apache.kafka.common.ConsumerGroupState;

import java.util.Optional;

@Data
@Builder
public class KafkaConsumerResponse {
    private final String groupId;
    private final boolean isSimpleConsumerGroup;
    private final Optional<ConsumerGroupState> state;
}
