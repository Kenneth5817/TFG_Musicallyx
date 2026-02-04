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
                "a@admin.com",
                "Aa12345.",
                "651370140",
                Rol.ADMIN
        );

        Usuario usuario3 = crearOActualizarUsuario(
                "Lara Amaya",
                "laraamayaa@gmail.com",
                "Aa12345.",
                "612756789",
                Rol.USER
        );

        Usuario usuario4 = crearOActualizarUsuario(
                "Alex García",
                "alexddacgarcia@gmail.com",
                "Aa12345.",
                "609643765",
                Rol.USER
        );

        Usuario usuario5 = crearOActualizarUsuario(
                "Jesús Añó",
                "jesusssaño@gmail.com",
                "Aa12345.",
                "69902845",
                Rol.USER
        );

        Usuario usuario6 = crearOActualizarUsuario(
                "Miquel Barbera",
                "miquelbarberaa@gmail.com",
                "Aa12345.",
                "642492302",
                Rol.USER
        );

        Usuario usuario7 = crearOActualizarUsuario(
                "Yarina Barbera",
                "yarinabarberaa@gmail.com",
                "Aa12345.",
                "6822642355",
                Rol.USER
        );

        Usuario usuario8 = crearOActualizarUsuario(
                "Adelin Bota",
                "aadelinbota@gmail.com",
                "Aa12345.",
                "601303658",
                Rol.USER
        );

        Usuario usuario9 = crearOActualizarUsuario(
                "Angelo Cardoso",
                "angeloocardoso@gmail.com",
                "Aa12345.",
                "621254702",
                Rol.USER
        );

        Usuario usuario10 = crearOActualizarUsuario(
                "Carlos Cortés",
                "carlossscortes@gmail.com",
                "Aa12345.",
                "613121402",
                Rol.USER
        );

        Usuario usuario11 = crearOActualizarUsuario(
                "Kenneth Jensen",
                "kennethjensenquero@gmail.com",
                "Aa12345.",
                "69376003",
                Rol.USER
        );
        Usuario usuario12 = crearOActualizarUsuario(
                "Marta Ruiz",
                "martaaxruiz@gmail.com",
                "Aa12345.",
                "693857127",
                Rol.USER
        );
        Usuario usuario13 = crearOActualizarUsuario(
                "Diogo Domingos",
                "diogoodomingos@gmail.com",
                "Aa12345.",
                "613018505",
                Rol.USER
        );
        Usuario usuario14 = crearOActualizarUsuario(
                "Leo Ferrand",
                "leooferrand@gmail.com",
                "Aa12345.",
                "618503827",
                Rol.USER
        );
        Usuario usuario15 = crearOActualizarUsuario(
                "Noemí Martín",
                "noemimmartin@gmail.com",
                "Aa12345.",
                "695823950",
                Rol.USER
        );
        Usuario usuario16 = crearOActualizarUsuario(
                "Guilherme Oliveira",
                "guilhermeeooliveira@gmail.com",
                "Aa12345.",
                "628395028",
                Rol.USER
        );
        Usuario usuario17 = crearOActualizarUsuario(
                "Verónica Guerreiro",
                "verooguerreiro@gmail.com",
                "Aa12345.",
                "613121402",
                Rol.USER
        );
        Usuario usuario18 = crearOActualizarUsuario(
                "Carlos Cortés",
                "carlossscortes@gmail.com",
                "Aa12345.",
                "613121402",
                Rol.USER
        );
        Usuario usuario19 = crearOActualizarUsuario(
                "Cristina Varela",
                "crisvarelatina@gmail.com",
                "Aa12345.",
                "6829486881",
                Rol.USER
        );
        Usuario usuario20 = crearOActualizarUsuario(
                "Manuel Murgui",
                "manurgui@gmail.com",
                "Aa12345.",
                "6002039480",
                Rol.USER
        );
        Usuario usuario21 = crearOActualizarUsuario(
                "Joana Raposo",
                "joanarapoooso@gmail.com",
                "Aa12345.",
                "619202930",
                Rol.USER
        );
        Usuario usuario22 = crearOActualizarUsuario(
                "Noemie Santos",
                "noemieesantoss@gmail.com",
                "Aa12345.",
                "692039485",
                Rol.USER
        );
        Usuario usuario23 = crearOActualizarUsuario(
                "Tobala Sierra",
                "tobalasierrax@gmail.com",
                "Aa12345.",
                "619229385",
                Rol.USER
        );
        Usuario usuario24 = crearOActualizarUsuario(
                "Pedro Sierra",
                "pedritosierral@gmail.com",
                "Aa12345.",
                "6993849602",
                Rol.USER
        );
        Usuario usuario25 = crearOActualizarUsuario(
                "Julia Urizar",
                "juliaaurizar@gmail.com",
                "Aa12345.",
                "619384759",
                Rol.USER
        );
        Usuario usuario26 = crearOActualizarUsuario(
                "Lidiane Cruz",
                "lidianecruzzz@gmail.com",
                "Aa12345.",
                "619284005",
                Rol.USER
        );
        Usuario usuario27 = crearOActualizarUsuario(
                "Margarida Alves",
                "margaridaaalves@gmail.com",
                "Aa12345.",
                "602847581",
                Rol.USER
        );
        Usuario usuario28 = crearOActualizarUsuario(
                "musicallyx",
                "musicallyxofficial5817@gmail.com",
                "Aa12345.",
                "651370140",
                Rol.USER
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
        Profesor profesorComposicion = profesorRepository.save(
                Profesor.builder().usuario(usuario1).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Composición").telefono("651 37 01 40").biografia("Profesor de composicion.")
                        .setClases(new HashSet<>(List.of(composicion))).build()
        );
        Profesor profesorPiano = profesorRepository.save(
                Profesor.builder().usuario(usuario2).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Piano").telefono("651 37 01 40")
                        .biografia("Con 7 años de experiencia en la enseñanza de piano clásico, especializado en técnica y teoría musical.")
                        .setClases(new HashSet<>(List.of(piano))).build()
        );
        Profesor profesorProduccion = profesorRepository.save(
                Profesor.builder().usuario(usuario3).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Producción Musical").telefono("651 37 01 40").biografia("Experto en producir música")
                        .setClases(new HashSet<>(List.of(produccionMusical))).build()
        );
        Profesor profesorLetrista = profesorRepository.save(
                Profesor.builder().usuario(usuario5).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Letrista").telefono("651 37 01 40").biografia("Profesor de composicion.")
                        .setClases(new HashSet<>(List.of(letrista))).build()
        );
        Profesor profesorImprovisacionPiano = profesorRepository.save(
                Profesor.builder().usuario(usuario6).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Improvisacion al Piano").telefono("651 37 01 40")
                        .biografia("Con 7 años de experiencia en la enseñanza de piano, me encanta improvisar.")
                        .setClases(new HashSet<>(List.of(improvisacionPiano))).build()
        );
        Profesor profesorAnalisisPartituras = profesorRepository.save(
                Profesor.builder().usuario(usuario4).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Análisis Partituras").telefono("651 37 01 40")
                        .biografia("Profesor que te ayudará a analizar partituras")
                        .setClases(new HashSet<>(List.of(analisisPartituras))).build()
        );
        Profesor profesorLenguajeMusical = profesorRepository.save(
                Profesor.builder().usuario(usuario8).nombre("Kenneth").apellidos("Jensen")
                        .especialidad("Lenguaje Musical").telefono("651 37 01 40")
                        .biografia("Profesor de lenguaje Musical.")
                        .setClases(new HashSet<>(List.of(lenguajeMusical))).build()
        );

        // ================== ALUMNOS ==================
        Alumno alumno1 = alumnoRepository.save(
                Alumno.builder().usuario(usuario1).clase(composicion).reservas(new HashSet<>()).build()
        );
        Alumno alumno2 = alumnoRepository.save(
                Alumno.builder().usuario(usuario2).clase(piano).reservas(new HashSet<>()).build()
        );
        Alumno alumno3 = alumnoRepository.save(
                Alumno.builder().usuario(usuario3).clase(produccionMusical).reservas(new HashSet<>()).build()
        );
        Alumno alumno4 = alumnoRepository.save(
                Alumno.builder().usuario(usuario4).clase(lenguajeMusical).reservas(new HashSet<>()).build()
        );
        Alumno alumno5 = alumnoRepository.save(
                Alumno.builder().usuario(usuario5).clase(piano).reservas(new HashSet<>()).build()
        );
        Alumno alumno6 = alumnoRepository.save(
                Alumno.builder().usuario(usuario6).clase(analisisPartituras).reservas(new HashSet<>()).build()
        );
        Alumno alumno7 = alumnoRepository.save(
                Alumno.builder().usuario(usuario7).clase(improvisacionPiano).reservas(new HashSet<>()).build()
        );
        Alumno alumno8 = alumnoRepository.save(
                Alumno.builder().usuario(usuario8).clase(letrista).reservas(new HashSet<>()).build()
        );
        Alumno alumno9 = alumnoRepository.save(
                Alumno.builder().usuario(usuario9).clase(produccionMusical).reservas(new HashSet<>()).build()
        );
        Alumno alumno10 = alumnoRepository.save(
                Alumno.builder().usuario(usuario10).clase(analisisPartituras).reservas(new HashSet<>()).build()
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

        // ================== RESERVAS ==================
        Reserva reserva1 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(new Date())
                        .estado("Confirmada").metodoPago("Tarjeta de Crédito")
                        .comentarios("Reserva confirmada para la clase de piano.")
                        .clase(piano).alumno(alumno1).precio(14.00).build()
        );
        Reserva reserva2 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(null)
                        .estado("Pendiente").metodoPago("Bizum")
                        .comentarios("Esperando confirmación para la clase de composicion.")
                        .clase(composicion).alumno(alumno2).precio(14.00).build()
        );
        Reserva reserva3 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(null)
                        .estado("Cancelada").metodoPago("Paypal")
                        .comentarios("La clase fue cancelada por razones personales.")
                        .clase(produccionMusical).alumno(alumno3).precio(14.00).build()
        );
        Reserva reserva4 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(new Date())
                        .estado("Confirmada").metodoPago("Tarjeta de Crédito")
                        .comentarios("Reserva confirmada para la clase de piano.")
                        .clase(piano).alumno(alumno4).precio(14.00).build()
        );
        Reserva reserva5 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(null)
                        .estado("Pendiente").metodoPago("Bizum")
                        .comentarios("Esperando confirmación para la clase de improvisacion al piano.")
                        .clase(improvisacionPiano).alumno(alumno5).precio(14.00).build()
        );
        Reserva reserva6 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(null)
                        .estado("Cancelada").metodoPago("Paypal")
                        .comentarios("La clase fue cancelada por razones personales.")
                        .clase(analisisPartituras).alumno(alumno6).precio(14.00).build()
        );
        Reserva reserva7 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(new Date())
                        .estado("Confirmada").metodoPago("Tarjeta de Crédito")
                        .comentarios("Reserva confirmada para la clase de lenguaje Musical.")
                        .clase(lenguajeMusical).alumno(alumno7).precio(14.00).build()
        );
        Reserva reserva8 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(null)
                        .estado("Pendiente").metodoPago("Bizum")
                        .comentarios("Esperando confirmación para la clase de composicion.")
                        .clase(composicion).alumno(alumno8).precio(14.00).build()
        );
        Reserva reserva9 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(null)
                        .estado("Cancelada").metodoPago("Paypal")
                        .comentarios("La clase fue cancelada por razones personales.")
                        .clase(produccionMusical).alumno(alumno9).precio(14.00).build()
        );
        Reserva reserva10 = reservaRepository.save(
                Reserva.builder().fechaReserva(new Date()).fechaConfirmacion(null)
                        .estado("Cancelada").metodoPago("Paypal")
                        .comentarios("La clase fue cancelada por razones personales.")
                        .clase(produccionMusical).alumno(alumno10).precio(14.00).build()
        );


        // ================== METODOS DE PAGO ==================
        MetodoPago metodoPago1 = metodoPagoRepository.save(
                MetodoPago.builder().tipo("Tarjeta de Crédito")
                        .descripcion("Pago a través de tarjeta bancaria con red internacional.").build()
        );
        MetodoPago metodoPago2 = metodoPagoRepository.save(
                MetodoPago.builder().tipo("PayPal").descripcion("Pago a través de la aplicación Paypal mediante móvil.").build()
        );

        // ================== PAGOS ==================
        pagoRepository.saveAll(List.of(
                Pago.builder().monto(50.00).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva1).metodoPago(metodoPago1).build(),
                Pago.builder().monto(30.00).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva2).metodoPago(metodoPago2).build(),
                Pago.builder().monto(80.00).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva1).metodoPago(metodoPago1).build(),
                Pago.builder().monto(15.00).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.CANCELLED)
                        .reserva(reserva2).metodoPago(metodoPago1).build(),
                Pago.builder().monto(25.99).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva1).metodoPago(metodoPago2).build(),
                Pago.builder().monto(19.99).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva2).metodoPago(metodoPago2).build(),
                Pago.builder().monto(20.50).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva1).metodoPago(metodoPago2).build(),
                Pago.builder().monto(28.00).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva2).metodoPago(metodoPago2).build(),
                Pago.builder().monto(50.00).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva1).metodoPago(metodoPago1).build(),
                Pago.builder().monto(30.00).fechaPago(LocalDateTime.now()).estado(Pago.EstadoPago.COMPLETED)
                        .reserva(reserva2).metodoPago(metodoPago1).build()
        ));
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
