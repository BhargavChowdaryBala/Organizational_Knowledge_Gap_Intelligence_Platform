package com.knowledgegap.service;

import com.knowledgegap.dto.DepartmentAnalysisResponse;
import com.knowledgegap.dto.DashboardSummaryResponse;
import com.knowledgegap.dto.SkillAnalysisResponse;
import com.knowledgegap.dto.HeatmapResponse;

import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getDashboardSummary();

    List<SkillAnalysisResponse> getSkillAnalysis();

    List<HeatmapResponse> getHeatmap();

    List<DepartmentAnalysisResponse> getDepartmentAnalysis();

}