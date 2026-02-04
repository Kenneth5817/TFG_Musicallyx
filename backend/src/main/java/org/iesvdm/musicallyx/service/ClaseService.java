package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.domain.Clase;
import org.iesvdm.musicallyx.repository.ClaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class ClaseService {

    @Autowired
    private ClaseRepository claseRepository;

    public Page<Clase> findAll(Pageable pageable) {
        return claseRepository.findAllBy(pageable);
    }

    public Optional<Clase> findById(Long id) {
        return claseRepository.findById(id);
    }

    public Clase save(Clase clase) {
        return claseRepository.save(clase);
    }

    public void deleteById(Long id) {
        claseRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return claseRepository.existsById(id);
    }
    //Añadido
//    public Page<Clase> listarClases(String nombreClase, Pageable pageable) {
//        return claseRepository.f(nombreClase, pageable);
//    }
}
