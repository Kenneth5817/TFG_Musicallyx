package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.domain.EstadisticasWeb;
import org.iesvdm.musicallyx.service.EstadisticasWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estadisticas-web")
public class EstadisticasWebController {

    @Autowired
    private EstadisticasWebService service;

    @PostMapping("/visita")
    public void registrarVisita() {
        service.incrementarVisita();
    }

    @GetMapping
    public EstadisticasWeb getEstadisticas() {
        return service.obtenerEstadisticas();
    }

}