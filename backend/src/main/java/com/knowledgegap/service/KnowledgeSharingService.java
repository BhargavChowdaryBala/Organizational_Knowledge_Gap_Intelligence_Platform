package com.knowledgegap.service;

import com.knowledgegap.entity.KnowledgeSharing;

import java.util.List;

public interface KnowledgeSharingService {

    KnowledgeSharing createSession(KnowledgeSharing session);

    List<KnowledgeSharing> getAllSessions();

    KnowledgeSharing getSessionById(Integer id);

    List<KnowledgeSharing> getSessionsByMentor(Integer mentorId);

    List<KnowledgeSharing> getSessionsByMentee(Integer menteeId);

    List<KnowledgeSharing> getSessionsBySkill(String skillName);

    List<KnowledgeSharing> getSessionsByStatus(String status);

    KnowledgeSharing updateSession(Integer id, KnowledgeSharing session);

    void deleteSession(Integer id);
}