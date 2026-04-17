package org.iesvdm.musicallyx;

import lombok.extern.slf4j.Slf4j;
import org.iesvdm.musicallyx.domain.*;
import org.iesvdm.musicallyx.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;


@Slf4j
@SpringBootTest
@Transactional
class MusicallyxxApplicationTests {

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Importamos los repository con @Autowired
    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private ClaseRepository claseRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ProfesorRepository profesorRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void contextLoads() {

    }

    @BeforeEach
    void limpiarHorarios() {
        // Borra todos los horarios antes de cada test
        horarioRepository.deleteAll();
    }
    @Commit
    @Test
    void cargaInicial() {

// ================== USUARIOS ==================

        Usuario usuario1 = crearOActualizarUsuario(
                "Guille Ollés",
                "guilleolless@gmail.com",
                "Aa12345.",
                "612325478",
                Rol.USER
        );

        Usuario usuario2 = crearOActualizarUsuario(
                "Kenneth Jensen",
                "kennethjensenquero@gmail.com",
                "Aa12345.",
                "69376003",
                Rol.USER
        );

        Usuario usuario3 = crearOActualizarUsuario(
                "musicallyx",
                "musicallyxofficial5817@gmail.com",
                "Aa12345.",
                "651370140",
                Rol.ADMIN
        );




        // ================== CLASES ==================
        Clase composicion = claseRepository.save(
                Clase.builder().nombreClase("Composición").descripcion("Clase destinada a componer.").build()
        );
        Clase piano = claseRepository.save(
                Clase.builder().nombreClase("Piano").descripcion("Clase destinada a piano.").build()
        );
        Clase produccionMusical = claseRepository.save(
                Clase.builder().nombreClase("Producción Musical").descripcion("Clase destinada a producir música.").build()
        );
        Clase letrista = claseRepository.save(
                Clase.builder().nombreClase("Letrista").descripcion("Clase destinada a escribir letras de canciones.").build()
        );
        Clase lenguajeMusical = claseRepository.save(
                Clase.builder().nombreClase("Lenguaje Musical").descripcion("Clase destinada a lenguaje musical.").build()
        );
        Clase analisisPartituras = claseRepository.save(
                Clase.builder().nombreClase("Análisis Partituras").descripcion("Clase destinada a analizar partituras.").build()
        );
        Clase improvisacionPiano = claseRepository.save(
                Clase.builder().nombreClase("Improvisacion al Piano").descripcion("Clase destinada a improvisar en el piano.").build()
        );

        // ================== PROFESORES ==================
        Profesor profeKenneth = profesorRepository.save(
                Profesor.builder().usuario(usuario1).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Composición").telefono("651 37 01 40").biografia("Profesor")
                        .setClases(new HashSet<>(List.of(composicion))).build()
        );


        // ================== ALUMNOS ==================
        Alumno alumno1 = alumnoRepository.save(
                Alumno.builder().usuario(usuario1).clase(composicion).reservas(new HashSet<>()).build()
        );

        Alumno alumno3 = alumnoRepository.save(
                Alumno.builder().usuario(usuario3).clase(produccionMusical).reservas(new HashSet<>()).build()
        );



        // ================== HORARIOS ==================
        horarioRepository.saveAll(List.of(
                crearHorario(DiaSemana.LUNES, "16:00", false),
                crearHorario(DiaSemana.LUNES, "17:00", true),
                crearHorario(DiaSemana.LUNES, "18:00", true),
                crearHorario(DiaSemana.LUNES, "19:00", true),
                crearHorario(DiaSemana.LUNES, "20:00", true),
                crearHorario(DiaSemana.MARTES, "16:00", false),
                crearHorario(DiaSemana.MARTES, "17:00", true),
                crearHorario(DiaSemana.MARTES, "18:00", true),
                crearHorario(DiaSemana.MARTES, "19:00", true),
                crearHorario(DiaSemana.MARTES, "20:00", true),
                crearHorario(DiaSemana.MIERCOLES, "16:00", false),
                crearHorario(DiaSemana.MIERCOLES, "17:00", true),
                crearHorario(DiaSemana.MIERCOLES, "18:00", true),
                crearHorario(DiaSemana.MIERCOLES, "19:00", true),
                crearHorario(DiaSemana.MIERCOLES, "20:00", true),
                crearHorario(DiaSemana.JUEVES, "16:00", false),
                crearHorario(DiaSemana.JUEVES, "17:00", true),
                crearHorario(DiaSemana.JUEVES, "18:00", true),
                crearHorario(DiaSemana.JUEVES, "19:00", true),
                crearHorario(DiaSemana.JUEVES, "20:00", true),
                crearHorario(DiaSemana.VIERNES, "16:00", false),
                crearHorario(DiaSemana.VIERNES, "17:00", true),
                crearHorario(DiaSemana.VIERNES, "18:00", true),
                crearHorario(DiaSemana.VIERNES, "19:00", true),
                crearHorario(DiaSemana.VIERNES, "20:00", true)
        ));



        // ================== METODOS DE PAGO ==================
        MetodoPago metodoPago1 = metodoPagoRepository.save(
                MetodoPago.builder().tipo("Tarjeta de Crédito")
                        .descripcion("Pago por tarjeta.").build()
        );
        MetodoPago metodoPago2 = metodoPagoRepository.save(
                MetodoPago.builder().tipo("En efectivo")
                        .descripcion("Pago el dia de la clase.").build()
        );
        MetodoPago metodoPago3 = metodoPagoRepository.save(
                MetodoPago.builder().tipo("Bizum")
                        .descripcion("Pago por Bizum mediante móvil.")
                        .build()
        );
    }


    private Horario crearHorario(DiaSemana dia, String horaInicio, boolean disponible) {
        return Horario.builder()
                .diaSemana(dia)
                .horaInicio(LocalTime.parse(horaInicio))
                .horaFin(LocalTime.parse(horaInicio).plusHours(1))
                .disponible(disponible)
                .descripcion(disponible ? "Disponible" : "Ocupado")
                .build();
    }

    private Usuario crearOActualizarUsuario(String nombre, String email, String password, String telefono, Rol rol) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(email);
        if (usuarioExistente.isPresent()) {
            Usuario u = usuarioExistente.get();
            boolean changed = false;
            if (!Objects.equals(u.getNombre(), nombre)) {
                u.setNombre(nombre);
                changed = true;
            }
            if (!Objects.equals(u.getTelefono(), telefono)) {
                u.setTelefono(telefono);
                changed = true;
            }
            if (!Objects.equals(u.getRol(), rol)) {
                u.setRol(rol);
                changed = true;
            }
            if (changed) {
                return usuarioRepository.save(u);
            }
            return u;
        } else {
            Usuario u = new Usuario();
            u.setNombre(nombre);
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode(password));
            u.setTelefono(telefono);
            u.setRol(rol);
            return usuarioRepository.save(u);
        }
    }

    @BeforeEach
    void limpiarUsuariosDuplicados() {
        List<Usuario> todos = usuarioRepository.findAll();
        Map<String, Usuario> emailUnico = new HashMap<>();

        for (Usuario u : todos) {
            if (emailUnico.containsKey(u.getEmail())) {
                // Eliminar el duplicado
                usuarioRepository.delete(u);
            } else {
                emailUnico.put(u.getEmail(), u);
            }
        }
    }


}
