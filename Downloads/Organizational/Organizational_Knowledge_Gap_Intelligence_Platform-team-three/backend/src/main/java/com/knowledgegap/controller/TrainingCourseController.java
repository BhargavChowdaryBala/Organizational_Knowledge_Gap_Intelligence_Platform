package com.knowledgegap.controller;

import com.knowledgegap.entity.TrainingCourse;
import com.knowledgegap.service.TrainingCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-courses")
@CrossOrigin(origins = "*")
public class TrainingCourseController {

    @Autowired
    private TrainingCourseService trainingCourseService;

    @PostMapping
    public TrainingCourse createTrainingCourse(@RequestBody TrainingCourse course) {
        return trainingCourseService.createTrainingCourse(course);
    }

    @GetMapping
    public List<TrainingCourse> getAllTrainingCourses() {
        return trainingCourseService.getAllTrainingCourses();
    }

    @GetMapping("/{id}")
    public TrainingCourse getTrainingCourseById(@PathVariable Integer id) {
        return trainingCourseService.getTrainingCourseById(id);
    }

    @PutMapping("/{id}")
    public TrainingCourse updateTrainingCourse(@PathVariable Integer id,
                                               @RequestBody TrainingCourse course) {
        return trainingCourseService.updateTrainingCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public void deleteTrainingCourse(@PathVariable Integer id) {
        trainingCourseService.deleteTrainingCourse(id);
    }
}