package com.knowledgegap.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_paths")
public class LearningPath {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer learningPathId;


    private String skillName;


    private Integer stepNumber;


    private String title;


    @Column(length = 1000)
    private String description;



    public LearningPath() {
    }



    public Integer getLearningPathId() {
        return learningPathId;
    }


    public void setLearningPathId(Integer learningPathId) {
        this.learningPathId = learningPathId;
    }


    public String getSkillName() {
        return skillName;
    }


    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }


    public Integer getStepNumber() {
        return stepNumber;
    }


    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }


    public String getTitle() {
        return title;
    }


    public void setTitle(String title) {
        this.title = title;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }

}