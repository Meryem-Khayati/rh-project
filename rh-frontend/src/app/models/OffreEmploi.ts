export interface OffreEmploi {
  id?: number;
  titre: string;
  description: string;
  localisation: string;
  salaire: any;
  datePublication?: any;
  statut: string;
  recruteurId: number;
  typeContrat: any;
  competenceIds: number[];
}

