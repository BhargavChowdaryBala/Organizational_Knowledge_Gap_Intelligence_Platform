package com.knowledgegap.service;

import com.knowledgegap.dto.EmployeeProfileRequest;
import com.knowledgegap.entity.EmployeeProfile;

import java.util.List;

public interface EmployeeProfileService {

    EmployeeProfile createProfile(EmployeeProfileRequest request);

    List<EmployeeProfile> getAllProfiles();

    EmployeeProfile getProfileById(Integer id);

    EmployeeProfile getProfileByUserId(Integer userId);

    EmployeeProfile updateProfile(Integer id, EmployeeProfileRequest request);

    void deleteProfile(Integer id);
}