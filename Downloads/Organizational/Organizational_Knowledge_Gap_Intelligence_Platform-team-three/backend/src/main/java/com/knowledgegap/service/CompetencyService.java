package com.knowledgegap.service;

import com.knowledgegap.dto.CompetencyRequest;
import com.knowledgegap.entity.Competency;

import java.util.List;

public interface CompetencyService {

    Competency createCompetency(CompetencyRequest request);

    List<Competency> getAllCompetencies();

    Competency getCompetencyById(Integer id);

    Competency updateCompetency(Integer id, CompetencyRequest request);

    void deleteCompetency(Integer id);
}