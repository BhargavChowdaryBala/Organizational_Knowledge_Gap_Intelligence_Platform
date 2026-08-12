package com.knowledgegap.controller;

import com.knowledgegap.dto.CourseRequest;
import com.knowledgegap.dto.CourseResponse;
import com.knowledgegap.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public CourseResponse createCourse(@RequestBody CourseRequest request) {
        return courseService.createCourse(request);
    }

    @GetMapping
    public List<CourseResponse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable Integer id) {
        return courseService.getCourseById(id);
    }

    @PutMapping("/{id}")
    public CourseResponse updateCourse(@PathVariable Integer id,
                                       @RequestBody CourseRequest request) {
        return courseService.updateCourse(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Integer id) {
        courseService.deleteCourse(id);
    }
}