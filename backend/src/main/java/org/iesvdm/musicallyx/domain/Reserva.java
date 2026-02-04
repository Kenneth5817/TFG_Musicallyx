package org.iesvdm.musicallyx.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

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

    private Date fechaReserva;
    private Date fechaConfirmacion;
    private String estado;
    private String metodoPago;
    private String comentarios;
    private String referenciaTransaccion;
    private double precio;
    private String hora;

    @ManyToOne
    @JsonBackReference("clase-reservas")
    private Clase clase;

    @ManyToOne
    @JsonBackReference("alumno-reservas")
    private Alumno alumno;
}
