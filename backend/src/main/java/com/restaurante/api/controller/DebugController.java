package com.restaurante.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * DebugController — solo para desarrollo.
 * Genera hashes BCrypt para actualizar la BD.
 *
 * USO: GET http://localhost:8080/api/debug/bcrypt?password=123456
 * Luego actualiza en MySQL:
 * UPDATE usuarios SET password_hash = '<hash generado>' WHERE email =
 * 'mesero@rest.com';
 *
 * REMOVER este archivo antes de ir a producción.
 */
@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final PasswordEncoder passwordEncoder;

    @GetMapping("/bcrypt")
    public Map<String, String> generarHash(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return Map.of(
                "password", password,
                "hash", hash,
                "sql", "UPDATE usuarios SET password_hash = '" + hash + "' WHERE email = 'mesero@rest.com';");
    }
}
