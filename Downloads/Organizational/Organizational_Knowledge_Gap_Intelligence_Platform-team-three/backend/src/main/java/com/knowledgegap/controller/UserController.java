package com.knowledgegap.controller;

import com.knowledgegap.dto.UserResponse;
import com.knowledgegap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }
}