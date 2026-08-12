package com.knowledgegap.service;

import com.knowledgegap.dto.RoleRequest;
import com.knowledgegap.dto.RoleResponse;

import java.util.List;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    List<RoleResponse> getAllRoles();

    RoleResponse getRoleById(Integer id);

    RoleResponse updateRole(Integer id, RoleRequest request);

    void deleteRole(Integer id);
}