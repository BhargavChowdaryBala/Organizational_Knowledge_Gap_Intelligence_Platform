package com.knowledgegap.service.impl;

import com.knowledgegap.dto.CourseRequest;
import com.knowledgegap.dto.CourseResponse;
import com.knowledgegap.entity.Course;
import com.knowledgegap.entity.Department;
import com.knowledgegap.repository.CourseRepository;
import com.knowledgegap.repository.DepartmentRepository;
import com.knowledgegap.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public CourseResponse createCourse(CourseRequest request) {

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Course course = new Course();

        course.setCourseName(request.getCourseName());
        course.setCourseCode(request.getCourseCode());
        course.setCredits(request.getCredits());
        course.setDepartment(department);

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    @Override
    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse getCourseById(Integer id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return mapToResponse(course);
    }

    @Override
    public CourseResponse updateCourse(Integer id, CourseRequest request) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        course.setCourseName(request.getCourseName());
        course.setCourseCode(request.getCourseCode());
        course.setCredits(request.getCredits());
        course.setDepartment(department);

        Course updatedCourse = courseRepository.save(course);

        return mapToResponse(updatedCourse);
    }

    @Override
    public void deleteCourse(Integer id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        courseRepository.delete(course);
    }

    private CourseResponse mapToResponse(Course course) {

        CourseResponse response = new CourseResponse();

        response.setCourseId(course.getCourseId());
        response.setCourseName(course.getCourseName());
        response.setCourseCode(course.getCourseCode());
        response.setCredits(course.getCredits());

        if (course.getDepartment() != null) {
            response.setDepartmentName(course.getDepartment().getDepartmentName());
        }

        return response;
    }
}