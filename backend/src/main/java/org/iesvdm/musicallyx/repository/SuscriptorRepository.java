package org.iesvdm.musicallyx.repository;


import org.iesvdm.musicallyx.domain.Suscriptor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuscriptorRepository extends JpaRepository<Suscriptor, Long> {
    boolean existsByEmail(String email);
}
