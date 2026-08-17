package com.knowledgegap.controller;

import com.knowledgegap.dto.AuthResponse;
import com.knowledgegap.dto.LoginRequest;
import com.knowledgegap.dto.RegisterRequest;
import com.knowledgegap.dto.OtpLoginRequest;
import com.knowledgegap.dto.ResetPasswordRequest;
import com.knowledgegap.dto.GoogleLoginRequest;
import com.knowledgegap.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

   @PostMapping("/register")
   public AuthResponse register(@RequestBody RegisterRequest request) {
       System.out.println(">>> REGISTER API HIT <<<");
       return authService.register(request);
   }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/otp-login")
    public AuthResponse otpLogin(@RequestBody OtpLoginRequest request) {
        return authService.otpLogin(request);
    }

    @PostMapping("/reset-password")
    public AuthResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PostMapping("/google")
    public AuthResponse googleLogin(@RequestBody GoogleLoginRequest request) {
        return authService.googleLogin(request);
    }
}