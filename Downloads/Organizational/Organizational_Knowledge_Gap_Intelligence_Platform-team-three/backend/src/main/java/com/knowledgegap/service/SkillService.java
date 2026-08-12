package com.knowledgegap.service;

import com.knowledgegap.dto.SkillRequest;
import com.knowledgegap.entity.Skill;

import java.util.List;

public interface SkillService {

    Skill createSkill(SkillRequest request);

    List<Skill> getAllSkills();

    Skill getSkillById(Integer id);

    Skill updateSkill(Integer id, SkillRequest request);

    void deleteSkill(Integer id);
}