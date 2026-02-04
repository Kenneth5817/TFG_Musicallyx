package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.domain.Profesor;
import org.iesvdm.musicallyx.repository.ProfesorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class ProfesorService {

    @Autowired
    private ProfesorRepository profesorRepository;

    public Page<Profesor> findAll(Pageable pageable) {
        return profesorRepository.findAllBy(pageable);
    }

    public Optional<Profesor> findById(Long id) {
        return profesorRepository.findById(id);
    }

    public Profesor save(Profesor profesor) {
        return profesorRepository.save(profesor);
    }

    public void deleteById(Long id) {
        profesorRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return profesorRepository.existsById(id);
    }
}
