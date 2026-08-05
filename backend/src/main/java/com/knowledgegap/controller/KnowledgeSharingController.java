package com.knowledgegap.controller;

import com.knowledgegap.entity.KnowledgeSharing;
import com.knowledgegap.service.KnowledgeSharingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge-sharing")
@CrossOrigin(origins = "*")
public class KnowledgeSharingController {

    private final KnowledgeSharingService service;

    public KnowledgeSharingController(KnowledgeSharingService service) {
        this.service = service;
    }

    // Create Session
    @PostMapping
    public KnowledgeSharing createSession(@RequestBody KnowledgeSharing session) {
        return service.createSession(session);
    }

    // Get All Sessions
    @GetMapping
    public List<KnowledgeSharing> getAllSessions() {
        return service.getAllSessions();
    }

    // Get Session By ID
    @GetMapping("/{id}")
    public KnowledgeSharing getSessionById(@PathVariable Integer id) {
        return service.getSessionById(id);
    }

    // Get Sessions By Mentor
    @GetMapping("/mentor/{mentorId}")
    public List<KnowledgeSharing> getSessionsByMentor(@PathVariable Integer mentorId) {
        return service.getSessionsByMentor(mentorId);
    }

    // Get Sessions By Mentee
    @GetMapping("/mentee/{menteeId}")
    public List<KnowledgeSharing> getSessionsByMentee(@PathVariable Integer menteeId) {
        return service.getSessionsByMentee(menteeId);
    }

    // Get Sessions By Skill
    @GetMapping("/skill/{skillName}")
    public List<KnowledgeSharing> getSessionsBySkill(@PathVariable String skillName) {
        return service.getSessionsBySkill(skillName);
    }

    // Get Sessions By Status
    @GetMapping("/status/{status}")
    public List<KnowledgeSharing> getSessionsByStatus(@PathVariable String status) {
        return service.getSessionsByStatus(status);
    }

    // Update Session
    @PutMapping("/{id}")
    public KnowledgeSharing updateSession(
            @PathVariable Integer id,
            @RequestBody KnowledgeSharing session) {

        return service.updateSession(id, session);
    }

    // Delete Session
    @DeleteMapping("/{id}")
    public String deleteSession(@PathVariable Integer id) {

        service.deleteSession(id);

        return "Knowledge Sharing Session Deleted Successfully";
    }
}