package com.knowledgegap.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.knowledgegap.dto.AIRecommendationResponse;
import com.knowledgegap.entity.Employee;
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

        // Replace this with data from your repositories
        Employee employee = new Employee();
        employee.setEmployeeId(userId);
        employee.setEmployeeName("John");

        String prompt = """
                Employee Name : %s

                Skills:
                Java - Intermediate
                Spring Boot - Beginner
                React - Intermediate

                Assessment Score:
                Java - 65%%

                Learning Progress:
                Spring Boot Course - 30%%

                Recommend:
                1. Skill Gap
                2. Learning Path
                3. Recommended Course
                4. Priority
                5. Estimated Duration
                """.formatted(employee.getEmployeeName());

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

        HttpEntity<String> entity =
                new HttpEntity<>(body, headers);

        String response = restTemplate.postForObject(
                apiUrl + "?key=" + apiKey,
                entity,
                String.class
        );

        String recommendation = "";

        try {

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

        } catch (Exception e) {

            recommendation = "Unable to generate recommendation.";

        }

        AIRecommendationResponse dto =
                new AIRecommendationResponse();

        dto.setUserId(employee.getEmployeeId());
        dto.setEmployeeName(employee.getEmployeeName());
        dto.setSkillName("Multiple Skills");
        dto.setGap(35);
        dto.setRecommendation(recommendation);

        return Collections.singletonList(dto);

    }

}