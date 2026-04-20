package org.iesvdm.musicallyx.controller;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.iesvdm.musicallyx.config.SecurityConfig;
import org.iesvdm.musicallyx.domain.Usuario;
import org.iesvdm.musicallyx.repository.UsuarioRepository;
import org.iesvdm.musicallyx.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuario no encontrado con ese correo"));
        }

        Usuario usuario = usuarioOpt.get();

        // 1️⃣ Generar token temporal y guardar en la base de datos
        String token = java.util.UUID.randomUUID().toString();
        usuario.setResetToken(token);
        usuario.setTokenExpiration(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        // 2️⃣ Construir email y enviarlo ✅ CORREGIDO
        String resetLink = "https://musicallyxx.netlify.app/reset-password?token=" + token;
        String subject = "Recuperación de contraseña";
        String text = "Haz click aquí para restablecer tu contraseña: " + resetLink;

        try {
            emailService.sendSimpleEmail(email, subject, text);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "No se pudo enviar el correo, revisa la configuración SMTP"));
        }

        return ResponseEntity.ok(Map.of("message", "Correo de recuperación enviado"));
    }

    @GetMapping("/login")
    public ResponseEntity<String> loginGet() {
        return ResponseEntity.ok("Usa POST para hacer login");
    }



    // Endpoint POST /v1/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Contraseña incorrecta"));
        }


        // ✅ rol único (ADMIN o ALUMNO)
        String rol = usuario.getRol() != null ? usuario.getRol().name() : "USER";

        // ⚡ Enviar estructura clara al frontend
        Map<String, Object> response = Map.of(
                "idUsuario", usuario.getIdUsuario(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "rol", rol
        );

        return ResponseEntity.ok(response);
    }



    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {

        // Verificar que no exista
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message","El usuario ya existe con ese email"));
        }

        // Validaciones básicas
        if (usuario.getPassword() == null || usuario.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("message","Contraseña demasiado corta"));
        }
        if (usuario.getEmail() == null || !usuario.getEmail().contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message","Email inválido"));
        }

        // 🔹 Encriptar contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    // DTO para recibir login
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters y setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // 1. Validar token (GET)
    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        System.out.println("🔍 Validando token: " + token);

        Optional<Usuario> usuarioOpt = usuarioRepository.findByResetToken(token);

        if (usuarioOpt.isEmpty()) {
            System.out.println("❌ Token no encontrado");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("valid", false, "message", "Token inválido"));
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getTokenExpiration() == null ||
                usuario.getTokenExpiration().isBefore(LocalDateTime.now())) {
            System.out.println("❌ Token expirado");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("valid", false, "message", "Token expirado"));
        }

        System.out.println("✅ Token válido para usuario: " + usuario.getEmail());
        return ResponseEntity.ok(Map.of("valid", true));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String nuevaPassword = body.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByResetToken(token);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Token inválido"));
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getTokenExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Token expirado"));
        }

        // 🔹 Guardar nueva contraseña encriptada y limpiar token
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuario.setResetToken(null);
        usuario.setTokenExpiration(null);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
    }


    @GetMapping("/validar-sesion")
    public ResponseEntity<Boolean> validarSesion(HttpSession session) {
        Object usuario = session.getAttribute("usuario");
        boolean sessionValida = usuario != null;
        return ResponseEntity.ok(sessionValida);
    }


}
