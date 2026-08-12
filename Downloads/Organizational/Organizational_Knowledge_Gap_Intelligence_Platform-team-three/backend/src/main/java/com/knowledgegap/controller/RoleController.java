package com.knowledgegap.controller;

import com.knowledgegap.dto.RoleRequest;
import com.knowledgegap.dto.RoleResponse;
import com.knowledgegap.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping
    public RoleResponse createRole(@RequestBody RoleRequest request) {
        return roleService.createRole(request);
    }

    @GetMapping
    public List<RoleResponse> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public RoleResponse getRoleById(@PathVariable Integer id) {
        return roleService.getRoleById(id);
    }

    @PutMapping("/{id}")
    public RoleResponse updateRole(@PathVariable Integer id,
                                   @RequestBody RoleRequest request) {
        return roleService.updateRole(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
    }
}