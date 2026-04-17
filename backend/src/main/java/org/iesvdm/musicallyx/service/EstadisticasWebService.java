package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.domain.EstadisticasWeb;
import org.iesvdm.musicallyx.repository.EstadisticasWebRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class EstadisticasWebService {

    @Autowired
    private EstadisticasWebRepository repo;

    @Transactional
    public void incrementarVisita() {

        EstadisticasWeb stats = repo.findById(1L).orElseGet(() -> {
            EstadisticasWeb s = new EstadisticasWeb();
            s.setId(1L);
            s.setVisitasTotales(0L);
            s.setVisitasDiarias(0L);
            s.setVisitasMensuales(0L);
            s.setVisitasAnuales(0L);
            s.setUltimaActualizacion(LocalDate.now());
            return s;
        });

        LocalDate hoy = LocalDate.now();

        if (stats.getVisitasTotales() == null) stats.setVisitasTotales(0L);
        if (stats.getVisitasDiarias() == null) stats.setVisitasDiarias(0L);
        if (stats.getVisitasMensuales() == null) stats.setVisitasMensuales(0L);
        if (stats.getVisitasAnuales() == null) stats.setVisitasAnuales(0L);

        if (stats.getUltimaActualizacion() == null ||
                !stats.getUltimaActualizacion().isEqual(hoy)) {
            stats.setVisitasDiarias(0L);
        }

        if (stats.getUltimaActualizacion() == null ||
                stats.getUltimaActualizacion().getMonth() != hoy.getMonth()) {
            stats.setVisitasMensuales(0L);
        }

        if (stats.getUltimaActualizacion() == null ||
                stats.getUltimaActualizacion().getYear() != hoy.getYear()) {
            stats.setVisitasAnuales(0L);
        }

        stats.setVisitasTotales(stats.getVisitasTotales() + 1);
        stats.setVisitasDiarias(stats.getVisitasDiarias() + 1);
        stats.setVisitasMensuales(stats.getVisitasMensuales() + 1);
        stats.setVisitasAnuales(stats.getVisitasAnuales() + 1);

        stats.setUltimaActualizacion(hoy);

        repo.save(stats);
    }

    public EstadisticasWeb obtenerEstadisticas() {
        return repo.findById(1L)
                .orElseGet(() -> {
                    EstadisticasWeb s = new EstadisticasWeb();
                    s.setId(1L);
                    s.setVisitasTotales(0L);
                    s.setVisitasDiarias(0L);
                    s.setVisitasMensuales(0L);
                    s.setVisitasAnuales(0L);
                    return s;
                });
    }
}