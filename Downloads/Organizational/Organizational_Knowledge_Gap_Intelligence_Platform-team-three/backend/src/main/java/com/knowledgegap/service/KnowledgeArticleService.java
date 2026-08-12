package com.knowledgegap.service;

import com.knowledgegap.entity.KnowledgeArticle;

import java.util.List;

public interface KnowledgeArticleService {

    KnowledgeArticle createArticle(KnowledgeArticle article);

    List<KnowledgeArticle> getAllArticles();

    KnowledgeArticle getArticleById(Integer id);

    KnowledgeArticle updateArticle(Integer id, KnowledgeArticle article);

    void deleteArticle(Integer id);
}