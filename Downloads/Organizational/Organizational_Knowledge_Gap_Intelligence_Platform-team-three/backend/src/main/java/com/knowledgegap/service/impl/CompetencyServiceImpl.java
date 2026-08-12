package com.knowledgegap.service.impl;

import com.knowledgegap.dto.CompetencyRequest;
import com.knowledgegap.entity.Competency;
import com.knowledgegap.repository.CompetencyRepository;
import com.knowledgegap.service.CompetencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompetencyServiceImpl implements CompetencyService {

    @Autowired
    private CompetencyRepository competencyRepository;

    @Override
    public Competency createCompetency(CompetencyRequest request) {

        Competency competency = new Competency();

        competency.setCompetencyName(request.getCompetencyName());
        competency.setDescription(request.getDescription());
        competency.setExpectedLevel(request.getExpectedLevel());

        return competencyRepository.save(competency);
    }

    @Override
    public List<Competency> getAllCompetencies() {
        return competencyRepository.findAll();
    }

    @Override
    public Competency getCompetencyById(Integer id) {
        return competencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Competency Not Found"));
    }

    @Override
    public Competency updateCompetency(Integer id, CompetencyRequest request) {

        Competency competency = getCompetencyById(id);

        competency.setCompetencyName(request.getCompetencyName());
        competency.setDescription(request.getDescription());
        competency.setExpectedLevel(request.getExpectedLevel());

        return competencyRepository.save(competency);
    }

    @Override
    public void deleteCompetency(Integer id) {
        competencyRepository.deleteById(id);
    }
}