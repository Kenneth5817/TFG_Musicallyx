package org.iesvdm.musicallyx.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Alumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idAlumno;

    @OneToOne
    // Evita el bucle
    private Usuario usuario;

    @OneToMany(mappedBy = "alumno", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("alumno-reservas")
    private Set<Reserva> reservas = new HashSet<>();

    @ManyToOne
    @JsonBackReference("clase-alumnos")
    private Clase clase;

    @ManyToOne
    @JsonBackReference
    private Horario horario;

}
