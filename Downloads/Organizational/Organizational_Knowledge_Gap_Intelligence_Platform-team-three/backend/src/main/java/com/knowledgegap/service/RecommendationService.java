package com.knowledgegap.service;


import com.knowledgegap.dto.CourseRecommendationResponse;

import java.util.List;


public interface RecommendationService {


List<CourseRecommendationResponse>
recommendCourses(Integer userId);


}