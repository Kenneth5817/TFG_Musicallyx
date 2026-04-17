package org.iesvdm.musicallyx.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "estadisticas_web")
@Data
public class EstadisticasWeb {

    @Id
    private Long id;

    private Long visitasTotales = 0L;

    private Long visitasDiarias = 0L;

    private Long visitasMensuales = 0L;

    private Long visitasAnuales = 0L;

    private LocalDate ultimaActualizacion;
}