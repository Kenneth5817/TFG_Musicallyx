package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.domain.MetodoPago;
import org.iesvdm.musicallyx.exception.MetodoPagoNotFoundException;
import org.iesvdm.musicallyx.service.MetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/api/metodos-pago")
public class MetodoPagoController {

    @Autowired
    private MetodoPagoService metodoPagoService;

    @GetMapping({"/",""})
    public Page<MetodoPago> getAllMetodoPago(Pageable pageable) {
        return metodoPagoService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public MetodoPago getMetodoPagoById(@PathVariable Long id) {
        return metodoPagoService.findById(id)
                .orElseThrow(() -> new MetodoPagoNotFoundException("Método de pago con ID " + id + " no encontrado."));
    }

    @PostMapping({"/",""})
    public ResponseEntity<MetodoPago> createMetodoPago(@RequestBody MetodoPago metodoPago) {
        MetodoPago createdMetodoPago = metodoPagoService.save(metodoPago);
        return new ResponseEntity<>(createdMetodoPago, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetodoPago> updateMetodoPago(@PathVariable Long id, @RequestBody MetodoPago metodoPago) {
        if (!metodoPagoService.existsById(id)) {
            throw new MetodoPagoNotFoundException("Método de pago con ID " + id + " no encontrado.");
        }
        metodoPago.setIdMetodo(Math.toIntExact(id));
        MetodoPago updatedMetodoPago = metodoPagoService.save(metodoPago);
        return new ResponseEntity<>(updatedMetodoPago, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetodoPago(@PathVariable Long id) {
        if (!metodoPagoService.existsById(id)) {
            throw new MetodoPagoNotFoundException("Método de pago con ID " + id + " no encontrado.");
        }
        metodoPagoService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MetodoPago> patchMetodoPago(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        MetodoPago metodoPago = metodoPagoService.findById(id)
                .orElseThrow(() -> new MetodoPagoNotFoundException("Método de pago con ID " + id + " no encontrado."));

        if (updates.containsKey("tipo")) {
            metodoPago.setTipo((String) updates.get("tipo"));
        }
        if (updates.containsKey("descripcion")) {
            metodoPago.setDescripcion((String) updates.get("descripcion"));
        }

        MetodoPago updated = metodoPagoService.save(metodoPago);
        return ResponseEntity.ok(updated);
    }




}

