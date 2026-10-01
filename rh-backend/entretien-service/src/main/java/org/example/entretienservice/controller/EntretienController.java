package org.example.entretienservice.controller;

import lombok.Getter;
import org.example.entretienservice.entities.Entretien;
import org.example.entretienservice.service.EntretienService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entretiens")
public class EntretienController {
    private final EntretienService entretienService;

    public EntretienController(EntretienService entretienService) {
        this.entretienService = entretienService;
    }

    @PostMapping("/add")
    public Entretien creerEntretien(@RequestBody Entretien entretien) {
        return entretienService.creerEntretien(entretien);
    }

    @GetMapping("/candidature/{id}")
    public List<Entretien> getEntretiens(@PathVariable Long id) {
        return entretienService.getEntretiensParCandidature(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Entretien modifier(@PathVariable Long id,
                              @RequestBody Entretien entretien) {
        return entretienService.modifierEntretien(id, entretien);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        entretienService.supprimerEntretien(id);
    }

    @GetMapping
    public List<Entretien> getTous() {
        return entretienService.getTousLesEntretiens();
    }

    @GetMapping("/{id}")
    public Entretien getById(@PathVariable Long id) {
        return entretienService.getById(id);
    }





    @GetMapping("/type/{type}")
    public List<Entretien> getParType(@PathVariable String type) {
        return entretienService.getEntretiensParType(type);
    }




}
