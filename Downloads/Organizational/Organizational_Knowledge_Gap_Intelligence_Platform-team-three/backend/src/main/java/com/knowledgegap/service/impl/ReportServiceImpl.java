package com.knowledgegap.service.impl;

import com.knowledgegap.dto.ReportResponse;
import com.knowledgegap.repository.AssessmentRepository;
import com.knowledgegap.repository.DepartmentRepository;
import com.knowledgegap.repository.EmployeeSkillRepository;
import com.knowledgegap.repository.LearningProgressRepository;
import com.knowledgegap.repository.NotificationRepository;
import com.knowledgegap.repository.SkillRepository;
import com.knowledgegap.repository.TrainingCourseRepository;
import com.knowledgegap.repository.UserRepository;
import com.knowledgegap.service.ReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private TrainingCourseRepository trainingCourseRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private LearningProgressRepository learningProgressRepository;

    @Override
    public ReportResponse getDashboardReport() {

        ReportResponse response = new ReportResponse();

        response.setTotalEmployees(userRepository.count());
        response.setTotalDepartments(departmentRepository.count());
        response.setTotalSkills(skillRepository.count());
        response.setTotalTrainingCourses(trainingCourseRepository.count());
        response.setTotalAssessments(assessmentRepository.count());
        response.setTotalNotifications(notificationRepository.count());

        response.setCompletedTrainings(
                (long) learningProgressRepository.findByStatus("Completed").size());

        response.setInProgressTrainings(
                (long) learningProgressRepository.findByStatus("In Progress").size());

        response.setPendingTrainings(
                (long) learningProgressRepository.findByStatus("Not Started").size());

        return response;
    }

    @Override
    public ReportResponse getEmployeeReport() {

        ReportResponse response = new ReportResponse();

        response.setTotalEmployees(userRepository.count());
        response.setTotalSkills(employeeSkillRepository.count());

        return response;
    }

    @Override
    public ReportResponse getDepartmentReport() {

        ReportResponse response = new ReportResponse();

        response.setTotalDepartments(departmentRepository.count());
        response.setTotalEmployees(userRepository.count());

        return response;
    }

    @Override
    public ReportResponse getTrainingReport() {

        ReportResponse response = new ReportResponse();

        response.setTotalTrainingCourses(trainingCourseRepository.count());

        response.setCompletedTrainings(
                (long) learningProgressRepository.findByStatus("Completed").size());

        response.setInProgressTrainings(
                (long) learningProgressRepository.findByStatus("In Progress").size());

        response.setPendingTrainings(
                (long) learningProgressRepository.findByStatus("Not Started").size());

        return response;
    }

    @Override
    public ReportResponse getAssessmentReport() {

        ReportResponse response = new ReportResponse();

        response.setTotalAssessments(assessmentRepository.count());

        return response;
    }
}