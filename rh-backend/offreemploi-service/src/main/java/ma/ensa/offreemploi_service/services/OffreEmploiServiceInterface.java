package ma.ensa.offreemploi_service.services;

import ma.ensa.offreemploi_service.dto.OffreEmploiDetailsDTO;
import ma.ensa.offreemploi_service.entities.OffreEmploi;

import java.util.List;

public interface OffreEmploiServiceInterface {
    OffreEmploi getOffreById(Long id);
    List<OffreEmploi> getAllOffres();
    List<OffreEmploi> getAllOffresByRecruteurId(Long id);
    OffreEmploi createOffre(OffreEmploi offreEmploi);
    OffreEmploi updateOffre(Long id, OffreEmploi dto);

    void deleteOffre(Long id);
    boolean existOffre(OffreEmploi offreEmploi);
    boolean isCompetenceUsed(Long competenceId);
    List<String> getCompetenceNamesByOffreId(Long id);
    void desactiverOffre(Long id );
     List<OffreEmploiDetailsDTO> getAllOffresWithDetails();



    }
