package org.example.entretienservice.feignclient;

import org.example.entretienservice.dto.CandidatureDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "candidature-service"
)
public interface CandidatureClient {
    @GetMapping("/candidatures/{id}")
    CandidatureDto getCandidatureById(@PathVariable Long id);
}
