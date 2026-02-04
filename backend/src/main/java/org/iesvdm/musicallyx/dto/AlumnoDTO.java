package org.iesvdm.musicallyx.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlumnoDTO {
    private Integer idAlumno;
    private String nombre;
    private String email;
    private Integer claseId;
    private Integer horarioId;
}
