package org.example.cvservice.repository;

import com.drew.lang.annotations.Nullable;
import org.example.cvservice.entities.CV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CvRepository extends JpaRepository<CV, Long> {
    @Nullable
    CV findByCandidatId(Long candidatId);
}
