package org.iesvdm.musicallyx.exception;

public class PagoNotFoundException extends RuntimeException {
    public PagoNotFoundException(String mensaje) {
        super(mensaje);
    }
}
