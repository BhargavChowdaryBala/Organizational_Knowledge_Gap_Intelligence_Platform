package com.knowledgegap.controller;

import com.knowledgegap.dto.SkillRequest;
import com.knowledgegap.entity.Skill;
import com.knowledgegap.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping
    public Skill createSkill(@RequestBody SkillRequest request) {
        return skillService.createSkill(request);
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Integer id) {
        return skillService.getSkillById(id);
    }

    @PutMapping("/{id}")
    public Skill updateSkill(@PathVariable Integer id,
                             @RequestBody SkillRequest request) {
        return skillService.updateSkill(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Integer id) {
        skillService.deleteSkill(id);
    }
}