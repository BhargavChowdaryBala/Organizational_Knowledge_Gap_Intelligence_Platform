package com.knowledgegap.repository;

import com.knowledgegap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    @Query("""
        SELECT u.department.departmentName, COUNT(u)
        FROM User u
        WHERE u.department IS NOT NULL
        GROUP BY u.department.departmentName
    """)
    List<Object[]> getDepartmentAnalysis();
}