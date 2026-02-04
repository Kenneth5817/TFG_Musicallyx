package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.dto.AlumnoDTO;
import org.iesvdm.musicallyx.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.iesvdm.musicallyx.domain.Alumno;

import java.util.Optional;

@Service
@Transactional
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    public Page<Alumno> findAll(Pageable pageable) {
        return alumnoRepository.findAllBy(pageable);
    }

    public Optional<Alumno> findById(Long id) {
        return alumnoRepository.findById(id);
    }

    public Alumno save(Alumno alumno) {
        return alumnoRepository.save(alumno);
    }


    public boolean existsById(Long id) {
        return alumnoRepository.existsById(id);
    }

    public AlumnoDTO toDTO(Alumno alumno) {
        return AlumnoDTO.builder()
                .idAlumno(alumno.getIdAlumno())
                .nombre(alumno.getUsuario() != null ? alumno.getUsuario().getNombre() : null)
                .email(alumno.getUsuario() != null ? alumno.getUsuario().getEmail() : null)
                .claseId(alumno.getClase() != null ? alumno.getClase().getIdClase() : null)
                .horarioId(alumno.getHorario() != null ? alumno.getHorario().getIdHorario() : null)
                .build();
    }

    public Page<AlumnoDTO> toDTO(Page<Alumno> alumnos) {
        return alumnos.map(this::toDTO);
    }

    @Transactional
    public void deleteById(Long id) {
        alumnoRepository.deleteById(id); // Hibernate solo hace DELETE sobre la PK
    }

//    /**Añadimos el pageable**/
//    public Page<Alumno> listarAlumnos(String idUsuario, Pageable pageable) {
//        return alumnoRepository.findByIdUsuarioContainingIgnoreCase(idUsuario, pageable);
//    }
}
