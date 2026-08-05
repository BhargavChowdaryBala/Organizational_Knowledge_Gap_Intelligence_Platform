package com.knowledgegap.dto;

import java.util.List;

public class AssessmentSubmissionRequest {

    private Integer userId;
    private List<AnswerRequest> answers;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public List<AnswerRequest> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerRequest> answers) {
        this.answers = answers;
    }
}