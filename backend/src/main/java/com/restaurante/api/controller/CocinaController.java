package com.restaurante.api.controller;

import com.restaurante.api.dto.OrdenResponseDTO;
import com.restaurante.api.entity.Orden;
import com.restaurante.api.repository.OrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CocinaController — Rutas del KDS (Kitchen Display System).
 * Requiere rol CHEF o ADMIN (configurado en SecurityConfig: /api/cocina/**).
 */
@RestController
@RequestMapping("/api/cocina")
@RequiredArgsConstructor
public class CocinaController {

    private final OrdenRepository ordenRepo;

    /**
     * GET /api/cocina/ordenes
     * Devuelve órdenes en estados que le interesan al chef:
     * - confirmada → nuevos tickets que llegan a la cocina
     * - en_preparacion → tickets que ya están siendo cocinados
     */
    @GetMapping("/ordenes")
    public ResponseEntity<List<OrdenResponseDTO>> listarParaCocina() {
        List<OrdenResponseDTO> ordenes = ordenRepo.findAll().stream()
                .filter(o -> o.getEstado() == Orden.Estado.confirmada ||
                        o.getEstado() == Orden.Estado.en_preparacion)
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .map(OrdenResponseDTO::from)
                .toList();
        return ResponseEntity.ok(ordenes);
    }
}
