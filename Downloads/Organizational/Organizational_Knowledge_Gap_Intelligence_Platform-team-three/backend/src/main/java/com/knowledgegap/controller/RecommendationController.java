package com.knowledgegap.controller;


import com.knowledgegap.dto.CourseRecommendationResponse;
import com.knowledgegap.service.RecommendationService;


import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin("*")
public class RecommendationController {



private final RecommendationService recommendationService;



public RecommendationController(
RecommendationService recommendationService
){

this.recommendationService=
recommendationService;

}




@GetMapping("/{userId}")
public List<CourseRecommendationResponse>
getRecommendations(
@PathVariable Integer userId
){


return recommendationService
.recommendCourses(userId);


}


}