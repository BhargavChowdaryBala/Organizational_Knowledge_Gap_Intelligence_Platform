package com.knowledgegap.dto;

public class BenchmarkResponse {

    private String employeeName;
    private Double employeeAverage;
    private Double departmentAverage;
    private Double companyAverage;
    private String status;

    public BenchmarkResponse() {
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public Double getEmployeeAverage() {
        return employeeAverage;
    }

    public void setEmployeeAverage(Double employeeAverage) {
        this.employeeAverage = employeeAverage;
    }

    public Double getDepartmentAverage() {
        return departmentAverage;
    }

    public void setDepartmentAverage(Double departmentAverage) {
        this.departmentAverage = departmentAverage;
    }

    public Double getCompanyAverage() {
        return companyAverage;
    }

    public void setCompanyAverage(Double companyAverage) {
        this.companyAverage = companyAverage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}