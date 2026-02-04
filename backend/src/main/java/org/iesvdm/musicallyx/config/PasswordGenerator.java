package org.iesvdm.musicallyx.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "Aa12345.";
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("Hash generado: " + hashedPassword);
    }
}
