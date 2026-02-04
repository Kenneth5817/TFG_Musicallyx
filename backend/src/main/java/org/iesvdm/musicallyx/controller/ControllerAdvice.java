package org.iesvdm.musicallyx.controller;

import org.iesvdm.musicallyx.*;
import org.iesvdm.musicallyx.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@org.springframework.web.bind.annotation.ControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(AlumnoNotFoundException.class)
    public ResponseEntity<String> handleAlumnoNotFound(AlumnoNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ClaseNotFoundException.class)
    public ResponseEntity<String> handleClaseNotFound(ClaseNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProfesorNotFoundException.class)
    public ResponseEntity<String> handleProfesorNotFound(ProfesorNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HorarioNotFoundException.class)
    public ResponseEntity<String> handleHorarioNotFound(HorarioNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MetodoPagoNotFoundException.class)
    public ResponseEntity<String> handleMetodoPagoNotFound(MetodoPagoNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PagoNotFoundException.class)
    public ResponseEntity<String> handlePagoNotFound(PagoNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReservaNotFoundException.class)
    public ResponseEntity<String> handleReservaNotFound(ReservaNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UsuarioNotFoundException.class)
    public ResponseEntity<String> handleUsuarioNotFound(UsuarioNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}
