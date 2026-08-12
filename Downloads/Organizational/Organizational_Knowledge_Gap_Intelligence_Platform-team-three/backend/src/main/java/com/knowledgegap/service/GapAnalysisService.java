package com.knowledgegap.service;

import com.knowledgegap.dto.GapAnalysisResponse;
import java.util.List;

public interface GapAnalysisService {

    List<GapAnalysisResponse> analyzeEmployee(Integer userId);

    List<GapAnalysisResponse> getGapAnalysis();

}