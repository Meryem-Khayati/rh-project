package ma.ensa.offreemploi_service.services;

import jakarta.transaction.Transactional;
import ma.ensa.offreemploi_service.dto.CompetenceDTO;
import ma.ensa.offreemploi_service.dto.OffreEmploiDetailsDTO;
import ma.ensa.offreemploi_service.dto.RecruteurDTO;
import ma.ensa.offreemploi_service.entities.OffreEmploi;
import ma.ensa.offreemploi_service.feignClient.CandidatureClient;
import ma.ensa.offreemploi_service.feignClient.CompetenceClient;
import ma.ensa.offreemploi_service.feignClient.RecruteurClient;
import ma.ensa.offreemploi_service.repositories.OffreEmploiRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class OffreEmploiService implements OffreEmploiServiceInterface {
    private OffreEmploiRepository offreEmploiRepository;
    private CompetenceClient competenceClient;
    private RecruteurClient recruteurClient;
    private CandidatureClient candidatureClient;

    OffreEmploiService(OffreEmploiRepository offreEmploiRepository,CompetenceClient competenceClient, RecruteurClient recruteurClient,CandidatureClient candidatureClient){
        this.offreEmploiRepository = offreEmploiRepository;
        this.competenceClient = competenceClient;
        this.recruteurClient = recruteurClient;
        this.candidatureClient = candidatureClient;
    }
    @Override
    public List<OffreEmploi> getAllOffres() {
        return offreEmploiRepository.findAll();
    }
    @Override
    public OffreEmploi getOffreById(Long id) {
        return offreEmploiRepository.findById(id).orElse(null);
    }
    @Override
    public OffreEmploi createOffre(OffreEmploi offreEmploi) {
        offreEmploi.setStatut("Active");
        return offreEmploiRepository.save(offreEmploi);
    }

    @Override
    public OffreEmploi updateOffre(Long id, OffreEmploi newoffreEmploi) {
        OffreEmploi offre = offreEmploiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        offre.setTitre(newoffreEmploi.getTitre());
        offre.setDescription(newoffreEmploi.getDescription());
        offre.setLocalisation(newoffreEmploi.getLocalisation());
        offre.setSalaire(newoffreEmploi.getSalaire());
        offre.setDatePublication(LocalDate.now());
        offre.setCompetenceIds(newoffreEmploi.getCompetenceIds());
        offre.setRecruteurId(newoffreEmploi.getRecruteurId());
        offre.setTypeContrat(newoffreEmploi.getTypeContrat());
        offre.setStatut("Active");


        return offreEmploiRepository.save(offre);
    }

    @Override
    public void deleteOffre(Long id) {
        OffreEmploi offre = offreEmploiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        boolean rep = candidatureClient.existsByOffreId(id);
        if (rep) {
            throw new RuntimeException("Impossible de supprimer l'offre : des candidatures y sont associées.");
        }

        offreEmploiRepository.deleteById(id);
    }

    @Override
    public List<OffreEmploi> getAllOffresByRecruteurId(Long id) {
        return offreEmploiRepository.findByRecruteurId(id);
    }

    @Override
    public boolean existOffre(OffreEmploi offreEmploi) {
        return offreEmploiRepository.existsByTitreAndDescription(offreEmploi.getTitre(), offreEmploi.getDescription());
    }

    @Override
    public boolean isCompetenceUsed(Long competenceId) {
        return offreEmploiRepository.existsByCompetenceIdsContaining(competenceId);
    }

    @Override
    public List<String> getCompetenceNamesByOffreId(Long id) {
        OffreEmploi offre = offreEmploiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        List<Long> competenceIds = offre.getCompetenceIds();

        if (competenceIds == null || competenceIds.isEmpty()) {
            return List.of();
        }

        return competenceIds.stream()
                .map(competenceId -> {
                    try {
                        return competenceClient.getCompetenceNomById(competenceId);
                    } catch (Exception e) {
                        return "NOM_INCONNU_" + competenceId;
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    public void desactiverOffre(Long id) {
        OffreEmploi offre = offreEmploiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        offre.setStatut("INACTIVE");
        offreEmploiRepository.save(offre);
    }

    @Override
    public List<OffreEmploiDetailsDTO> getAllOffresWithDetails() {
        List<OffreEmploi> offres = offreEmploiRepository.findAll();

        return offres.stream().map(offre -> {

            // 🔹 Appel auth-service
            RecruteurDTO recruteur =
                    recruteurClient.getRecruteur(offre.getRecruteurId()).getBody();

            // 🔹 Appel competence-service
            List<CompetenceDTO> competences =
                    competenceClient.getCompetences(offre.getCompetenceIds());

            // 🔹 Construction DTO final
            OffreEmploiDetailsDTO dto = new OffreEmploiDetailsDTO();
            dto.setId(offre.getId());
            dto.setTitre(offre.getTitre());
            dto.setDescription(offre.getDescription());
            dto.setLocalisation(offre.getLocalisation());
            dto.setSalaire(offre.getSalaire());
            dto.setDatePublication(offre.getDatePublication());
            dto.setStatut(offre.getStatut());
            dto.setTypeContrat(offre.getTypeContrat());


            dto.setRecruteur(recruteur);
            dto.setCompetences(competences);

            return dto;
        }).toList();
    }



}
