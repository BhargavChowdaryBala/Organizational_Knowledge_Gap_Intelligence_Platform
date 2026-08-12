package com.knowledgegap.controller;

import com.knowledgegap.entity.Assessment;
import com.knowledgegap.entity.AssessmentAnswer;
import com.knowledgegap.entity.Question;
import com.knowledgegap.entity.User;
import com.knowledgegap.service.AssessmentAnswerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessment-answers")
@CrossOrigin(origins = "*")
public class AssessmentAnswerController {

    private final AssessmentAnswerService service;

    public AssessmentAnswerController(AssessmentAnswerService service) {
        this.service = service;
    }

    // Save Answer
    @PostMapping
    public AssessmentAnswer saveAnswer(@RequestBody AssessmentAnswer answer) {
        return service.saveAnswer(answer);
    }

    // Get All Answers
    @GetMapping
    public List<AssessmentAnswer> getAllAnswers() {
        return service.getAllAnswers();
    }

    // Get Answer By ID
    @GetMapping("/{id}")
    public AssessmentAnswer getAnswerById(@PathVariable Integer id) {
        return service.getAnswerById(id);
    }

    // Get Answers By User
    @GetMapping("/user")
    public List<AssessmentAnswer> getAnswersByUser(
            @RequestBody User user) {

        return service.getAnswersByUser(user);
    }

    // Get Answers By Question
    @GetMapping("/question")
    public List<AssessmentAnswer> getAnswersByQuestion(
            @RequestBody Question question) {

        return service.getAnswersByQuestion(question);
    }

    // Get Answers By Assessment
    @GetMapping("/assessment")
    public List<AssessmentAnswer> getAnswersByAssessment(
            @RequestBody Assessment assessment) {

        return service.getAnswersByAssessment(assessment);
    }

    // Get Answers By User And Assessment
    @PostMapping("/user-assessment")
    public List<AssessmentAnswer> getAnswersByUserAndAssessment(
            @RequestBody UserAssessmentRequest request) {

        return service.getAnswersByUserAndAssessment(
                request.getUser(),
                request.getAssessment()
        );
    }

    // Update Answer
    @PutMapping("/{id}")
    public AssessmentAnswer updateAnswer(
            @PathVariable Integer id,
            @RequestBody AssessmentAnswer answer) {

        return service.updateAnswer(id, answer);
    }

    // Delete Answer
    @DeleteMapping("/{id}")
    public String deleteAnswer(@PathVariable Integer id) {

        service.deleteAnswer(id);

        return "Assessment Answer Deleted Successfully";
    }

    // DTO
    public static class UserAssessmentRequest {

        private User user;
        private Assessment assessment;

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }

        public Assessment getAssessment() {
            return assessment;
        }

        public void setAssessment(Assessment assessment) {
            this.assessment = assessment;
        }
    }
}