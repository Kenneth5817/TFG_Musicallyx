package org.iesvdm.musicallyx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())                 // Configuración CORS
                .csrf(csrf -> csrf.disable())                    // Deshabilitamos CSRF para Angular
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers("/v1/api/auth/**").permitAll()
                        .requestMatchers("/api/email/**").permitAll()
                        .requestMatchers("/api/mensajes/**").permitAll()
                        .requestMatchers("/v1/api/usuarios/**").permitAll()
                        .requestMatchers("/v1/api/profesores/**").permitAll()
                        .requestMatchers("/v1/api/reservas/**").permitAll()


                        // Endpoints de administración: ADMIN o USER
                        .requestMatchers("/api/admin/**").hasAnyAuthority("ADMIN", "USER")

                        // Cualquier otra petición requiere autenticación
                        .anyRequest().permitAll()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );



        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Lista explícita de orígenes permitidos
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:4200",
                "http://localhost:3000",
                "http://localhost:5173"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // Para cookies y auth

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}

