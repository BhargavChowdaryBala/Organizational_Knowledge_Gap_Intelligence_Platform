package com.knowledgegap.service;

import com.knowledgegap.entity.AssessmentAnswer;

import java.util.List;

public interface AssessmentAnswerService {

    AssessmentAnswer saveAnswer(AssessmentAnswer answer);

    List<AssessmentAnswer> getAnswersByUser(Integer userId);
}