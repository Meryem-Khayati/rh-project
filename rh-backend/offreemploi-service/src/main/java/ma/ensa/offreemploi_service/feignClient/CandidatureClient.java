package ma.ensa.offreemploi_service.feignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name = "candidature-service")

public interface CandidatureClient {
    @GetMapping("/candidatures/exists-by-offre/{offreId}")
     Boolean existsByOffreId(@PathVariable Long offreId);
}
