package org.iesvdm.musicallyx.repository;

import org.iesvdm.musicallyx.domain.Chat;
import org.iesvdm.musicallyx.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Conversación entre dos usuarios
    List<Chat> findByEmisorAndReceptorOrReceptorAndEmisorOrderByFechaEnvioAsc(
            Usuario emisor1, Usuario receptor1,
            Usuario emisor2, Usuario receptor2
    );

    // Mensajes recibidos por un usuario
    List<Chat> findByReceptorOrderByFechaEnvioDesc(Usuario receptor);

    // Mensajes enviados por un usuario
    List<Chat> findByEmisorOrderByFechaEnvioDesc(Usuario emisor);

}
