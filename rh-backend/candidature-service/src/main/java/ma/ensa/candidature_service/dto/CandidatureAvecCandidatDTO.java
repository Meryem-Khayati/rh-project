package ma.ensa.candidature_service.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class CandidatureAvecCandidatDTO {
    // Informations de la candidature
    private Long id;
    private LocalDate dateSoumission;
    private String statut;
    private String scoreMatching;
    private Long offreEmploiId;
    private Long candidatId;
    private CandidatDTO candidatDTO;

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

    public CandidatDTO getCandidatDTO() {
        return candidatDTO;
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

    public void setCandidatDTO(CandidatDTO candidatDTO) {
        this.candidatDTO = candidatDTO;
    }
}
