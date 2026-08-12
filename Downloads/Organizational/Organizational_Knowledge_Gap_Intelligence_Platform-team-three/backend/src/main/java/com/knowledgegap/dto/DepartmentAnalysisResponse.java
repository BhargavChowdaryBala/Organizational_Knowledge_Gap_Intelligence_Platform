package com.knowledgegap.dto;

public class DepartmentAnalysisResponse {

    private String departmentName;
    private Long employeeCount;

    public DepartmentAnalysisResponse() {
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Long employeeCount) {
        this.employeeCount = employeeCount;
    }
}