package com.knowledgegap.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_progress")
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer progressId;

    @Column(nullable = false)
    private Integer employeeId;

    @Column(nullable = false)
    private Integer courseId;

    @Column(nullable = false)
    private Integer progressPercentage;

    @Column(nullable = false)
    private String status;

    private String certificateUrl;

    public LearningProgress() {
    }

    public Integer getProgressId() {
        return progressId;
    }

    public void setProgressId(Integer progressId) {
        this.progressId = progressId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }
}