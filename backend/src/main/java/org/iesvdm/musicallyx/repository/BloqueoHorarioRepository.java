package org.iesvdm.musicallyx.repository;

import org.iesvdm.musicallyx.domain.BloqueoHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface BloqueoHorarioRepository extends JpaRepository<BloqueoHorario, Long> {

    List<BloqueoHorario> findByFechaBetween(LocalDate start, LocalDate end);

    @Modifying
    @Query("DELETE FROM BloqueoHorario b WHERE b.fecha BETWEEN :start AND :end")
    void deleteSemana(@Param("start") LocalDate start,
                      @Param("end") LocalDate end);
    void deleteByFechaBetween(LocalDate start, LocalDate end);
}