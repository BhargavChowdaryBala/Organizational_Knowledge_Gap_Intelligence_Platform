package com.knowledgegap.service.impl;

import com.knowledgegap.entity.LearningProgress;
import com.knowledgegap.repository.LearningProgressRepository;
import com.knowledgegap.service.LearningProgressService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningProgressServiceImpl implements LearningProgressService {

    private final LearningProgressRepository repository;

    public LearningProgressServiceImpl(LearningProgressRepository repository) {
        this.repository = repository;
    }

    @Override
    public LearningProgress createLearningProgress(LearningProgress learningProgress) {
        return repository.save(learningProgress);
    }

    @Override
    public List<LearningProgress> getAllLearningProgress() {
        return repository.findAll();
    }

    @Override
    public LearningProgress getLearningProgressById(Integer progressId) {

        return repository.findById(progressId)
                .orElseThrow(() ->
                        new RuntimeException("Learning Progress not found with ID : " + progressId));
    }

    @Override
    public List<LearningProgress> getLearningProgressByEmployee(Integer employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    @Override
    public List<LearningProgress> getLearningProgressByCourse(Integer courseId) {
        return repository.findByCourseId(courseId);
    }

    @Override
    public List<LearningProgress> getLearningProgressByStatus(String status) {
        return repository.findByStatus(status);
    }

    @Override
    public LearningProgress updateLearningProgress(Integer progressId,
                                                   LearningProgress learningProgress) {

        LearningProgress existing = repository.findById(progressId)
                .orElseThrow(() ->
                        new RuntimeException("Learning Progress not found with ID : " + progressId));

        existing.setEmployeeId(learningProgress.getEmployeeId());
        existing.setCourseId(learningProgress.getCourseId());
        existing.setProgressPercentage(learningProgress.getProgressPercentage());
        existing.setStatus(learningProgress.getStatus());
        existing.setCertificateUrl(learningProgress.getCertificateUrl());

        return repository.save(existing);
    }

    @Override
    public void deleteLearningProgress(Integer progressId) {

        LearningProgress existing = repository.findById(progressId)
                .orElseThrow(() ->
                        new RuntimeException("Learning Progress not found with ID : " + progressId));

        repository.delete(existing);
    }

}