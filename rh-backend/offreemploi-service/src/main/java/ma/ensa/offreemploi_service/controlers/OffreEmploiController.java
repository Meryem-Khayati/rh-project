package ma.ensa.offreemploi_service.controlers;

import ma.ensa.offreemploi_service.dto.OffreEmploiDetailsDTO;
import ma.ensa.offreemploi_service.entities.OffreEmploi;
import ma.ensa.offreemploi_service.enums.TypeContrat;
import ma.ensa.offreemploi_service.services.OffreEmploiServiceInterface;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/offres")
public class OffreEmploiController {
    private OffreEmploiServiceInterface offreEmploiServiceInterface;
    OffreEmploiController(OffreEmploiServiceInterface offreEmploiServiceInterface){
        this.offreEmploiServiceInterface = offreEmploiServiceInterface;
    }

    @GetMapping
    public ResponseEntity<List<OffreEmploi>> getAllOffres(){
        return ResponseEntity.ok(offreEmploiServiceInterface.getAllOffres());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OffreEmploi> getOffreById(@PathVariable Long id) {
        return ResponseEntity.ok(offreEmploiServiceInterface.getOffreById(id));
    }
    @GetMapping("/recruteur/{id}")
    public ResponseEntity<List<OffreEmploi>> getOffreByRecruteurId(@PathVariable Long id) {
        return ResponseEntity.ok(offreEmploiServiceInterface.getAllOffresByRecruteurId(id));
    }

    @GetMapping("/details")
    public List<OffreEmploiDetailsDTO> getAllOffresWithDetails() {
        return offreEmploiServiceInterface.getAllOffresWithDetails();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addOffre(@RequestBody OffreEmploi offreEmploi) {
        if(offreEmploiServiceInterface.existOffre(offreEmploi)){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "success", false,
                            "message", " Offre d'emploi existe déja."
                    ));

        }else{
            offreEmploiServiceInterface.createOffre(offreEmploi);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "success", true,
                            "message", "Offre d'emploi a été ajouté."
                    ));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateOffre(@PathVariable("id") Long id, @RequestBody OffreEmploi offreEmploi) {

        try {
            OffreEmploi updated = offreEmploiServiceInterface.updateOffre(id, offreEmploi);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "L'offre d'emploi a été modifiée."
            ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", "L'offre d'emploi n'existe pas."
                    ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffre(@PathVariable("id") Long id) {
        try {
            offreEmploiServiceInterface.deleteOffre(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "L'offre a été supprimée."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }
    @PatchMapping("/desactiver/{id}")
    public ResponseEntity<?> desactiverOffre(@PathVariable Long id) {
        try {
            offreEmploiServiceInterface.desactiverOffre(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "L'offre d'emploi a été désactivée."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }


    //######################### Verifie si competance deja exist dans un offre  ##########################""


    // verifier si deja competance exit dans offre cad deja utiliser (pour assurer la supprision fiable )
    @GetMapping("/{competenceId}/used")
    public Boolean isCompetenceUsed(@PathVariable Long competenceId) {
        boolean isUsed = offreEmploiServiceInterface.isCompetenceUsed(competenceId);
        return isUsed;
    }

    // pour recupere les nom des competance au lieu de ces ID car on a besoin dans candidature pour calule de score
    @GetMapping("/{id}/competences/noms")
    public List<String> getCompetenceNamesByOffreId(@PathVariable Long id) {
        try {
            return offreEmploiServiceInterface.getCompetenceNamesByOffreId(id);
        }catch (RuntimeException e){
            System.out.println(e.getMessage());
          return  null;
        }
    }

//recuperer tout les type des cantrat
@GetMapping("contrat")
public TypeContrat[] getAllTypesContrat() {
    return TypeContrat.values();
}


}
