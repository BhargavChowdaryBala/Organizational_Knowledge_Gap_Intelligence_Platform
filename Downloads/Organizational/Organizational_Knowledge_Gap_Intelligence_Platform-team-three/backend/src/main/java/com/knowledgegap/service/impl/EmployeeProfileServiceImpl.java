package com.knowledgegap.service.impl;

import com.knowledgegap.dto.EmployeeProfileRequest;
import com.knowledgegap.entity.EmployeeProfile;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.EmployeeProfileRepository;
import com.knowledgegap.repository.UserRepository;
import com.knowledgegap.service.EmployeeProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeProfileServiceImpl implements EmployeeProfileService {

    @Autowired
    private EmployeeProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public EmployeeProfile createProfile(EmployeeProfileRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<EmployeeProfile> existingProfile = profileRepository.findByUserUserId(request.getUserId());
        if (existingProfile.isPresent()) {
            EmployeeProfile profile = existingProfile.get();
            profile.setDesignation(request.getDesignation());
            profile.setExperience(request.getExperience());
            profile.setLocation(request.getLocation());
            profile.setJoiningDate(request.getJoiningDate());
            profile.setBio(request.getBio());
            return profileRepository.save(profile);
        }

        EmployeeProfile profile = new EmployeeProfile();

        profile.setUser(user);
        profile.setDesignation(request.getDesignation());
        profile.setExperience(request.getExperience());
        profile.setLocation(request.getLocation());
        profile.setJoiningDate(request.getJoiningDate());
        profile.setBio(request.getBio());

        return profileRepository.save(profile);
    }

    @Override
    public List<EmployeeProfile> getAllProfiles() {
        return profileRepository.findAll();
    }

    @Override
    public EmployeeProfile getProfileById(Integer id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Override
    public EmployeeProfile getProfileByUserId(Integer userId) {
        return profileRepository.findByUserUserId(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Profile not found for user: " + userId));
    }

    @Override
    public EmployeeProfile updateProfile(Integer id,
                                         EmployeeProfileRequest request) {

        EmployeeProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        profile.setUser(user);
        profile.setDesignation(request.getDesignation());
        profile.setExperience(request.getExperience());
        profile.setLocation(request.getLocation());
        profile.setJoiningDate(request.getJoiningDate());
        profile.setBio(request.getBio());

        return profileRepository.save(profile);
    }

    @Override
    public void deleteProfile(Integer id) {
        profileRepository.deleteById(id);
    }
}