package com.knowledgegap.service;

import com.knowledgegap.dto.CourseRequest;
import com.knowledgegap.dto.CourseResponse;

import java.util.List;

public interface CourseService {

    CourseResponse createCourse(CourseRequest request);

    List<CourseResponse> getAllCourses();

    CourseResponse getCourseById(Integer id);

    CourseResponse updateCourse(Integer id, CourseRequest request);

    void deleteCourse(Integer id);
}