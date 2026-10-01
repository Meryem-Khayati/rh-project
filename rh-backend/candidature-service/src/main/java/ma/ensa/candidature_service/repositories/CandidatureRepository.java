package ma.ensa.candidature_service.repositories;


import ma.ensa.candidature_service.entities.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    // Trouver toutes les candidatures pour une offre d'emploi
    List<Candidature> findByOffreEmploiId(Long offreEmploiId);
    // Trouver toutes les candidatures d'un candidat
    List<Candidature> findByCandidatId(Long candidatId);

    // Trouver par offre et candidat (pour éviter les doublons)
    Candidature findByOffreEmploiIdAndCandidatId(Long offreEmploiId, Long candidatId);

    @Query(value = "SELECT COUNT(*) FROM candidature WHERE offre_emploi_id = :offreId", nativeQuery = true)
    long countByOffreEmploiIdNative(@Param("offreId") Long offreId);

    boolean existsByOffreEmploiId(Long offreEmploiId);
}
