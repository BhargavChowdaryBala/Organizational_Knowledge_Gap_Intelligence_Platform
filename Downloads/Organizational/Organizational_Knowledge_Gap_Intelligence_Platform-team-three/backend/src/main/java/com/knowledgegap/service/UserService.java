package com.knowledgegap.service;

import com.knowledgegap.dto.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();
}