package ma.ensa.candidature_service.dto;

import lombok.Data;

@Data
public class CvDTO {
    private Long id;
    private String typeFichier;
    private String texteExtrait;
    private byte [] urlFichier;
    private Long candidatId;

    public byte[] getUrlFichier() {
        return urlFichier;
    }

    public void setUrlFichier(byte[] urlFichier) {
        this.urlFichier = urlFichier;
    }

    public Long getId() {
        return id;
    }

    public String getTypeFichier() {
        return typeFichier;
    }

    public String getTexteExtrait() {
        return texteExtrait;
    }

    public Long getCandidatId() {
        return candidatId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTypeFichier(String typeFichier) {
        this.typeFichier = typeFichier;
    }

    public void setTexteExtrait(String texteExtrait) {
        this.texteExtrait = texteExtrait;
    }

    public void setCandidatId(Long candidatId) {
        this.candidatId = candidatId;
    }
}
