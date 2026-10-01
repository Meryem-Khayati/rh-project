package ma.ensa.offreemploi_service.feignClient;

import ma.ensa.offreemploi_service.dto.CompetenceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "competence-service")
public interface CompetenceClient {

    @GetMapping("/competences/{id}/nom")
     String getCompetenceNomById(@PathVariable Long id);

    @PostMapping("/competences/by-ids")
    List<CompetenceDTO> getCompetences(@RequestBody List<Long> ids);



}
