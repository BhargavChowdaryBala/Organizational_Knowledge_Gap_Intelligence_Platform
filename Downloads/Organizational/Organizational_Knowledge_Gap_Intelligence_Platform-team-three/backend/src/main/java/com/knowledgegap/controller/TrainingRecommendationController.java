package com.knowledgegap.controller;

import com.knowledgegap.dto.TrainingRecommendationResponse;
import com.knowledgegap.service.TrainingRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-recommendations")
@CrossOrigin(origins = "*")
public class TrainingRecommendationController {

    @Autowired
    private TrainingRecommendationService trainingRecommendationService;

    @GetMapping("/{userId}")
    public List<TrainingRecommendationResponse> getRecommendations(
            @PathVariable Integer userId) {

        return trainingRecommendationService.getRecommendations(userId);
    }
}