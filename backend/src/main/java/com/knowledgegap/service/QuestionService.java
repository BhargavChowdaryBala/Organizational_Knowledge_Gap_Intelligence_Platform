package com.knowledgegap.service;

import com.knowledgegap.entity.Question;

import java.util.List;

public interface QuestionService {

    List<Question> getAllQuestions();

    Question saveQuestion(Question question);

    List<Question> getQuestionsByAssessment(Integer assessmentId);
    Question updateQuestion(Integer id, Question question);

    void deleteQuestion(Integer id);
}