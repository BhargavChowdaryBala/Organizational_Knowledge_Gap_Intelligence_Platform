package com.knowledgegap.service.impl;

import com.knowledgegap.dto.TrainingRecommendationResponse;
import com.knowledgegap.entity.Competency;
import com.knowledgegap.entity.EmployeeSkill;
import com.knowledgegap.entity.TrainingCourse;
import com.knowledgegap.repository.CompetencyRepository;
import com.knowledgegap.repository.EmployeeSkillRepository;
import com.knowledgegap.repository.TrainingCourseRepository;
import com.knowledgegap.service.TrainingRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TrainingRecommendationServiceImpl implements TrainingRecommendationService {

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private CompetencyRepository competencyRepository;

    @Autowired
    private TrainingCourseRepository trainingCourseRepository;

    @Override
    public List<TrainingRecommendationResponse> getRecommendations(Integer userId) {

        List<EmployeeSkill> employeeSkills =
                employeeSkillRepository.findByUserUserId(userId);

        List<TrainingRecommendationResponse> responses = new ArrayList<>();

        for (EmployeeSkill employeeSkill : employeeSkills) {

            String skillName = employeeSkill.getSkill().getSkillName();

            Competency competency = competencyRepository
                    .findByCompetencyName(skillName)
                    .orElse(null);

            if (competency == null) {
                continue;
            }

            int gap = competency.getExpectedLevel()
                    - employeeSkill.getProficiencyLevel();

            if (gap <= 0) {
                continue;
            }

            List<TrainingCourse> courses =
                    trainingCourseRepository.findBySkillNameIgnoreCase(skillName);

            for (TrainingCourse course : courses) {

                TrainingRecommendationResponse response =
                        new TrainingRecommendationResponse();

                response.setEmployeeName(
                        employeeSkill.getUser().getFirstName() + " "
                                + employeeSkill.getUser().getLastName());

                response.setSkillName(skillName);

                response.setGap(gap);

                response.setCourseName(course.getCourseName());
                response.setProvider(course.getProvider());
                response.setDuration(course.getDuration());

                if (gap >= 3) {
                    response.setPriority("HIGH");
                } else if (gap == 2) {
                    response.setPriority("MEDIUM");
                } else {
                    response.setPriority("LOW");
                }

                responses.add(response);
            }
        }

        return responses;
    }
}