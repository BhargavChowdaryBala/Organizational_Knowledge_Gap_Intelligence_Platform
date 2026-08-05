package com.knowledgegap.controller;

import com.knowledgegap.dto.DashboardSummaryResponse;
import com.knowledgegap.dto.DepartmentAnalysisResponse;
import com.knowledgegap.dto.HeatmapResponse;
import com.knowledgegap.dto.SkillAnalysisResponse;
import com.knowledgegap.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // Dashboard Summary
    @GetMapping("/summary")
    public DashboardSummaryResponse getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }

    // Department Analysis
    @GetMapping("/department-analysis")
    public List<DepartmentAnalysisResponse> getDepartmentAnalysis() {
        return dashboardService.getDepartmentAnalysis();
    }

    // Skill Analysis
    @GetMapping("/skill-analysis")
    public List<SkillAnalysisResponse> getSkillAnalysis() {
        return dashboardService.getSkillAnalysis();
    }

    // Heatmap
    @GetMapping("/heatmap")
    public List<HeatmapResponse> getHeatmap() {
        return dashboardService.getHeatmap();
    }

}