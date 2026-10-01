package ma.ensa.competence_service.repositories;

import ma.ensa.competence_service.entities.Competence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {
    boolean existsByNomAndNiveau(String nom, String niveau);
    List<Competence> findByIdIn(List<Long> ids);

}
