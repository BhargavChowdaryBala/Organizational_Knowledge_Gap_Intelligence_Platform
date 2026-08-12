package com.knowledgegap.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_skills")
public class EmployeeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employeeSkillId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;

    private Integer proficiencyLevel;

    private Integer experienceYears;

    public EmployeeSkill() {
    }

    public Integer getEmployeeSkillId() {
        return employeeSkillId;
    }

    public void setEmployeeSkillId(Integer employeeSkillId) {
        this.employeeSkillId = employeeSkillId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public Integer getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(Integer proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }
}