package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.domain.*;
import org.iesvdm.musicallyx.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProfesorRepository profesorRepository;

    @Autowired
    private ClaseRepository claseRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @GetMapping("/usuarios")
    public Page<Usuario> getUsuarios(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }

    @GetMapping("/profesores")
    public Page<Profesor> getProfesores(Pageable pageable) {
        return profesorRepository.findAll(pageable);
    }

    @GetMapping("/clases")
    public Page<Clase> getClases(Pageable pageable) {
        return claseRepository.findAll(pageable);
    }


    @GetMapping("/reservas")
    public Page<Reserva> getReservas(Pageable pageable) {
        return reservaRepository.findAll(pageable);
    }
}
