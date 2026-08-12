package com.knowledgegap.service.impl;

import com.knowledgegap.dto.UserResponse;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.UserRepository;
import com.knowledgegap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToResponse(User user) {

        UserResponse response = new UserResponse();

        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());

        if (user.getRole() != null) {
            response.setRole(user.getRole().getRoleName());
        }

        if (user.getDepartment() != null) {
            response.setDepartment(user.getDepartment().getDepartmentName());
        }

        return response;
    }
}