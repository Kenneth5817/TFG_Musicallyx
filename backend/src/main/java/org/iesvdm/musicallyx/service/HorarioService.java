package org.iesvdm.musicallyx.service;

import org.iesvdm.musicallyx.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.iesvdm.musicallyx.domain.Horario;

import java.util.Optional;

@Service
@Transactional
public class HorarioService {

    @Autowired
    private HorarioRepository horariosRepository;

    public Page<Horario> findAll(Pageable pageable) {
        return horariosRepository.findAllBy(pageable);
    }


    public Optional<Horario> findById(Long id) {
        return horariosRepository.findById(id);
    }

    public Horario save(Horario horarios) {
        return horariosRepository.save(horarios);
    }

    public void deleteById(Long id) {
        horariosRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return horariosRepository.existsById(id);
    }

}
