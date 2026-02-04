package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.domain.Usuario;
import org.iesvdm.musicallyx.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<Usuario> findAll(Pageable pageable) {
        return usuarioRepository.findAllBy(pageable);
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return usuarioRepository.existsById(id);
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void saveResetToken(Long idUsuario, String token, LocalDateTime expiration) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow();
        usuario.setResetToken(token);
        usuario.setTokenExpiration(expiration);
        usuarioRepository.save(usuario);
    }


    public Usuario findByResetToken(String token) {
        return usuarioRepository.findByResetToken(token).orElse(null);
    }

    public boolean isTokenExpired(String token) {
        Usuario usuario = findByResetToken(token);
        if (usuario == null || usuario.getTokenExpiration() == null) return true;
        return LocalDateTime.now().isAfter(usuario.getTokenExpiration());
    }


    public void updatePassword(Long idUsuario, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }

    public void clearResetToken(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow();
        usuario.setResetToken(null);
        usuario.setTokenExpiration(null);
        usuarioRepository.save(usuario);
    }


}
