package org.example.entretienservice.dto;

import java.time.LocalDate;

public class CandidatureDto {
    private Long id;
    private LocalDate dateSoumission;
    private String statut;
    private String scoreMatching;



    public CandidatureDto(Long id, LocalDate dateSoumission, String statut, String scoreMatching) {
        this.id = id;
        this.dateSoumission = dateSoumission;
        this.statut = statut;
        this.scoreMatching = scoreMatching;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(LocalDate dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getScoreMatching() {
        return scoreMatching;
    }

    public void setScoreMatching(String scoreMatching) {
        this.scoreMatching = scoreMatching;
    }
}
