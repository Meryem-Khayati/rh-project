package org.example.authservice.repository;

import org.example.authservice.enumeration.StatutValidation;
import org.example.authservice.model.Recruteur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecruteurRepository extends JpaRepository<Recruteur,Long> {
    List<Recruteur> findByStatutValidation(StatutValidation statutValidation);
}
