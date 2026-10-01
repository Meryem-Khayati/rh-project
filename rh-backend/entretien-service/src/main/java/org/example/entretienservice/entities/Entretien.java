package org.example.entretienservice.entities;

import jakarta.persistence.*;
import lombok.Getter;
import org.example.entretienservice.enumeration.Type;

import java.time.LocalDate;
import java.util.Date;

@Entity
public class Entretien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private Type type;
    private String evaluation;
    @Column(name = "candidature_id", nullable = false)
    private Long candidatureId;

    public Entretien() {}

    public Entretien(LocalDate date, Type type, String evaluation, Long candidatureId) {
        this.date = date;
        this.type = type;
        this.evaluation = evaluation;
        this.candidatureId = candidatureId;
    }

    public Long getId() {
        return id;
    }


    public Type getType() {
        return type;
    }

    public String getEvaluation() {
        return evaluation;
    }

    public Long getCandidatureId() {
        return candidatureId;
    }

    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setType(Type type) { this.type = type; }

    public void setEvaluation(String evaluation) { this.evaluation = evaluation; }

    public void setCandidatureId(Long candidatureId) { this.candidatureId = candidatureId; }
}
