package com.knowledgegap.service.impl;


import com.knowledgegap.dto.GapAnalysisResponse;
import com.knowledgegap.dto.LearningPathResponse;
import com.knowledgegap.entity.LearningPath;
import com.knowledgegap.entity.TrainingCourse;

import com.knowledgegap.repository.LearningPathRepository;
import com.knowledgegap.repository.TrainingCourseRepository;

import com.knowledgegap.service.GapAnalysisService;
import com.knowledgegap.service.LearningPathService;


import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;



@Service
public class LearningPathServiceImpl 
        implements LearningPathService {



private final LearningPathRepository learningPathRepository;

private final GapAnalysisService gapAnalysisService;

private final TrainingCourseRepository trainingCourseRepository;



public LearningPathServiceImpl(
        LearningPathRepository learningPathRepository,
        GapAnalysisService gapAnalysisService,
        TrainingCourseRepository trainingCourseRepository
){

this.learningPathRepository = learningPathRepository;

this.gapAnalysisService = gapAnalysisService;

this.trainingCourseRepository = trainingCourseRepository;

}




@Override
public List<LearningPathResponse> getLearningPath(Integer userId){



List<GapAnalysisResponse> gaps =
        gapAnalysisService.analyzeEmployee(userId);



List<LearningPathResponse> responseList =
        new ArrayList<>();


int step=1;



for(GapAnalysisResponse gap:gaps){



if(gap.getGap()<=0)
    continue;



LearningPathResponse response =
        new LearningPathResponse();



response.setStep(step++);


response.setSkillName(
        gap.getSkillName()
);



TrainingCourse course =
trainingCourseRepository
.findFirstBySkillName(
        gap.getSkillName()
)
.orElse(null);



if(course!=null){


response.setCourseName(
        course.getCourseName()
);


response.setProvider(
        course.getProvider()
);


response.setDuration(
        course.getDuration()
);


}

else{


response.setCourseName(
        "No Course Available"
);


response.setProvider("-");


response.setDuration("-");


}



responseList.add(response);


}


return responseList;


}





@Override
public LearningPath createLearningPath(
        LearningPath learningPath){


return learningPathRepository.save(learningPath);

}




@Override
public List<LearningPath> getAllLearningPaths(){


return learningPathRepository.findAll();

}




@Override
public LearningPath getLearningPathById(Integer id){


return learningPathRepository.findById(id)

.orElseThrow(
()->new RuntimeException(
"Learning Path not found"
));

}





@Override
public LearningPath updateLearningPath(
Integer id,
LearningPath learningPath){


LearningPath existing =
        getLearningPathById(id);



existing.setSkillName(
        learningPath.getSkillName()
);


existing.setStepNumber(
        learningPath.getStepNumber()
);


existing.setTitle(
        learningPath.getTitle()
);


existing.setDescription(
        learningPath.getDescription()
);



return learningPathRepository.save(existing);


}




@Override
public void deleteLearningPath(Integer id){


learningPathRepository.deleteById(id);


}


}