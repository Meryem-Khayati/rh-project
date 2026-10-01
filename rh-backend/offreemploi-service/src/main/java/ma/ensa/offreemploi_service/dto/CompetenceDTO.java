package ma.ensa.offreemploi_service.dto;

import lombok.Data;

@Data
public class CompetenceDTO {
    private Long id;
    private String nom;
    private String niveau;

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }
}
