package ma.ensa.candidature_service.controlers;


import ma.ensa.candidature_service.dto.CandidatureAvecCandidatDTO;
import ma.ensa.candidature_service.dto.CandidatureDetailDto;
import ma.ensa.candidature_service.dto.CvDTO;
import ma.ensa.candidature_service.dto.OffreStatistiqueDto;
import ma.ensa.candidature_service.entities.Candidature;
import ma.ensa.candidature_service.services.CandidatureServiceInterface;
import ma.ensa.candidature_service.feignClient.CvClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/candidatures")
public class CandidatureController {
    private CandidatureServiceInterface candidatureServiceInterface;
    private CvClient cvClient;


    public CandidatureController(CandidatureServiceInterface candidatureServiceInterface, CvClient cvClient) {
        this.candidatureServiceInterface = candidatureServiceInterface;
        this.cvClient=cvClient;
    }


    @GetMapping
    public ResponseEntity<List<Candidature>> getAllCandidatures() {
        return ResponseEntity.ok(candidatureServiceInterface.getAllCandidatures());
    }

    @GetMapping("/{id}")
    public Candidature getCandidatureById(@PathVariable Long id) {
        return candidatureServiceInterface.getCandidatureById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> createCandidature(@RequestBody Candidature candidature) {
        try {
            candidatureServiceInterface.createCandidature(candidature);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "success", true,
                            "message", " La candidature éte ajoutée."
                    ));
        }catch (RuntimeException e){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCandidature(@PathVariable Long id, @RequestBody Candidature candidature) {

        try {
            Candidature updated = candidatureServiceInterface.updateCandidature(id, candidature);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "La candidature a été modifiée."
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidature(@PathVariable Long id) {
        try {
            candidatureServiceInterface.deleteCandidature(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "La candidature a été supprimée."
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

    @PostMapping("/{id}/accepter")
    public ResponseEntity<?> accepterCandidature(@PathVariable Long id, @RequestParam String email, @RequestParam String sujet, @RequestParam String message) {
        try{
            candidatureServiceInterface.accepterCandidature(id, email, sujet, message);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "La candidature a été Acceptée."
            ));
        }catch(RuntimeException e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }

        }
    @PostMapping("/{id}/refuser")
    public ResponseEntity<?> refuserCandidature(@PathVariable Long id, @RequestParam String email, @RequestParam String sujet, @RequestParam String message) {
        try{
            candidatureServiceInterface.refuserCandidature(id, email, sujet, message);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "La candidature a été Refusée."
            ));
        }catch(RuntimeException e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }

    }

    // Obtenir les candidatures pour une offre
    @GetMapping("/offre/{id}")
    public ResponseEntity<List<Candidature>> getCandidaturesByOffreEmploiId(@PathVariable Long id) {
        return ResponseEntity.ok(candidatureServiceInterface.getCandidaturesByOffreEmploiId(id));
    }

    // Obtenir les candidatures d’un candidat
    @GetMapping("/candidat/{id}")
    public ResponseEntity<List<Candidature>> getCandidaturesByCandidatId(@PathVariable Long id) {
        return ResponseEntity.ok(candidatureServiceInterface.getCandidaturesByCandidatId(id));
    }




    //###########################  canddature avec les donnes de candidat
    @GetMapping("/offres/{id}")
    public ResponseEntity<List<CandidatureAvecCandidatDTO>> getCandidatureWithCandidatByOffreId(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                candidatureServiceInterface.getCandidatureWithCandidatByOffreId(id)
        );
    }

    @GetMapping("/cv/candidat/{id}")
    public ResponseEntity<CvDTO> getCvByIdCandidat(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                cvClient.getCVByCandidatId(id)
        );
    }

//    @GetMapping("/candidat/{candidatId}/details")
//    public ResponseEntity<List<CandidatureDetailDto>> getDetailsByCandidat(
//            @PathVariable Long candidatId) {
//
//        return ResponseEntity.ok(
//                candidatureServiceInterface.getCandidatureDetailsByCandidatId(candidatId)
//        );
//    }

    @GetMapping("/candidat/{candidatId}/details")
    public ResponseEntity<?> getDetailsByCandidat(
            @PathVariable Long candidatId) {
        try {
            List<CandidatureDetailDto> cands = candidatureServiceInterface.getCandidatureDetailsByCandidatId(candidatId);
            return ResponseEntity.ok(cands);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }




    @GetMapping("/recruteur/{recruteurId}")
    public List<OffreStatistiqueDto> getStatistiques(@PathVariable Long recruteurId) {
        return candidatureServiceInterface.getOffresWithCandidatureCount(recruteurId);
    }


    @GetMapping("/exists-by-offre/{offreId}")
    public Boolean existsByOffreId(@PathVariable Long offreId) {
        boolean exists = candidatureServiceInterface.existsByOffreId(offreId);
        return exists ;
    }

}
