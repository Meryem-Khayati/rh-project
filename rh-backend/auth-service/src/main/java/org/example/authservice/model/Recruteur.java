package org.example.authservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.authservice.enumeration.StatutValidation;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Recruteur extends User{
    //info sur l'entreprise
    private String adresseEntreprise;
    private String nomEntreprise;
    private String siteWeb;
    private String telephoneEntreprise;
    private String descriptionEntreprise;
    private String numeroCIN;
    private String numtelephone;
    @Lob
    @Column(name = "logo_entreprise", columnDefinition = "LONGBLOB")
    private byte[] logoEntreprise;
    @Enumerated(value = EnumType.STRING)
    private StatutValidation statutValidation;
    private LocalDateTime dateDemandeValidation;
    private LocalDateTime dateValidation;
    private String commentaireRefus;

    public byte[] getLogoEntreprise() {
        return logoEntreprise;
    }

    public void setLogoEntreprise(byte[] logoEntreprise) {
        this.logoEntreprise = logoEntreprise;
    }

    public String getAdresseEntreprise() {
        return adresseEntreprise;
    }

    public void setAdresseEntreprise(String adresseEntreprise) {
        this.adresseEntreprise = adresseEntreprise;
    }

    public String getNomEntreprise() {
        return nomEntreprise;
    }

    public void setNomEntreprise(String nomEntreprise) {
        this.nomEntreprise = nomEntreprise;
    }

    public String getSiteWeb() {
        return siteWeb;
    }

    public void setSiteWeb(String siteWeb) {
        this.siteWeb = siteWeb;
    }

    public String getTelephoneEntreprise() {
        return telephoneEntreprise;
    }

    public void setTelephoneEntreprise(String telephoneEntreprise) {
        this.telephoneEntreprise = telephoneEntreprise;
    }

    public String getDescriptionEntreprise() {
        return descriptionEntreprise;
    }

    public void setDescriptionEntreprise(String descriptionEntreprise) {
        this.descriptionEntreprise = descriptionEntreprise;
    }

    public String getNumeroCIN() {
        return numeroCIN;
    }

    public void setNumeroCIN(String numeroCIN) {
        this.numeroCIN = numeroCIN;
    }

    public String getNumtelephone() {
        return numtelephone;
    }

    public void setNumtelephone(String numtelephone) {
        this.numtelephone = numtelephone;
    }

    public StatutValidation getStatutValidation() {
        return statutValidation;
    }

    public void setStatutValidation(StatutValidation statutValidation) {
        this.statutValidation = statutValidation;
    }

    public LocalDateTime getDateDemandeValidation() {
        return dateDemandeValidation;
    }

    public void setDateDemandeValidation(LocalDateTime dateDemandeValidation) {
        this.dateDemandeValidation = dateDemandeValidation;
    }

    public LocalDateTime getDateValidation() {
        return dateValidation;
    }

    public void setDateValidation(LocalDateTime dateValidation) {
        this.dateValidation = dateValidation;
    }

    public String getCommentaireRefus() {
        return commentaireRefus;
    }

    public void setCommentaireRefus(String commentaireRefus) {
        this.commentaireRefus = commentaireRefus;
    }
}
