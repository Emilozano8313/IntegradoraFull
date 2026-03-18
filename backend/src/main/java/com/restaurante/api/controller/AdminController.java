package com.restaurante.api.controller;

import com.restaurante.api.dto.*;
import com.restaurante.api.entity.*;
import com.restaurante.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * AdminController — CRUD de usuarios de staff.
 * Rutas protegidas con rol ADMIN (configurado en SecurityConfig: /api/admin/**)
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    // ── Listar todos los usuarios de staff ────────────────────────────────────
    @GetMapping("/usuarios")
    public List<UsuarioResponseDTO> listar() {
        return usuarioRepo.findAll().stream()
                .map(UsuarioResponseDTO::from)
                .toList();
    }

    // ── Crear nuevo usuario ───────────────────────────────────────────────────
    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponseDTO> crear(@RequestBody UsuarioRequestDTO req) {
        if (usuarioRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es requerida");
        }

        Usuario u = new Usuario();
        u.setNombre(req.getNombre());
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRol(Usuario.Rol.valueOf(req.getRol()));
        u.setKitchenId(req.getKitchenId());
        u.setMesaId(req.getMesaId());
        u.setActivo(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UsuarioResponseDTO.from(usuarioRepo.save(u)));
    }

    // ── Actualizar usuario (sin cambiar password si no se envía) ──────────────
    @PutMapping("/usuarios/{id}")
    public UsuarioResponseDTO actualizar(@PathVariable Long id, @RequestBody UsuarioRequestDTO req) {
        Usuario u = usuarioRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        u.setNombre(req.getNombre());
        u.setEmail(req.getEmail());
        u.setRol(Usuario.Rol.valueOf(req.getRol()));
        u.setKitchenId(req.getKitchenId());
        u.setMesaId(req.getMesaId());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        return UsuarioResponseDTO.from(usuarioRepo.save(u));
    }

    // ── Eliminar usuario ──────────────────────────────────────────────────────
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!usuarioRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        usuarioRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
