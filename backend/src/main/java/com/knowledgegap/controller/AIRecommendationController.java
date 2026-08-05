package com.knowledgegap.controller;

import com.knowledgegap.dto.AIRecommendationResponse;
import com.knowledgegap.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIRecommendationController {

    private final GeminiService geminiService;

    public AIRecommendationController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/recommendation/{userId}")
    public List<AIRecommendationResponse> getRecommendations(@PathVariable Integer userId) {
        return geminiService.generateRecommendations(userId);
    }
}