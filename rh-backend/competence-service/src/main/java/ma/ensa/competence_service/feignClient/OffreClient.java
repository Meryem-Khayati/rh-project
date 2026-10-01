package ma.ensa.competence_service.feignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "offreemploi-service")
public interface OffreClient {
    @GetMapping("/offres/{competenceId}/used")
     Boolean isCompetenceUsed(@PathVariable Long competenceId);
}
