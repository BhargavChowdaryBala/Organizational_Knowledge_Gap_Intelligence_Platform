package com.knowledgegap.config;

import com.knowledgegap.entity.*;
import com.knowledgegap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private CompetencyRepository competencyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private TrainingCourseRepository trainingCourseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeProfileRepository employeeProfileRepository;

    @Autowired
    private KnowledgeSharingRepository knowledgeSharingRepository;

    @Autowired
    private KnowledgeArticleRepository knowledgeArticleRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Roles based on SRS Section 4.1
        String[] srsRoles = {
            "Employee",
            "Team Lead / Manager",
            "HR Specialist",
            "Department Head",
            "Learning & Development Admin",
            "System Administrator"
        };

        // Ensure compliant SRS roles exist in the database
        for (String roleName : srsRoles) {
            if (roleRepository.findByRoleName(roleName).isEmpty()) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
            }
        }

        // Get standard Employee role for fallback mapping
        Role standardEmployeeRole = roleRepository.findByRoleName("Employee").orElse(null);

        // Standardize any users that were previously registered with duplicate role variations
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            if (user.getRole() != null) {
                String name = user.getRole().getRoleName();
                if (name.equalsIgnoreCase("role_employee") || name.equalsIgnoreCase("employee_role") || name.equalsIgnoreCase("employeerole")) {
                    user.setRole(standardEmployeeRole);
                    userRepository.save(user);
                }
            }
        }

        // Clean up legacy roles that are not SRS-compliant
        List<Role> allDbRoles = roleRepository.findAll();
        List<String> compliantRoles = Arrays.asList(srsRoles);
        for (Role dbRole : allDbRoles) {
            if (!compliantRoles.contains(dbRole.getRoleName())) {
                try {
                    // Update any users still referencing this custom/legacy role to the standard Employee role
                    for (User user : allUsers) {
                        if (user.getRole() != null && user.getRole().getRoleId().equals(dbRole.getRoleId())) {
                            user.setRole(standardEmployeeRole);
                            userRepository.save(user);
                        }
                    }
                    roleRepository.delete(dbRole);
                } catch (Exception e) {
                    System.err.println("Could not delete legacy role: " + dbRole.getRoleName() + ". " + e.getMessage());
                }
            }
        }

        // 2. Initialize Departments based on SRS Requirements
        String[][] srsDepartments = {
            {"Engineering", "ENG"},
            {"Product Management", "PROD"},
            {"UI/UX Design", "DESIGN"},
            {"Human Resources", "HR"},
            {"Learning & Development", "L&D"},
            {"Sales & Marketing", "MKT"},
            {"Operations", "OPS"}
        };

        for (String[] deptInfo : srsDepartments) {
            if (departmentRepository.findByDepartmentName(deptInfo[0]).isEmpty()) {
                Department dept = new Department();
                dept.setDepartmentName(deptInfo[0]);
                dept.setDepartmentCode(deptInfo[1]);
                departmentRepository.save(dept);
            }
        }

        // 3. Initialize Skills
        String[][] initialSkills = {
            {"Java", "Backend Development", "Core Java, multithreading, collections, Streams API"},
            {"Spring Boot", "Backend Development", "Spring framework, MVC, REST APIs, JPA/Hibernate, Security"},
            {"Python", "Backend Development / Data Science", "Scripting, pandas, numpy, machine learning libraries"},
            {"React", "Frontend Development", "Virtual DOM, JSX, hooks, state management, components"},
            {"Docker", "DevOps / Infrastructure", "Containerization, Dockerfile, docker-compose, images, volumes"},
            {"Kubernetes", "DevOps / Infrastructure", "Orchestration, pods, services, deployments, helm charts"},
            {"SQL", "Databases", "Relational databases, joins, subqueries, indexes, query optimization"},
            {"System Design", "Architecture & Design", "High-level design, low-level design, scalability, microservices"}
        };

        for (String[] skillInfo : initialSkills) {
            if (skillRepository.findBySkillName(skillInfo[0]).isEmpty()) {
                Skill skill = new Skill();
                skill.setSkillName(skillInfo[0]);
                skill.setCategory(skillInfo[1]);
                skill.setDescription(skillInfo[2]);
                skillRepository.save(skill);
            }
        }

        // 4. Initialize Competencies (Expected Skill Levels for Gap Analysis)
        String[][] expectedCompetencies = {
            {"Java", "Backend developer level", "4"},
            {"Spring Boot", "Enterprise framework level", "4"},
            {"Python", "Data and scripting level", "3"},
            {"React", "Modern frontend web UI level", "4"},
            {"Docker", "Basic containerization level", "3"},
            {"Kubernetes", "Clustered deployment level", "3"},
            {"SQL", "Relational querying level", "3"},
            {"System Design", "Distributed architectural design level", "4"}
        };

        for (String[] compInfo : expectedCompetencies) {
            if (competencyRepository.findByCompetencyName(compInfo[0]).isEmpty()) {
                Competency competency = new Competency();
                competency.setCompetencyName(compInfo[0]);
                competency.setDescription(compInfo[1]);
                competency.setExpectedLevel(Integer.parseInt(compInfo[2]));
                competencyRepository.save(competency);
            }
        }

        // 5. Initialize Seed Test Users
        if (userRepository.findByEmail("admin@knowledgegap.com").isEmpty()) {
            Role employeeRole = roleRepository.findByRoleName("Employee").orElse(null);
            Role managerRole = roleRepository.findByRoleName("Team Lead / Manager").orElse(null);
            Role hrRole = roleRepository.findByRoleName("HR Specialist").orElse(null);
            Role deptHeadRole = roleRepository.findByRoleName("Department Head").orElse(null);
            Role ldAdminRole = roleRepository.findByRoleName("Learning & Development Admin").orElse(null);
            Role sysAdminRole = roleRepository.findByRoleName("System Administrator").orElse(null);

            Department engDept = departmentRepository.findByDepartmentName("Engineering").orElse(null);
            Department prodDept = departmentRepository.findByDepartmentName("Product Management").orElse(null);
            Department designDept = departmentRepository.findByDepartmentName("UI/UX Design").orElse(null);
            Department hrDept = departmentRepository.findByDepartmentName("Human Resources").orElse(null);
            Department ldDept = departmentRepository.findByDepartmentName("Learning & Development").orElse(null);

            // Seed System Admin
            User admin = getOrCreateUser("Admin", "User", "admin@knowledgegap.com", "password123", "1111111111", "Active", sysAdminRole, engDept, "System Administrator", 5, "HQ", "Manages user roles and system-level metadata.");

            // Seed L&D Admin
            User ldAdmin = getOrCreateUser("Robert", "Miller", "ld.admin@knowledgegap.com", "password123", "2222222222", "Active", ldAdminRole, ldDept, "L&D Director", 7, "HQ", "Directs employee learning pathways, training budgets, and skill benchmarking.");

            // Seed HR Specialist
            User hrSpecialist = getOrCreateUser("Grace", "Hopper", "grace.hopper@example.com", "password123", "3333333333", "Active", hrRole, hrDept, "Talent Development Lead", 4, "HQ", "HR specialist coordinating training cohorts and competency gaps.");

            // Seed Department Head
            User deptHead = getOrCreateUser("David", "Miller", "david.miller@example.com", "password123", "4444444444", "Active", deptHeadRole, engDept, "VP of Engineering", 12, "New York", "Overseeing engineering strategy, core backend platforms, and infrastructure.");

            // Seed Managers / Team Leads
            User jane = getOrCreateUser("Jane", "Smith", "jane.smith@example.com", "password123", "9876543210", "Active", managerRole, engDept, "Engineering Lead", 8, "San Francisco", "Expert in Spring Boot and Distributed Systems Architecture.");

            User sarah = getOrCreateUser("Sarah", "Connor", "sarah.connor@example.com", "password123", "6667778888", "Active", managerRole, designDept, "Design Director", 10, "Los Angeles", "Passionate about User Experience, prototyping, and typography.");

            User vikram = getOrCreateUser("Vikram", "Mehta", "vikram.mehta@example.com", "password123", "1239874560", "Active", managerRole, prodDept, "Engineering Manager", 6, "Mumbai", "System design expert, focusing on product growth and user telemetry.");

            // Seed Employees / Experts / Mentors
            User john = getOrCreateUser("John", "Doe", "john.doe@example.com", "password123", "1234567890", "Active", employeeRole, engDept, "Software Engineer", 2, "San Francisco", "Backend developer looking to master Spring Boot and Docker.");

            User bob = getOrCreateUser("Bob", "Johnson", "bob.johnson@example.com", "password123", "5551234567", "Active", employeeRole, prodDept, "Associate Product Manager", 3, "Chicago", "Passionate about user research, SQL query optimization, and product analytics.");

            User arjun = getOrCreateUser("Arjun", "Patel", "arjun.patel@example.com", "password123", "9998887777", "Active", employeeRole, engDept, "Tech Lead", 7, "Mumbai", "React, Node.js, and AWS enthusiast. Happy to mentor in frontend and cloud scaling.");

            User priya = getOrCreateUser("Priya", "Sharma", "priya.sharma@example.com", "password123", "8887776666", "Active", employeeRole, engDept, "Senior Data Scientist", 5, "Bangalore", "Data nerd. Specializes in Python, Machine Learning, and query optimizations.");

            User rohit = getOrCreateUser("Rohit", "Singh", "rohit.singh@example.com", "password123", "7776665555", "Active", employeeRole, engDept, "DevOps Engineer", 4, "Delhi", "Docker, Kubernetes, and CI/CD pipeline automation specialist.");

            User ananya = getOrCreateUser("Ananya", "Iyer", "ananya.iyer@example.com", "password123", "5554443333", "Active", employeeRole, designDept, "UI/UX Designer", 4, "Chennai", "Crafting beautiful, accessible digital products. Expert in Figma and design systems.");

            // 6. Seed Employee Skills (Assessed Skill Proficiency)
            seedEmployeeSkill(john, "Java", 2, 2);          // Gap of 2 (Expected 4)
            seedEmployeeSkill(john, "Spring Boot", 1, 1);   // Gap of 3 (Expected 4) - Critical
            seedEmployeeSkill(john, "Docker", 3, 3);        // Gap of 0 (Expected 3) - Competent

            seedEmployeeSkill(jane, "Java", 4, 5);          // Gap of 0 (Expected 4) - Competent
            seedEmployeeSkill(jane, "Spring Boot", 4, 4);   // Gap of 0 (Expected 4) - Competent
            seedEmployeeSkill(jane, "System Design", 4, 6); // Gap of 0 (Expected 4) - Competent

            seedEmployeeSkill(bob, "Python", 2, 2);         // Gap of 1 (Expected 3)
            seedEmployeeSkill(bob, "React", 1, 1);          // Gap of 3 (Expected 4) - Critical

            seedEmployeeSkill(arjun, "React", 5, 5);
            seedEmployeeSkill(arjun, "System Design", 4, 4);
            seedEmployeeSkill(arjun, "SQL", 4, 3);

            seedEmployeeSkill(priya, "Python", 5, 4);
            seedEmployeeSkill(priya, "SQL", 5, 5);

            seedEmployeeSkill(rohit, "Docker", 5, 4);
            seedEmployeeSkill(rohit, "Kubernetes", 4, 3);

            seedEmployeeSkill(ananya, "System Design", 3, 2);
        }

        // 7. Seed Knowledge Articles / Resources
        if (knowledgeArticleRepository.count() == 0) {
            KnowledgeArticle a1 = new KnowledgeArticle();
            a1.setTitle("React Best Practices 2025");
            a1.setAuthor("Arjun Patel");
            a1.setCategory("React / Frontend");
            a1.setContent("Detailed guide on writing clean hooks, performance optimizations, state virtualization, and code splitting.");
            a1.setCreatedDate("2026-08-01");
            knowledgeArticleRepository.save(a1);

            KnowledgeArticle a2 = new KnowledgeArticle();
            a2.setTitle("SQL Query Optimization Guide");
            a2.setAuthor("Priya Sharma");
            a2.setCategory("SQL / Database");
            a2.setContent("Everything you need to know about execution plans, indexes, partition pruning, and optimizing subqueries.");
            a2.setCreatedDate("2026-08-02");
            knowledgeArticleRepository.save(a2);

            KnowledgeArticle a3 = new KnowledgeArticle();
            a3.setTitle("AWS Well-Architected Framework");
            a3.setAuthor("Rohit Singh");
            a3.setCategory("DevOps / Cloud");
            a3.setContent("An architectural overview of the 6 pillars: operational excellence, security, reliability, performance, cost, and sustainability.");
            a3.setCreatedDate("2026-08-03");
            knowledgeArticleRepository.save(a3);

            KnowledgeArticle a4 = new KnowledgeArticle();
            a4.setTitle("Design System Fundamentals");
            a4.setAuthor("Ananya Iyer");
            a4.setCategory("UI/UX Design");
            a4.setContent("How to create consistent component tokens, accessible color palettes, and reuse layouts in Figma.");
            a4.setCreatedDate("2026-08-04");
            knowledgeArticleRepository.save(a4);
        }

        // 8. Seed Knowledge Sharing Sessions
        if (knowledgeSharingRepository.count() == 0) {
            User arjunUser = userRepository.findByEmail("arjun.patel@example.com").orElse(null);
            User johnUser = userRepository.findByEmail("john.doe@example.com").orElse(null);
            User priyaUser = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
            User rohitUser = userRepository.findByEmail("rohit.singh@example.com").orElse(null);
            User ananyaUser = userRepository.findByEmail("ananya.iyer@example.com").orElse(null);

            if (arjunUser != null && johnUser != null) {
                KnowledgeSharing ks1 = new KnowledgeSharing();
                ks1.setMentorId(arjunUser.getUserId());
                ks1.setMenteeId(johnUser.getUserId());
                ks1.setSkillName("System Design");
                ks1.setSessionTitle("Building Scalable Microservices");
                ks1.setDescription("Deep dive into API gateways, service registry, circuit breakers, and distributed configuration.");
                ks1.setSessionDate("2026-08-10");
                ks1.setSessionTime("04:00 PM - 05:00 PM");
                ks1.setMeetingLink("https://meet.google.com/abc-defg-hij");
                ks1.setStatus("Scheduled");
                knowledgeSharingRepository.save(ks1);
            }

            if (priyaUser != null && johnUser != null) {
                KnowledgeSharing ks2 = new KnowledgeSharing();
                ks2.setMentorId(priyaUser.getUserId());
                ks2.setMenteeId(johnUser.getUserId());
                ks2.setSkillName("Python");
                ks2.setSessionTitle("Introduction to Generative AI");
                ks2.setDescription("Overview of LLMs, prompt engineering, fine-tuning, and integrating embeddings into software pipelines.");
                ks2.setSessionDate("2026-08-12");
                ks2.setSessionTime("11:00 AM - 12:00 PM");
                ks2.setMeetingLink("https://meet.google.com/abc-defg-hij");
                ks2.setStatus("Scheduled");
                knowledgeSharingRepository.save(ks2);
            }

            if (rohitUser != null && johnUser != null) {
                KnowledgeSharing ks3 = new KnowledgeSharing();
                ks3.setMentorId(rohitUser.getUserId());
                ks3.setMenteeId(johnUser.getUserId());
                ks3.setSkillName("Kubernetes");
                ks3.setSessionTitle("Kubernetes Best Practices");
                ks3.setDescription("Secrets management, pod security standards, resource limits, and ingress controller routing.");
                ks3.setSessionDate("2026-08-14");
                ks3.setSessionTime("03:00 PM - 04:00 PM");
                ks3.setMeetingLink("https://meet.google.com/abc-defg-hij");
                ks3.setStatus("Scheduled");
                knowledgeSharingRepository.save(ks3);
            }

            if (ananyaUser != null && johnUser != null) {
                KnowledgeSharing ks4 = new KnowledgeSharing();
                ks4.setMentorId(ananyaUser.getUserId());
                ks4.setMenteeId(johnUser.getUserId());
                ks4.setSkillName("React");
                ks4.setSessionTitle("Design Systems with Figma");
                ks4.setDescription("How to map design system variables in Figma to React component tailwind configuration.");
                ks4.setSessionDate("2026-08-16");
                ks4.setSessionTime("05:00 PM - 06:00 PM");
                ks4.setMeetingLink("https://meet.google.com/abc-defg-hij");
                ks4.setStatus("Scheduled");
                knowledgeSharingRepository.save(ks4);
            }
        }

        // 7. Seed Training Courses for Recommendations
        if (trainingCourseRepository.count() == 0) {
            String[][] courses = {
                {"Java", "Java Programming Masterclass", "Udemy", "80 hours", "Beginner-Advanced", "https://www.udemy.com/course/java-the-complete-java-developer-course/"},
                {"Java", "Java In-Depth: Become a Complete Java Engineer", "Udemy", "34 hours", "Intermediate", "https://www.udemy.com/course/java-in-depth-become-a-complete-java-engineer/"},
                {"Java", "Java Certification Training Course", "Simplilearn", "40 hours", "Intermediate", "https://www.simplilearn.com/java-certification-training-course"},
                {"Spring Boot", "Spring Boot Microservices and Spring Cloud", "Udemy", "22 hours", "Advanced", "https://www.udemy.com/course/microservices-with-spring-boot-and-spring-cloud/"},
                {"Spring Boot", "Spring Framework 6 & Spring Boot 3", "Udemy", "45 hours", "Beginner-Advanced", "https://www.udemy.com/course/spring-hibernate-tutorial/"},
                {"Spring Boot", "Building Microservices with Spring Boot", "Coursera", "12 hours", "Advanced", "https://www.coursera.org/learn/building-microservices-spring-boot"},
                {"SQL", "The Complete SQL Bootcamp: Go from Zero to Hero", "Udemy", "9 hours", "Beginner", "https://www.udemy.com/course/the-complete-sql-bootcamp/"},
                {"SQL", "SQL for Data Science", "Coursera", "14 hours", "Beginner", "https://www.coursera.org/learn/sql-for-data-science"},
                {"SQL", "Advanced SQL for Query Tuning and Performance", "LinkedIn Learning", "3 hours", "Advanced", "https://www.linkedin.com/learning/advanced-sql-for-query-tuning-and-performance"},
                {"React", "React - The Complete Guide (incl Hooks, React Router, Redux)", "Udemy", "48 hours", "Beginner-Advanced", "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"},
                {"React", "Modern React with Redux", "Udemy", "38 hours", "Beginner", "https://www.udemy.com/course/react-redux/"},
                {"React", "Advanced React", "Coursera", "26 hours", "Advanced", "https://www.coursera.org/learn/advanced-react"},
                {"System Design", "Pragmatic System Design", "Udemy", "12 hours", "Advanced", "https://www.udemy.com/course/pragmatic-system-design/"},
                {"System Design", "System Design Interview - An Insider's Guide", "ByteByteGo", "20 hours", "Advanced", "https://bytebytego.com/"},
                {"System Design", "Software Architecture & System Design", "LinkedIn Learning", "5 hours", "Advanced", "https://www.linkedin.com/learning/software-architecture-and-system-design"},
                {"Python", "Complete Python Bootcamp From Zero to Hero in Python", "Udemy", "22 hours", "Beginner", "https://www.udemy.com/course/complete-python-bootcamp/"},
                {"Python", "Python for Data Science and Machine Learning", "Udemy", "25 hours", "Intermediate", "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/"},
                {"Docker", "Docker and Kubernetes: The Complete Guide", "Udemy", "22 hours", "Intermediate-Advanced", "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/"},
                {"Kubernetes", "Kubernetes Certified Application Developer (CKAD)", "Udemy", "15 hours", "Advanced", "https://www.udemy.com/course/certified-kubernetes-application-developer/"}
            };

            for (String[] courseInfo : courses) {
                TrainingCourse course = new TrainingCourse();
                course.setSkillName(courseInfo[0]);
                course.setCourseName(courseInfo[1]);
                course.setProvider(courseInfo[2]);
                course.setDuration(courseInfo[3]);
                course.setLevel(courseInfo[4]);
                course.setCourseUrl(courseInfo[5]);
                trainingCourseRepository.save(course);
            }
        }
    }

    private User getOrCreateUser(String firstName, String lastName, String email, String password, String phone, String status, Role role, Department department, String designation, int experience, String location, String bio) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User user = existing.get();
            seedEmployeeProfile(user, designation, experience, location, bio);
            return user;
        }
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setStatus(status);
        user.setRole(role);
        user.setDepartment(department);
        User savedUser = userRepository.save(user);
        seedEmployeeProfile(savedUser, designation, experience, location, bio);
        return savedUser;
    }

    private void seedEmployeeSkill(User user, String skillName, int proficiency, int experience) {
        Optional<Skill> skillOpt = skillRepository.findBySkillName(skillName);
        if (skillOpt.isPresent()) {
            Skill skill = skillOpt.get();
            List<EmployeeSkill> existingSkills = employeeSkillRepository.findByUserUserId(user.getUserId());
            boolean alreadyHas = existingSkills.stream().anyMatch(es -> es.getSkill().getSkillId().equals(skill.getSkillId()));
            if (alreadyHas) {
                return;
            }
            EmployeeSkill employeeSkill = new EmployeeSkill();
            employeeSkill.setUser(user);
            employeeSkill.setSkill(skill);
            employeeSkill.setProficiencyLevel(proficiency);
            employeeSkill.setExperienceYears(experience);
            employeeSkill.setEmployeeSkillId(null); // autogenerated
            employeeSkillRepository.save(employeeSkill);
        }
    }

    private void seedEmployeeProfile(User user, String designation, Integer experience, String location, String bio) {
        if (user.getUserId() != null && employeeProfileRepository.findByUserUserId(user.getUserId()).isPresent()) {
            return;
        }
        EmployeeProfile profile = new EmployeeProfile();
        profile.setUser(user);
        profile.setDesignation(designation);
        profile.setExperience(experience);
        profile.setLocation(location);
        profile.setJoiningDate(java.time.LocalDate.now().minusYears(experience));
        profile.setBio(bio);
        employeeProfileRepository.save(profile);
    }
}
