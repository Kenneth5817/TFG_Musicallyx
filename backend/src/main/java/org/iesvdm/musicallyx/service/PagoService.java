package org.iesvdm.musicallyx.service;
import org.iesvdm.musicallyx.domain.Pago;
import org.iesvdm.musicallyx.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    public Page<Pago> findAll(Pageable pageable) {
        return pagoRepository.findAllBy(pageable);
    }


    public Optional<Pago> findById(Long id) {
        return pagoRepository.findById(id);
    }

    public Pago save(Pago pago) {
        return pagoRepository.save(pago);
    }

    public void deleteById(Long id) {
        pagoRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return pagoRepository.existsById(id);
    }

}
