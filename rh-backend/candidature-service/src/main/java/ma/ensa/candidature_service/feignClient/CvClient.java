package ma.ensa.candidature_service.feignClient;

import ma.ensa.candidature_service.dto.CvDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cv-service")
public interface CvClient {

    @GetMapping("/api/cv/candidat/{candidatId}")
    CvDTO getCVByCandidatId(@PathVariable Long candidatId);
}
