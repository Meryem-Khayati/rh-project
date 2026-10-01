package ma.ensa.offreemploi_service.feignClient;

import ma.ensa.offreemploi_service.dto.CompetenceDTO;
import ma.ensa.offreemploi_service.dto.RecruteurDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "auth-service")
public interface RecruteurClient {

    @GetMapping("/users/recruteurs/{id}")
    public ResponseEntity<RecruteurDTO> getRecruteur(@PathVariable Long id);

}
