package com.knowledgegap.controller;

import com.knowledgegap.dto.EmployeeProfileRequest;
import com.knowledgegap.entity.EmployeeProfile;
import com.knowledgegap.service.EmployeeProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class EmployeeProfileController {

    @Autowired
    private EmployeeProfileService employeeProfileService;

    @PostMapping
    public EmployeeProfile createProfile(@RequestBody EmployeeProfileRequest request) {
        return employeeProfileService.createProfile(request);
    }

    @GetMapping
    public List<EmployeeProfile> getAllProfiles() {
        return employeeProfileService.getAllProfiles();
    }

    @GetMapping("/{id}")
    public EmployeeProfile getProfileById(@PathVariable Integer id) {
        return employeeProfileService.getProfileById(id);
    }

    @GetMapping("/user/{userId}")
    public EmployeeProfile getProfileByUserId(@PathVariable Integer userId) {
        return employeeProfileService.getProfileByUserId(userId);
    }

    @PutMapping("/{id}")
    public EmployeeProfile updateProfile(@PathVariable Integer id,
                                         @RequestBody EmployeeProfileRequest request) {
        return employeeProfileService.updateProfile(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable Integer id) {
        employeeProfileService.deleteProfile(id);
    }
}