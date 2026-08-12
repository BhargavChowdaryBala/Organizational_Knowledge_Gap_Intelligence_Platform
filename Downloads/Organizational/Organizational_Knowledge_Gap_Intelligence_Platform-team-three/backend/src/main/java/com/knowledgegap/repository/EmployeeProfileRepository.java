package com.knowledgegap.repository;

import com.knowledgegap.entity.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Integer> {
    Optional<EmployeeProfile> findByUserUserId(Integer userId);
}