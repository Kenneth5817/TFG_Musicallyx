package org.iesvdm.musicallyx.controller;
import org.iesvdm.musicallyx.domain.Alumno;
import org.iesvdm.musicallyx.domain.Clase;
import org.iesvdm.musicallyx.domain.Horario;
import org.iesvdm.musicallyx.domain.Usuario;
import org.iesvdm.musicallyx.dto.AlumnoDTO;
import org.iesvdm.musicallyx.exception.AlumnoNotFoundException;
import org.iesvdm.musicallyx.service.AlumnoService;
import org.iesvdm.musicallyx.service.ClaseService;
import org.iesvdm.musicallyx.service.HorarioService;
import org.iesvdm.musicallyx.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/v1/api/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private ClaseService claseService;

    @Autowired
    private HorarioService horarioService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping({"/",""})
    public Page<AlumnoDTO> getAllAlumnos(Pageable pageable) {
        Page<Alumno> alumnos = alumnoService.findAll(pageable);
        return alumnos.map(this::toDTO);
    }

    @GetMapping("/{id}")
    public AlumnoDTO getAlumnoById(@PathVariable Long id) {
        Alumno alumno = alumnoService.findById(id)
                .orElseThrow(() -> new AlumnoNotFoundException("Alumno con ID " + id + " no encontrado."));
        return toDTO(alumno);
    }

    private Alumno toEntity(AlumnoDTO dto) {
        Alumno alumno = new Alumno();
        alumno.setIdAlumno(dto.getIdAlumno());

        // Usuario
        if (dto.getNombre() != null || dto.getEmail() != null) {
            Usuario usuario = new Usuario();
            usuario.setNombre(dto.getNombre());
            usuario.setEmail(dto.getEmail());
            usuario = usuarioService.save(usuario); // ✅ Guardar primero
            alumno.setUsuario(usuario);
        }

        // Clase
        if (dto.getClaseId() != null) {
            Clase clase = claseService.findById(dto.getClaseId().longValue())
                    .orElseThrow(() -> new RuntimeException("Clase con ID " + dto.getClaseId() + " no encontrada"));
            alumno.setClase(clase);
        }

        // Horario
        if (dto.getHorarioId() != null) {
            Horario horario = horarioService.findById(dto.getHorarioId().longValue())
                    .orElseThrow(() -> new RuntimeException("Horario con ID " + dto.getHorarioId() + " no encontrado"));
            alumno.setHorario(horario);
        }

        return alumno;
    }

    private AlumnoDTO toDTO(Alumno alumno) {
        return AlumnoDTO.builder()
                .idAlumno(alumno.getIdAlumno())
                .nombre(alumno.getUsuario() != null ? alumno.getUsuario().getNombre() : null)
                .email(alumno.getUsuario() != null ? alumno.getUsuario().getEmail() : null)
                .claseId(alumno.getClase() != null ? alumno.getClase().getIdClase() : null)
                .horarioId(alumno.getHorario() != null ? alumno.getHorario().getIdHorario() : null)
                .build();
    }


    @PostMapping({"/",""})
    public ResponseEntity<AlumnoDTO> createAlumno(@RequestBody AlumnoDTO dto) {
        Alumno alumno = toEntity(dto);
        Alumno saved = alumnoService.save(alumno);
        return new ResponseEntity<>(toDTO(saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlumnoDTO> updateAlumno(@PathVariable Long id, @RequestBody AlumnoDTO dto) {
        if (!alumnoService.existsById(id)) {
            throw new AlumnoNotFoundException("Alumno con ID " + id + " no encontrado.");
        }
        dto.setIdAlumno(id.intValue());
        Alumno updated = alumnoService.save(toEntity(dto));
        return new ResponseEntity<>(toDTO(updated), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlumno(@PathVariable Integer id) {
        Alumno alumno = alumnoService.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        // Limpiar relaciones que bloquean el borrado
        if (alumno.getClase() != null) alumno.setClase(null);
        if (alumno.getHorario() != null) alumno.setHorario(null);
        if (alumno.getUsuario() != null) alumno.setUsuario(null);

        // Reservas se borrarán automáticamente por cascade + orphanRemoval

        alumnoService.save(alumno); // guardar los cambios antes de borrar
        alumnoService.deleteById(Long.valueOf(id));

        return ResponseEntity.noContent().build();
    }




    @PatchMapping("/{id}")
    public ResponseEntity<AlumnoDTO> patchAlumno(@PathVariable Long id, @RequestBody AlumnoDTO dto) {
        Alumno alumno = alumnoService.findById(id)
                .orElseThrow(() -> new AlumnoNotFoundException("Alumno con ID " + id + " no encontrado."));

        if (dto.getNombre() != null || dto.getEmail() != null) {
            if (alumno.getUsuario() == null) alumno.setUsuario(new Usuario());
            if (dto.getNombre() != null) alumno.getUsuario().setNombre(dto.getNombre());
            if (dto.getEmail() != null) alumno.getUsuario().setEmail(dto.getEmail());
        }

        if (dto.getClaseId() != null) {
            Clase clase = claseService.findById(dto.getClaseId().longValue())
                    .orElseThrow(() -> new RuntimeException("Clase con ID " + dto.getClaseId() + " no encontrada"));
            alumno.setClase(clase);
        }

        if (dto.getHorarioId() != null) {
            Horario horario = horarioService.findById(dto.getHorarioId().longValue())
                    .orElseThrow(() -> new RuntimeException("Horario con ID " + dto.getHorarioId() + " no encontrado"));
            alumno.setHorario(horario);
        }

        Alumno updated = alumnoService.save(alumno);
        return new ResponseEntity<>(toDTO(updated), HttpStatus.OK);
    }

    //Endpoint con paginación
//    @GetMapping({"/",""})
//    public Page<Alumno> listarAlumnos(
//            @RequestParam(required = false) String idUsuario,
//            Pageable pageable) {
//        return alumnoService.listarAlumnos(idUsuario, pageable);
//    }
}
