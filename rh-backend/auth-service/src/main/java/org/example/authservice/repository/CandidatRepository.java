package org.example.authservice.repository;

import org.example.authservice.model.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidatRepository extends JpaRepository<Candidat,Long> {
}
