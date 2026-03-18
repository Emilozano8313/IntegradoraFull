package com.restaurante.api.controller;

import com.restaurante.api.entity.Usuario;
import com.restaurante.api.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthenticationManager authManager;
        private final UsuarioRepository usuarioRepo;

        // ── DTO explícito para evitar cualquier transformación de Jackson ─────────
        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        public static class LoginRequest {
                private String email;
                private String password;
        }

        /**
         * POST /api/auth/login
         * Body exacto: { "email": "...", "password": "..." }
         * PÚBLICO — usa DTO explícito en vez de Map para evitar SNAKE_CASE de Jackson.
         */
        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest req,
                        HttpServletRequest request) {

                String email = req.getEmail();
                String password = req.getPassword();

                log.info("[AUTH] Login attempt — email: {}", email);

                if (email == null || email.isBlank() || password == null || password.isBlank()) {
                        log.warn("[AUTH] Email o password nulo/vacío");
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Email y contraseña son requeridos"));
                }

                // Verificar que el usuario existe en BD antes de autenticar
                boolean existeUsuario = usuarioRepo.findByEmail(email).isPresent();
                log.info("[AUTH] usuario existe en BD: {}", existeUsuario);

                try {
                        Authentication auth = authManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(email, password));

                        SecurityContextHolder.getContext().setAuthentication(auth);

                        HttpSession session = request.getSession(true);
                        session.setAttribute(
                                        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                                        SecurityContextHolder.getContext());

                        Usuario usuario = usuarioRepo.findByEmail(email)
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

                        log.info("[AUTH] Login exitoso — usuario: {} rol: {}", usuario.getNombre(), usuario.getRol());

                        return ResponseEntity.ok(Map.of(
                                        "id", usuario.getId(),
                                        "nombre", usuario.getNombre(),
                                        "email", usuario.getEmail(),
                                        "rol", usuario.getRol().name()));

                } catch (BadCredentialsException e) {
                        log.warn("[AUTH] BadCredentials para email: {}", email);
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("error", "Credenciales incorrectas"));
                } catch (Exception e) {
                        log.error("[AUTH] Error inesperado: {}", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("error", "Error interno al autenticar"));
                }
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(HttpServletRequest request) {
                HttpSession session = request.getSession(false);
                if (session != null)
                        session.invalidate();
                SecurityContextHolder.clearContext();
                return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
        }

        @GetMapping("/me")
        public ResponseEntity<?> me() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth == null || !auth.isAuthenticated()
                                || "anonymousUser".equals(auth.getPrincipal())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("error", "Sin sesión activa"));
                }
                String email = auth.getName();
                Usuario usuario = usuarioRepo.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
                return ResponseEntity.ok(Map.of(
                                "id", usuario.getId(),
                                "nombre", usuario.getNombre(),
                                "email", usuario.getEmail(),
                                "rol", usuario.getRol().name()));
        }
}
