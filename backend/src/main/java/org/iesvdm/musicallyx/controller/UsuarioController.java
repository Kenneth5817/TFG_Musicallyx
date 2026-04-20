package org.iesvdm.musicallyx.controller;
import org.iesvdm.musicallyx.dto.UsuarioPerfilDTO;
import org.iesvdm.musicallyx.repository.UsuarioRepository;
import org.iesvdm.musicallyx.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.iesvdm.musicallyx.exception.UsuarioNotFoundException;
import org.iesvdm.musicallyx.domain.Usuario;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;


    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody Usuario datosActualizados) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();

        usuario.setNombre(datosActualizados.getNombre());
        usuario.setEmail(datosActualizados.getEmail());
        usuario.setTelefono(datosActualizados.getTelefono());
        usuario.setNivelMusical(datosActualizados.getNivelMusical());
        usuario.setGustosMusicales(datosActualizados.getGustosMusicales());

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<Usuario> actualizarPerfil(
            @PathVariable Long id,
            @RequestBody UsuarioPerfilDTO dto) {

        Usuario actualizado = usuarioService.actualizarPerfil(id, dto);

        return ResponseEntity.ok(actualizado);
    }


    @GetMapping({"/",""})
    public Page<Usuario> getAllUsuarios(Pageable pageable) {
        return usuarioService.findAll(pageable);
    }


    @GetMapping("/{id}")
    public Usuario getUsuarioById(@PathVariable Long id) {
        return usuarioService.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario con ID " + id + " no encontrado."));
    }

    @PostMapping({"/",""})
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        Usuario createdUsuario = usuarioService.save(usuario);
        return new ResponseEntity<>(createdUsuario, HttpStatus.CREATED);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (!usuarioService.existsById(id)) {
            throw new UsuarioNotFoundException("Usuario con ID " + id + " no encontrado.");
        }
        usuarioService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/email/{email}")
    public Usuario getUsuarioByEmail(@PathVariable String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario con email " + email + " no encontrado"));
    }

    @GetMapping("/buscar")
    public List<Usuario> buscarPorNombre(@RequestParam String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @PatchMapping("/{id}/parcial")
    public ResponseEntity<Usuario> actualizarUsuarioParcial(
            @PathVariable Long id,
            @RequestBody Map<String, Object> campos) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }

        Usuario usuario = usuarioOpt.get();

        campos.forEach((clave, valor) -> {
            switch (clave) {
                case "nombre":
                    usuario.setNombre((String) valor);
                    break;
                case "email":
                    usuario.setEmail((String) valor);
                    break;
                case "telefono":
                    usuario.setTelefono((String) valor);
                    break;
                case "nivel":
                    usuario.setNivelMusical((String) valor);
                    break;
                case "gustos":
                    usuario.setGustosMusicales((String) valor);
                    break;
                // agregar más campos según sea necesario
            }
        });

        usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuario);
    }

}
