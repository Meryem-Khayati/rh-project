package org.example.cvservice.services;
import feign.FeignException;
import org.example.cvservice.dto.CandidatDto;
import org.example.cvservice.entities.CV;
import org.example.cvservice.feignclient.CandidatClient;
import org.example.cvservice.repository.CvRepository;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CvService {

    private final CvRepository cvRepository;
    private final CandidatClient candidatClient;

    public CvService(CvRepository cvRepository, CandidatClient candidatClient) {
        this.cvRepository = cvRepository;
        this.candidatClient = candidatClient;
    }


    public CV uploadAndProcessCV(MultipartFile file, Long candidatId) throws IOException {
        try {
            CandidatDto candidatDto= candidatClient.getCandidat(candidatId).getBody();
            byte[] fileBytes = file.getBytes();
            String extractedText = extractTextFromBytes(fileBytes);
            CV cv = new CV();
            cv.setUrlFichier(fileBytes);
            cv.setNomFichier(file.getOriginalFilename());
            cv.setTypeFichier(file.getContentType());
            cv.setTexteExtrait(extractedText);
            cv.setCandidatId(candidatId);

            return cvRepository.save(cv);
        } catch (FeignException.NotFound e) {
            throw new RuntimeException("Le candidat avec ce ID n'existe pas", e);
        } catch (FeignException e) {
            throw new RuntimeException("Erreur lors de la vérification de candidat : " + e.getMessage(), e);
        }
    }

    public CV getCVByCandidatId(Long candidatId) {
        return cvRepository.findByCandidatId(candidatId);
    }



    private String extractTextFromBytes(byte[] bytes) {
        try {
            // Instanciation directe avec un Resource
            var resource = new ByteArrayResource(bytes);
            var reader = new TikaDocumentReader(resource); // ← constructeur à 1 paramètre (Resource)

            // Extraction via .get()
            List<Document> documents = reader.get();

            // Utilisation de .getText()
            return documents.stream()
                    .map(Document::getText)
                    .collect(Collectors.joining("\n\n"))
                    .trim();

        } catch (Exception e) {
            throw new RuntimeException("Échec de l'extraction du texte avec Tika : " + e.getMessage(), e);
        }
    }


    public CV getCVById(Long id) {
        return cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV non trouvé avec ID : " + id));
    }

   public List<CV> getAllCV(){
        return cvRepository.findAll();
   }
    public byte[] getCVFileBytes(Long cvId) {
        return getCVById(cvId).getUrlFichier();
    }

    public String getCVFileName(Long cvId) {
        return getCVById(cvId).getNomFichier();
    }

}