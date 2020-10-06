package com.spyduck.controller;

import com.spyduck.service.KafkaClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RequestMapping("api/v1/consumers")
@RestController
public class ConsumerController {
    @Autowired
    private KafkaClientService clientService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getBrokers(@RequestParam Map<String, String> connection) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(this.clientService.listConsumerGroups(connection));
    }
}
