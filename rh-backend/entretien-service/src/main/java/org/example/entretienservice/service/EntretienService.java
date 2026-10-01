package org.example.entretienservice.service;

import feign.FeignException;
import org.example.entretienservice.dto.CandidatureDto;
import org.example.entretienservice.entities.Entretien;
import org.example.entretienservice.feignclient.CandidatureClient;
import org.example.entretienservice.repository.EntretienRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntretienService {
    private final EntretienRepository entretienRepository;
    private final CandidatureClient candidatureClient;

    public EntretienService(EntretienRepository entretienRepository, CandidatureClient candidatureClient) {
        this.entretienRepository = entretienRepository;
        this.candidatureClient = candidatureClient;
    }

    public Entretien creerEntretien(Entretien entretien) {
        try {
            // 1. Vérifier que la candidature existe
            CandidatureDto candidature = candidatureClient.getCandidatureById(entretien.getCandidatureId());

            if (candidature == null) {
                throw new RuntimeException("La candidature avec l'ID " + entretien.getCandidatureId() + " n'existe pas");
            }

            // 2. Vérifier le statut de la candidature (optionnel mais recommandé)
//            if (!"ACCEPTEE".equalsIgnoreCase(candidature.getStatut())) {
//                throw new RuntimeException("Impossible de créer un entretien pour une candidature avec statut : " +
//                        candidature.getStatut() + ". La candidature doit être acceptée.");
//            }

            // 3. Sauvegarder l'entretien
            return entretienRepository.save(entretien);

        } catch (FeignException.NotFound e) {
            throw new RuntimeException("La candidature avec l'ID " + entretien.getCandidatureId() + " n'existe pas", e);
        } catch (FeignException e) {
            throw new RuntimeException("Erreur lors de la vérification de la candidature : " + e.getMessage(), e);
        }
    }
    public List<Entretien> getEntretiensParCandidature(Long candidatureId) {
        return entretienRepository.findByCandidatureId(candidatureId);
    }

    public Entretien modifierEntretien(Long id, Entretien newData) {
        Entretien entretien = entretienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entretien introuvable"));

        entretien.setDate(newData.getDate());
        entretien.setType(newData.getType());
        entretien.setEvaluation(newData.getEvaluation());

        return entretienRepository.save(entretien);
    }

    public void supprimerEntretien(Long id) {
        if (!entretienRepository.existsById(id)) {
            throw new RuntimeException("Entretien introuvable");
        }
        entretienRepository.deleteById(id);
    }

    public List<Entretien> getTousLesEntretiens() {
        return entretienRepository.findAll();
    }


    public List<Entretien> getEntretiensParType(String type) {
        return entretienRepository.findByType(type);
    }
    public Entretien getById(Long id){
        return  entretienRepository.findById(id).orElse(null);
    }

}
