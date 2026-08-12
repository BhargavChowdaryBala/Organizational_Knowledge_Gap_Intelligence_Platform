package com.knowledgegap.repository;

import com.knowledgegap.entity.Assessment;
import com.knowledgegap.entity.AssessmentAnswer;
import com.knowledgegap.entity.Question;
import com.knowledgegap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, Integer> {

    List<AssessmentAnswer> findByUser(User user);

    List<AssessmentAnswer> findByQuestion(Question question);

    List<AssessmentAnswer> findByAssessment(Assessment assessment);

    List<AssessmentAnswer> findByUserAndAssessment(User user,
                                                   Assessment assessment);

}