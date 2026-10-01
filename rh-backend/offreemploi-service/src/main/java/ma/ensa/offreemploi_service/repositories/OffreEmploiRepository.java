package ma.ensa.offreemploi_service.repositories;

import ma.ensa.offreemploi_service.entities.OffreEmploi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffreEmploiRepository extends JpaRepository<OffreEmploi, Long> {
    boolean existsByTitreAndDescription(String titre, String description);
    List<OffreEmploi> findByRecruteurId(Long id);



    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM OffreEmploi o WHERE :competenceId MEMBER OF o.competenceIds")
    boolean existsByCompetenceIdsContaining(@Param("competenceId") Long competenceId);
}
