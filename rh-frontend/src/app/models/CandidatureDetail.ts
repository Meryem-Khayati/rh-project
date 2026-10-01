import { CompetenceDTO } from "./CompetenceDTO";
import { OffreEmploi } from "./OffreEmploi";

export interface CandidatureDetail {
  id: number;
  dateSoumission: string;
  statut: any;
  scoreMatching: string;
  offreEmploiId: number;
  candidatId: number;
  offreEmploi: OffreEmploi;
  competenceDTOList: CompetenceDTO[];
}