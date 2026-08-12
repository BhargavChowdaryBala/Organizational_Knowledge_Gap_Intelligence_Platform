package com.knowledgegap.service;

import com.knowledgegap.dto.EmployeeSkillRequest;
import com.knowledgegap.entity.EmployeeSkill;

import java.util.List;

public interface EmployeeSkillService {

    EmployeeSkill createEmployeeSkill(EmployeeSkillRequest request);

    List<EmployeeSkill> getAllEmployeeSkills();

    List<EmployeeSkill> getEmployeeSkillsByUser(Integer userId);

    EmployeeSkill getEmployeeSkillById(Integer id);

    EmployeeSkill updateEmployeeSkill(Integer id, EmployeeSkillRequest request);

    void deleteEmployeeSkill(Integer id);
}