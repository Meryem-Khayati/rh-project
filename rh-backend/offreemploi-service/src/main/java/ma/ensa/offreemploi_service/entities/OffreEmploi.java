package ma.ensa.offreemploi_service.entities;


import jakarta.persistence.*;
import lombok.*;
import ma.ensa.offreemploi_service.enums.TypeContrat;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OffreEmploi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String titre;
    @Column(nullable = false, length = 1000)
    private String description;
    @Column(nullable = false)
    private String localisation;
    private float salaire;
    private LocalDate datePublication;
    @Column(nullable = true)
    private String statut;
    private Long recruteurId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeContrat typeContrat;
    @ElementCollection
    private List<Long> competenceIds;
    @PrePersist
    protected void onCreate() {
        if (this.datePublication == null) {
            this.datePublication = LocalDate.now();
        }
    }

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

    public List<Long> getCompetenceIds() {
        return competenceIds;
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

    public void setCompetenceIds(List<Long> competenceIds) {
        this.competenceIds = competenceIds;
    }


    public void setRecruteurId(Long recruteurId) {
        this.recruteurId = recruteurId;
    }

    public TypeContrat getTypeContrat() {
        return typeContrat;
    }

    public void setTypeContrat(TypeContrat typeContrat) {
        this.typeContrat = typeContrat;
    }

}
