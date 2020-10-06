package com.spyduck.controller;

import com.spyduck.model.request.KafkaMessageRequest;
import com.spyduck.service.KafkaClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/messages")
@RestController
public class MessageController {
    @Autowired
    private KafkaClientService clientService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> produceMessage(@RequestBody KafkaMessageRequest request) {
        this.clientService.ProduceMessage(request);
        return ResponseEntity.ok("");
    }
}