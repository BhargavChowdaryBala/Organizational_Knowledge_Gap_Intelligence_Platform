package com.knowledgegap.controller;

import com.knowledgegap.dto.CompetencyRequest;
import com.knowledgegap.entity.Competency;
import com.knowledgegap.service.CompetencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competencies")
@CrossOrigin(origins="*")
public class CompetencyController {

    @Autowired
    private CompetencyService competencyService;

    @PostMapping
    public Competency createCompetency(@RequestBody CompetencyRequest request){
        return competencyService.createCompetency(request);
    }

    @GetMapping
    public List<Competency> getAllCompetencies(){
        return competencyService.getAllCompetencies();
    }

    @GetMapping("/{id}")
    public Competency getCompetencyById(@PathVariable Integer id){
        return competencyService.getCompetencyById(id);
    }

    @PutMapping("/{id}")
    public Competency updateCompetency(@PathVariable Integer id,
                                       @RequestBody CompetencyRequest request){
        return competencyService.updateCompetency(id,request);
    }

    @DeleteMapping("/{id}")
    public void deleteCompetency(@PathVariable Integer id){
        competencyService.deleteCompetency(id);
    }
}