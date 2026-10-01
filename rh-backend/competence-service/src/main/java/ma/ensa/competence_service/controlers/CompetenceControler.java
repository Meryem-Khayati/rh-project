package ma.ensa.competence_service.controlers;

import ma.ensa.competence_service.entities.Competence;
import ma.ensa.competence_service.services.CompetenceServiceInterface;
import ma.ensa.competence_service.services.CompetenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/competences")
public class CompetenceControler {
    CompetenceServiceInterface competenceServiceInterface;
    CompetenceControler(CompetenceService competenceService){
        this.competenceServiceInterface = competenceService;
    }

    @GetMapping
    public ResponseEntity<List<Competence>> getAllCompetence(){
        return ResponseEntity.ok(competenceServiceInterface.getAllCompetence());
    }

    @GetMapping("/{id}")
    public Competence getCompetenceById(@PathVariable Long id) {
        return competenceServiceInterface.getCompetanceById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCompetence(@RequestBody Competence competence) {
        if(competenceServiceInterface.existCompetence(competence)){
           return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "success", false,
                        "message", " La compétence existe déja."
                ));

       }else{
            competenceServiceInterface.createCompetence(competence);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "success", true,
                        "message", "La compétence a été ajouté."
                ));
    }
}

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompetence(@PathVariable("id") Long id, @RequestBody Competence competence) {

        try {
            Competence updated = competenceServiceInterface.updateCompetence(id, competence);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "La compétence a été modifiée."
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
    public ResponseEntity<?> deleteCompetence(@PathVariable("id") Long id) {
        try {
            competenceServiceInterface.deleteCompetence(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "La compétence a été supprimée."
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
// get le nom de competence qui a l id  'id'
    @GetMapping("/{id}/nom")
    public String getCompetenceNomById(@PathVariable Long id) {
        try {
            String nom = competenceServiceInterface.getCompetenceNomById(id);
            return nom;
        }catch (RuntimeException e){
            return e.getMessage();
        }
    }

    @PostMapping("/by-ids")
    public List<Competence> getCompetences(@RequestBody List<Long> ids) {
        return competenceServiceInterface.getCompetencesByIds(ids);
    }





}
