package org.example.cvservice.controller;
import org.example.cvservice.entities.CV;
import org.example.cvservice.services.CvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cv")
public class CvController {
    private final CvService cvService;

    public CvController(CvService cvService) {
        this.cvService = cvService;
    }

    // Upload + traitement
    @PostMapping("/upload")
    public ResponseEntity<CV> uploadCV(
            @RequestParam("file") MultipartFile file,
            @RequestParam("candidatId") Long candidatId) {

        try {
            CV cv = cvService.uploadAndProcessCV(file, candidatId);
            return ResponseEntity.ok(cv);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // Récupérer un CV par ID (métadonnées + texte extrait)
    @GetMapping("/{id}")
    public ResponseEntity<CV> getCV(@PathVariable Long id) {
        try {
            CV cv = cvService.getCVById(id);
            return ResponseEntity.ok(cv);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/candidat/{candidatId}")
    public CV getCVByCandidatId(@PathVariable Long candidatId) {
        return cvService.getCVByCandidatId(candidatId);
    }

    @GetMapping("/candidat/{candidatId}/download")
    public ResponseEntity<Resource> downloadCv(@PathVariable Long candidatId) {
        CV cv = cvService.getCVByCandidatId(candidatId);

        if (cv == null) {
            return ResponseEntity.notFound().build(); // 404
        }

        //  CV trouvé → on construit la réponse
        ByteArrayResource resource = new ByteArrayResource(cv.getUrlFichier());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(cv.getTypeFichier()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + cv.getNomFichier() + "\"")
                .body(resource);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CV>> getAllCV(){
        try {
            List<CV> cv = cvService.getAllCV();
            return ResponseEntity.ok(cv);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }



    // Télécharger le fichier original (PDF/DOCX)
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadCV(@PathVariable Long id) {
        try {
            byte[] fileBytes = cvService.getCVFileBytes(id);
            String fileName = cvService.getCVFileName(id);

            ByteArrayResource resource = new ByteArrayResource(fileBytes);

            // Détecter le type MIME dynamiquement (ou forcer à application/pdf si tous sont PDF)
            String contentType = "application/pdf"; // ou mieux : déduire de fileName/type

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.parseMediaType(contentType))  // application/pdf
                    .contentLength(fileBytes.length)
                    .body(resource);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}