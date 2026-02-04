package org.iesvdm.musicallyx.repository;

import org.iesvdm.musicallyx.domain.Pago;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    Page<Pago> findAllBy(Pageable pageable);

}
