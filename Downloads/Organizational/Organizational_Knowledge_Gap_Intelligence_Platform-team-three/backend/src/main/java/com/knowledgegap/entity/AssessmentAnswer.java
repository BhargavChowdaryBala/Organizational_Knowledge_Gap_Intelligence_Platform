package com.knowledgegap.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment_answers")
public class AssessmentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer answerId;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "assessment_id", nullable = true)
    private Assessment assessment;

    @Column(nullable = false)
    private String selectedAnswer;

    @Column(nullable = false)
    private Boolean isCorrect;

    public AssessmentAnswer() {
    }

    public Integer getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Integer answerId) {
        this.answerId = answerId;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean correct) {
        isCorrect = correct;
    }
}