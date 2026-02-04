package org.iesvdm.musicallyx.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.iesvdm.musicallyx.domain.Usuario;

import java.util.List;
import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Page<Usuario> findAllBy(Pageable pageable);

    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByResetToken(String resetToken);
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

}
