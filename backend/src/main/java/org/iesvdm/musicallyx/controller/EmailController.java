package org.iesvdm.musicallyx.controller;
import jakarta.mail.internet.MimeMessage;
import org.iesvdm.musicallyx.domain.Chat;
import org.iesvdm.musicallyx.domain.Reserva;
import org.iesvdm.musicallyx.domain.Usuario;
import org.iesvdm.musicallyx.dto.EmailDTO;
import org.iesvdm.musicallyx.dto.ReservaDTO;
import org.iesvdm.musicallyx.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ReservaService reservaService;


    @Autowired
    private EmailService emailService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ChatService chatService;

    @Autowired
    private SuscriptorService suscriptorService;


    // Endpoint para enviar correo de confirmación de clase
    @PostMapping("/confirmacion")
    public String enviarCorreoConfirmacion(@RequestBody ReservaDTO reserva) {

        String logoUrl = "https://drive.google.com/uc?export=view&id=1fJxSMYFN-OtjE6gwq3itFUVLUJn9W0oL";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("musicallyxofficial5817@gmail.com");
            helper.setTo(reserva.getEmail());
            helper.setSubject("🎵 Tu clase ha sido confirmada - MusicallyX");

            String htmlMsg =
                    "<!DOCTYPE html>" +
                            "<html lang='es'>" +
                            "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>" +
                            "<body style='margin:0;padding:0;font-family:Poppins,sans-serif;background:#ffffff;color:#333;'>" +

                            // Rayitas arriba
                            "<div style='width:100%;height:8px;background:#000;'></div>" +
                            "<div style='width:100%;height:8px;background:#CE2127;'></div>" +

                            // Logo centrado
                            "<div style='text-align:center;padding:10px 0;'>" +
                            "<img src='" + logoUrl + "' alt='Musicallyx' style='max-width:180px;height:auto;'/>" +
                            "</div>" +

                            // Contenedor principal
                            "<div style='max-width:600px;margin:0 auto;padding:25px;border-radius:20px;background:#f5f5f5;" +
                            "border:1px solid #ddd;box-shadow:0 6px 15px rgba(0,0,0,0.1);'>" +

                            "<div style='text-align:center;padding-bottom:15px;'>" +
                            "<h2 style='margin:0;color:#CE2127;'>Tu clase ha sido confirmada</h2>" +
                            "<p style='color:#333;font-size:1.1rem;margin-top:10px;'>Aquí están los detalles de tu reserva:</p>" +
                            "</div>" +

                            "<div style='padding:20px;border-radius:15px;background:#ffffff;margin-top:15px;line-height:1.6;'>" +
                            "<p>🎶 <strong>Asignatura:</strong> " + reserva.getAsignatura() + "</p>" +
                            "<p>📅 <strong>Día:</strong> " + reserva.getFechaClase() + "</p>" +
                            "<p>⏰ <strong>Hora:</strong> " + reserva.getHora() + "</p>" +
                            "<p>🎹 <strong>Modalidad:</strong> " + reserva.getModalidad() + "</p>" +
                            "<p>📚 <strong>Nivel:</strong> " + reserva.getNivel() + "</p>" +
                            "<p>💳 <strong>Bono:</strong> " + reserva.getBono() + "</p>" +
                            "</div>" +

                            // Mensaje de seguimiento
                            "<div style='font-size:0.95rem;color:#555;text-align:center;margin-top:25px;line-height:1.6;'>" +
                            "<p>Sigue Musicallyx en Instagram para no perderte nada:</p>" +
                            "<p style='font-size:1rem;color:#CE2127;font-weight:700;'>@musicallyx_official</p>" +
                            "</div>" +

                            // Botón de Instagram
                            "<div style='text-align:center;margin:25px 0;'>" +
                            "<a href='https://www.instagram.com/musicallyx_official/' target='_blank' " +
                            "style='display:inline-block;padding:14px 28px;background:#CE2127;color:#fff;font-weight:700;" +
                            "border-radius:12px;text-decoration:none;font-size:1rem;'>Síguenos en Instagram</a>" +
                            "</div>" +

                            "</div>" +

                            // Rayitas abajo
                            "<div style='width:100%;height:8px;background:#000;margin-top:30px;'></div>" +
                            "<div style='width:100%;height:8px;background:#CE2127;margin-bottom:15px;'></div>" +

                            "</body></html>";

            helper.setText(htmlMsg, true);
            mailSender.send(message);

            return "Correo de confirmación enviado a " + reserva.getEmail();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error enviando correo: " + e.getMessage();
        }
    }

    @PostMapping("/reset-password")
    public String enviarCorreoRecuperacion(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            return "Email inválido";
        }

        String asunto = "Recuperación de contraseña - Musicallyx";
        String mensaje = "Hola,\n\n" +
                "Recibimos una solicitud para restablecer tu contraseña.\n" +
                "Haz clic en el siguiente enlace para cambiarla:\n\n" +
                "https://musicallyxx.netlify.app/reset-password?email=" + email + "\n\n" +
                "Si no fuiste tú, simplemente ignora este mensaje.\n\n" +
                "Musicallyx Team";

        emailService.sendSimpleEmail(email, asunto, mensaje);

        return "Correo de recuperación enviado a " + email;
    }

    @PostMapping("/suscripcion")
    public String enviarCorreoSuscripcion(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || !email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return "Email inválido";
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("musicallyxofficial5817@gmail.com");
            helper.setTo(email);
            helper.setSubject("🎵 ¡Gracias por suscribirte a Musicallyx!");

            String logoUrl = "https://drive.google.com/uc?export=view&id=1fJxSMYFN-OtjE6gwq3itFUVLUJn9W0oL";

            String htmlMsg =
                    "<!DOCTYPE html>" +
                            "<html lang='es'>" +
                            "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>" +
                            "<body style='margin:0;padding:0;font-family:Poppins,sans-serif;background:#ffffff;color:#333;'>" +

                            "<div style='width:100%;height:8px;background:#000;'></div>" +
                            "<div style='width:100%;height:8px;background:#CE2127;'></div>" +

                            "<div style='text-align:center;padding:10px 0;'>" +
                            "<img src='" + logoUrl + "' alt='Musicallyx' style='max-width:180px;height:auto;'/>" +
                            "</div>" +

                            "<div style='max-width:600px;margin:0 auto;padding:25px;border-radius:20px;background:#f5f5f5;" +
                            "border:1px solid #ddd;box-shadow:0 6px 15px rgba(0,0,0,0.1);'>" +

                            "<div style='text-align:center;padding-bottom:15px;'>" +
                            "<h2 style='margin:0;color:#CE2127;'>¡Gracias por unirte a Musicallyx!</h2>" +
                            "<p style='color:#333;font-size:1.1rem;margin-top:10px;'>Tu suscripción ha sido registrada correctamente.</p>" +
                            "</div>" +

                            "<div style='padding:20px;border-radius:15px;background:#ffffff;margin-top:15px;line-height:1.6;'> " +
                            "<p>🎹 <strong>Recibirás tutoriales, novedades y contenido exclusivo</strong> para mejorar cada día.</p>" +
                            "<p>✨ <strong>¡No te pierdas nada!</strong> Tenemos muchas sorpresas musicales para ti.</p>" +
                            "</div>" +

                            "<div style='font-size:0.95rem;color:#555;text-align:center;margin-top:25px;line-height:1.6;'>" +
                            "<p><strong>Síguenos en Instagram</strong> para más contenido, noticias y avances:</p>" +
                            "<p style='font-size:1rem;color:#CE2127;font-weight:700;'>@musicallyx_official</p>" +
                            "</div>" +

                            "<div style='text-align:center;margin:25px 0;'>" +
                            "<a href='https://www.instagram.com/musicallyx_official/' target='_blank' " +
                            "style='display:inline-block;padding:14px 28px;background:#CE2127;color:#fff;font-weight:700;" +
                            "border-radius:12px;text-decoration:none;font-size:1rem;'>Síguenos en Instagram</a>" +
                            "</div>" +

                            "</div>" +

                            "<div style='width:100%;height:8px;background:#000;margin-top:30px;'></div>" +
                            "<div style='width:100%;height:8px;background:#CE2127;margin-bottom:15px;'></div>" +

                            "</body></html>";

            helper.setText(htmlMsg, true);
            mailSender.send(message);

            return "Correo de suscripción enviado a " + email;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error enviando correo: " + e.getMessage();
        }
    }

    @CrossOrigin(origins = "https://musicallyxx.netlify.app")
    @PostMapping("/reset-password-request")
    public ResponseEntity<String> resetPasswordRequest(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email inválido");
        }

        Usuario usuario = usuarioService.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe un usuario con ese email");
        }

        // Generar token y guardarlo con fecha de expiración
        String token = UUID.randomUUID().toString();
        usuarioService.saveResetToken(Long.valueOf(usuario.getIdUsuario()), token, LocalDateTime.now().plusHours(1));

        // Construir link con token
        String resetUrl = "https://musicallyxx.netlify.app/reset-password?token=" + token;

        // Enviar correo
        String asunto = "Restablece tu contraseña - Musicallyx";
        String mensaje = "Has solicitado restablecer tu contraseña. Haz clic aquí para cambiarla:\n" + resetUrl;
        emailService.sendSimpleEmail(email, asunto, mensaje);

        return ResponseEntity.ok("Correo de restablecimiento enviado");
    }

    @PostMapping("/enviar")
    public ResponseEntity<EmailDTO> enviarCorreoYGuardar(@RequestBody EmailDTO emailDTO) {
        if (emailDTO.getReceptor() == null || emailDTO.getReceptor().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 1️⃣ Enviar correo usando tu EmailService
        String destinatario = emailDTO.getReceptor();
        String asunto = emailDTO.getAsunto();
        String mensaje = emailDTO.getTexto();

        try {
            emailService.sendSimpleEmail(destinatario, asunto, mensaje);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }

        // 2️⃣ Guardar mensaje en la base de datos como chat
        Usuario emisor = usuarioService.findByEmail(emailDTO.getEmisor());
        Usuario receptor = usuarioService.findByEmail(emailDTO.getReceptor());

        Chat chatGuardado = chatService.enviarMensaje(emisor, receptor, mensaje, asunto);

        // 3️⃣ Convertir Chat a EmailDTO para la respuesta
        EmailDTO respuesta = new EmailDTO(
                chatGuardado.getId(),
                chatGuardado.getTexto(),
                chatGuardado.getAsunto(),
                chatGuardado.getEmisor().getEmail(),
                chatGuardado.getReceptor().getEmail(),
                chatGuardado.getFechaEnvio().toString(),
                chatGuardado.isLeido()
        );

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/suscribirse")
    public ResponseEntity<String> suscribirse(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        // Validación básica del email
        if (email == null || !email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return ResponseEntity.badRequest().body("Email inválido");
        }

        // Guardar en BD, devuelve null si ya existe
        var guardado = suscriptorService.guardarSuscriptor(email);

        if (guardado == null) {
            // Email ya estaba registrado
            return ResponseEntity.status(409).body("Ya estás suscrito");
        }

        // Enviar correo de bienvenida
        enviarCorreoSuscripcion(body);

        return ResponseEntity.ok("¡Suscripción exitosa! Te hemos enviado un correo de confirmación.");
    }


    @PostMapping("/solicitud-reserva")
    public ResponseEntity<String> enviarSolicitudReserva(@RequestBody ReservaDTO reservaDTO) {

        if (reservaDTO.getEmail() == null || reservaDTO.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email inválido");
        }

        // 1️⃣ Guardar reserva
        Reserva reserva = new Reserva();
        reserva.setNombre(reservaDTO.getNombre());
        reserva.setApellidos(reservaDTO.getApellidos());
        reserva.setTelefono(reservaDTO.getTelefono());
        reserva.setEmail(reservaDTO.getEmail());
        reserva.setAsignatura(reservaDTO.getAsignatura());
        reserva.setBono(reservaDTO.getBono());
        reserva.setNivel(reservaDTO.getNivel());
        reserva.setModalidad(reservaDTO.getModalidad());
        reserva.setFechaClase(reservaDTO.getFechaClase());
        reserva.setHora(reservaDTO.getHora());
        reserva.setEstado("Pendiente");
        reserva.setFechaReserva(new Date());
        reserva.setCorreoEnviado(false);

        Reserva reservaGuardada = reservaService.save(reserva);

        String nombreCompleto = reservaDTO.getNombre() + " " + reservaDTO.getApellidos();

        try {
            // 2️⃣ Enviar correo HTML al usuario
            reservaService.enviarCorreoReservaHtml(reservaDTO.getEmail(), reservaDTO);
            // 3️⃣ Enviar correo simple al admin
            String asuntoAdmin = "🔔 Nueva reserva Musicallyx";
            String mensajeAdmin =
                    "Nueva reserva recibida:\n\n" +
                            "Nombre: " + nombreCompleto + "\n" +
                            "Email: " + reservaDTO.getEmail() + "\n" +
                            "Teléfono: " + reservaDTO.getTelefono() + "\n" +
                            "Asignatura: " + reservaDTO.getAsignatura() + "\n" +
                            "Bono: " + reservaDTO.getBono() + "\n" +
                            "Nivel: " + reservaDTO.getNivel() + "\n" +
                            "Modalidad: " + reservaDTO.getModalidad() + "\n" +
                            "Fecha clase: " + reservaDTO.getFechaClase() + "\n" +
                            "Hora: " + reservaDTO.getHora();

            emailService.sendSimpleEmail("musicallyxofficial5817@gmail.com", asuntoAdmin, mensajeAdmin);

            // 4️⃣ Marcar correoEnviado = true
            reservaService.marcarCorreoEnviado(reservaGuardada.getIdReserva());

            return ResponseEntity.ok("Correo de solicitud enviado y reserva guardada correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error enviando correo, pero reserva guardada");
        }
    }
}
