package ma.ensa.competence_service.services;

import ma.ensa.competence_service.entities.Competence;

import java.util.List;

public interface CompetenceServiceInterface {
    List<Competence> getAllCompetence();
    Competence getCompetanceById(Long id);
    boolean existCompetence(Competence competence);
    Competence createCompetence(Competence competence);
    Competence updateCompetence(Long id , Competence newcompetence);
    void deleteCompetence(Long id);
    String getCompetenceNomById(Long id);
    List<Competence> getCompetencesByIds(List<Long> ids);



    }
