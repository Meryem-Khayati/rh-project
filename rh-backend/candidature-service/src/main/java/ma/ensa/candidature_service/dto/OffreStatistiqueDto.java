package ma.ensa.candidature_service.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor

public class OffreStatistiqueDto {

    private Long id;
    private String titre;
    private LocalDate datePublication;
    private long nbCandidatures;

    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public LocalDate getDatePublication() {
        return datePublication;
    }

    public long getNbCandidatures() {
        return nbCandidatures;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setDatePublication(LocalDate datePublication) {
        this.datePublication = datePublication;
    }

    public void setNbCandidatures(long nbCandidatures) {
        this.nbCandidatures = nbCandidatures;
    }
}
