package org.iesvdm.musicallyx.controller;
import org.iesvdm.musicallyx.dto.ReservaTablaDTO;
import org.iesvdm.musicallyx.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.iesvdm.musicallyx.exception.ReservaNotFoundException;
import org.iesvdm.musicallyx.domain.Reserva;

import java.util.List;

@RestController
@RequestMapping("/v1/api/reservas")

public class ReservaController {
    @Autowired
    private ReservaService reservaService;

    @GetMapping({"/",""})
    public Page<ReservaTablaDTO> getAllReservas(Pageable pageable) {
        return reservaService.findAll(pageable);
    }
    @GetMapping("/{id}")
    public Reserva getReservaById(@PathVariable Long id) {
        return reservaService.findById(id)
                .orElseThrow(() -> new ReservaNotFoundException("Reserva con ID " + id + " no encontrada."));
    }


    @PostMapping({"/",""})
    public ResponseEntity<Reserva> createReserva(@RequestBody Reserva reserva) {
        Reserva createdReserva = reservaService.save(reserva);
        return new ResponseEntity<>(createdReserva, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reserva> updateReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        if (!reservaService.existsById(id)) {
            throw new ReservaNotFoundException("Reserva con ID " + id + " no encontrada.");
        }
        reserva.setIdReserva(Math.toIntExact(id));
        Reserva updatedReserva = reservaService.save(reserva);
        return new ResponseEntity<>(updatedReserva, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Long id) {
        if (!reservaService.existsById(id)) {
            throw new ReservaNotFoundException("Reserva con ID " + id + " no encontrada.");
        }
        reservaService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/tabla")
    public Page<ReservaTablaDTO> getReservasTabla(Pageable pageable) {
        return reservaService.findAll(pageable);
    }

    @GetMapping("/pendientes")
    public List<Reserva> getPendientes() {
        return reservaService.findByEstado("Pendiente");
    }

    @GetMapping("/confirmadas")
    public List<Reserva> getConfirmadas() {
        return reservaService.findByEstado("Confirmada");
    }


}
