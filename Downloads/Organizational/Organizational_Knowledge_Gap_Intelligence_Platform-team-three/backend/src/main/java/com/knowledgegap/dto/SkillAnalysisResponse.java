package com.knowledgegap.dto;

public class SkillAnalysisResponse {

    private String skillName;
    private Long employeeCount;

    public SkillAnalysisResponse() {
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Long employeeCount) {
        this.employeeCount = employeeCount;
    }
}