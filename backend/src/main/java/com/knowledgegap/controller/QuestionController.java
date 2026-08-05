package com.knowledgegap.controller;

import com.knowledgegap.entity.Question;
import com.knowledgegap.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @PostMapping
    public Question saveQuestion(@RequestBody Question question) {
        return questionService.saveQuestion(question);
    }

    @GetMapping("/assessment/{assessmentId}")
    public List<Question> getQuestionsByAssessment(
            @PathVariable Integer assessmentId) {

        return questionService.getQuestionsByAssessment(assessmentId);
    }
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Integer id,
                                   @RequestBody Question question) {
        return questionService.updateQuestion(id, question);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Integer id) {
        questionService.deleteQuestion(id);
    }
}