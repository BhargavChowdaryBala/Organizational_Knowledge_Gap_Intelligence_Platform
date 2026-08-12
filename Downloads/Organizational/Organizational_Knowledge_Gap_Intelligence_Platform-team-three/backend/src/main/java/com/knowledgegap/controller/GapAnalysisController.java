package com.knowledgegap.controller;

import com.knowledgegap.dto.GapAnalysisResponse;
import com.knowledgegap.service.GapAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gap-analysis")
@CrossOrigin(origins = "*")
public class GapAnalysisController {

    @Autowired
    private GapAnalysisService gapAnalysisService;

    @GetMapping("/{userId}")
    public List<GapAnalysisResponse> analyzeEmployee(@PathVariable Integer userId) {

        return gapAnalysisService.analyzeEmployee(userId);
    }
}