package com.knowledgegap.service.impl;

import com.knowledgegap.entity.KnowledgeSharing;
import com.knowledgegap.repository.KnowledgeSharingRepository;
import com.knowledgegap.service.KnowledgeSharingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KnowledgeSharingServiceImpl implements KnowledgeSharingService {

    private final KnowledgeSharingRepository repository;

    public KnowledgeSharingServiceImpl(KnowledgeSharingRepository repository) {
        this.repository = repository;
    }

    @Override
    public KnowledgeSharing createSession(KnowledgeSharing session) {
        return repository.save(session);
    }

    @Override
    public List<KnowledgeSharing> getAllSessions() {
        return repository.findAll();
    }

    @Override
    public KnowledgeSharing getSessionById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Knowledge Sharing Session not found with ID: " + id));
    }

    @Override
    public List<KnowledgeSharing> getSessionsByMentor(Integer mentorId) {
        return repository.findByMentorId(mentorId);
    }

    @Override
    public List<KnowledgeSharing> getSessionsByMentee(Integer menteeId) {
        return repository.findByMenteeId(menteeId);
    }

    @Override
    public List<KnowledgeSharing> getSessionsBySkill(String skillName) {
        return repository.findBySkillName(skillName);
    }

    @Override
    public List<KnowledgeSharing> getSessionsByStatus(String status) {
        return repository.findByStatus(status);
    }

    @Override
    public KnowledgeSharing updateSession(Integer id, KnowledgeSharing session) {

        KnowledgeSharing existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Knowledge Sharing Session not found with ID: " + id));

        existing.setMentorId(session.getMentorId());
        existing.setMenteeId(session.getMenteeId());
        existing.setSkillName(session.getSkillName());
        existing.setSessionTitle(session.getSessionTitle());
        existing.setDescription(session.getDescription());
        existing.setSessionDate(session.getSessionDate());
        existing.setSessionTime(session.getSessionTime());
        existing.setMeetingLink(session.getMeetingLink());
        existing.setStatus(session.getStatus());

        return repository.save(existing);
    }

    @Override
    public void deleteSession(Integer id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Knowledge Sharing Session not found with ID: " + id);
        }

        repository.deleteById(id);
    }
}