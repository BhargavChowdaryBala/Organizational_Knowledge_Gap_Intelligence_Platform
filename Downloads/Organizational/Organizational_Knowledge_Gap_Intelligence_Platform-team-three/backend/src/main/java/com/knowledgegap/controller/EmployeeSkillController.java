package com.knowledgegap.controller;

import com.knowledgegap.dto.EmployeeSkillRequest;
import com.knowledgegap.entity.EmployeeSkill;
import com.knowledgegap.service.EmployeeSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-skills")
@CrossOrigin(origins = "*")
public class EmployeeSkillController {

    @Autowired
    private EmployeeSkillService employeeSkillService;

    @PostMapping
    public EmployeeSkill createEmployeeSkill(@RequestBody EmployeeSkillRequest request) {
        return employeeSkillService.createEmployeeSkill(request);
    }

    @GetMapping
    public List<EmployeeSkill> getAllEmployeeSkills() {
        return employeeSkillService.getAllEmployeeSkills();
    }

    @GetMapping("/{id}")
    public EmployeeSkill getEmployeeSkillById(@PathVariable Integer id) {
        return employeeSkillService.getEmployeeSkillById(id);
    }

    @GetMapping("/user/{userId}")
    public List<EmployeeSkill> getEmployeeSkillsByUser(@PathVariable Integer userId) {
        return employeeSkillService.getEmployeeSkillsByUser(userId);
    }

    @PutMapping("/{id}")
    public EmployeeSkill updateEmployeeSkill(@PathVariable Integer id,
                                             @RequestBody EmployeeSkillRequest request) {
        return employeeSkillService.updateEmployeeSkill(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployeeSkill(@PathVariable Integer id) {
        employeeSkillService.deleteEmployeeSkill(id);
    }
}