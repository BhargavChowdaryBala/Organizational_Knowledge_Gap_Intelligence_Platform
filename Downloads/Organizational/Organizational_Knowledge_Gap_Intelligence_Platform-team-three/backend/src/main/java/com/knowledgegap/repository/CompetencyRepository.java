package com.knowledgegap.repository;

import com.knowledgegap.entity.Competency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompetencyRepository extends JpaRepository<Competency, Integer> {

    Optional<Competency> findByCompetencyName(String competencyName);

}