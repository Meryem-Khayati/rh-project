package ma.ensa.candidature_service.feignClient;

import ma.ensa.candidature_service.dto.OffreEmploiDto;
import ma.ensa.candidature_service.dto.OffreStatistiqueDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "offreemploi-service")
public interface OffreClient {
    @GetMapping("/competences/{competenceId}/used")
    Boolean isCompetenceUsed(@PathVariable Long competenceId);

    @GetMapping("/offres/{id}/competences/noms")
     List<String> getCompetenceNamesByOffreId(@PathVariable Long id);

    @GetMapping("/offres/{id}")
     ResponseEntity<OffreEmploiDto> getOffreById(@PathVariable Long id) ;
    @GetMapping("/offres/recruteur/{id}")
     ResponseEntity<List<OffreEmploiDto>> getOffreByRecruteurId(@PathVariable Long id);

}
