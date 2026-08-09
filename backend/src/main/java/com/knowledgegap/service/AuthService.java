package com.knowledgegap.service;

import com.knowledgegap.dto.AuthResponse;
import com.knowledgegap.dto.LoginRequest;
import com.knowledgegap.dto.RegisterRequest;
import com.knowledgegap.dto.OtpLoginRequest;
import com.knowledgegap.dto.ResetPasswordRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse otpLogin(OtpLoginRequest request);

    AuthResponse resetPassword(ResetPasswordRequest request);
}