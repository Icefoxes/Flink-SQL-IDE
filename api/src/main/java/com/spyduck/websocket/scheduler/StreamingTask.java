package com.spyduck.websocket.scheduler;

import com.spyduck.websocket.core.StringConsumer;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.types.Row;
import org.apache.flink.util.CloseableIterator;

import java.util.UUID;

@Slf4j
public class StreamingTask implements Runnable {
    private final String id;

    private final CloseableIterator<Row> iterator;

    private final String userId;

    private final Integer recordToFetch;

    private final StringConsumer notification;

    private final StringConsumer results;

    public StreamingTask(CloseableIterator<Row> iterator,

                         StringConsumer notification,
                         StringConsumer results,
                         String userId,
                         Integer recordToFetch) {
        this.results = results;
        this.notification = notification;
        this.iterator = iterator;

        this.userId = userId;
        this.recordToFetch = recordToFetch;
        this.id = UUID.randomUUID().toString().substring(0, 13);

        Thread.currentThread().setName("Streaming Task " + id);
        log.info("{}-{} task is created", this.id, this.userId);
    }

    public StreamingTask(CloseableIterator<Row> iterator,
                         StringConsumer notification,
                         StringConsumer results,
                         String userId) {
        this(iterator, notification, results, userId, 10);
    }


    public void Stop() throws Exception {
        this.iterator.close();
    }

    @SneakyThrows
    @Override
    public void run() {
        log.info("{}-{} is running", this.id, this.userId);
        int idx = 0;
        notification.ConsumerString("Job " + this.id + " Is Running");

        while (iterator.hasNext() && idx < recordToFetch) {
            Row row = iterator.next();
            idx += 1;
            results.ConsumerString(row.toString());
        }
        iterator.close();
        notification.ConsumerString("Job " + this.id + " Finished");
        log.info("{}-{} stopped", this.id, this.userId);
    }
}
