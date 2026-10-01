package ma.ensa.offreemploi_service.dto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import ma.ensa.offreemploi_service.enums.TypeContrat;

import java.time.LocalDate;
import java.util.List;

@Data
public class OffreEmploiDetailsDTO {
    private Long id;
    private String titre;
    private String description;
    private String localisation;
    private float salaire;
    private LocalDate datePublication;
    private String statut;
    @Enumerated(EnumType.STRING)
    private TypeContrat typeContrat;

    private RecruteurDTO recruteur;
    private List<CompetenceDTO> competences;

    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public String getDescription() {
        return description;
    }

    public String getLocalisation() {
        return localisation;
    }

    public float getSalaire() {
        return salaire;
    }

    public LocalDate getDatePublication() {
        return datePublication;
    }

    public String getStatut() {
        return statut;
    }

    public RecruteurDTO getRecruteur() {
        return recruteur;
    }

    public List<CompetenceDTO> getCompetences() {
        return competences;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    public void setSalaire(float salaire) {
        this.salaire = salaire;
    }

    public void setDatePublication(LocalDate datePublication) {
        this.datePublication = datePublication;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public void setRecruteur(RecruteurDTO recruteur) {
        this.recruteur = recruteur;
    }

    public void setCompetences(List<CompetenceDTO> competences) {
        this.competences = competences;
    }

    public TypeContrat getTypeContrat() {
        return typeContrat;
    }

    public void setTypeContrat(TypeContrat typeContrat) {
        this.typeContrat = typeContrat;
    }
}

