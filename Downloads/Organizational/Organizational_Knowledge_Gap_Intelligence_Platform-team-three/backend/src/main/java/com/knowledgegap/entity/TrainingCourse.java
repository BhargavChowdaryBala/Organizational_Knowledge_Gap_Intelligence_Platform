package com.knowledgegap.entity;

import jakarta.persistence.*;

@Entity
@Table(name="training_courses")
public class TrainingCourse {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseId;


    private String skillName;


    private String courseName;


    private String provider;


    private String duration;


    private String level;


    private String courseUrl;



    public TrainingCourse(){

    }


    public Integer getCourseId() {
        return courseId;
    }


    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }


    public String getSkillName() {
        return skillName;
    }


    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }


    public String getCourseName() {
        return courseName;
    }


    public void setCourseName(String courseName) {
        this.courseName = courseName;
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


    public String getLevel() {
        return level;
    }


    public void setLevel(String level) {
        this.level = level;
    }


    public String getCourseUrl() {
        return courseUrl;
    }


    public void setCourseUrl(String courseUrl) {
        this.courseUrl = courseUrl;
    }

}