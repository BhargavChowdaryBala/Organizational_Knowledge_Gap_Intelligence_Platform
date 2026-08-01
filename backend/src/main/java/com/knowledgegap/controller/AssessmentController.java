package com.knowledgegap.controller;

import com.knowledgegap.dto.AssessmentResultResponse;
import com.knowledgegap.dto.AssessmentSubmissionRequest;
import com.knowledgegap.entity.Assessment;
import com.knowledgegap.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @PostMapping
    public Assessment saveAssessment(@RequestBody Assessment assessment) {
        return assessmentService.saveAssessment(assessment);
    }

    @GetMapping
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    @GetMapping("/course/{courseName}")
    public List<Assessment> getAssessmentsByCourse(@PathVariable String courseName) {
        return assessmentService.getAssessmentsByCourse(courseName);
    }

    @PostMapping("/{assessmentId}/submit")
    public AssessmentResultResponse submitAssessment(
            @PathVariable Integer assessmentId,
            @RequestBody AssessmentSubmissionRequest request) {

        return assessmentService.submitAssessment(assessmentId, request);
    }
    @DeleteMapping("/{id}")
    public String deleteAssessment(@PathVariable Integer id) {
        assessmentService.deleteAssessment(id);
        return "Assessment deleted successfully";
    }
}