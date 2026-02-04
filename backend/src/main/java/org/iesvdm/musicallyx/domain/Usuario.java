package org.iesvdm.musicallyx.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@JsonIgnoreProperties({"profesor", "alumno"})

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idUsuario;

    private String nombre;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(unique = true)
    private String email;
    private String telefono;

    @OneToOne(mappedBy = "usuario")
    @JsonBackReference("profesor-usuario")
    private Profesor profesor;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", length = 20)
    private Rol rol;

    @OneToOne(mappedBy = "usuario")
    @JsonBackReference("alumno-usuario")
    private Alumno alumno;

    // ✅ Constructor que inicializa roles
    public Usuario(String nombre, String password, String email, String telefono, Rol rol) {
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.telefono = telefono;
        this.rol = rol;
    }

    // ✅ Campos para recuperación de contraseña
    private String resetToken;
    private LocalDateTime tokenExpiration;

    private String nivel;
    private String gustos;

}
