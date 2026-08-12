package com.knowledgegap.dto;

public class RecommendationResponse {

    private String employeeName;
    private String skillName;
    private Integer currentLevel;
    private Integer expectedLevel;
    private Integer gap;
    private String recommendedCourse;
    private String provider;
    private String duration;

    public RecommendationResponse() {
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

    public String getRecommendedCourse() {
        return recommendedCourse;
    }

    public void setRecommendedCourse(String recommendedCourse) {
        this.recommendedCourse = recommendedCourse;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}