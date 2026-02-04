package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.domain.Chat;
import org.iesvdm.musicallyx.domain.Usuario;
import org.iesvdm.musicallyx.dto.EmailDTO;
import org.iesvdm.musicallyx.service.ChatService;
import org.iesvdm.musicallyx.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/mensajes")
public class ChatController {

    private final ChatService mensajeService;
    private final UsuarioService userService;

    public ChatController(ChatService mensajeService, UsuarioService userService) {
        this.mensajeService = mensajeService;
        this.userService = userService;
    }

    // ✅ Enviar mensaje
    @PostMapping("/enviar")
    public EmailDTO enviarMensaje(@RequestBody EmailDTO chatDTO) {

        Usuario emisor = userService.findByEmail(chatDTO.getEmisor());
        Usuario receptor = userService.findByEmail(chatDTO.getReceptor());

        // <-- ahora enviamos asunto también
        Chat mensaje = mensajeService.enviarMensaje(emisor, receptor, chatDTO.getTexto(), chatDTO.getAsunto());

        return new EmailDTO(
                mensaje.getId(),
                mensaje.getTexto(),
                mensaje.getAsunto(),            // <-- incluir asunto
                mensaje.getEmisor().getEmail(),
                mensaje.getReceptor().getEmail(),
                mensaje.getFechaEnvio().toString(),
                mensaje.isLeido()
        );
    }

    // ✅ Obtener chat entre dos usuarios
    @GetMapping("/chat")
    public List<EmailDTO> obtenerMensajes(@RequestParam String usuario1Email,
                                          @RequestParam String usuario2Email) {

        Usuario usuario1 = userService.findByEmail(usuario1Email);
        Usuario usuario2 = userService.findByEmail(usuario2Email);

        List<Chat> mensajes = mensajeService.obtenerMensajes(usuario1, usuario2);

        return mensajes.stream()
                .map(m -> new EmailDTO(
                        m.getId(),
                        m.getTexto(),
                        m.getAsunto(),                // <-- incluir asunto
                        m.getEmisor().getEmail(),
                        m.getReceptor().getEmail(),
                        m.getFechaEnvio().toString(),
                        m.isLeido()
                ))
                .toList();
    }

    // ✅ Mensajes recibidos
    @GetMapping("/recibidos")
    public List<EmailDTO> obtenerRecibidos(@RequestParam String usuario) {
        Usuario u = userService.findByEmail(usuario);
        return mensajeService.obtenerRecibidos(u)
                .stream()
                .map(m -> new EmailDTO(
                        m.getId(),
                        m.getTexto(),
                        m.getAsunto(),                // <-- incluir asunto
                        m.getEmisor().getEmail(),
                        m.getReceptor().getEmail(),
                        m.getFechaEnvio().toString(),
                        m.isLeido()
                ))
                .toList();
    }

    // ✅ Mensajes enviados
    @GetMapping("/enviados")
    public List<EmailDTO> obtenerEnviados(@RequestParam String usuario) {
        Usuario u = userService.findByEmail(usuario);
        return mensajeService.obtenerEnviados(u)
                .stream()
                .map(m -> new EmailDTO(
                        m.getId(),
                        m.getTexto(),
                        m.getAsunto(),                // <-- incluir asunto
                        m.getEmisor().getEmail(),
                        m.getReceptor().getEmail(),
                        m.getFechaEnvio().toString(),
                        m.isLeido()
                ))
                .toList();
    }

    // ✅ Actualizar mensaje COMPLETO (PUT)
    @PutMapping("/{id}")
    public EmailDTO actualizarMensajeCompleto(@PathVariable Long id, @RequestBody EmailDTO dto) {

        Chat mensaje = mensajeService.findById(id);

        mensaje.setTexto(dto.getTexto());
        mensaje.setAsunto(dto.getAsunto());

        Chat actualizado = mensajeService.save(mensaje);

        return new EmailDTO(
                actualizado.getId(),
                actualizado.getTexto(),
                actualizado.getAsunto(),
                actualizado.getEmisor().getEmail(),
                actualizado.getReceptor().getEmail(),
                actualizado.getFechaEnvio().toString(),
                actualizado.isLeido()
        );
    }

    @DeleteMapping("/{id}")
    public void eliminarMensaje(@PathVariable Long id) {
        mensajeService.deleteById(id);
    }

    @PatchMapping("/{id}")
    public EmailDTO actualizarMensajeParcial(@PathVariable Long id, @RequestBody EmailDTO dto) {

        Chat mensaje = mensajeService.findById(id);

        if (dto.getTexto() != null) {
            mensaje.setTexto(dto.getTexto());
        }
        if (dto.getAsunto() != null) {
            mensaje.setAsunto(dto.getAsunto());
        }

        Chat actualizado = mensajeService.save(mensaje);

        return new EmailDTO(
                actualizado.getId(),
                actualizado.getTexto(),
                actualizado.getAsunto(),
                actualizado.getEmisor().getEmail(),
                actualizado.getReceptor().getEmail(),
                actualizado.getFechaEnvio().toString(),
                actualizado.isLeido()
        );
    }



    // ✅ Marcar mensaje como leído
    @PutMapping("/leido/{mensajeId}")
    public EmailDTO marcarLeido(@PathVariable Long mensajeId) {
        Chat mensaje = mensajeService.marcarComoLeido(mensajeId);
        return new EmailDTO(
                mensaje.getId(),
                mensaje.getTexto(),
                mensaje.getAsunto(),            // <-- incluir asunto
                mensaje.getEmisor().getEmail(),
                mensaje.getReceptor().getEmail(),
                mensaje.getFechaEnvio().toString(),
                mensaje.isLeido()
        );
    }
    // ✅ Marcar varios mensajes como leídos
    @PutMapping("/marcar-leidos")
    public List<EmailDTO> marcarVariosLeidos(@RequestBody List<Long> ids) {
        List<Chat> mensajesActualizados = ids.stream()
                .map(id -> mensajeService.marcarComoLeido(id))
                .toList();

        return mensajesActualizados.stream()
                .map(m -> new EmailDTO(
                        m.getId(),
                        m.getTexto(),
                        m.getAsunto(),
                        m.getEmisor().getEmail(),
                        m.getReceptor().getEmail(),
                        m.getFechaEnvio().toString(),
                        m.isLeido()
                ))
                .toList();
    }


}


