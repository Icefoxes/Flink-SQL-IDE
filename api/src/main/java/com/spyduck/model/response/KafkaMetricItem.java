package com.spyduck.model.response;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class KafkaMetricItem {
    private String name;

    private String group;

    private String description;

    private Map<String, String> tags;


}
