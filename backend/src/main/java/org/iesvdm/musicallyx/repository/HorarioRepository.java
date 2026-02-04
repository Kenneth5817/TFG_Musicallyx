package org.iesvdm.musicallyx.repository;

import org.iesvdm.musicallyx.domain.Horario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
    //PAGINATOR
    Page<Horario> findAllBy(Pageable pageable);

}
