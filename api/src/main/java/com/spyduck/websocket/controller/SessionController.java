package com.spyduck.websocket.controller;

import com.spyduck.websocket.model.ChannelConfig;
import com.spyduck.websocket.model.request.SessionExecuteRequest;
import com.spyduck.websocket.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class SessionController {
    @Autowired
    private SessionService sessionService;

    @MessageMapping(ChannelConfig.REQUEST_EXECUTE)
    public void ExecuteCommand(SessionExecuteRequest message, Principal principal) {
        sessionService.ExecuteCommand(principal.getName(), message.getCommand());
    }

    @MessageMapping(ChannelConfig.REQUEST_CATALOG)
    public void Catalog(Principal principal) {
        sessionService.SyncCatalog(principal.getName());
    }

    @MessageMapping(ChannelConfig.REQUEST_EXPLAIN)
    public void explain(SessionExecuteRequest message, Principal principal) {
        sessionService.ExplainQuery(message.getCommand(), principal.getName());
    }

    @MessageMapping(ChannelConfig.REQUEST_CLOSE)
    public void close(SessionExecuteRequest message, Principal principal) {
        sessionService.Close(principal.getName());
    }
}
