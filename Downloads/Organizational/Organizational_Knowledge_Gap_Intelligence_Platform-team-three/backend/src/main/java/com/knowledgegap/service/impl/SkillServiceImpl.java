package com.knowledgegap.service.impl;

import com.knowledgegap.dto.SkillRequest;
import com.knowledgegap.entity.Skill;
import com.knowledgegap.repository.SkillRepository;
import com.knowledgegap.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public Skill createSkill(SkillRequest request) {

        if (skillRepository.findBySkillName(request.getSkillName()).isPresent()) {
            throw new RuntimeException("Skill already exists");
        }

        Skill skill = new Skill();
        skill.setSkillName(request.getSkillName());
        skill.setCategory(request.getCategory());
        skill.setDescription(request.getDescription());

        return skillRepository.save(skill);
    }

    @Override
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Override
    public Skill getSkillById(Integer id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    @Override
    public Skill updateSkill(Integer id, SkillRequest request) {

        Skill skill = getSkillById(id);

        skill.setSkillName(request.getSkillName());
        skill.setCategory(request.getCategory());
        skill.setDescription(request.getDescription());

        return skillRepository.save(skill);
    }

    @Override
    public void deleteSkill(Integer id) {

        Skill skill = getSkillById(id);
        skillRepository.delete(skill);
    }
}