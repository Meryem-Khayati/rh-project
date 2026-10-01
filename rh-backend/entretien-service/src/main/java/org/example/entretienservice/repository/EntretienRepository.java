package org.example.entretienservice.repository;

import org.example.entretienservice.entities.Entretien;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntretienRepository extends JpaRepository<Entretien,Long> {
    List<Entretien> findByCandidatureId(Long candidatureId);
    List<Entretien> findByType(String type);

}
