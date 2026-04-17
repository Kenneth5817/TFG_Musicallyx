package org.iesvdm.musicallyx.service;

import lombok.RequiredArgsConstructor;
import org.iesvdm.musicallyx.domain.BloqueoHorario;
import org.iesvdm.musicallyx.repository.BloqueoHorarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BloqueoHorarioService {

    private final BloqueoHorarioRepository repository;

    public List<BloqueoHorario> getAll() {
        return repository.findAll();
    }

    public List<BloqueoHorario> getSemana(LocalDate start, LocalDate end) {
        return repository.findByFechaBetween(start, end);
    }

    public BloqueoHorario save(BloqueoHorario bloqueo) {
        return repository.save(bloqueo);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public void reemplazarBloqueosSemana(LocalDate start, LocalDate end, List<BloqueoHorario> nuevos) {

        // 🔥 borrar semana completa
        repository.deleteByFechaBetween(start, end);

        // 🔥 guardar nuevos bloqueos
        repository.saveAll(nuevos);
    }
}