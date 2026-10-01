package ma.ensa.candidature_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class OffreEmploiDto {
    private Long id;
    private String titre;
    private String description;
    private String localisation;
    private float salaire;
    private LocalDate datePublication;
    private String statut;
    private Long recruteurId;
    private List<Long> competenceIds;

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

    public Long getRecruteurId() {
        return recruteurId;
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

    public void setRecruteurId(Long recruteurId) {
        this.recruteurId = recruteurId;
    }

    public List<Long> getCompetenceIds() {
        return competenceIds;
    }

    public void setCompetenceIds(List<Long> competenceIds) {
        this.competenceIds = competenceIds;
    }
}
