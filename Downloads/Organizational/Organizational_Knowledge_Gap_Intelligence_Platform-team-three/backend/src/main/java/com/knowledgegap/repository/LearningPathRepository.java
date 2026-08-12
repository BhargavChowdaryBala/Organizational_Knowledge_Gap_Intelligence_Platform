package com.knowledgegap.repository;


import com.knowledgegap.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface LearningPathRepository 
        extends JpaRepository<LearningPath,Integer> {


    List<LearningPath> findBySkillNameOrderByStepNumber(String skillName);

}