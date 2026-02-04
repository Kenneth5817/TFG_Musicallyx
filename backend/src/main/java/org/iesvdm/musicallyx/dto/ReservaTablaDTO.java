package org.iesvdm.musicallyx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Date;

@Data
@AllArgsConstructor
public class ReservaTablaDTO {
    private String nombreAlumno;
    private String nombreClase;
    private String profesorClase;
    private String email;
    private Integer idReserva;
    private String estado;
    private Date fechaReserva;
    private String metodoPago;
}