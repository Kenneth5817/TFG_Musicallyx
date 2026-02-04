package org.iesvdm.musicallyx.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idHorario;

    // 🔹 Día de la semana como ENUM, mejor que String
    @Convert(converter = DiaSemanaConverter.class)
    @Column(name = "dia_semana")
    private DiaSemana diaSemana;

    // 🔹 Usar LocalTime en lugar de String
    private LocalTime horaInicio;
    private LocalTime horaFin;

    private boolean disponible = true;

    private String descripcion;

    // 🔹 Relaciones
    @ManyToOne
    @JsonBackReference("profesor-horarios")
    @JsonIgnore
    private Profesor profesor;

    @ManyToOne
    @JsonBackReference("clase-horarios")
    private Clase clase;

    @OneToMany(mappedBy = "horario")
    @JsonManagedReference
    @JsonIgnore
    private Set<Alumno> alumnos;

    @Override
    public String toString() {
        return "Horario{" +
                "id=" + idHorario +
                ", diaSemana=" + diaSemana +
                ", horaInicio=" + horaInicio +
                ", horaFin=" + horaFin +
                ", disponible=" + disponible +
                '}';
    }


}
