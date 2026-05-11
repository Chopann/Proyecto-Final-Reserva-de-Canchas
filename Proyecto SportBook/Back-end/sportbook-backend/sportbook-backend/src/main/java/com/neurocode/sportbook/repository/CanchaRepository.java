package com.neurocode.sportbook.repository;

import com.neurocode.sportbook.entity.Cancha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Integer> {

    List<Cancha> findByEstado(String estado);

    List<Cancha> findByTipoSuperficie(String tipoSuperficie);

    List<Cancha> findByEstadoAndTipoSuperficie(String estado, String tipoSuperficie);
}
