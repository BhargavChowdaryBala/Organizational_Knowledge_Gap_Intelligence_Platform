package com.knowledgegap.repository;

import com.knowledgegap.entity.KnowledgeSharing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeSharingRepository extends JpaRepository<KnowledgeSharing, Integer> {

    List<KnowledgeSharing> findByMentorId(Integer mentorId);

    List<KnowledgeSharing> findByMenteeId(Integer menteeId);

    List<KnowledgeSharing> findBySkillName(String skillName);

    List<KnowledgeSharing> findByStatus(String status);

}