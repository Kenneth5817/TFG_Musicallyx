package org.iesvdm.musicallyx.repository;

import org.iesvdm.musicallyx.dto.ReservaTablaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.iesvdm.musicallyx.domain.Reserva;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    @Query("SELECT new org.iesvdm.musicallyx.dto.ReservaTablaDTO(" +
            "u.nombre, " +                                 // nombreAlumno
            "c.nombreClase, " +                             // nombreClase
            "CONCAT(COALESCE(p.nombre, ''), ' ', COALESCE(p.apellidos, '')), " + // profesorClase
            "u.email, " +                                  // email
            "r.idReserva, " +                              // idReserva
            "r.estado, " +                                 // estado
            "r.fechaReserva, " +                           // fechaReserva
            "r.metodoPago) " +                             // metodoPago
            "FROM Reserva r " +
            "LEFT JOIN r.alumno a " +
            "LEFT JOIN a.usuario u " +
            "LEFT JOIN r.clase c " +
            "LEFT JOIN c.profesor p")
    Page<ReservaTablaDTO> findAllReservaTabla(Pageable pageable);
    List<Reserva> findByEmail(String email);
    List<Reserva> findByFechaClaseBetween(LocalDate start, LocalDate end);
    List<Reserva> findByEstado(String estado);

}
