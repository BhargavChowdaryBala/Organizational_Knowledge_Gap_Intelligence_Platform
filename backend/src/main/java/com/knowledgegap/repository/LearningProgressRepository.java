package com.knowledgegap.repository;

import com.knowledgegap.entity.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Integer> {

    List<LearningProgress> findByEmployeeId(Integer employeeId);

    List<LearningProgress> findByCourseId(Integer courseId);

    List<LearningProgress> findByStatus(String status);
    long countByStatus(String status);

}