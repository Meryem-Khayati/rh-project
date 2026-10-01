export interface Recruteur{
    id?: number;
    nom: string;
    prenom: string;
    username: string;
    password: string;
    adresseEntreprise:string;
    nomEntreprise:string;
    siteWeb:string;
    telephoneEntreprise:string;
    descriptionEntreprise:string;
    numeroCIN:string;
    numtelephone:string;
    statutValidation?:string;
    dateDemandeValidation?:string;
    dateValidation?:string;
    commentaireRefus?:string;
    logoEntreprise?: File;       // pour le formulaire
    logoEntrepriseUrl?: string;  // pour l'affichage 

  }
  