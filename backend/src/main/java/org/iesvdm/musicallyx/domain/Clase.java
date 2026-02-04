package org.iesvdm.musicallyx.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Clase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idClase;

    private String nombreClase;
    private String descripcion;
    private Date fecha;
    private String horaInicio;
    private String horaFin;
    private double precio;
    private String modalidad;
    private String dificultad;

    @ManyToOne
    @JoinColumn(name = "id_profesor")
    @JsonBackReference
    @JsonIgnore
    private Profesor profesor;

    @OneToMany(mappedBy = "clase")
    @JsonManagedReference("clase-alumnos")
    @JsonIgnore
    private Set<Alumno> setAlumnos=new HashSet<>();

    @OneToMany(mappedBy = "clase")
    @JsonManagedReference("clase-horarios")
    private Set<Horario> setHorarios=new HashSet<>();

    @OneToMany(mappedBy = "clase")
    @JsonManagedReference("clase-reservas")
    @JsonIgnore
    private Set<Reserva> reservas = new HashSet<>();


}
