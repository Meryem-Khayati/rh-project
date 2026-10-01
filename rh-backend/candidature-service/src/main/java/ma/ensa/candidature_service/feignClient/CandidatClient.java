package ma.ensa.candidature_service.feignClient;

import ma.ensa.candidature_service.dto.CandidatDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service")
public interface CandidatClient {

    @GetMapping("/users/candidats/{id}")
    ResponseEntity<CandidatDTO> getCandidat(@PathVariable Long id);
}
