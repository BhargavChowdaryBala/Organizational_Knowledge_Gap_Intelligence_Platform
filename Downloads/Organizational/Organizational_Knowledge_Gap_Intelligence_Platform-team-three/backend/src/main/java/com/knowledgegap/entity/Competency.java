package com.knowledgegap.entity;

import jakarta.persistence.*;

@Entity
@Table(name="competencies")
public class Competency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer competencyId;

    @Column(nullable=false, unique=true)
    private String competencyName;

    private String description;

    private Integer expectedLevel;

    public Competency(){}

    public Integer getCompetencyId() {
        return competencyId;
    }

    public void setCompetencyId(Integer competencyId) {
        this.competencyId = competencyId;
    }

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