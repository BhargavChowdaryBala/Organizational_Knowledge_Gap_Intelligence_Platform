package com.knowledgegap.service;

import com.knowledgegap.dto.AIRecommendationResponse;

import java.util.List;

public interface GeminiService {

    List<AIRecommendationResponse> generateRecommendations(Integer userId);

}