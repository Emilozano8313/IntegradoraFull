package com.restaurante.api.controller;

import com.restaurante.api.dto.OrdenResponseDTO;
import com.restaurante.api.repository.OrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Rutas del módulo mesero — requieren rol MESERO o ADMIN (configurado en
 * SecurityConfig).
 * URL: /api/mesero/**
 */
@RestController
@RequestMapping("/api/mesero")
@RequiredArgsConstructor
public class MeseroController {

    private final OrdenRepository ordenRepo;

    /**
     * GET /api/mesero/ordenes
     * Devuelve todas las órdenes activas (sin cerradas/canceladas).
     * El frontend hace polling cada 10 s.
     */
    @GetMapping("/ordenes")
    public ResponseEntity<List<OrdenResponseDTO>> listarActivas() {
        List<OrdenResponseDTO> ordenes = ordenRepo.findActivas()
                .stream()
                .map(OrdenResponseDTO::from)
                .toList();
        return ResponseEntity.ok(ordenes);
    }
}
