package com.spyduck.model;

import lombok.Data;

@Data
public class ConsumerConfiguration {
    private String broker;

    private String topic;
}
