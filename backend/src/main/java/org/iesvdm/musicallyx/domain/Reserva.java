package org.iesvdm.musicallyx.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idReserva;

    private String nombre;
    private String apellidos;
    private String telefono;
    private String email;

    private String asignatura;
    private String bono;
    private String nivel;
    private String modalidad;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaClase;
    private String semana;
    private Date fechaReserva;
    private Date fechaConfirmacion;
    private String estado;
    private String metodoPago;
    private String comentarios;
    private String referenciaTransaccion;
    private double precio;
    private String hora;
    private boolean correoEnviado = false;

    @ManyToOne
    @JsonBackReference("clase-reservas")
    private Clase clase;

    @ManyToOne
    @JsonBackReference("alumno-reservas")
    private Alumno alumno;
}
