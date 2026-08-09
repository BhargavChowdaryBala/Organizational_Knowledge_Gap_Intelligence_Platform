package com.knowledgegap.dto;

public class OtpLoginRequest {
    private String email;

    public OtpLoginRequest() {
    }

    public OtpLoginRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
