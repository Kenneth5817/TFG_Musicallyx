package org.iesvdm.musicallyx.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.iesvdm.musicallyx.domain.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public void enviarCorreoConfirmacion(String destinatario, String alumno, String asignatura, String fechaISO, String hora, String logoUrl, String notasUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("musicallyxofficial5817@gmail.com");
            helper.setTo(destinatario);
            helper.setSubject("✅ Tu clase en Musicallyx está confirmada!");

            ZonedDateTime fechaDate = ZonedDateTime.parse(fechaISO);
            String fechaFormateada = fechaDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            String htmlMsg = "<!DOCTYPE html>" +
                    "<html lang='es'>" +
                    "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>" +
                    "<body style='margin:0;padding:0;font-family:Poppins,sans-serif;background:#ffffff;color:#333;'>" +

                    // Separadores superiores
                    "<div style='width:100%;height:8px;background:#000;'></div>" +
                    "<div style='width:100%;height:8px;background:#CE2127;'></div>" +

                    // Logo centrado
                    "<div style='text-align:center;padding:10px 0;'>" +
                    "<img src='" + logoUrl + "' alt='MusicallyX' style='max-width:180px;height:auto;'/>" +
                    "</div>" +

                    // Card principal con fondo gris clarito
                    "<div style='max-width:600px;margin:0 auto;padding:25px;border-radius:20px;background:#f5f5f5;" +
                    "border:1px solid #ddd;box-shadow:0 6px 15px rgba(0,0,0,0.1);'>" +

                    // Mensaje introductorio
                    "<div style='text-align:center;padding-bottom:15px;'>" +
                    "<p style='color:#333;font-size:1.2rem;margin:0;font-weight:500;'>Tu clase ha sido confirmada. Aquí están los detalles:</p>" +
                    "</div>" +

                    // Card con información de la clase
                    "<div style='padding:20px;border-radius:15px;background:#ffffff;margin-top:15px;text-align:center;'>" +
                    "<p style='font-size:1.1rem;margin:10px 0;'>Clase de <strong style='color:#dc3545;'>" + asignatura + "</strong></p>" +
                    "<p style='font-size:1rem;margin:8px 0;'>📅 <strong style='color:#000;border:1px solid #000;padding:6px 10px;border-radius:5px;'>" + fechaFormateada + "</strong></p>" +
                    "<p style='font-size:1rem;margin:8px 0;'>⏰ <strong style='color:#000;border:1px solid #000;padding:6px 10px;border-radius:5px;'>" + hora + "</strong></p>" +
                    "</div>" +

                    // Imagen de notas musicales grande
                    "<div style='text-align:center;margin-top:20px;'>" +
                    "<img src='" + notasUrl + "' alt='Notas musicales' style='width:100%;height:auto;border-radius:10px;'/>" +
                    "</div>" +

                    // Sobre nosotros (arriba del botón)
                    "<div style='font-size:0.95rem;color:#555;text-align:center;margin-top:25px;line-height:1.6;'>" +
                    "<p><strong>Sobre nosotros:</strong></p>" +
                    "<p>MusicallyX se preocupa porque disfrutes de la música de verdad y la hagas tuya. Aprende de manera divertida y fácil, y no te pierdas nuestros tutoriales exclusivos que te harán sentir la música como nunca antes.</p>" +
                    "<p style='margin-top:15px;font-size:0.85rem;color:#999;'>🚀 MusicallyX Team 🚀</p>" +
                    "</div>" +

                    // Botón llamativo al final con color #CE2127
                    "<div style='text-align:center;margin:25px 0;'>" +
                    "<a href='https://www.instagram.com/musicallyx_official/' target='_blank' " +
                    "style='display:inline-block;padding:14px 28px;background:#CE2127;color:#fff;font-weight:700;" +
                    "border-radius:12px;text-decoration:none;font-size:1rem;transition:all 0.3s;'>📸 Síguenos en Instagram</a>" +
                    "</div>" +

                    "</div>" +  // fin card

                    // Separadores inferiores
                    "<div style='width:100%;height:8px;background:#000;margin-top:30px;'></div>" +
                    "<div style='width:100%;height:8px;background:#CE2127;margin-bottom:15px;'></div>" +

                    "</body></html>";

            helper.setText(htmlMsg, true);
            mailSender.send(message);
            System.out.println("Correo tipo tarjeta enviado a: " + destinatario);

        } catch (MessagingException e) {
            System.err.println("Error enviando correo a " + destinatario + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("No se pudo enviar el correo: " + e.getMessage());
        }
    }






    public void sendSimpleEmail(String destinatario, String asunto, String mensajeTexto) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom("musicallyxofficial5817@gmail.com");
        mensaje.setTo(destinatario);
        mensaje.setSubject(asunto);
        mensaje.setText(mensajeTexto);

        try {
            mailSender.send(mensaje);
            System.out.println("Correo enviado a: " + destinatario);
        } catch (Exception e) {
            System.err.println("Error enviando correo a " + destinatario + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendResetPasswordEmail(String destinatario, String token) {
        String resetUrl = "http://localhost:4200/reset-password?token=" + token;
        String asunto = "Restablece tu contraseña - Musicallyx";
        String mensaje = "Hola,\n\nHas solicitado restablecer tu contraseña. Haz clic aquí para cambiarla:\n" + resetUrl +
                "\n\nSi no fuiste tú, ignora este mensaje.\n\nMusicallyx Team";

        sendSimpleEmail(destinatario, asunto, mensaje);
    }

}
