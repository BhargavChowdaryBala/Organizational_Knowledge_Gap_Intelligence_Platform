package com.knowledgegap.service;


import com.knowledgegap.dto.LearningPathResponse;
import com.knowledgegap.entity.LearningPath;

import java.util.List;


public interface LearningPathService {


    List<LearningPathResponse> getLearningPath(Integer userId);



    LearningPath createLearningPath(
            LearningPath learningPath);



    List<LearningPath> getAllLearningPaths();



    LearningPath getLearningPathById(Integer id);



    LearningPath updateLearningPath(
            Integer id,
            LearningPath learningPath);



    void deleteLearningPath(Integer id);

}