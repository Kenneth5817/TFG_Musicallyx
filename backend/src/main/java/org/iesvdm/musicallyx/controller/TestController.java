package org.iesvdm.musicallyx.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/hola")
    public String decirHola() {
        return "¡Hola desde el backend de Spring Boot!";
    }
}
