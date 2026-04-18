package org.iesvdm.musicallyx;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@ComponentScan(basePackages = {
        "org.iesvdm.musicallyx",          // tu paquete principal
        "org.iesvdm.payment.paypal"       // paquete donde está PaypalController y PaypalService
})
public class MusicallyxxApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(MusicallyxxApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
    @Override
    public void run(String... args) throws Exception {
         System.out.println("=== ENV TEST ===");
    System.out.println("URL: " + System.getenv("SPRING_DATASOURCE_URL"));
    System.out.println("USER: " + System.getenv("SPRING_DATASOURCE_USERNAME"));
    System.out.println("PASS: " + System.getenv("SPRING_DATASOURCE_PASSWORD"));
    
    }

    @PostConstruct
        public void testDB() {
            System.out.println("DB URL: " + System.getenv("SPRING_DATASOURCE_URL"));
        }
    //  Crear todos los objetos lo suyo seria todo en los tests
}
