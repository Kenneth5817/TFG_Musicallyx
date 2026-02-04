package org.iesvdm.musicallyx.controller;


import org.iesvdm.musicallyx.domain.Pago;
import org.iesvdm.musicallyx.exception.PagoNotFoundException;
import org.iesvdm.musicallyx.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/v1/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping({"/",""})
    public Page<Pago> getAllPagos(Pageable pageable) {
        return pagoService.findAll(pageable);
    }


    @GetMapping("/{id}")
    public Pago getPagoById(@PathVariable Long id) {
        return pagoService.findById(id)
                .orElseThrow(() -> new PagoNotFoundException("Pago con ID " + id + " no encontrado."));
    }

    @PostMapping({"/",""})
    public ResponseEntity<Pago> createPago(@RequestBody Pago pago) {
        Pago createdPago = pagoService.save(pago);
        return new ResponseEntity<>(createdPago, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pago> updatePago(@PathVariable Long id, @RequestBody Pago pago) {
        if (!pagoService.existsById(id)) {
            throw new PagoNotFoundException("Pago con ID " + id + " no encontrado.");
        }
        pago.setIdPago(Math.toIntExact(id));
        Pago updatedPago = pagoService.save(pago);
        return new ResponseEntity<>(updatedPago, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePago(@PathVariable Long id) {
        if (!pagoService.existsById(id)) {
            throw new PagoNotFoundException("Pago con ID " + id + " no encontrado.");
        }
        pagoService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Pago> patchPago(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> updates) {

        Pago pago = pagoService.findById(Long.valueOf(id))
                .orElseThrow(() -> new PagoNotFoundException("Pago con ID " + id + " no encontrado."));

        updates.forEach((key, value) -> {
            switch (key) {
                case "idTransaccionProveedor":
                    pago.setIdTransaccionProveedor((String) value);
                    break;
                case "monto":
                    pago.setMonto(Double.parseDouble(value.toString()));
                    break;
                case "fechaPago":
                    pago.setFechaPago(LocalDateTime.parse((String) value));
                    break;
                case "estado":
                    pago.setEstado(Pago.EstadoPago.valueOf((String) value));
                    break;
                // Puedes añadir más campos si es necesario
            }
        });

        Pago updatedPago = pagoService.save(pago);
        return ResponseEntity.ok(updatedPago);
    }


}
