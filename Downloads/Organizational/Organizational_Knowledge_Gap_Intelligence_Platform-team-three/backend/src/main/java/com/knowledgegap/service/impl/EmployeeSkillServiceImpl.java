package com.knowledgegap.service.impl;

import com.knowledgegap.dto.EmployeeSkillRequest;
import com.knowledgegap.entity.EmployeeSkill;
import com.knowledgegap.entity.Skill;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.EmployeeSkillRepository;
import com.knowledgegap.repository.SkillRepository;
import com.knowledgegap.repository.UserRepository;
import com.knowledgegap.service.EmployeeSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeSkillServiceImpl implements EmployeeSkillService {

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
public EmployeeSkill createEmployeeSkill(EmployeeSkillRequest request) {

    System.out.println("===== REQUEST =====");
    System.out.println("UserId = " + request.getUserId());
    System.out.println("SkillId = " + request.getSkillId());

    User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Skill skill = skillRepository.findById(request.getSkillId())
            .orElseThrow(() -> new RuntimeException("Skill not found"));

    System.out.println("User Found = " + user.getUserId());
    System.out.println("Skill Found = " + skill.getSkillId());

    EmployeeSkill employeeSkill = new EmployeeSkill();

    employeeSkill.setUser(user);
    employeeSkill.setSkill(skill);
    employeeSkill.setProficiencyLevel(request.getProficiencyLevel());
    employeeSkill.setExperienceYears(request.getExperienceYears());

    System.out.println("Before Save User = " + employeeSkill.getUser().getUserId());
    System.out.println("Before Save Skill = " + employeeSkill.getSkill().getSkillId());

    EmployeeSkill saved = employeeSkillRepository.save(employeeSkill);

    System.out.println("Saved User = " + saved.getUser());
    System.out.println("Saved Skill = " + saved.getSkill());

    return saved;
}

    @Override
    public List<EmployeeSkill> getAllEmployeeSkills() {
        return employeeSkillRepository.findAll();
    }

    @Override
    public List<EmployeeSkill> getEmployeeSkillsByUser(Integer userId) {
        return employeeSkillRepository.findByUserUserId(userId);
    }

    @Override
    public EmployeeSkill getEmployeeSkillById(Integer id) {
        return employeeSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee Skill not found"));
    }

    @Override
    public EmployeeSkill updateEmployeeSkill(Integer id, EmployeeSkillRequest request) {

        EmployeeSkill employeeSkill = getEmployeeSkillById(id);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        employeeSkill.setUser(user);
        employeeSkill.setSkill(skill);
        employeeSkill.setProficiencyLevel(request.getProficiencyLevel());
        employeeSkill.setExperienceYears(request.getExperienceYears());

        return employeeSkillRepository.save(employeeSkill);
    }

    @Override
    public void deleteEmployeeSkill(Integer id) {
        employeeSkillRepository.deleteById(id);
    }
}