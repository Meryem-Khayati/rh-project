package ma.ensa.candidature_service.services;

import ma.ensa.candidature_service.dto.CandidatureAvecCandidatDTO;
import ma.ensa.candidature_service.dto.CandidatureDetailDto;
import ma.ensa.candidature_service.dto.OffreStatistiqueDto;
import ma.ensa.candidature_service.entities.Candidature;

import java.util.List;

public interface CandidatureServiceInterface {
    Candidature getCandidatureById(Long id);
     List<Candidature> getAllCandidatures();
    Candidature createCandidature(Candidature candidature);
    Candidature updateCandidature(Long id, Candidature updatedCandidature);
    public List<Candidature> getCandidaturesByOffreEmploiId(Long offreEmploiId);
    public List<Candidature> getCandidaturesByCandidatId(Long candidatId);
     void deleteCandidature(Long id);
     String calculateScoreFromCv(Long offreId, Long candidatId);
    void accepterCandidature(Long candidatureId, String emailCandidat, String sujet, String message);
    void refuserCandidature(Long candidatureId, String emailCandidat, String sujet, String message);
    List<CandidatureDetailDto> getCandidatureDetailsByCandidatId(Long candidatId);
    List<CandidatureAvecCandidatDTO> getCandidatureWithCandidatByOffreId(Long offreId);
    List<OffreStatistiqueDto> getOffresWithCandidatureCount(Long recruteurId) ;
    boolean existsByOffreId(Long offreId);


    }
