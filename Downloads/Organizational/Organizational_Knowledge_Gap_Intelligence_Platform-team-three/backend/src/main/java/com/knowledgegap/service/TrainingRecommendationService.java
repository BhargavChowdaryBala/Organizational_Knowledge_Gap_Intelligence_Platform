package com.knowledgegap.service;

import com.knowledgegap.dto.TrainingRecommendationResponse;

import java.util.List;

public interface TrainingRecommendationService {

    List<TrainingRecommendationResponse> getRecommendations(Integer userId);

}