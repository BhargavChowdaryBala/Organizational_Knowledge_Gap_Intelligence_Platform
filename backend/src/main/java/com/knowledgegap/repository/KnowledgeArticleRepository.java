package com.knowledgegap.repository;

import com.knowledgegap.entity.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle,Integer> {

}