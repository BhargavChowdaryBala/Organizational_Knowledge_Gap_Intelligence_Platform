package com.knowledgegap.service;

import com.knowledgegap.dto.AssessmentResultResponse;
import com.knowledgegap.dto.AssessmentSubmissionRequest;
import com.knowledgegap.entity.Assessment;

import java.util.List;

public interface AssessmentService {

    Assessment saveAssessment(Assessment assessment);

    List<Assessment> getAllAssessments();

    Assessment getAssessmentById(Integer id);

    List<Assessment> getAssessmentsByCourse(String courseName);

    AssessmentResultResponse submitAssessment(
            Integer assessmentId,
            AssessmentSubmissionRequest request);

    void deleteAssessment(Integer id);
}