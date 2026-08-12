package com.knowledgegap.service.impl;


import com.knowledgegap.dto.*;
import com.knowledgegap.entity.TrainingCourse;
import com.knowledgegap.repository.TrainingCourseRepository;
import com.knowledgegap.service.*;


import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;



@Service
public class RecommendationServiceImpl
implements RecommendationService {



private final GapAnalysisService gapAnalysisService;


private final TrainingCourseRepository trainingCourseRepository;



public RecommendationServiceImpl(
GapAnalysisService gapAnalysisService,
TrainingCourseRepository trainingCourseRepository
){

this.gapAnalysisService=gapAnalysisService;

this.trainingCourseRepository=trainingCourseRepository;

}




@Override
public List<CourseRecommendationResponse>
recommendCourses(Integer userId){



List<GapAnalysisResponse> gaps =
gapAnalysisService.analyzeEmployee(userId);



List<CourseRecommendationResponse> result =
new ArrayList<>();



for(GapAnalysisResponse gap:gaps){



if(gap.getGap()<=0)
continue;



List<TrainingCourse> courses =
trainingCourseRepository
.findBySkillName(
gap.getSkillName()
);



for(TrainingCourse course:courses){


CourseRecommendationResponse response =
new CourseRecommendationResponse();



response.setSkillName(
course.getSkillName()
);


response.setCourseName(
course.getCourseName()
);


response.setProvider(
course.getProvider()
);


response.setDuration(
course.getDuration()
);


response.setLevel(
course.getLevel()
);



result.add(response);


}


}



return result;


}


}