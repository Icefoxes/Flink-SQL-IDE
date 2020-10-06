package com.spyduck.websocket.scheduler;

import com.spyduck.websocket.context.ContextHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ScheduledTasks {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ContextHolder contextHolder;

    @Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {

    }
}