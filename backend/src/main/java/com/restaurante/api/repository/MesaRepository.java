package com.restaurante.api.repository;

import com.restaurante.api.entity.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Optional<Mesa> findByNumero(Integer numero);
}
