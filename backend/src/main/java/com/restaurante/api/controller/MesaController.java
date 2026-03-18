package com.restaurante.api.controller;

import com.restaurante.api.entity.Mesa;
import com.restaurante.api.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
@RequestMapping("/api/mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaRepository mesaRepo;

    /**
     * GET /api/mesas/{numero}
     * Consulta el estado de una mesa. Retorna 409 si está ocupada.
     * PÚBLICO — el cliente de mesa no tiene sesión.
     */
    @GetMapping("/{numero}")
    public ResponseEntity<?> show(@PathVariable Integer numero) {
        Mesa mesa = mesaRepo.findByNumero(numero)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mesa no encontrada"));

        if (mesa.getEstado() == Mesa.Estado.ocupada) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "La mesa ya está ocupada"));
        }

        return ResponseEntity.ok(Map.of(
                "id", mesa.getId(),
                "numero", mesa.getNumero(),
                "estado", mesa.getEstado().name()));
    }

    /**
     * GET /api/mesas
     * Lista todas las mesas (para el dashboard del mesero/admin).
     */
    @GetMapping
    public ResponseEntity<?> index() {
        var mesas = mesaRepo.findAll().stream().map(m -> Map.of(
                "id", m.getId(),
                "numero", m.getNumero(),
                "estado", m.getEstado().name())).toList();
        return ResponseEntity.ok(mesas);
    }
}
