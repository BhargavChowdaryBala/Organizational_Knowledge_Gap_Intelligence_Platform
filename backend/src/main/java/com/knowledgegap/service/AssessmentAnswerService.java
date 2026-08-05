package com.knowledgegap.service;

import com.knowledgegap.entity.Assessment;
import com.knowledgegap.entity.AssessmentAnswer;
import com.knowledgegap.entity.Question;
import com.knowledgegap.entity.User;

import java.util.List;

public interface AssessmentAnswerService {

    // Create
    AssessmentAnswer saveAnswer(AssessmentAnswer answer);

    // Read
    List<AssessmentAnswer> getAllAnswers();

    AssessmentAnswer getAnswerById(Integer answerId);

    List<AssessmentAnswer> getAnswersByUser(User user);

    List<AssessmentAnswer> getAnswersByQuestion(Question question);

    List<AssessmentAnswer> getAnswersByAssessment(Assessment assessment);

    List<AssessmentAnswer> getAnswersByUserAndAssessment(
            User user,
            Assessment assessment);

    // Update
    AssessmentAnswer updateAnswer(Integer answerId,
                                  AssessmentAnswer answer);

    // Delete
    void deleteAnswer(Integer answerId);
}