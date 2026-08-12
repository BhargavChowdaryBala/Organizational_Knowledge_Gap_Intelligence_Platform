package com.knowledgegap.service.impl;

import com.knowledgegap.entity.Assessment;
import com.knowledgegap.entity.AssessmentAnswer;
import com.knowledgegap.entity.Question;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.AssessmentAnswerRepository;
import com.knowledgegap.service.AssessmentAnswerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssessmentAnswerServiceImpl implements AssessmentAnswerService {

    private final AssessmentAnswerRepository repository;

    public AssessmentAnswerServiceImpl(AssessmentAnswerRepository repository) {
        this.repository = repository;
    }

    @Override
    public AssessmentAnswer saveAnswer(AssessmentAnswer answer) {
        return repository.save(answer);
    }

    @Override
    public List<AssessmentAnswer> getAllAnswers() {
        return repository.findAll();
    }

    @Override
    public AssessmentAnswer getAnswerById(Integer answerId) {
        return repository.findById(answerId)
                .orElseThrow(() ->
                        new RuntimeException("Assessment Answer not found with ID: " + answerId));
    }

    @Override
    public List<AssessmentAnswer> getAnswersByUser(User user) {
        return repository.findByUser(user);
    }

    @Override
    public List<AssessmentAnswer> getAnswersByQuestion(Question question) {
        return repository.findByQuestion(question);
    }

    @Override
    public List<AssessmentAnswer> getAnswersByAssessment(Assessment assessment) {
        return repository.findByAssessment(assessment);
    }

    @Override
    public List<AssessmentAnswer> getAnswersByUserAndAssessment(User user,
                                                                Assessment assessment) {
        return repository.findByUserAndAssessment(user, assessment);
    }

    @Override
    public AssessmentAnswer updateAnswer(Integer answerId,
                                         AssessmentAnswer answer) {

        AssessmentAnswer existing = repository.findById(answerId)
                .orElseThrow(() ->
                        new RuntimeException("Assessment Answer not found with ID: " + answerId));

        existing.setAssessment(answer.getAssessment());
        existing.setQuestion(answer.getQuestion());
        existing.setUser(answer.getUser());
        existing.setSelectedAnswer(answer.getSelectedAnswer());
        existing.setIsCorrect(answer.getIsCorrect());

        return repository.save(existing);
    }

    @Override
    public void deleteAnswer(Integer answerId) {

        AssessmentAnswer existing = repository.findById(answerId)
                .orElseThrow(() ->
                        new RuntimeException("Assessment Answer not found with ID: " + answerId));

        repository.delete(existing);
    }
}