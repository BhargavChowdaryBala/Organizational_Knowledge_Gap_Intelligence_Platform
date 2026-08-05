package com.knowledgegap.service.impl;

import com.knowledgegap.entity.KnowledgeArticle;
import com.knowledgegap.repository.KnowledgeArticleRepository;
import com.knowledgegap.service.KnowledgeArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KnowledgeArticleServiceImpl implements KnowledgeArticleService {

    @Autowired
    private KnowledgeArticleRepository repository;

    @Override
    public KnowledgeArticle createArticle(KnowledgeArticle article) {
        return repository.save(article);
    }

    @Override
    public List<KnowledgeArticle> getAllArticles() {
        return repository.findAll();
    }

    @Override
    public KnowledgeArticle getArticleById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article Not Found"));
    }

    @Override
    public KnowledgeArticle updateArticle(Integer id, KnowledgeArticle article) {

        KnowledgeArticle existing = getArticleById(id);

        existing.setTitle(article.getTitle());
        existing.setContent(article.getContent());
        existing.setCategory(article.getCategory());
        existing.setAuthor(article.getAuthor());
        existing.setCreatedDate(article.getCreatedDate());

        return repository.save(existing);
    }

    @Override
    public void deleteArticle(Integer id) {
        repository.deleteById(id);
    }
}