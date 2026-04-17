package org.iesvdm.musicallyx.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ReservaDTO {
    private String nombre;
    private String apellidos;
    private String telefono;
    private String email;
    private String profesor;
    private String asignatura;
    private LocalDate fechaClase;
    private String hora;
    private String bono;
    private String modalidad;
    private String nivel;
}

