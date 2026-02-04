package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.repository.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.iesvdm.musicallyx.domain.MetodoPago;

import java.util.Optional;

@Service
@Transactional
public class MetodoPagoService {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    public Page<MetodoPago> findAll(Pageable pageable) {
        return metodoPagoRepository.findAllBy(pageable);
    }

    public Optional<MetodoPago> findById(Long id) {
        return metodoPagoRepository.findById(id);
    }

    public MetodoPago save(MetodoPago metodoPago) {
        return metodoPagoRepository.save(metodoPago);
    }

    public void deleteById(Long id) {
        metodoPagoRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return metodoPagoRepository.existsById(id);
    }
}
