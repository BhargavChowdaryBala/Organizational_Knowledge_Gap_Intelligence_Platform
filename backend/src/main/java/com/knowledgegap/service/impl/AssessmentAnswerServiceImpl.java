package com.knowledgegap.service.impl;

import com.knowledgegap.entity.AssessmentAnswer;
import com.knowledgegap.repository.AssessmentAnswerRepository;
import com.knowledgegap.service.AssessmentAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.knowledgegap.entity.Question;
import com.knowledgegap.repository.QuestionRepository;
import java.util.List;

@Service
public class AssessmentAnswerServiceImpl implements AssessmentAnswerService {

    @Autowired
    private AssessmentAnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public AssessmentAnswer saveAnswer(AssessmentAnswer answer) {

        Integer questionId = answer.getQuestion().getQuestionId();

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if(question.getCorrectAnswer().equalsIgnoreCase(answer.getSelectedAnswer())){
            answer.setIsCorrect(true);
        }
        else{
            answer.setIsCorrect(false);
        }

        return answerRepository.save(answer);
    }

    @Override
    public List<AssessmentAnswer> getAnswersByUser(Integer userId) {
        return answerRepository.findByUserUserId(userId);
    }
}