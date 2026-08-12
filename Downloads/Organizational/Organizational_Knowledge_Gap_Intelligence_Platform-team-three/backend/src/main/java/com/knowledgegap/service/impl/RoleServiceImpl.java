package com.knowledgegap.service.impl;

import com.knowledgegap.dto.RoleRequest;
import com.knowledgegap.dto.RoleResponse;
import com.knowledgegap.entity.Role;
import com.knowledgegap.repository.RoleRepository;
import com.knowledgegap.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public RoleResponse createRole(RoleRequest request) {

        Role role = new Role();
        role.setRoleName(request.getRoleName());

        Role savedRole = roleRepository.save(role);

        return mapToResponse(savedRole);
    }

    @Override
    public List<RoleResponse> getAllRoles() {

        return roleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse getRoleById(Integer id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        return mapToResponse(role);
    }

    @Override
    public RoleResponse updateRole(Integer id, RoleRequest request) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        role.setRoleName(request.getRoleName());

        Role updatedRole = roleRepository.save(role);

        return mapToResponse(updatedRole);
    }

    @Override
    public void deleteRole(Integer id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        roleRepository.delete(role);
    }

    private RoleResponse mapToResponse(Role role) {

        RoleResponse response = new RoleResponse();

        response.setRoleId(role.getRoleId());
        response.setRoleName(role.getRoleName());

        return response;
    }
}