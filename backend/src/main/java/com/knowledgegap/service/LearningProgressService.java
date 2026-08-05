package com.knowledgegap.service;

import com.knowledgegap.entity.LearningProgress;

import java.util.List;

public interface LearningProgressService {

    // Create
    LearningProgress createLearningProgress(LearningProgress learningProgress);

    // Read
    List<LearningProgress> getAllLearningProgress();

    LearningProgress getLearningProgressById(Integer progressId);

    List<LearningProgress> getLearningProgressByEmployee(Integer employeeId);

    List<LearningProgress> getLearningProgressByCourse(Integer courseId);

    List<LearningProgress> getLearningProgressByStatus(String status);

    // Update
    LearningProgress updateLearningProgress(Integer progressId,
                                            LearningProgress learningProgress);

    // Delete
    void deleteLearningProgress(Integer progressId);

}