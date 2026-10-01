package ma.ensa.candidature_service.dto;

import java.time.LocalDate;
import java.util.List;

public class CandidatureDetailDto {
    // Informations de la candidature
    private Long id;
    private LocalDate dateSoumission;
    private String statut;
    private String scoreMatching;
    private Long offreEmploiId;
    private Long candidatId;

    // Informations de l'offre d'emploi (venant du autre microservice)
    private OffreEmploiDto offreEmploi;
    private List<CompetenceDTO> competenceDTOList;

    public List<CompetenceDTO> getCompetenceDTOList() {
        return competenceDTOList;
    }

    public void setCompetenceDTOList(List<CompetenceDTO> competenceDTOList) {
        this.competenceDTOList = competenceDTOList;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDateSoumission() {
        return dateSoumission;
    }

    public String getStatut() {
        return statut;
    }

    public String getScoreMatching() {
        return scoreMatching;
    }

    public Long getOffreEmploiId() {
        return offreEmploiId;
    }

    public Long getCandidatId() {
        return candidatId;
    }

    public OffreEmploiDto getOffreEmploi() {
        return offreEmploi;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDateSoumission(LocalDate dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public void setScoreMatching(String scoreMatching) {
        this.scoreMatching = scoreMatching;
    }

    public void setOffreEmploiId(Long offreEmploiId) {
        this.offreEmploiId = offreEmploiId;
    }

    public void setCandidatId(Long candidatId) {
        this.candidatId = candidatId;
    }

    public void setOffreEmploi(OffreEmploiDto offreEmploi) {
        this.offreEmploi = offreEmploi;
    }
}
