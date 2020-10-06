package com.spyduck.controller;

import com.spyduck.service.KafkaClientService;
import io.swagger.models.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RequestMapping("api/v1/topics")
@RestController
public class TopicController {
    @Autowired
    private KafkaClientService clientService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getBrokers(@RequestParam Map<String, String> connection, Model model) throws IOException {
        return ResponseEntity.ok(this.clientService.listTopics(connection));
    }
}
