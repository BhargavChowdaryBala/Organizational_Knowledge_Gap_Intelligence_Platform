package com.knowledgegap.service.impl;

import com.knowledgegap.dto.DashboardSummaryResponse;
import com.knowledgegap.dto.DepartmentAnalysisResponse;
import com.knowledgegap.dto.GapAnalysisResponse;
import com.knowledgegap.dto.HeatmapResponse;
import com.knowledgegap.dto.SkillAnalysisResponse;

import com.knowledgegap.repository.AssessmentRepository;
import com.knowledgegap.repository.CompetencyRepository;
import com.knowledgegap.repository.DepartmentRepository;
import com.knowledgegap.repository.EmployeeSkillRepository;
import com.knowledgegap.repository.LearningProgressRepository;
import com.knowledgegap.repository.NotificationRepository;
import com.knowledgegap.repository.SkillRepository;
import com.knowledgegap.repository.TrainingCourseRepository;
import com.knowledgegap.repository.UserRepository;

import com.knowledgegap.service.DashboardService;
import com.knowledgegap.service.GapAnalysisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private CompetencyRepository competencyRepository;
    @Autowired
private NotificationRepository notificationRepository;

@Autowired
private LearningProgressRepository learningProgressRepository;

@Autowired
private AssessmentRepository assessmentRepository;

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private TrainingCourseRepository trainingCourseRepository;
    @Autowired
    private GapAnalysisService gapAnalysisService;
   
    @Override
public DashboardSummaryResponse getDashboardSummary() {

    DashboardSummaryResponse response = new DashboardSummaryResponse();

    // Existing Dashboard Data
    response.setTotalEmployees(userRepository.count());
    response.setTotalDepartments(departmentRepository.count());
    response.setTotalSkills(skillRepository.count());
    response.setTotalCompetencies(competencyRepository.count());
    response.setTotalEmployeeSkills(employeeSkillRepository.count());

    // Milestone 3
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
public List<DepartmentAnalysisResponse> getDepartmentAnalysis() {

    List<Object[]> results = userRepository.getDepartmentAnalysis();

    List<DepartmentAnalysisResponse> responses = new ArrayList<>();

    for (Object[] row : results) {

        DepartmentAnalysisResponse response = new DepartmentAnalysisResponse();

        response.setDepartmentName((String) row[0]);
        response.setEmployeeCount((Long) row[1]);

        responses.add(response);
    }

    return responses;
}
@Override
public List<HeatmapResponse> getHeatmap() {

    System.out.println("Inside getHeatmap()");

    List<GapAnalysisResponse> gaps = gapAnalysisService.getGapAnalysis();

    System.out.println("Gap count = " + gaps.size());

    List<HeatmapResponse> responses = new ArrayList<>();

    for (GapAnalysisResponse gap : gaps) {

        System.out.println(gap.getEmployeeName());

        HeatmapResponse response = new HeatmapResponse();

        response.setEmployeeName(gap.getEmployeeName());
        response.setSkillName(gap.getSkillName());
        response.setCurrentLevel(gap.getCurrentLevel());
        response.setExpectedLevel(gap.getExpectedLevel());
        response.setGap(gap.getGap());

        responses.add(response);
    }

    return responses;
}
@Override
public List<SkillAnalysisResponse> getSkillAnalysis() {

    List<Object[]> results = employeeSkillRepository.getSkillAnalysis();

    List<SkillAnalysisResponse> responses = new ArrayList<>();

    for (Object[] row : results) {

        SkillAnalysisResponse response = new SkillAnalysisResponse();

        response.setSkillName((String) row[0]);
        response.setEmployeeCount((Long) row[1]);

        responses.add(response);
    }

    return responses;
}
}