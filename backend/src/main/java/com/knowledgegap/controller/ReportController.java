package com.knowledgegap.controller;

import com.knowledgegap.dto.ReportResponse;
import com.knowledgegap.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // Dashboard Report
    @GetMapping("/dashboard")
    public ReportResponse getDashboardReport() {
        return reportService.getDashboardReport();
    }

    // Employee Report
    @GetMapping("/employees")
    public ReportResponse getEmployeeReport() {
        return reportService.getEmployeeReport();
    }

    // Department Report
    @GetMapping("/departments")
    public ReportResponse getDepartmentReport() {
        return reportService.getDepartmentReport();
    }

    // Training Report
    @GetMapping("/trainings")
    public ReportResponse getTrainingReport() {
        return reportService.getTrainingReport();
    }

    // Assessment Report
    @GetMapping("/assessments")
    public ReportResponse getAssessmentReport() {
        return reportService.getAssessmentReport();
    }

}