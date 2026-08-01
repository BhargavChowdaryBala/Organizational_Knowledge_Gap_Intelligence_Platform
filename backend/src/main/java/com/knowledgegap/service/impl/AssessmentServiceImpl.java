package com.knowledgegap.service.impl;

import com.knowledgegap.dto.AnswerRequest;
import com.knowledgegap.dto.AssessmentResultResponse;
import com.knowledgegap.dto.AssessmentSubmissionRequest;
import com.knowledgegap.entity.Assessment;
import com.knowledgegap.entity.AssessmentAnswer;
import com.knowledgegap.entity.Question;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.AssessmentAnswerRepository;
import com.knowledgegap.repository.AssessmentRepository;
import com.knowledgegap.repository.QuestionRepository;
import com.knowledgegap.repository.UserRepository;
import com.knowledgegap.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AssessmentAnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Assessment saveAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    @Override
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @Override
    public List<Assessment> getAssessmentsByCourse(String courseName) {
        return assessmentRepository.findByCourseName(courseName);
    }

    @Override
    public void deleteAssessment(Integer id) {
        assessmentRepository.deleteById(id);
    }

    @Override
    public AssessmentResultResponse submitAssessment(
            Integer assessmentId,
            AssessmentSubmissionRequest request) {

        // Find Assessment
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found"));

        // Find User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        int score = 0;

        for (AnswerRequest answerRequest : request.getAnswers()) {

            // Find Question
            Question question = questionRepository.findById(answerRequest.getQuestionId())
                    .orElseThrow(() ->
                            new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

            // Validate Assessment
            if (!question.getAssessment().getAssessmentId().equals(assessmentId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Question does not belong to this assessment."
                );
            }

            // Check Answer
            boolean correct = question.getCorrectAnswer()
                    .equals(answerRequest.getSelectedAnswer());

            if (correct) {
                score++;
            }

            // Save Answer
            AssessmentAnswer answer = new AssessmentAnswer();
            answer.setQuestion(question);
            answer.setUser(user);
            answer.setSelectedAnswer(answerRequest.getSelectedAnswer());
            answer.setIsCorrect(correct);

            answerRepository.save(answer);
        }

        // Prepare Result
        AssessmentResultResponse response = new AssessmentResultResponse();
        response.setScore(score);
        response.setTotalQuestions(assessment.getTotalQuestions());
        response.setPassingMarks(assessment.getPassingMarks());

        if (score >= assessment.getPassingMarks()) {
            response.setResult("PASS");
        } else {
            response.setResult("FAIL");
        }

        return response;
    }
}