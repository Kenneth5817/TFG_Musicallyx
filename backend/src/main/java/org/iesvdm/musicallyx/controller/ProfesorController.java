package org.iesvdm.musicallyx.controller;
import org.iesvdm.musicallyx.domain.Profesor;
import org.iesvdm.musicallyx.dto.PageDTO;
import org.iesvdm.musicallyx.exception.ProfesorNotFoundException;
import org.iesvdm.musicallyx.service.ProfesorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/api/profesores")

public class ProfesorController {

    @Autowired
    private ProfesorService profesorService;

    @GetMapping({"/",""})
    public PageDTO<Profesor> getAllProfesores(Pageable pageable) {
        Page<Profesor> page = profesorService.findAll(pageable);
        return new PageDTO<>(page.getContent(), page.getTotalPages(), page.getNumber());
    }

    @GetMapping("/{id}")
    public Profesor getProfesorById(@PathVariable Long id) {
        return profesorService.findById(id)
                .orElseThrow(() -> new ProfesorNotFoundException("Profesor con ID " + id + " no encontrado."));
    }

    @PostMapping({"/",""})
    public ResponseEntity<Profesor> createProfesor(@RequestBody Profesor profesor) {
        Profesor createdProfesor = profesorService.save(profesor);
        return new ResponseEntity<>(createdProfesor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profesor> updateProfesor(@PathVariable Long id, @RequestBody Profesor profesor) {
        if (!profesorService.existsById(id)) {
            throw new ProfesorNotFoundException("Profesor con ID " + id + " no encontrado.");
        }
        profesor.setIdProfesor(Math.toIntExact(id));
        Profesor updatedProfesor = profesorService.save(profesor);
        return new ResponseEntity<>(updatedProfesor, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesor(@PathVariable Long id) {
        if (!profesorService.existsById(id)) {
            throw new ProfesorNotFoundException("Profesor con ID " + id + " no encontrado.");
        }
        profesorService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Profesor> patchProfesor(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> updates) {

        Profesor profesor = profesorService.findById(Long.valueOf(id))
                .orElseThrow(() -> new ProfesorNotFoundException("Profesor con ID " + id + " no encontrado."));

        // Aplicamos los cambios solo a los campos presentes
        updates.forEach((key, value) -> {
            switch (key) {
                case "telefono":
                    profesor.setTelefono(String.valueOf(value));
                    break;
                case "nombre":
                    profesor.setNombre((String) value);
                    break;
                case "apellidos":
                    profesor.setApellidos((String) value);
                    break;
                case "especialidad":
                    profesor.setEspecialidad((String) value);
                    break;
                case "biografia":
                    profesor.setBiografia((String) value);
                    break;
                // Puedes añadir más campos si es necesario
            }
        });

        // Guardamos la entidad modificada
        Profesor updatedProfesor = profesorService.save(profesor);

        return ResponseEntity.ok(updatedProfesor);
    }
}
