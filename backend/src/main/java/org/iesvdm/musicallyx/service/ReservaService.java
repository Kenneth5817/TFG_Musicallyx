package org.iesvdm.musicallyx.service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.iesvdm.musicallyx.domain.Reserva;
import org.iesvdm.musicallyx.domain.Rol;
import org.iesvdm.musicallyx.domain.Usuario;
import org.iesvdm.musicallyx.dto.ReservaDTO;
import org.iesvdm.musicallyx.dto.ReservaTablaDTO;
import org.iesvdm.musicallyx.repository.ReservaRepository;
import org.iesvdm.musicallyx.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JavaMailSender mailSender;


    public Page<ReservaTablaDTO> findAll(Pageable pageable) {
        return reservaRepository.findAllReservaTabla(pageable);
    }

    public Optional<Reserva> findById(Long id) {
        return reservaRepository.findById(id);
    }

    public void setSemanaYFechaClase(Reserva reserva, LocalDate fechaSeleccionada) {
        // Guardamos la fecha exacta directamente
        reserva.setFechaClase(fechaSeleccionada);

        // Calculamos lunes y domingo de esa semana
        LocalDate lunes = fechaSeleccionada.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate domingo = fechaSeleccionada.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        // Formato de semana dd/MM-dd/MM
        DateTimeFormatter formatoSemana = DateTimeFormatter.ofPattern("dd/MM");
        reserva.setSemana(lunes.format(formatoSemana) + "-" + domingo.format(formatoSemana));
    }

    public Reserva save(Reserva reserva) {
        // Si el front no envía fechaClase, usamos hoy
        LocalDate fechaSeleccionada = reserva.getFechaClase() != null
                ? reserva.getFechaClase()
                : LocalDate.now();

        // Guardamos fechaClase y semana correctas
        setSemanaYFechaClase(reserva, fechaSeleccionada);

        // Usuario
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(reserva.getEmail());
        if (usuarioExistente.isEmpty()) {
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombre(reserva.getNombre());
            nuevoUsuario.setEmail(reserva.getEmail());
            nuevoUsuario.setTelefono(reserva.getTelefono());
            nuevoUsuario.setNivelMusical(reserva.getNivel());
            nuevoUsuario.setGustosMusicales("");
            nuevoUsuario.setPassword("invitado");
            nuevoUsuario.setRol(Rol.USER);
            usuarioRepository.save(nuevoUsuario);
        }

        return reservaRepository.save(reserva);
    }

    public List<Reserva> findByEmail(String email) {
        return reservaRepository.findByEmail(email);
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

    public void marcarCorreoEnviado(Integer idReserva) {
        Reserva r = reservaRepository.findById(Long.valueOf(idReserva))
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        r.setCorreoEnviado(true);
        reservaRepository.save(r);
    }

    public void enviarCorreoReservaHtml(String destinatario, ReservaDTO reservaDTO) {
        try {
            System.out.println("🔥 Intentando enviar correo a: " + reservaDTO.getEmail());
            System.out.println("🔥 FechaClase DTO: " + reservaDTO.getFechaClase());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("musicallyxofficial5817@gmail.com");
            helper.setTo(destinatario);
            helper.setSubject("🎵 Hemos recibido tu solicitud - MusicallyX");

            String logoUrl = "https://drive.google.com/uc?export=view&id=1fJxSMYFN-OtjE6gwq3itFUVLUJn9W0oL";

            String nombreCompleto = reservaDTO.getNombre() + " " + reservaDTO.getApellidos();

            String htmlMsg = "<html><body style='font-family:Arial,sans-serif;color:#333;text-align:center;'>"
                    + "<div style='width:100%;height:8px;background:#000;'></div>"
                    + "<div style='width:100%;height:8px;background:#CE2127;'></div>"
                    + "<div style='text-align:center;padding:10px 0;'><img src='" + logoUrl + "' alt='MusicallyX' style='max-width:180px;height:auto;'/></div>"
                    + "<p>Hola <strong>" + nombreCompleto + "</strong>,</p>"
                    + "<p>Gracias por confiar en Musicallyx 🎶</p>"
                    + "<p>Hemos recibido correctamente tu solicitud de clase de <strong style='color:#CE2127;'>" + reservaDTO.getAsignatura() + "</strong>.</p>"
                    + "<p>Estos son los datos de tu reserva:</p>"
                    + "<p>🎶<strong> Asignatura:</strong>" + reservaDTO.getAsignatura() + "</p>"
                    + "<p>🎹<strong> Nivel: </strong>" + reservaDTO.getNivel() + "</p>"
                    + "<p>📚 <strong>Modalidad: </strong>" + reservaDTO.getModalidad() + "</p>"
                    + "<p>💳 <strong>Bono: </strong>" + reservaDTO.getBono() + "</p>"
                    + "<p>🗓️ <strong>Día: </strong>" + reservaDTO.getFechaClase() + "</p>"
                    + "<p>⏰ <strong>Hora: </strong>" + reservaDTO.getHora() + "</p>"
                    + "<p>¡Nos pondremos en contacto contigo lo antes posible para ultimar los detalles!</p>"
                    + "<p><strong>Musicallyx Team 🚀</strong></p>"
                    + "<div style='font-size:0.95rem;color:#555;margin-top:25px;line-height:1.6;'>"
                    + "<p>Sigue Musicallyx en Instagram para no perderte nada:</p>"
                    + "<p style='font-size:1rem;color:#CE2127;font-weight:700;'>@musicallyx_official</p>"
                    + "</div>"
                    + "<div style='text-align:center;margin:25px 0;'>"
                    + "<a href='https://www.instagram.com/musicallyx_official/' target='_blank' "
                    + "style='display:inline-block;padding:14px 28px;background:#CE2127;color:#fff;font-weight:700;"
                    + "border-radius:12px;text-decoration:none;font-size:1rem;'>Síguenos en Instagram</a>"
                    + "</div>"
                    + "</body></html>";

            helper.setText(htmlMsg, true);
            mailSender.send(message);
            System.out.println("Correo de reserva HTML enviado a: " + destinatario);

        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("No se pudo enviar el correo de reserva: " + e.getMessage());
        }
    }

}
