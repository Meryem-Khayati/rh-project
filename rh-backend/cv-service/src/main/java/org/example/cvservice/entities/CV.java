package org.example.cvservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
public class CV {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] urlFichier;

    @Column(name = "nom_fichier")
    private String nomFichier;

    @Column(name = "type_fichier")
    private String typeFichier;

    @Column(columnDefinition = "TEXT")
    private String texteExtrait;

    @Column(nullable = false)
    private Long candidatId;

    public CV() {
    }

    public CV(Long id, byte[] urlFichier, String nomFichier, String typeFichier, String texteExtrait, Long candidatId) {
        this.id = id;
        this.urlFichier = urlFichier;
        this.nomFichier = nomFichier;
        this.typeFichier = typeFichier;
        this.texteExtrait = texteExtrait;
        this.candidatId = candidatId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getUrlFichier() {
        return urlFichier;
    }

    public void setUrlFichier(byte[] urlFichier) {
        this.urlFichier = urlFichier;
    }

    public String getNomFichier() {
        return nomFichier;
    }

    public void setNomFichier(String nomFichier) {
        this.nomFichier = nomFichier;
    }

    public String getTypeFichier() {
        return typeFichier;
    }

    public void setTypeFichier(String typeFichier) {
        this.typeFichier = typeFichier;
    }

    public String getTexteExtrait() {
        return texteExtrait;
    }

    public void setTexteExtrait(String texteExtrait) {
        this.texteExtrait = texteExtrait;
    }

    public Long getCandidatId() {
        return candidatId;
    }

    public void setCandidatId(Long candidatId) {
        this.candidatId = candidatId;
    }
}
