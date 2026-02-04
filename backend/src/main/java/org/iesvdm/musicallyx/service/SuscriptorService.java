package org.iesvdm.musicallyx.service;
import org.iesvdm.musicallyx.domain.Suscriptor;
import org.iesvdm.musicallyx.repository.SuscriptorRepository;
import org.springframework.stereotype.Service;

@Service
public class SuscriptorService {

    private final SuscriptorRepository repo;

    public SuscriptorService(SuscriptorRepository repo) {
        this.repo = repo;
    }

    public Suscriptor guardarSuscriptor(String email) {
        if (repo.existsByEmail(email)) return null;

        Suscriptor s = new Suscriptor();
        s.setEmail(email);
        return repo.save(s);
    }
}
