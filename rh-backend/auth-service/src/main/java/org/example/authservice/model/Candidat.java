package org.example.authservice.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.authservice.enumeration.Role;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Candidat extends User{
     private String numtelephone;
     private String adresse;

     public String getNumtelephone() {
          return numtelephone;
     }

     public void setNumtelephone(String numtelephone) {
          this.numtelephone = numtelephone;
     }

     public String getAdresse() {
          return adresse;
     }

     public void setAdresse(String adresse) {
          this.adresse = adresse;
     }
}
