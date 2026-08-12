package com.knowledgegap.service.impl;

import com.knowledgegap.entity.TrainingCourse;
import com.knowledgegap.repository.TrainingCourseRepository;
import com.knowledgegap.service.TrainingCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingCourseServiceImpl implements TrainingCourseService {

    @Autowired
    private TrainingCourseRepository repository;

    @Override
    public TrainingCourse createTrainingCourse(TrainingCourse course) {
        return repository.save(course);
    }

    @Override
    public List<TrainingCourse> getAllTrainingCourses() {
        return repository.findAll();
    }

    @Override
    public TrainingCourse getTrainingCourseById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Override
    public TrainingCourse updateTrainingCourse(Integer id, TrainingCourse course) {

        TrainingCourse existing = getTrainingCourseById(id);

        existing.setCourseName(course.getCourseName());
        existing.setSkillName(course.getSkillName());
        existing.setProvider(course.getProvider());
        existing.setDuration(course.getDuration());
        existing.setLevel(course.getLevel());

        return repository.save(existing);
    }

    @Override
    public void deleteTrainingCourse(Integer id) {
        repository.deleteById(id);
    }
}