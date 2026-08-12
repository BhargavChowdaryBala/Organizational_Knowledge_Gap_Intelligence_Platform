package com.knowledgegap.service.impl;

import com.knowledgegap.dto.DepartmentRequest;
import com.knowledgegap.dto.DepartmentResponse;
import com.knowledgegap.entity.Department;
import com.knowledgegap.repository.DepartmentRepository;
import com.knowledgegap.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {

        Department department = new Department();

        department.setDepartmentName(request.getDepartmentName());
        department.setDepartmentCode(request.getDepartmentCode());
        department.setManagerId(request.getManagerId());

        Department savedDepartment = departmentRepository.save(department);

        return mapToResponse(savedDepartment);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse getDepartmentById(Integer id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        return mapToResponse(department);
    }

    @Override
    public DepartmentResponse updateDepartment(Integer id, DepartmentRequest request) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setDepartmentName(request.getDepartmentName());
        department.setDepartmentCode(request.getDepartmentCode());
        department.setManagerId(request.getManagerId());

        Department updatedDepartment = departmentRepository.save(department);

        return mapToResponse(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Integer id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        departmentRepository.delete(department);
    }

    private DepartmentResponse mapToResponse(Department department) {

        DepartmentResponse response = new DepartmentResponse();

        response.setDepartmentId(department.getDepartmentId());
        response.setDepartmentName(department.getDepartmentName());
        response.setDepartmentCode(department.getDepartmentCode());
        response.setManagerId(department.getManagerId());

        return response;
    }
}