package com.knowledgegap.dto;

public class HeatmapResponse {

    private String employeeName;
    private String skillName;
    private Integer currentLevel;
    private Integer expectedLevel;
    private Integer gap;

    public HeatmapResponse() {
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Integer currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Integer getExpectedLevel() {
        return expectedLevel;
    }

    public void setExpectedLevel(Integer expectedLevel) {
        this.expectedLevel = expectedLevel;
    }

    public Integer getGap() {
        return gap;
    }

    public void setGap(Integer gap) {
        this.gap = gap;
    }
}