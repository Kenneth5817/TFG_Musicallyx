package org.iesvdm.musicallyx.controller;

import lombok.RequiredArgsConstructor;
import org.iesvdm.musicallyx.domain.BloqueoHorario;
import org.iesvdm.musicallyx.repository.BloqueoHorarioRepository;
import org.iesvdm.musicallyx.service.BloqueoHorarioService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/v1/api/bloqueos")
@RequiredArgsConstructor
public class BloqueoHorarioController {

    private final BloqueoHorarioService service;
    private final BloqueoHorarioRepository repository;

    @GetMapping
    public List<BloqueoHorario> getAll() {
        return service.getAll();
    }

    @GetMapping("/semana")
    public List<BloqueoHorario> getSemana(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return service.getSemana(start, end);
    }

    @PostMapping
    public void guardarBloqueos(@RequestBody List<BloqueoHorario> bloqueos) {

        if (bloqueos.isEmpty()) return;

        // Obtener semana desde la primera fecha
        LocalDate start = bloqueos.get(0).getFecha();
        LocalDate end = start.plusDays(6);

        service.reemplazarBloqueosSemana(start, end, bloqueos);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}