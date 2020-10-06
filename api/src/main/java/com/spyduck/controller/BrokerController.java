package com.spyduck.controller;

import com.spyduck.service.KafkaClientService;
import io.micrometer.core.annotation.Timed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RequestMapping("api/v1/brokers")
@RestController
public class BrokerController {
    @Autowired
    private KafkaClientService clientService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> testBroker(@RequestParam Map<String, String> connection) throws IOException {
        if (this.clientService.isConnected(connection)) {
            return ResponseEntity.ok("");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}