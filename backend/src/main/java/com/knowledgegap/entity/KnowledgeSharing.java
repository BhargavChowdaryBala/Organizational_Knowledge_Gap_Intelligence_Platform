package com.knowledgegap.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "knowledge_sharing")
public class KnowledgeSharing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sharingId;

    @Column(nullable = false)
    private Integer mentorId;

    @Column(nullable = false)
    private Integer menteeId;

    @Column(nullable = false)
    private String skillName;

    @Column(nullable = false)
    private String sessionTitle;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String sessionDate;

    @Column(nullable = false)
    private String sessionTime;

    @Column(nullable = false)
    private String meetingLink;

    @Column(nullable = false)
    private String status;

    public KnowledgeSharing() {
    }

    public Integer getSharingId() {
        return sharingId;
    }

    public void setSharingId(Integer sharingId) {
        this.sharingId = sharingId;
    }

    public Integer getMentorId() {
        return mentorId;
    }

    public void setMentorId(Integer mentorId) {
        this.mentorId = mentorId;
    }

    public Integer getMenteeId() {
        return menteeId;
    }

    public void setMenteeId(Integer menteeId) {
        this.menteeId = menteeId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(String sessionDate) {
        this.sessionDate = sessionDate;
    }

    public String getSessionTime() {
        return sessionTime;
    }

    public void setSessionTime(String sessionTime) {
        this.sessionTime = sessionTime;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}