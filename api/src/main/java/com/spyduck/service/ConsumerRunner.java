package com.spyduck.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spyduck.model.response.RealtimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import javax.websocket.Session;
import java.io.IOException;
import java.time.Duration;

@Slf4j
public class ConsumerRunner implements Runnable {

    private final KafkaConsumer<String, String> consumer;

    private final Session session;

    private final ObjectMapper mapper = new ObjectMapper();

    public ConsumerRunner(KafkaConsumer<String, String> consumer,
                          Session session) {
        this.consumer = consumer;
        this.session = session;
    }

    @Override
    public void run() {
        while (true) {
            if (!this.session.isOpen()) {
                consumer.close();
                break;
            }
            ConsumerRecords<String, String> consumerRecords = consumer.poll(Duration.ofSeconds(5));
            for (ConsumerRecord<String, String> record : consumerRecords) {
                try {
                    String messageToSend = mapper.writeValueAsString(RealtimeMessage.builder()
                            .topic(record.topic())
                            .partition(record.partition())
                            .offset(record.offset())
                            .timestamp(record.timestamp())
                            .key(record.key())
                            .value(record.value())
                            .build());
                    session.getBasicRemote().sendText(messageToSend);
                } catch (IOException e) {
                    log.error(e.getLocalizedMessage());
                }
            }
        }
    }
}
