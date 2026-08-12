package com.knowledgegap.service.impl;

import com.knowledgegap.dto.BenchmarkResponse;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.EmployeeSkillRepository;
import com.knowledgegap.repository.UserRepository;
import com.knowledgegap.service.BenchmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BenchmarkServiceImpl implements BenchmarkService {

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public BenchmarkResponse getBenchmark(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double employeeAverage = employeeSkillRepository.getEmployeeAverage(userId);
        Double departmentAverage = employeeSkillRepository.getDepartmentAverage(userId);
        Double companyAverage = employeeSkillRepository.getCompanyAverage();

        if (employeeAverage == null) employeeAverage = 0.0;
        if (departmentAverage == null) departmentAverage = 0.0;
        if (companyAverage == null) companyAverage = 0.0;

        BenchmarkResponse response = new BenchmarkResponse();

        response.setEmployeeName(
                user.getFirstName() + " " + user.getLastName());

        response.setEmployeeAverage(employeeAverage);
        response.setDepartmentAverage(departmentAverage);
        response.setCompanyAverage(companyAverage);

        if (employeeAverage > companyAverage) {
            response.setStatus("Above Company Average");
        } else if (employeeAverage.equals(companyAverage)) {
            response.setStatus("Company Average");
        } else {
            response.setStatus("Below Company Average");
        }

        return response;
    }
}