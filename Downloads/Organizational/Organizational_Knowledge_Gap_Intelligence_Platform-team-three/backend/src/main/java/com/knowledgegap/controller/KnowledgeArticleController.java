package com.knowledgegap.controller;

import com.knowledgegap.entity.KnowledgeArticle;
import com.knowledgegap.service.KnowledgeArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class KnowledgeArticleController {

    @Autowired
    private KnowledgeArticleService service;

    @PostMapping
    public KnowledgeArticle createArticle(@RequestBody KnowledgeArticle article) {
        return service.createArticle(article);
    }

    @GetMapping
    public List<KnowledgeArticle> getAllArticles() {
        return service.getAllArticles();
    }

    @GetMapping("/{id}")
    public KnowledgeArticle getArticle(@PathVariable Integer id) {
        return service.getArticleById(id);
    }

    @PutMapping("/{id}")
    public KnowledgeArticle updateArticle(@PathVariable Integer id,
                                          @RequestBody KnowledgeArticle article) {

        return service.updateArticle(id, article);
    }

    @DeleteMapping("/{id}")
    public String deleteArticle(@PathVariable Integer id) {

        service.deleteArticle(id);

        return "Knowledge Article Deleted Successfully";
    }
}