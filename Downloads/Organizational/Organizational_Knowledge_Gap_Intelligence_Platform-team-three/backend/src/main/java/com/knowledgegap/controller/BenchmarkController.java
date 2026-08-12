package com.knowledgegap.controller;

import com.knowledgegap.dto.BenchmarkResponse;
import com.knowledgegap.service.BenchmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/benchmark")
@CrossOrigin(origins = "*")
public class BenchmarkController {

    @Autowired
    private BenchmarkService benchmarkService;

    @GetMapping("/{userId}")
    public BenchmarkResponse getBenchmark(@PathVariable Integer userId) {

        return benchmarkService.getBenchmark(userId);

    }
}