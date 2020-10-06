package com.spyduck.websocket.service;

import com.spyduck.websocket.context.ContextHolder;
import com.spyduck.websocket.core.StreamContext;
import com.spyduck.websocket.core.StringConsumer;
import com.spyduck.websocket.model.response.SessionResponse;
import com.spyduck.websocket.scheduler.StreamingTask;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.flink.types.Row;
import org.apache.flink.util.CloseableIterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class SessionService {
    private final ExecutorService executorService =
            new ThreadPoolExecutor(4, 10, 0L, TimeUnit.MILLISECONDS,
                    new LinkedBlockingQueue<>());
    @Autowired
    private ContextHolder contextHolder;

    @Autowired
    private ChannelService channelService;

    public void RestartSession(String userId) {
        if (!this.contextHolder.ContainsStreamContext(userId)) {
            this.contextHolder.AddStreamContext(userId);
            return;
        }
        this.contextHolder.RestartStreamContext(userId);
    }

    public void Close(String userId) {
        if (this.contextHolder.ContainsStreamContext(userId)) {
            this.contextHolder.CloseStreamContext(userId);
        }
        this.channelService.SendNotificationInfo(userId, "Succeed");
        this.SyncCatalog(userId);
    }

    /**
     * sync up catalog with remote session
     *
     * @param userId string
     */
    public void SyncCatalog(String userId) {
        StreamContext context = this.contextHolder.getStreamContextByUserId(userId);
        try {
            this.channelService.SendCatalog(userId, context.getCatalog());
        } catch (Exception e) {
            this.channelService.SendNotificationError(userId, e.getMessage());
            log.error(e.getMessage());
        }
    }

    public void ExecuteCommand(String userId, String command) {
        this.ExecuteCommand(userId,
                command,
                message -> channelService.SendNotificationInfo(userId, message),
                message -> channelService.SendConsole(userId, message));
    }

    public void ExecuteCommand(String userId, String command, StringConsumer results) {
        this.ExecuteCommand(userId,
                command,
                message -> channelService.SendNotificationInfo(userId, message),
                results);
    }

    public void ExecuteCommand(String userId,
                               String command,
                               StringConsumer notification,
                               StringConsumer results) {
        if (StringUtils.isEmpty(command)) {
            this.channelService.SendNotificationError(userId, "Command Is Empty");
            return;
        }
        StreamContext context = this.contextHolder.getStreamContextByUserId(userId);

        try {
            log.info("executing [{}] for user:{}", command, userId);
            this.channelService.SendNotificationInfo(userId, "Start Executing");
            CloseableIterator<Row> rows = context.ExecuteCommand(command);
            StreamingTask task = new StreamingTask(rows,
                    notification,
                    results,
                    userId);
            this.executorService.execute(task);
        } catch (Exception e) {
            this.channelService.SendConsole(userId, SessionResponse.badRequest(e.toString() + ":" + e.getMessage()));
            log.error(e.getMessage());
        }
    }

    @PreDestroy
    public void Shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(800, TimeUnit.MILLISECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
    }

    public void ExplainQuery(String message, String userId) {
        if (StringUtils.isEmpty(message)) {
            this.channelService.SendNotificationError(userId, "Command Is Empty");
            return;
        }
        if (message.toUpperCase().startsWith("SELECT") || message.toUpperCase().startsWith("INSERT")) {
            this.ExecuteCommand(userId,
                    "EXPLAIN PLAN FOR " + message,
                    msg -> channelService.SendConsole(userId, msg));
        }
        else {
            this.channelService.SendNotificationError(userId, "Cannot Explain");
        }
    }
}
