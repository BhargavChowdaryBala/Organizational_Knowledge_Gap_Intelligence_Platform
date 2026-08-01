package com.knowledgegap.controller;

import com.knowledgegap.entity.AssessmentAnswer;
import com.knowledgegap.service.AssessmentAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AssessmentAnswerController {

    @Autowired
    private AssessmentAnswerService service;

    @PostMapping
    public AssessmentAnswer saveAnswer(@RequestBody AssessmentAnswer answer) {
        return service.saveAnswer(answer);
    }

    @GetMapping("/{userId}")
    public List<AssessmentAnswer> getAnswers(@PathVariable Integer userId) {
        return service.getAnswersByUser(userId);
    }
}