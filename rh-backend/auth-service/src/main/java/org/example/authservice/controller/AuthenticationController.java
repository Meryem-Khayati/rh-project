package org.example.authservice.controller;

import org.example.authservice.model.Candidat;
import org.example.authservice.model.Recruteur;
import org.example.authservice.model.User;
import org.example.authservice.repository.UserRepository;
import org.example.authservice.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;


@RestController
@RequestMapping("/users")
public class AuthenticationController {
    private final AuthenticationService authService;
    @Autowired
    private UserRepository userRepository;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }
    @PostMapping("/register/candidat")
    public ResponseEntity<Candidat> registerCandidat(@RequestBody Candidat candidat) {
        return ResponseEntity.ok(authService.registerCandidat(candidat));
    }

    @GetMapping("/{id}/logo")
    public ResponseEntity<byte[]> getLogoEntreprise(@PathVariable Long id) {
        try {
            Optional<Recruteur> recruteurOpt = authService.getRecruteurById(id);

            if (recruteurOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Recruteur recruteur = recruteurOpt.get();
            byte[] logoData = recruteur.getLogoEntreprise(); // Récupère le blob

            if (logoData == null || logoData.length == 0) {
                return ResponseEntity.noContent().build();
            }

            // Déterminer le type MIME (par défaut PNG)
            String contentType = "image/png";

            // Si vous stockez le type de fichier, utilisez-le
            // String contentType = recruteur.getLogoContentType();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(logoData.length);
            headers.setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS)); // Cache 7 jours

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(logoData);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/upload-logo")
    public ResponseEntity<String> uploadLogo(
            @RequestParam("logo") MultipartFile logo,
            @RequestParam("recruteurId") Long recruteurId) {

        try {
            authService.uploadLogo(recruteurId, logo);
            return ResponseEntity.ok("Logo uploadé avec succès.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erreur de validation : " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Erreur serveur : " + e.getMessage());
        }
    }



    @PostMapping("/register/recruteur")
    public ResponseEntity<Recruteur> registerRecruteur(@RequestBody Recruteur recruteur) {
        return ResponseEntity.ok(authService.registerRecruteur(recruteur));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        try {
            Map<String, Object> result = authService.authenticate(request); // Type de retour Map
            if (result.containsKey("error")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result); // Renvoie { "error": "..." }
            } else {
                return ResponseEntity.ok(result);
            }

        } catch (Exception ex) {
            // 4. Gère les erreurs inattendues du contrôleur lui-même
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Authentication process failed on server");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long id) {
        Optional<User> user = authService.getUserById(id);

        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            User user = authService.getUserFromToken(token);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String responseMessage = authService.DeleteUser(id);
        return ResponseEntity.ok(responseMessage);
    }

    @PutMapping("/candidats/{id}")
    public ResponseEntity<Candidat> updateCandidat(
            @PathVariable Long id,
            @RequestBody Candidat updated) {
        try {
            Candidat result = authService.updateCandidat(id, updated);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/candidats/{id}")
    public ResponseEntity<String> deleteCandidat(@PathVariable Long id) {
        try {
            String message = authService.deleteCandidat(id);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/candidats/{id}")
    public ResponseEntity<Candidat> getCandidat(@PathVariable Long id) {
        return authService.getCandidatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/candidats")
    public ResponseEntity<List<Candidat>> getAllCandidats() {
        return ResponseEntity.ok(authService.getAllCandidats());
    }

    // =============== RECRUTEUR ===============

    @PutMapping("/recruteurs/{id}")
    public ResponseEntity<Recruteur> updateRecruteur(
            @PathVariable Long id,
            @RequestBody Recruteur updated) {
        try {
            Recruteur result = authService.updateRecruteur(id, updated);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/recruteurs/{id}")
    public ResponseEntity<String> deleteRecruteur(@PathVariable Long id) {
        try {
            String message = authService.deleteRecruteur(id);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/recruteurs/{id}")
    public ResponseEntity<Recruteur> getRecruteur(@PathVariable Long id) {
        return authService.getRecruteurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recruteurs")
    public ResponseEntity<List<Recruteur>> getAllRecruteurs() {
        return ResponseEntity.ok(authService.getAllRecruteurs());
    }

    // =============== VALIDATION PAR ADMIN ===============

    @PutMapping("/admin/recruteurs/{id}/valider")
    public ResponseEntity<Recruteur> validerRecruteur(@PathVariable Long id) {
        try {
            Recruteur result = authService.validerRecruteurParAdmin(id);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/admin/recruteurs/{id}/refuser")
    public ResponseEntity<Recruteur> refuserRecruteur(
            @PathVariable Long id,
            @RequestParam String commentaireRefus) {
        try {
            Recruteur result = authService.refuserRecruteurParAdmin(id, commentaireRefus);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/admin/recruteurs/en-attente")
    public ResponseEntity<List<Recruteur>> getRecruteursEnAttente() {
        return ResponseEntity.ok(authService.getRecruteursEnAttente());
    }
    @GetMapping("/admin/recruteurs/actifs")
    public ResponseEntity<List<Recruteur>> getRecruteursApprouve() {
        return ResponseEntity.ok(authService.getRecruteursActifs());
    }
    @GetMapping("/admin/recruteurs/refus")
    public ResponseEntity<List<Recruteur>> getRecruteursRefusee() {
        return ResponseEntity.ok(authService.getRecruteursRefuse());
    }

    //  endpoint pour uploader/mettre à jour le logo
    @PutMapping("/{id}/logo")
    public ResponseEntity<?> uploadLogo(
            @PathVariable Long id,
            @RequestParam("logo") MultipartFile file) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Fichier vide");
            }

            // Vérifier le type de fichier
            String contentType = file.getContentType();
            if (!contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Le fichier doit être une image");
            }

            Optional<Recruteur> recruteurOpt = authService.getRecruteurById(id);
            if (recruteurOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Recruteur recruteur = recruteurOpt.get();
            recruteur.setLogoEntreprise(file.getBytes());
            // recruteur.setLogoContentType(contentType); // Si vous voulez stocker le type

            authService.updateRecruteur(id, recruteur);

            return ResponseEntity.ok().body("Logo mis à jour avec succès");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload: " + e.getMessage());
        }
    }





}
