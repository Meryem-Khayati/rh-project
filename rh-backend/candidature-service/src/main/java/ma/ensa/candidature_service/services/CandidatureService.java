package ma.ensa.candidature_service.services;

import jakarta.transaction.Transactional;
import ma.ensa.candidature_service.dto.*;
import ma.ensa.candidature_service.entities.Candidature;
import ma.ensa.candidature_service.feignClient.CandidatClient;
import ma.ensa.candidature_service.feignClient.CompetenceClient;
import ma.ensa.candidature_service.repositories.CandidatureRepository;
import ma.ensa.candidature_service.feignClient.CvClient;
import ma.ensa.candidature_service.feignClient.OffreClient;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class CandidatureService implements CandidatureServiceInterface{
    private CandidatureRepository candidatureRepository;
    private OffreClient offreClient;
    private JavaMailSender mailSender;
    private CvClient cvClient;
    private  CandidatClient candidatClient;
    private CompetenceClient competenceClient;

    public CandidatureService(CandidatureRepository candidatureRepository,OffreClient offreClient, CvClient cvClient,CandidatClient candidatClient,CompetenceClient competenceClient, JavaMailSender mailSender) {
        this.candidatureRepository = candidatureRepository;
        this.offreClient = offreClient;
        this.cvClient=cvClient;
        this.candidatClient = candidatClient;
        this.competenceClient = competenceClient;
        this.mailSender = mailSender;
    }

    @Override
    public List<Candidature> getAllCandidatures() {
        return candidatureRepository.findAll();
    }
    @Override
    public Candidature getCandidatureById(Long id) {
        return candidatureRepository.findById(id).orElse(null);
    }
    @Override
    public Candidature createCandidature(Candidature candidature) {
        Candidature existing = candidatureRepository.findByOffreEmploiIdAndCandidatId(
                candidature.getOffreEmploiId(), candidature.getCandidatId());
        if (existing != null) {
            throw new RuntimeException("Candidature déjà soumise pour cette offre");
        }
        String score= this.calculateScoreFromCv(candidature.getOffreEmploiId(),candidature.getCandidatId());
        candidature.setScoreMatching(score);
        candidature.setStatut("en attente");
        return candidatureRepository.save(candidature);
    }
    @Override
    public Candidature updateCandidature(Long id, Candidature newCandidature) {
        Candidature existingCandidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée avec l'ID : " + id));
        existingCandidature.setStatut(newCandidature.getStatut());
        existingCandidature.setDateSoumission(newCandidature.getDateSoumission());
        existingCandidature.setOffreEmploiId(newCandidature.getOffreEmploiId());
        existingCandidature.setCandidatId(newCandidature.getCandidatId());

        String score= this.calculateScoreFromCv(newCandidature.getOffreEmploiId(),newCandidature.getCandidatId());
        existingCandidature.setScoreMatching(score);

        return candidatureRepository.save(existingCandidature);
    }

    @Override
    public List<Candidature> getCandidaturesByOffreEmploiId(Long offreEmploiId) {
        return candidatureRepository.findByOffreEmploiId(offreEmploiId);
    }

    @Override
    public List<Candidature> getCandidaturesByCandidatId(Long candidatId) {
        return candidatureRepository.findByCandidatId(candidatId);
    }
    @Override
    public void deleteCandidature(Long id) {
        if (!candidatureRepository.existsById(id)) {
            throw new RuntimeException("candidature non trouvée avec l'ID : " + id);
        }
        candidatureRepository.deleteById(id);
    }

    @Override
     public String calculateScoreFromCv(Long offreId, Long candidatId) {
        try {
            List<String> competencesOffre = offreClient.getCompetenceNamesByOffreId(offreId);
            CvDTO cv = cvClient.getCVByCandidatId(candidatId);
            String cvText = cv.getTexteExtrait();

            if (competencesOffre == null || competencesOffre.isEmpty()) {
                return "0%";
            }

            if (cvText == null || cvText.trim().isEmpty()) {
                return "0%";
            }

            // Normaliser le texte du CV : en minuscules, supprimer ponctuation
            String normalizedCv = cvText.toLowerCase()
                    .replaceAll("[^a-z0-9\\s]", " "); // garde lettres, chiffres, espaces

            long found = competencesOffre.stream()
                    .map(String::toLowerCase)
                    .filter(competence -> {
                        // Pour gérer les expressions comme "Java Spring"
                        String escaped = "\\b" + Pattern.quote(competence) + "\\b";
                        return Pattern.compile(escaped).matcher(normalizedCv).find();
                    })
                    .count();

            double score = (double) found / competencesOffre.size() * 100;
            return String.format("%.2f%%", score);

        } catch (Exception e) {
            return "N/A";
        }
    }

    @Override
    public void accepterCandidature(Long candidatureId, String emailCandidat, String sujet, String message) {
        // 1. Vérifier que la candidature existe
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée avec l'ID : " + candidatureId));

        // 2. Mettre à jour le statut
        candidature.setStatut("ACCEPTÉE");
        candidatureRepository.save(candidature);

        // 3. Envoyer l'email avec les données fournies par le frontend
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(emailCandidat);
        mailMessage.setSubject(sujet);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }

    @Override
    public void refuserCandidature(Long candidatureId, String emailCandidat, String sujet, String message) {
        // 1. Vérifier que la candidature existe
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée avec l'ID : " + candidatureId));

        // 2. Mettre à jour le statut
        candidature.setStatut("REFUSÉE");
        candidatureRepository.save(candidature);

        // 3. Envoyer l'email avec les données fournies par le frontend
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(emailCandidat);
        mailMessage.setSubject(sujet);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }



    //###################   Reponse pour avoir candidature et offre et competence""
    @Override
    public List<CandidatureDetailDto> getCandidatureDetailsByCandidatId(Long candidatId) {

        List<Candidature> candidatures = candidatureRepository.findByCandidatId(candidatId);

        if (candidatures.isEmpty()) {
            throw new RuntimeException(
                    "Aucune candidature trouvée "
            );
        }

        List<CandidatureDetailDto> result = new ArrayList<>();

        for (Candidature candidature : candidatures) {

            //  Récupérer l'offre
            OffreEmploiDto offreRaw = offreClient
                    .getOffreById(candidature.getOffreEmploiId())
                    .getBody();

            if (offreRaw == null) {
                continue;
            }

            //  Récupérer les compétences à partir des IDs
            List<CompetenceDTO> competences = new ArrayList<>();

            if (offreRaw.getCompetenceIds() != null && !offreRaw.getCompetenceIds().isEmpty()) {
                competences = competenceClient.getCompetences(
                        offreRaw.getCompetenceIds()
                );
            }

            //Construire l'offre enrichie
            OffreEmploiDto offreEnrichie = new OffreEmploiDto();
            offreEnrichie.setId(offreRaw.getId());
            offreEnrichie.setTitre(offreRaw.getTitre());
            offreEnrichie.setDescription(offreRaw.getDescription());
            offreEnrichie.setLocalisation(offreRaw.getLocalisation());
            offreEnrichie.setSalaire(offreRaw.getSalaire());
            offreEnrichie.setDatePublication(offreRaw.getDatePublication());
            offreEnrichie.setStatut(offreRaw.getStatut());
            offreEnrichie.setRecruteurId(offreRaw.getRecruteurId());
            offreEnrichie.setCompetenceIds(offreRaw.getCompetenceIds());

            //  Construire le DTO final
            CandidatureDetailDto dto = new CandidatureDetailDto();
            dto.setId(candidature.getId());
            dto.setDateSoumission(candidature.getDateSoumission());
            dto.setStatut(candidature.getStatut());
            dto.setScoreMatching(candidature.getScoreMatching());
            dto.setOffreEmploiId(candidature.getOffreEmploiId());
            dto.setCandidatId(candidature.getCandidatId());
            dto.setOffreEmploi(offreEnrichie);

            // ⭐ POINT CLÉ : injecter les compétences récupérées
            dto.setCompetenceDTOList(competences);

            result.add(dto);
        }

        return result;
    }
    //###################   Reponse pour avoir candidat avec candidatire""

    @Override
    public List<CandidatureAvecCandidatDTO> getCandidatureWithCandidatByOffreId(Long offreId) {

        //  Récupérer les candidatures liées à l'offre
        List<Candidature> candidatures =
                candidatureRepository.findByOffreEmploiId(offreId);

        if (candidatures.isEmpty()) {
            return Collections.emptyList();

        }

        List<CandidatureAvecCandidatDTO> result = new ArrayList<>();

        // Pour chaque candidature, récupérer le candidat
        for (Candidature candidature : candidatures) {

            CandidatDTO candidatDTO = null;

            try {
                candidatDTO = candidatClient.getCandidat(
                        candidature.getCandidatId()
                ).getBody();
            } catch (Exception e) {
                // si le candidat n'existe plus ou erreur microservice
                continue;
            }

            // 3 Construire le DTO final
            CandidatureAvecCandidatDTO dto =
                    new CandidatureAvecCandidatDTO();

            dto.setId(candidature.getId());
            dto.setDateSoumission(candidature.getDateSoumission());
            dto.setStatut(candidature.getStatut());
            dto.setScoreMatching(candidature.getScoreMatching());
            dto.setOffreEmploiId(candidature.getOffreEmploiId());
            dto.setCandidatId(candidature.getCandidatId());
            dto.setCandidatDTO(candidatDTO);

            result.add(dto);
        }

        return result;
    }

@Override
    public List<OffreStatistiqueDto> getOffresWithCandidatureCount(Long recruteurId) {
        List<OffreEmploiDto> offres = offreClient.getOffreByRecruteurId(recruteurId).getBody();

        return offres.stream()
                .map(offre -> {
                    long count = candidatureRepository.countByOffreEmploiIdNative(offre.getId());
                    return new OffreStatistiqueDto(
                            offre.getId(),
                            offre.getTitre(),
                            offre.getDatePublication(),
                            count
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByOffreId(Long offreId) {
        return candidatureRepository.existsByOffreEmploiId(offreId);
    }


}

