package com.spyduck.websocket.service;

import com.spyduck.websocket.model.ChannelConfig;
import com.spyduck.websocket.model.response.SessionResponse;
import com.spyduck.websocket.model.shared.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

/**
 * this service can be init natively (not Ioc)
 */
@Service
public class ChannelService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public ChannelService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    private void SendNotification(String userId, String level, String message) {
        this.simpMessagingTemplate.convertAndSendToUser(userId,
                ChannelConfig.RESPONSE_NOTIFICATION,
                MessageBuilder
                        .withPayload(Notification.builder().message(message).level(level).build())
                        .setHeader(MessageHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build());
    }

    public void SendNotificationInfo(String userId, String message) {
        this.SendNotification(userId, "INFO", message);
    }

    public void SendNotificationWarning(String userId, String message) {
        this.SendNotification(userId, "WARNING", message);
    }

    public void SendNotificationError(String userId, String message) {
        this.SendNotification(userId, "ERROR", message);
    }

    public void SendConsole(String userId, String message) {
        this.simpMessagingTemplate.convertAndSendToUser(userId,
                ChannelConfig.RESPONSE_CONSOLE,
                MessageBuilder
                        .withPayload(SessionResponse.ok(message))
                        .setHeader(MessageHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build());
    }

    public void SendConsole(String userId, SessionResponse message) {
        this.simpMessagingTemplate.convertAndSendToUser(userId,
                ChannelConfig.RESPONSE_CONSOLE,
                MessageBuilder
                        .withPayload(message)
                        .setHeader(MessageHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build());
    }

    public void SendCatalog(String userId, Object object) {
        this.simpMessagingTemplate.convertAndSendToUser(userId,
                ChannelConfig.RESPONSE_CATALOG,
                MessageBuilder
                        .withPayload(object)
                        .setHeader(MessageHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build());
    }

    public void SendCatalog(String userId, String message) {
        this.simpMessagingTemplate.convertAndSendToUser(userId,
                ChannelConfig.RESPONSE_CATALOG,
                MessageBuilder
                        .withPayload(message)
                        .setHeader(MessageHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build());
    }

    public void SendExplain(String userId, String message) {
        this.simpMessagingTemplate.convertAndSendToUser(userId,
                ChannelConfig.RESPONSE_EXPLAIN,
                MessageBuilder
                        .withPayload(SessionResponse.ok(message))
                        .setHeader(MessageHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build());
    }
}
