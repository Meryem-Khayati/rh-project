package ma.ensa.candidature_service.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private LocalDate dateSoumission;
    @Column(nullable = true)
    private String statut;

    @Column(nullable = true)
    private String scoreMatching;

    @Column(name = "offre_emploi_id", nullable = false)
    private Long offreEmploiId;

    @Column(nullable = false)
    private Long candidatId;

    @PrePersist
    protected void onCreate() {
        if (this.dateSoumission == null) {
            this.dateSoumission = LocalDate.now();
        }
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
}
