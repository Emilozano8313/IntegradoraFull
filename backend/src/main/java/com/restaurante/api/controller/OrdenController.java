package com.restaurante.api.controller;

import com.restaurante.api.dto.*;
import com.restaurante.api.entity.Usuario;
import com.restaurante.api.repository.UsuarioRepository;
import com.restaurante.api.service.OrdenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService ordenService;
    private final UsuarioRepository usuarioRepo;

    @PostMapping
    public ResponseEntity<OrdenResponseDTO> crear(@Valid @RequestBody OrdenRequestDTO req) {
        OrdenResponseDTO orden = ordenService.crearOrden(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(orden);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenResponseDTO> show(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.obtenerOrden(id));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<OrdenResponseDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario empleadoLogueado = null;
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            empleadoLogueado = usuarioRepo.findByEmail(auth.getName()).orElse(null);
        }

        return ResponseEntity.ok(ordenService.cambiarEstado(id, nuevoEstado, empleadoLogueado));
    }

    @GetMapping("/historial")
    public ResponseEntity<List<OrdenResponseDTO>> getHistorial() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuarioActual = usuarioRepo.findByEmail(auth.getName()).orElse(null);
        if (usuarioActual == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            return ResponseEntity.ok(ordenService.obtenerHistorial());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
