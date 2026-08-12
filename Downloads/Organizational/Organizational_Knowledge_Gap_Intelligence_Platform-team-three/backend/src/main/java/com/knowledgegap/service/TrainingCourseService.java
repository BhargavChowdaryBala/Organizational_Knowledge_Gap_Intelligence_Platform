package com.knowledgegap.service;

import com.knowledgegap.entity.TrainingCourse;

import java.util.List;

public interface TrainingCourseService {

    TrainingCourse createTrainingCourse(TrainingCourse course);

    List<TrainingCourse> getAllTrainingCourses();

    TrainingCourse getTrainingCourseById(Integer id);

    TrainingCourse updateTrainingCourse(Integer id, TrainingCourse course);

    void deleteTrainingCourse(Integer id);
}