package org.iesvdm.musicallyx.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class BloqueoHorario {
    @Id
    @GeneratedValue
    private Long id;

    private LocalDate fecha;
    private String hora;

    private boolean disponible;
    private String motivo;
}