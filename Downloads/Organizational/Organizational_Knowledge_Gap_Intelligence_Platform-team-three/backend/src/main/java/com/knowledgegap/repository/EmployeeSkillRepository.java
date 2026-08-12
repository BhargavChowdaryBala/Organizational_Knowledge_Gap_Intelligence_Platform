package com.knowledgegap.repository;

import com.knowledgegap.entity.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeSkillRepository extends JpaRepository<EmployeeSkill, Integer> {

    List<EmployeeSkill> findByUserUserId(Integer userId);

    @Query("SELECT es.skill.skillName, COUNT(es) FROM EmployeeSkill es GROUP BY es.skill.skillName")
    List<Object[]> getSkillAnalysis();
    @Query("""
SELECT AVG(es.proficiencyLevel)
FROM EmployeeSkill es
WHERE es.user.userId = :userId
""")
Double getEmployeeAverage(Integer userId);

@Query("""
SELECT AVG(es.proficiencyLevel)
FROM EmployeeSkill es
WHERE es.user.department.departmentId =
(
SELECT u.department.departmentId
FROM User u
WHERE u.userId = :userId
)
""")
Double getDepartmentAverage(Integer userId);

@Query("""
SELECT AVG(es.proficiencyLevel)
FROM EmployeeSkill es
""")
Double getCompanyAverage();

}