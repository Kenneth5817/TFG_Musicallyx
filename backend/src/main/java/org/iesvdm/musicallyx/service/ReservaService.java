package org.iesvdm.musicallyx.service;
import org.iesvdm.musicallyx.domain.Reserva;
import org.iesvdm.musicallyx.dto.ReservaTablaDTO;
import org.iesvdm.musicallyx.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;


    public Page<ReservaTablaDTO> findAll(Pageable pageable) {
        return reservaRepository.findAllReservaTabla(pageable);
    }

    public Optional<Reserva> findById(Long id) {
        return reservaRepository.findById(id);
    }

    public Reserva save(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    public void deleteById(Long id) {
        reservaRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return reservaRepository.existsById(id);
    }

/**
    public List<ReservaTablaDTO> findAllTabla(Pageable pageable) {
        return reservaRepository.findAllBy(pageable).stream()
                .map(r -> new ReservaTablaDTO(
                        r.getAlumno() != null ? r.getAlumno().getUsuario().getNombre() : "Sin alumno",
                        r.getClase() != null ? r.getClase().getNombreClase() : "Sin clase",
                        r.getIdReserva() != null ? r.getIdReserva().toString() : "0",                 // idReserva como String

                        r.getIdReserva(),
                        r.getEstado(),
                        r.getFechaReserva(),
                        r.getMetodoPago()
                ))
                .collect(Collectors.toList());
    }**/

    public List<Reserva> findByEstado(String estado) {
        return reservaRepository.findByEstado(estado);
    }



}
