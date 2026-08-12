package com.knowledgegap.service.impl;

import com.knowledgegap.dto.GapAnalysisResponse;
import com.knowledgegap.entity.Competency;
import com.knowledgegap.entity.EmployeeSkill;
import com.knowledgegap.repository.CompetencyRepository;
import com.knowledgegap.repository.EmployeeSkillRepository;
import com.knowledgegap.service.GapAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GapAnalysisServiceImpl implements GapAnalysisService {

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private CompetencyRepository competencyRepository;

    @Override
    public List<GapAnalysisResponse> analyzeEmployee(Integer userId) {

        List<EmployeeSkill> employeeSkills =
                employeeSkillRepository.findByUserUserId(userId);

        return buildGapAnalysis(employeeSkills);
    }

    @Override
    public List<GapAnalysisResponse> getGapAnalysis() {

        List<EmployeeSkill> allSkills =
                employeeSkillRepository.findAll();

        return buildGapAnalysis(allSkills);
    }

    private List<GapAnalysisResponse> buildGapAnalysis(List<EmployeeSkill> employeeSkills) {

        List<GapAnalysisResponse> responses = new ArrayList<>();

        for (EmployeeSkill employeeSkill : employeeSkills) {

            if (employeeSkill.getSkill() == null) {
    continue;
}

String skillName = employeeSkill.getSkill().getSkillName();
            Competency competency = competencyRepository
                    .findByCompetencyName(skillName)
                    .orElse(null);

            if (competency == null) {
                continue;
            }

            GapAnalysisResponse response = new GapAnalysisResponse();

            response.setUserId(employeeSkill.getUser().getUserId());

            response.setEmployeeName(
                    employeeSkill.getUser().getFirstName() + " "
                            + employeeSkill.getUser().getLastName());

            response.setSkillName(skillName);

            response.setCurrentLevel(employeeSkill.getProficiencyLevel());

            response.setExpectedLevel(competency.getExpectedLevel());

            int gap = competency.getExpectedLevel()
                    - employeeSkill.getProficiencyLevel();

            response.setGap(gap);

            if (gap <= 0) {
                response.setStatus("Competent");
            } else if (gap <= 2) {
                response.setStatus("Needs Improvement");
            } else {
                response.setStatus("Needs Training");
            }

            responses.add(response);
        }

        return responses;
    }
}