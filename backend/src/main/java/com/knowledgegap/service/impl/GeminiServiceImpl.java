package com.knowledgegap.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.knowledgegap.dto.AIRecommendationResponse;
import com.knowledgegap.service.GeminiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public GeminiServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public List<AIRecommendationResponse> generateRecommendations(Integer userId) {

        String employeeName = "User " + userId;

        String prompt = """
                Employee Name : %s

                Skills:
                Java - Intermediate
                Spring Boot - Beginner
                React - Intermediate

                Assessment Score:
                Java - 65%

                Learning Progress:
                Spring Boot Course - 30%

                Recommend:
                1. Skill Gap
                2. Learning Path
                3. Recommended Course
                4. Priority
                5. Estimated Duration
                """.formatted(employeeName);

        String body = """
        {
          "contents": [
            {
              "parts": [
                {
                  "text": "%s"
                }
              ]
            }
          ]
        }
        """.formatted(prompt.replace("\"", "\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(
                    apiUrl + "?key=" + apiKey,
                    entity,
                    String.class
            );

            String recommendation = "";
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            recommendation = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            AIRecommendationResponse aiRes = new AIRecommendationResponse();
            aiRes.setUserId(userId);
            aiRes.setEmployeeName(employeeName);
            aiRes.setSkillName("Spring Boot & Java");
            aiRes.setRecommendation(recommendation);
            aiRes.setGap(2);
            return List.of(aiRes);
        } catch (Exception e) {
            AIRecommendationResponse fallback = new AIRecommendationResponse();
            fallback.setUserId(userId);
            fallback.setEmployeeName(employeeName);
            fallback.setSkillName("Spring Boot & Java Architecture");
            fallback.setRecommendation("Recommend completing advanced Microservices and Cloud Native deployment module.");
            fallback.setGap(2);
            return List.of(fallback);
        }
    }
}