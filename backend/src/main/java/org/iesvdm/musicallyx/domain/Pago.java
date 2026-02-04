package org.iesvdm.musicallyx.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idPago;

    private String idTransaccionProveedor;
    private double monto;
    private LocalDateTime fechaPago;

    @Enumerated(EnumType.STRING)
    private EstadoPago estado;

    public enum EstadoPago {
        CREATED,
        COMPLETED,
        FAILED,
        CANCELLED
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva")
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_metodo")
    private MetodoPago metodoPago;


}
