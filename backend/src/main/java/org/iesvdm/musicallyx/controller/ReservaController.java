package org.iesvdm.musicallyx.controller;
import org.iesvdm.musicallyx.dto.ReservaDTO;
import org.iesvdm.musicallyx.dto.ReservaTablaDTO;
import org.iesvdm.musicallyx.repository.ReservaRepository;
import org.iesvdm.musicallyx.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.iesvdm.musicallyx.exception.ReservaNotFoundException;
import org.iesvdm.musicallyx.domain.Reserva;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/v1/api/reservas")

public class ReservaController {
    @Autowired
    private ReservaService reservaService;

    @Autowired
    private ReservaRepository reservaRepository;
    @GetMapping({"/",""})
    public Page<ReservaTablaDTO> getAllReservas(Pageable pageable) {
        return reservaService.findAll(pageable);
    }
    @GetMapping("/{id}")
    public Reserva getReservaById(@PathVariable Long id) {
        return reservaService.findById(id)
                .orElseThrow(() -> new ReservaNotFoundException("Reserva con ID " + id + " no encontrada."));
    }

    @GetMapping("/usuario/{email}")
    public List<Reserva> getReservasPorUsuario(@PathVariable String email) {
        return reservaService.findByEmail(email);
    }
    @PostMapping("/correo-test")
    public ResponseEntity<String> correoTest() {
        ReservaDTO dto = new ReservaDTO(
                "Test","Usuario","123456789",
                "kennethjensenquero@gmail.com","Profesor X",
                "Lenguaje Musical", LocalDate.of(2026,4,15),
                "18:00-19:00","Clase 1h (22€)","Online","Normal"
        );
        reservaService.enviarCorreoReservaHtml(dto.getEmail(), dto);
        return ResponseEntity.ok("Correo test enviado");
    }

    @GetMapping("/semana/{semana}")
    public List<Reserva> getReservasPorSemana(@PathVariable String semana) {
        // La semana vendrá en formato ISO yyyy-MM-dd_to_yyyy-MM-dd
        String[] fechas = semana.split("_to_");
        LocalDate inicio = LocalDate.parse(fechas[0]);
        LocalDate fin = LocalDate.parse(fechas[1]);
        return reservaRepository.findByFechaClaseBetween(inicio, fin);
    }

    @PostMapping({"/",""})
    public ResponseEntity<Reserva> createReserva(@RequestBody ReservaDTO dto) {

        System.out.println("🔥 DTO RECIBIDO:");
        System.out.println("fechaClase: " + dto.getFechaClase());
        System.out.println("hora: " + dto.getHora());
        System.out.println("email: " + dto.getEmail());

        Reserva reserva = new Reserva();
        reserva.setNombre(dto.getNombre());
        reserva.setApellidos(dto.getApellidos());
        reserva.setTelefono(dto.getTelefono());
        reserva.setEmail(dto.getEmail());
        reserva.setAsignatura(dto.getAsignatura());
        reserva.setFechaClase(dto.getFechaClase());
        reserva.setHora(dto.getHora());
        reserva.setBono(dto.getBono());
        reserva.setModalidad(dto.getModalidad());
        reserva.setNivel(dto.getNivel());

        reserva.setEstado("Pendiente");
        // 🔥 1. GUARDAR EN BD
        Reserva createdReserva = reservaService.save(reserva);

        System.out.println("🔥 GUARDADO EN BBDD:");
        System.out.println("fechaClase: " + createdReserva.getFechaClase());
        System.out.println("hora: " + createdReserva.getHora());
        System.out.println("email: " + createdReserva.getEmail());

        // 🔥 2. ENVIAR EMAIL (AQUÍ ESTÁ LA MAGIA)
        try {
            reservaService.enviarCorreoReservaHtml(createdReserva.getEmail(), dto);
            System.out.println("📧 Email enviado correctamente");
        } catch (Exception e) {
            System.err.println("❌ Error enviando email: " + e.getMessage());
        }

        // 🔥 3. RESPUESTA NORMAL
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

    @PutMapping("/confirmar/{id}")
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable Integer id) {
        Reserva reserva = reservaService.findById(Long.valueOf(id))
                .orElseThrow(() -> new ReservaNotFoundException("Reserva no encontrada"));

        reserva.setEstado("Confirmada");
        reserva.setFechaConfirmacion(new Date());
        Reserva updated = reservaService.save(reserva);

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/pendiente/{id}")
    public ResponseEntity<Reserva> devolverAPendientes(@PathVariable Integer id) {
        Reserva reserva = reservaService.findById(Long.valueOf(id))
                .orElseThrow(() -> new ReservaNotFoundException("Reserva con ID " + id + " no encontrada."));

        reserva.setEstado("Pendiente");
        reserva.setFechaConfirmacion(null);
        Reserva updated = reservaService.save(reserva);

        return new ResponseEntity<>(updated, HttpStatus.OK);
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
