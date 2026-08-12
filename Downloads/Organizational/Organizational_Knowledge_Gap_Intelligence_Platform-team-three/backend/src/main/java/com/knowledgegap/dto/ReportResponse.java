package com.knowledgegap.dto;

public class ReportResponse {

    private Long totalEmployees;

    private Long totalDepartments;

    private Long totalSkills;

    private Long totalTrainingCourses;

    private Long totalAssessments;

    private Long totalNotifications;

    private Long completedTrainings;

    private Long inProgressTrainings;

    private Long pendingTrainings;

    private Double averageGap;

    private Double averageAssessmentScore;

    public ReportResponse() {
    }

    public Long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public Long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(Long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public Long getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(Long totalSkills) {
        this.totalSkills = totalSkills;
    }

    public Long getTotalTrainingCourses() {
        return totalTrainingCourses;
    }

    public void setTotalTrainingCourses(Long totalTrainingCourses) {
        this.totalTrainingCourses = totalTrainingCourses;
    }

    public Long getTotalAssessments() {
        return totalAssessments;
    }

    public void setTotalAssessments(Long totalAssessments) {
        this.totalAssessments = totalAssessments;
    }

    public Long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(Long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public Long getCompletedTrainings() {
        return completedTrainings;
    }

    public void setCompletedTrainings(Long completedTrainings) {
        this.completedTrainings = completedTrainings;
    }

    public Long getInProgressTrainings() {
        return inProgressTrainings;
    }

    public void setInProgressTrainings(Long inProgressTrainings) {
        this.inProgressTrainings = inProgressTrainings;
    }

    public Long getPendingTrainings() {
        return pendingTrainings;
    }

    public void setPendingTrainings(Long pendingTrainings) {
        this.pendingTrainings = pendingTrainings;
    }

    public Double getAverageGap() {
        return averageGap;
    }

    public void setAverageGap(Double averageGap) {
        this.averageGap = averageGap;
    }

    public Double getAverageAssessmentScore() {
        return averageAssessmentScore;
    }

    public void setAverageAssessmentScore(Double averageAssessmentScore) {
        this.averageAssessmentScore = averageAssessmentScore;
    }
}