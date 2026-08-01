package com.knowledgegap.repository;

import com.knowledgegap.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {

    List<Assessment> findByCourseName(String courseName);

}