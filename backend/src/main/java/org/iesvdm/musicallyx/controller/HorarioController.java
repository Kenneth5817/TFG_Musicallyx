package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.domain.Clase;
import org.iesvdm.musicallyx.domain.Profesor;
import org.iesvdm.musicallyx.service.ClaseService;
import org.iesvdm.musicallyx.service.ProfesorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.iesvdm.musicallyx.exception.HorarioNotFoundException;
import org.iesvdm.musicallyx.domain.Horario;
import org.iesvdm.musicallyx.service.HorarioService;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/v1/api/horarios")

public class HorarioController {

    @Autowired
    private HorarioService horariosService;

    @Autowired
    private ClaseService claseService;

    @Autowired
    private ProfesorService profesorService;


    @GetMapping({"/",""})
    public Page<Horario> getAllHorarios(Pageable pageable) {
        return horariosService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Horario getHorarioById(@PathVariable Long id) {
        return horariosService.findById(id)
                .orElseThrow(() -> new HorarioNotFoundException("Horario con ID " + id + " no encontrado."));
    }

    @PostMapping({"/",""})
    public ResponseEntity<Horario> createHorario(@RequestBody Horario horario) {
        try{
            Horario createdHorario = horariosService.save(horario);
            return new ResponseEntity<>(createdHorario, HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> updateHorario(@PathVariable Long id, @RequestBody Horario horario) {
        if (!horariosService.existsById(id)) {
            throw new HorarioNotFoundException("Horario con ID " + id + " no encontrado.");
        }
        horario.setIdHorario(Math.toIntExact(id));
        Horario updatedHorario = horariosService.save(horario);
        return new ResponseEntity<>(updatedHorario, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorario(@PathVariable Long id) {
        if (!horariosService.existsById(id)) {
            throw new HorarioNotFoundException("Horario con ID " + id + " no encontrado.");
        }
        horariosService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Horario> patchHorario(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Horario horario = horariosService.findById(id)
                .orElseThrow(() -> new HorarioNotFoundException("Horario con ID " + id + " no encontrado."));

        updates.forEach((key, value) -> {
            switch (key) {
                case "horaInicio":
                    horario.setHoraInicio(LocalTime.from(LocalDateTime.parse(value.toString())));
                    break;
                case "horaFin":
                    horario.setHoraFin(LocalTime.from(LocalDateTime.parse(value.toString())));
                    break;
                case "profesorId":
                    int profesorId = Integer.parseInt(value.toString());
                    Profesor profesor = profesorService.findById((long) profesorId)
                            .orElseThrow(() -> new RuntimeException("Profesor con ID " + profesorId + " no encontrado"));
                    horario.setProfesor(profesor);
                    break;

                case "claseId":
                    int claseId = Integer.parseInt(value.toString());
                    Clase clase = claseService.findById((long) claseId)
                            .orElseThrow(() -> new RuntimeException("Clase con ID " + claseId + " no encontrada"));
                    horario.setClase(clase);
                    break;

                default:
                    throw new IllegalArgumentException("Campo no permitido: " + key);
            }
        });

        Horario updatedHorario = horariosService.save(horario);
        return new ResponseEntity<>(updatedHorario, HttpStatus.OK);
    }

}
