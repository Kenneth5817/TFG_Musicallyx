
package org.iesvdm.musicallyx.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Profesor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idProfesor;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    @JsonManagedReference("profesor-usuario")
    private Usuario usuario;

    private String nombre;
    private String apellidos;
    private String especialidad;
    private String telefono;
    private String biografia;

    @OneToMany(mappedBy = "profesor")
    @JsonIgnoreProperties("profesor")
    private Set<Clase> setClases = new HashSet<>();

    @OneToMany(mappedBy = "profesor")
    @JsonManagedReference("profesor-horarios")
    private Set<Horario> setHorarios = new HashSet<>();
}
