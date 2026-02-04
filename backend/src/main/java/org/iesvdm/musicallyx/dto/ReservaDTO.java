package org.iesvdm.musicallyx.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservaDTO {
    private String alumno;
    private String email;
    private String profesor;
    private String asignatura;
    private String fecha;
    private String hora;
}

