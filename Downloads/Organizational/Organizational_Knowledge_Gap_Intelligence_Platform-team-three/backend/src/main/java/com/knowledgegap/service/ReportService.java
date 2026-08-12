package com.knowledgegap.service;

import com.knowledgegap.dto.ReportResponse;

public interface ReportService {

    // Dashboard Report
    ReportResponse getDashboardReport();

    // Employee Report
    ReportResponse getEmployeeReport();

    // Department Report
    ReportResponse getDepartmentReport();

    // Training Report
    ReportResponse getTrainingReport();

    // Assessment Report
    ReportResponse getAssessmentReport();

}