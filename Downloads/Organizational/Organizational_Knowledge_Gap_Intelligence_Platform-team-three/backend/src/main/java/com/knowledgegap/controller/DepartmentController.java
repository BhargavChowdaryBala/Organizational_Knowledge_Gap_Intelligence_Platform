package com.knowledgegap.controller;

import com.knowledgegap.dto.DepartmentRequest;
import com.knowledgegap.dto.DepartmentResponse;
import com.knowledgegap.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    public DepartmentResponse createDepartment(@RequestBody DepartmentRequest request) {

        System.out.println("POST API HIT");

        return departmentService.createDepartment(request);
    }

    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {

        System.out.println("GET ALL DEPARTMENTS API HIT");

        return departmentService.getAllDepartments();
    }

    @GetMapping("/{id}")
    public DepartmentResponse getDepartmentById(@PathVariable Integer id) {

        System.out.println("GET DEPARTMENT BY ID API HIT");

        return departmentService.getDepartmentById(id);
    }

    @PutMapping("/{id}")
    public DepartmentResponse updateDepartment(@PathVariable Integer id,
                                               @RequestBody DepartmentRequest request) {

        System.out.println("UPDATE DEPARTMENT API HIT");

        return departmentService.updateDepartment(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable Integer id) {

        System.out.println("DELETE DEPARTMENT API HIT");

        departmentService.deleteDepartment(id);

        System.out.println("DEPARTMENT DELETED SUCCESSFULLY");
    }
}