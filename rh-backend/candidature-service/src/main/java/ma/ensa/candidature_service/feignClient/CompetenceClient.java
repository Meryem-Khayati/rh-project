package ma.ensa.candidature_service.feignClient;


import ma.ensa.candidature_service.dto.CompetenceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "competence-service")
public interface CompetenceClient {
    @PostMapping("/competences/by-ids")
    List<CompetenceDTO> getCompetences(@RequestBody List<Long> ids);

}
