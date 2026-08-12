package com.knowledgegap.repository;

import com.knowledgegap.entity.TrainingCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface TrainingCourseRepository 
        extends JpaRepository<TrainingCourse,Integer> {


    Optional<TrainingCourse> findFirstBySkillName(String skillName);


    List<TrainingCourse> findBySkillName(String skillName);


    // Add this
    List<TrainingCourse> findBySkillNameIgnoreCase(String skillName);

}
