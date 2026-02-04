package org.iesvdm.musicallyx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailDTO {
    private Long id;
    private String texto;
    private String asunto;
    private String emisor;
    private String receptor;
    private String fechaEnvio; // ISO string
    private boolean leido;
}
