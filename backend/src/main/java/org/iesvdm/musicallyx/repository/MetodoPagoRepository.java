package org.iesvdm.musicallyx.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.iesvdm.musicallyx.domain.MetodoPago;

@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long> {
    Page<MetodoPago> findAllBy(Pageable pageable);

}
