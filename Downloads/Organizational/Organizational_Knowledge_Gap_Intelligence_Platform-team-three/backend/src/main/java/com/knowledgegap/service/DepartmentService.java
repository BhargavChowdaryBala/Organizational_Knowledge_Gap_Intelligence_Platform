package com.knowledgegap.service;

import com.knowledgegap.dto.DepartmentRequest;
import com.knowledgegap.dto.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse createDepartment(DepartmentRequest request);

    List<DepartmentResponse> getAllDepartments();

    DepartmentResponse getDepartmentById(Integer id);

    DepartmentResponse updateDepartment(Integer id, DepartmentRequest request);

    void deleteDepartment(Integer id);
}