package com.knowledgegap.dto;

public class CompetencyRequest {

    private String competencyName;
    private String description;
    private Integer expectedLevel;

    public CompetencyRequest(){}

    public String getCompetencyName() {
        return competencyName;
    }

    public void setCompetencyName(String competencyName) {
        this.competencyName = competencyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getExpectedLevel() {
        return expectedLevel;
    }

    public void setExpectedLevel(Integer expectedLevel) {
        this.expectedLevel = expectedLevel;
    }
}