package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.domain.Chat;
import org.iesvdm.musicallyx.domain.Usuario;
import org.iesvdm.musicallyx.repository.ChatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ChatService {

    private final ChatRepository mensajeRepository;

    public ChatService(ChatRepository mensajeRepository) {
        this.mensajeRepository = mensajeRepository;
    }

    public void deleteById(Long id) {
        if (!mensajeRepository.existsById(id)) {
            throw new RuntimeException("El mensaje con ID " + id + " no existe.");
        }
        mensajeRepository.deleteById(id);
    }

    // Enviar mensaje
    public Chat enviarMensaje(Usuario emisor, Usuario receptor, String texto, String asunto) {
        Chat mensaje = Chat.builder()
                .emisor(emisor)
                .receptor(receptor)
                .texto(texto)
                .asunto(asunto)
                .fechaEnvio(LocalDateTime.now())
                .leido(false) // Por defecto no leído
                .build();
        return mensajeRepository.save(mensaje);
    }

    // Obtener todos los mensajes entre dos usuarios
    public List<Chat> obtenerMensajes(Usuario usuario1, Usuario usuario2) {
        List<Chat> mensajes = mensajeRepository
                .findByEmisorAndReceptorOrReceptorAndEmisorOrderByFechaEnvioAsc(
                        usuario1, usuario2, usuario1, usuario2);

        // Marcar como leídos los mensajes recibidos por el usuario actual
        mensajes.stream()
                .filter(m -> m.getReceptor().equals(usuario1) && !m.isLeido())
                .forEach(m -> m.setLeido(true));

        mensajeRepository.saveAll(mensajes);
        return mensajes;
    }


    // 🔹 NUEVO: Recibidos
    public List<Chat> obtenerRecibidos(Usuario receptor) {
        return mensajeRepository.findByReceptorOrderByFechaEnvioDesc(receptor);
    }

    // 🔹 NUEVO: Enviados
    public List<Chat> obtenerEnviados(Usuario emisor) {
        return mensajeRepository.findByEmisorOrderByFechaEnvioDesc(emisor);
    }


    // Marcar un mensaje como leído manualmente
    public Chat marcarComoLeido(Long mensajeId) {
        Chat mensaje = mensajeRepository.findById(mensajeId)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setLeido(true);
        return mensajeRepository.save(mensaje);
    }
    public List<Chat> marcarVariosComoLeidos(List<Long> ids) {
        List<Chat> mensajes = mensajeRepository.findAllById(ids);
        mensajes.forEach(m -> m.setLeido(true));
        return mensajeRepository.saveAll(mensajes);
    }

    // ✅ Buscar mensaje por ID
    public Chat findById(Long id) {
        return mensajeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje con ID " + id + " no existe."));
    }

    // ✅ Guardar cambios (para PUT y PATCH)
    public Chat save(Chat mensaje) {
        return mensajeRepository.save(mensaje);
    }

}
