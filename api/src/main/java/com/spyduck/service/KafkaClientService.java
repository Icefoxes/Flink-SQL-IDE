package com.spyduck.service;


import com.spyduck.model.request.KafkaMessageRequest;
import com.spyduck.model.response.KafkaTopic;
import com.spyduck.model.response.TopicPartitionInfo;
import com.spyduck.util.kafkaParameter;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.ConsumerGroupListing;
import org.apache.kafka.clients.admin.KafkaAdminClient;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.Metric;
import org.apache.kafka.common.MetricName;
import org.apache.kafka.common.PartitionInfo;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@Slf4j
public class KafkaClientService {

    public boolean isConnected(Map<String, String> conn) {
        try {
            KafkaConsumer<String, String> consumer = getKafkaConsumer(conn);
            Map<String, List<PartitionInfo>> topics = consumer.listTopics();
            log.info("connection to {} is ready, {} topics", conn.get(kafkaParameter.BOOTSTRAP), topics.size());
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public List<KafkaTopic> listTopics(Map<String, String> conn) {
        KafkaConsumer<String, String> consumer = getKafkaConsumer(conn);
        Map<String, List<PartitionInfo>> topics = consumer.listTopics();

        List<KafkaTopic> rlt = new ArrayList<>();
        for (Map.Entry<String, List<PartitionInfo>> entry : topics.entrySet()) {
            List<TopicPartitionInfo> partitionInfo = new ArrayList<>();
            entry.getValue().forEach(info -> partitionInfo.add(new TopicPartitionInfo(info.topic(), info.partition())));
            rlt.add(KafkaTopic.builder()
                    .topic(entry.getKey())
                    .partitions(partitionInfo)
                    .build());
        }
        return rlt;
    }

    public List<KafkaConsumerResponse> getConsumers(Map<String, String> conn) throws ExecutionException, InterruptedException {
        AdminClient client = getAdminClient(conn);
        List<KafkaConsumerResponse> responses = new ArrayList<>();
        Collection<ConsumerGroupListing> rlt = client.listConsumerGroups().all().get();
        for (ConsumerGroupListing consumerGroup : rlt) {
            responses.add(KafkaConsumerResponse.builder()
                    .groupId(consumerGroup.groupId())
                    .isSimpleConsumerGroup(consumerGroup.isSimpleConsumerGroup())
                    .state(consumerGroup.state())
                    .build());
        }
        return responses;
    }

    public Map<MetricName, ? extends Metric> getMetric(Map<String, String> conn) {

        return this.getAdminClient(conn).metrics();
    }

    public List<String> listConsumerGroups(Map<String, String> conn) throws ExecutionException, InterruptedException {
        return this.getAdminClient(conn).listConsumerGroups().all().get()
                .stream()
                .map(ConsumerGroupListing::groupId)
                .collect(Collectors.toList());
    }

    public void ProduceMessage(KafkaMessageRequest request) {
        Map<String, String> properties = new HashMap<>();
        properties.put(kafkaParameter.BOOTSTRAP, request.getBroker());
        this.getProducer(properties).send(new ProducerRecord<>(request.getTopic(), request.getKey(), request.getValue()));
    }

    private AdminClient getAdminClient(Map<String, String> conn) {
        Properties properties = new Properties();
        properties.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, conn.get(kafkaParameter.BOOTSTRAP));
        AdminClient client = KafkaAdminClient.create(properties);
        log.info("admin client was created");
        return client;
    }

    private KafkaProducer<String, String> getProducer(Map<String, String> conn) {
        String topic = conn.get(kafkaParameter.TOPIC);
        String key = conn.get(kafkaParameter.KEY);
        String value = conn.get(kafkaParameter.VALUE);
        Properties properties = new Properties();
        properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, conn.get(kafkaParameter.BOOTSTRAP));
        properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.setProperty(ProducerConfig.ACKS_CONFIG, "all");
        properties.setProperty(ProducerConfig.RETRIES_CONFIG, "1");
        KafkaProducer<String, String> producer = new KafkaProducer<>(properties);
        return producer;
    }

    public KafkaConsumer<String, String> getKafkaConsumer(Map<String, String> conn) {
        Properties properties = new Properties();
        properties.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, conn.get(kafkaParameter.BOOTSTRAP));
        properties.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.setProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        properties.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        // Timeout is 5s
        properties.setProperty(ConsumerConfig.REQUEST_TIMEOUT_MS_CONFIG, "5000");
        properties.setProperty(ConsumerConfig.GROUP_ID_CONFIG, UUID.randomUUID().toString());
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(properties);
        return consumer;
    }
}
