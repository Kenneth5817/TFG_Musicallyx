package org.iesvdm.musicallyx;

import org.iesvdm.musicallyx.domain.MetodoPago;
import org.iesvdm.musicallyx.repository.MetodoPagoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final MetodoPagoRepository metodoPagoRepository;

    // Constructor: Spring inyecta automáticamente el repositorio
    public DataLoader(MetodoPagoRepository metodoPagoRepository) {
        this.metodoPagoRepository = metodoPagoRepository;
    }

    @Override
    public void run(String... args) {

        // Solo se ejecuta si la tabla está vacía
        if (metodoPagoRepository.count() == 0) {

            MetodoPago tarjeta = MetodoPago.builder()
                    .tipo("Tarjeta de Crédito")
                    .descripcion("Pago directo con tarjeta bancaria (Visa, Mastercard, etc.)")
                    .build();
            MetodoPago paypal = MetodoPago.builder()
                    .tipo("PayPal")
                    .descripcion("Pago seguro a través de cuenta PayPal vinculada a tarjeta o banco.")
                    .build();

            metodoPagoRepository.save(tarjeta);
            metodoPagoRepository.save(paypal);

            System.out.println("✅ Métodos de pago inicializados correctamente");
        } else {
            System.out.println("⚠️ Métodos de pago ya existentes, no se han duplicado.");
        }
    }
}
