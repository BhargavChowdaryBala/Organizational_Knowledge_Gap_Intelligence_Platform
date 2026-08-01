package com.knowledgegap.repository;

import com.knowledgegap.entity.AssessmentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, Integer> {

    List<AssessmentAnswer> findByUserUserId(Integer userId);
}