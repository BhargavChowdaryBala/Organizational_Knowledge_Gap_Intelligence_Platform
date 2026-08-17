package com.knowledgegap.service.impl;

import com.knowledgegap.dto.AuthResponse;
import com.knowledgegap.dto.LoginRequest;
import com.knowledgegap.dto.RegisterRequest;
import com.knowledgegap.dto.OtpLoginRequest;
import com.knowledgegap.dto.ResetPasswordRequest;
import com.knowledgegap.dto.GoogleLoginRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.knowledgegap.entity.Department;
import com.knowledgegap.entity.Role;
import com.knowledgegap.entity.User;
import com.knowledgegap.repository.DepartmentRepository;
import com.knowledgegap.repository.RoleRepository;
import com.knowledgegap.repository.UserRepository;
import com.knowledgegap.security.JwtUtil;
import com.knowledgegap.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthResponse(null, "Email already exists", null, null);
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setStatus("ACTIVE");

        // Assign/Create Role dynamically
        String roleName = request.getRoleName();
        if (roleName == null || roleName.trim().isEmpty()) {
            roleName = "EMPLOYEE";
        }
        final String finalRoleName = roleName.trim();
        Role assignedRole = roleRepository.findByRoleName(finalRoleName)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRoleName(finalRoleName);
                    return roleRepository.save(newRole);
                });
        user.setRole(assignedRole);

        // Assign/Create Department dynamically
        String deptName = request.getDepartmentName();
        if (deptName != null && !deptName.trim().isEmpty()) {
            final String finalDeptName = deptName.trim();
            Department assignedDept = departmentRepository.findByDepartmentName(finalDeptName)
                    .orElseGet(() -> {
                        Department newDept = new Department();
                        newDept.setDepartmentName(finalDeptName);
                        String deptCode = finalDeptName.length() >= 3
                                ? finalDeptName.substring(0, 3).toUpperCase()
                                : finalDeptName.toUpperCase();
                        newDept.setDepartmentCode(deptCode);
                        return departmentRepository.save(newDept);
                    });
            user.setDepartment(assignedDept);
        }

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());


        return new AuthResponse(
                token,
                "Registration Successful",
                user.getFirstName(),
                user.getEmail(),
                user.getUserId()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Login Successful",
                user.getFirstName(),
                user.getEmail(),
                user.getUserId()
        );
    }

    @Override
    public AuthResponse otpLogin(OtpLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "OTP Login Successful",
                user.getFirstName(),
                user.getEmail(),
                user.getUserId()
        );
    }

    @Override
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Password Reset Successful",
                user.getFirstName(),
                user.getEmail(),
                user.getUserId()
        );
    }

    @Override
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No account found with this Google email. Please register first."
                ));

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Google Login Successful",
                user.getFirstName(),
                user.getEmail(),
                user.getUserId()
        );
    }
}