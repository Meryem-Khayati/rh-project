package org.example.authservice.service;

import jakarta.transaction.Transactional;
import org.example.authservice.enumeration.Role;
import org.example.authservice.enumeration.StatutValidation;
import org.example.authservice.model.Candidat;
import org.example.authservice.model.Recruteur;
import org.example.authservice.model.User;
import org.example.authservice.repository.CandidatRepository;
import org.example.authservice.repository.RecruteurRepository;
import org.example.authservice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CandidatRepository candidatRepository;
    private final RecruteurRepository recruteurRepository;

    public static final Long UNASSIGNED_DEPARTMENT = -1L;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService, CandidatRepository candidatRepository, RecruteurRepository recruteurRepository,
                                 AuthenticationManager authenticationManager

    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.candidatRepository = candidatRepository;
        this.recruteurRepository = recruteurRepository;
        this.authenticationManager = authenticationManager;

    }

    public String register(User request) {
        // 1. Vérification unicité username
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà utilisé.");
        }

        // 2. Encoder le mot de passe
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(encodedPassword);

        // 3. Définir le rôle automatiquement (sécurité : ne pas laisser le front choisir)
        request.setRole(Role.ADMIN);

        // 4. Sauvegarder (grâce à l'héritage JOINED, ça crée dans User + Candidat)
        repository.save(request);

        return "Admin inscrit avec succès.";
    }

    public Candidat registerCandidat(Candidat request) {
        // 1. Vérification unicité username
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà utilisé.");
        }

        // 2. Encoder le mot de passe
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(encodedPassword);

        // 3. Définir le rôle automatiquement (sécurité : ne pas laisser le front choisir)
        request.setRole(Role.CANDIDAT);

        // 4. Sauvegarder (grâce à l'héritage JOINED, ça crée dans User + Candidat)


        return repository.save(request);
    }

    public Recruteur registerRecruteur(Recruteur request) {
        // 1. Vérifier unicité username
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà utilisé.");
        }

        // 2. Encoder le mot de passe
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(encodedPassword);

        // 3. Définir rôle + statut initial
        request.setRole(Role.RECRUTEUR);
        request.setStatutValidation(StatutValidation.EN_ATTENTE);
        request.setDateDemandeValidation(java.time.LocalDateTime.now());

        // 4. Sauvegarder
        return repository.save(request);
    }

    public Map<String, Object> authenticate(User request) { // Change le type de retour
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            User user = repository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after successful authentication"));
            String token = jwtService.generateToken(user);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("prenom", user.getPrenom()); // Prénom
            userDetails.put("nom", user.getNom());       // Nom
            userDetails.put("username", user.getUsername());
            userDetails.put("role", user.getRole().name()); // Convertit l'enum en String
            response.put("user", userDetails); // Ajoute l'objet utilisateur à la réponse
            return response;
        } catch (BadCredentialsException ex) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "username or password are incorrect");
            return errorResponse;
        } catch (UsernameNotFoundException ex) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "password or username are incorrect");
            return errorResponse;
        } catch (Exception ex) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error: Authentication failed - " + ex.getMessage());
            return errorResponse;
        }
    }

    public User getUserFromToken(String token) {
        String username = jwtService.extractUsername(token);
        Optional<User> userOptional = repository.findByUsername(username);

        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }

    public Optional<User> getUserById(Long id){
        return repository.findById(id);
    }


    public String DeleteUser(Long id){
        Optional<User> userOptional= repository.findById(id);
        if(userOptional.isEmpty()){
            return "Aucun utilisateur trouvé avec cet Id";
        }
        User user = userOptional.get();
        repository.delete(user);

        return "Utilisateur " + user.getUsername() + " supprimé avec succès.";

    }


    public Candidat updateCandidat(Long id, Candidat updated) {
        Candidat existing = candidatRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidat non trouvé avec l'ID : " + id));
        existing.setNom(updated.getNom());
        existing.setAdresse(updated.getAdresse());
        existing.setPrenom(updated.getPrenom());
        existing.setNumtelephone(updated.getNumtelephone());
        String newUsername = updated.getUsername();
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            newUsername = newUsername.trim();
            // 🔐 Vérifier qu’un autre utilisateur n’a pas déjà ce username
            if (repository.findByUsername(newUsername)
                    .filter(u -> !u.getId().equals(id)) // autorise le même username pour le même user
                    .isPresent()) {
                throw new IllegalArgumentException("Ce nom d'utilisateur est déjà utilisé par un autre compte.");
            }
            existing.setUsername(newUsername);
        }
        String rawPassword = updated.getPassword();
        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(rawPassword.trim()));
        }

        return candidatRepository.save(existing);
    }

    public String deleteCandidat(Long id) {
        if (!candidatRepository.existsById(id)) {
            throw new IllegalArgumentException("Candidat non trouvé avec l'ID : " + id);
        }
        candidatRepository.deleteById(id);
        return "Candidat supprimé avec succès.";
    }

    public Recruteur uploadLogo(Long recruteurId, MultipartFile logo) {
        // 1. Vérifier que le fichier n'est pas vide
        if (logo.isEmpty()) {
            throw new IllegalArgumentException("Le fichier logo est vide.");
        }

        // 2. Valider le type MIME (sécurité)
        String contentType = logo.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/png") ||
                        contentType.equals("image/jpeg") ||
                        contentType.equals("image/svg+xml"))) {
            throw new IllegalArgumentException("Format non autorisé. Formats acceptés : PNG, JPG, SVG.");
        }

        // 3. Limite de taille (1 Mo)
        if (logo.getSize() > 1_000_000) { // 1 Mo
            throw new IllegalArgumentException("Le logo ne doit pas dépasser 1 Mo.");
        }

        // 4. Récupérer le recruteur
        Recruteur recruteur = recruteurRepository.findById(recruteurId)
                .orElseThrow(() -> new RuntimeException("Recruteur avec ID " + recruteurId + " non trouvé."));

        try {
            // 5. Lire les bytes et sauvegarder
            byte[] logoBytes = logo.getBytes();
            recruteur.setLogoEntreprise(logoBytes);
            return recruteurRepository.save(recruteur);

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la lecture du fichier logo.", e);
        }
    }

    // =============== RECRUTEUR ===============

    public Recruteur updateRecruteur(Long id, Recruteur updated) {
        Recruteur existing = recruteurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recruteur non trouvé avec l'ID : " + id));

        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setNumtelephone(updated.getNumtelephone());

        // Info entreprise
        existing.setNomEntreprise(updated.getNomEntreprise());
        existing.setAdresseEntreprise(updated.getAdresseEntreprise());
        existing.setSiteWeb(updated.getSiteWeb());
        existing.setTelephoneEntreprise(updated.getTelephoneEntreprise());
        existing.setDescriptionEntreprise(updated.getDescriptionEntreprise());
        existing.setNumeroCIN(updated.getNumeroCIN());
        String newUsername = updated.getUsername();
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            newUsername = newUsername.trim();
            // 🔐 Vérifier qu’un autre utilisateur n’a pas déjà ce username
            if (repository.findByUsername(newUsername)
                    .filter(u -> !u.getId().equals(id)) // autorise le même username pour le même user
                    .isPresent()) {
                throw new IllegalArgumentException("Ce nom d'utilisateur est déjà utilisé par un autre compte.");
            }
            existing.setUsername(newUsername);
        }
        String rawPassword = updated.getPassword();
        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(rawPassword.trim()));
        }

        return recruteurRepository.save(existing);
    }

    public String deleteRecruteur(Long id) {
        if (!recruteurRepository.existsById(id)) {
            throw new IllegalArgumentException("Recruteur non trouvé avec l'ID : " + id);
        }
        recruteurRepository.deleteById(id);
        return "Recruteur supprimé avec succès.";
    }

    // =============== VALIDATION PAR ADMIN ===============

    @Transactional
    public Recruteur validerRecruteurParAdmin(Long id) {
        Recruteur recruteur = recruteurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recruteur non trouvé"));

        if (recruteur.getStatutValidation() != StatutValidation.EN_ATTENTE) {
            throw new IllegalStateException("Le recruteur n'est pas en attente de validation.");
        }

        recruteur.setStatutValidation(StatutValidation.APPROUVE);
        recruteur.setDateValidation(LocalDateTime.now());
        return recruteurRepository.save(recruteur);
    }

    @Transactional
    public Recruteur refuserRecruteurParAdmin(Long id, String commentaireRefus) {
        Recruteur recruteur = recruteurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recruteur non trouvé"));

        if (recruteur.getStatutValidation() != StatutValidation.EN_ATTENTE) {
            throw new IllegalStateException("Le recruteur n'est pas en attente de validation.");
        }

        recruteur.setStatutValidation(StatutValidation.REFUSE);
        recruteur.setCommentaireRefus(commentaireRefus);
        return recruteurRepository.save(recruteur);
    }

    // =============== GETTERS ===============

    public Optional<Candidat> getCandidatById(Long id) {
        return candidatRepository.findById(id);
    }

    public Optional<Recruteur> getRecruteurById(Long id) {
        return recruteurRepository.findById(id);
    }

    public List<Candidat> getAllCandidats() {
        return candidatRepository.findAll();
    }

    public List<Recruteur> getAllRecruteurs() {
        return recruteurRepository.findAll();
    }

    public List<Recruteur> getRecruteursEnAttente() {
        return recruteurRepository.findByStatutValidation(StatutValidation.EN_ATTENTE);
    }
    public List<Recruteur> getRecruteursActifs() {
        return recruteurRepository.findByStatutValidation(StatutValidation.APPROUVE);
    }
    public List<Recruteur> getRecruteursRefuse() {
        return recruteurRepository.findByStatutValidation(StatutValidation.REFUSE);
    }



}
