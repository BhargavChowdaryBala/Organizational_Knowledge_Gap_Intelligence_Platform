package com.knowledgegap.controller;

import com.knowledgegap.entity.LearningProgress;
import com.knowledgegap.service.LearningProgressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-progress")
@CrossOrigin(origins = "*")
public class LearningProgressController {

    private final LearningProgressService service;

    public LearningProgressController(LearningProgressService service) {
        this.service = service;
    }

    @PostMapping
    public LearningProgress create(@RequestBody LearningProgress progress) {
        return service.createLearningProgress(progress);
    }

    @GetMapping
    public List<LearningProgress> getAll() {
        return service.getAllLearningProgress();
    }

    @GetMapping("/{id}")
    public LearningProgress getById(@PathVariable Integer id) {
        return service.getLearningProgressById(id);
    }

    @PutMapping("/{id}")
    public LearningProgress update(@PathVariable Integer id,
                                   @RequestBody LearningProgress progress) {
        return service.updateLearningProgress(id, progress);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.deleteLearningProgress(id);
        return "Deleted Successfully";
    }
}