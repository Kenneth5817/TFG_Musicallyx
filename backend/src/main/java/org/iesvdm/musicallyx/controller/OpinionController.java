package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/opinion")
public class OpinionController {

    private final EmailService emailService;

    public OpinionController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarOpinion(@RequestBody Map<String, String> payload) {
        String opinion = payload.get("opinion");
        if(opinion == null || opinion.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("La opinión no puede estar vacía");
        }

        // ✅ Enviar correo al admin
        emailService.sendSimpleEmail("musicallyxofficial5817@gmail.com", "Nueva sugerencia de usuario", opinion);

        return ResponseEntity.ok("Opinión enviada correctamente ✅");
    }
}
