package com.beehive.dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "BeeHive Backend is running! 🐝 \n";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}