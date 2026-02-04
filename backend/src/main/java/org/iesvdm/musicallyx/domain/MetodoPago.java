package org.iesvdm.musicallyx.domain;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idMetodo;

    private String tipo;

    private String descripcion;


    @OneToMany(mappedBy = "metodoPago")
    private List<Pago> pagos;


}
