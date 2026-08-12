package com.knowledgegap.service.impl;

import com.knowledgegap.entity.Question;
import com.knowledgegap.repository.QuestionRepository;
import com.knowledgegap.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    public List<Question> getQuestionsByAssessment(Integer assessmentId) {
        return questionRepository.findByAssessmentAssessmentId(assessmentId);
    }
    @Override
    public Question updateQuestion(Integer id, Question question) {
        question.setQuestionId(id);
        return questionRepository.save(question);
    }

    @Override
    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }
}