package org.iesvdm.musicallyx.repository;

import org.iesvdm.musicallyx.domain.Clase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaseRepository extends JpaRepository<Clase, Long> {
    Page<Clase> findAllBy(Pageable pageable);

}
