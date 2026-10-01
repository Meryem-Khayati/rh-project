package org.example.cvservice.feignclient;

import org.example.cvservice.dto.CandidatDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
@FeignClient(
        name = "auth-service"
)
public interface CandidatClient {
    @GetMapping("/users/candidats/{id}")
    ResponseEntity<CandidatDto> getCandidat(@PathVariable Long id);
}
