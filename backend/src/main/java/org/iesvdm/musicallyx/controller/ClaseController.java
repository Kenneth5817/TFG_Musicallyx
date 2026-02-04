package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.domain.Clase;
import org.iesvdm.musicallyx.domain.Profesor;
import org.iesvdm.musicallyx.exception.ClaseNotFoundException;
import org.iesvdm.musicallyx.service.ClaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/api/clases")
public class ClaseController {

    @Autowired
    private ClaseService claseService;

    @Autowired
    private ClaseService profesorService;


    @GetMapping({"", "/"})
    public Page<Clase> getAllClases(Pageable pageable) {
        return claseService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Clase getClaseById(@PathVariable Long id) {
        return claseService.findById(id)
                .orElseThrow(() -> new ClaseNotFoundException("Clase con ID " + id + " no encontrada."));
    }

    @PostMapping({"","/"})
    public ResponseEntity<Clase> createClase(@RequestBody Clase clase) {
        Clase createdClase = claseService.save(clase);
        return new ResponseEntity<>(createdClase, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clase> updateClase(@PathVariable Long id, @RequestBody Clase clase) {
        if (!claseService.existsById(id)) {
            throw new ClaseNotFoundException("Clase con ID " + id + " no encontrada.");
        }
        clase.setIdClase(Math.toIntExact(id));
        Clase updatedClase = claseService.save(clase);
        return new ResponseEntity<>(updatedClase, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClase(@PathVariable Long id) {
        if (!claseService.existsById(id)) {
            throw new ClaseNotFoundException("Clase con ID " + id + " no encontrada.");
        }
        claseService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Clase> patchClase(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Clase clase = claseService.findById(id)
                .orElseThrow(() -> new ClaseNotFoundException("Clase con ID " + id + " no encontrada."));

        updates.forEach((key, value) -> {
            switch (key) {
                case "nombreClase":
                    clase.setNombreClase(value.toString());
                    break;
                case "descripcion":
                    clase.setDescripcion(value.toString());
                    break;
                case "fecha":
                    // convertir a java.util.Date según formato
                    // ejemplo: yyyy-MM-dd
                    clase.setFecha(java.sql.Date.valueOf(value.toString()));
                    break;
                case "horaInicio":
                    clase.setHoraInicio(value.toString());
                    break;
                case "horaFin":
                    clase.setHoraFin(value.toString());
                    break;
                case "precio":
                    clase.setPrecio(Double.parseDouble(value.toString()));
                    break;
                case "modalidad":
                    clase.setModalidad(value.toString());
                    break;
                case "dificultad":
                    clase.setDificultad(value.toString());
                    break;
                case "profesorId":
                    int profesorId = Integer.parseInt(value.toString());
                    Profesor profesor = profesorService.findById((long) profesorId)
                            .orElseThrow(() -> new RuntimeException("Profesor con ID " + profesorId + " no encontrado")).getProfesor();
                    clase.setProfesor(profesor);
                    break;
                default:
                    throw new IllegalArgumentException("Campo no permitido: " + key);
            }
        });

        Clase updatedClase = claseService.save(clase);
        return new ResponseEntity<>(updatedClase, HttpStatus.OK);
    }

    //Añadido recientemente el paginator
//    @GetMapping
//    public ResponseEntity<Page<Clase>> listarClases(
//            @RequestParam(required = false, defaultValue = "") String nombreClase,
//            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
//
//        Page<Clase> clases = claseService.listarClases(nombreClase, pageable);
//        return ResponseEntity.ok(clases);
//    }
}
