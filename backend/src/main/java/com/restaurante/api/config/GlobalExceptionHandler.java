package com.restaurante.api.config;

import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

/**
 * Traduce excepciones de Spring a respuestas JSON consistentes.
 * { "error": "mensaje" } — misma forma que usaba el backend PHP.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleStatus(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(Map.of("error", ex.getReason() != null ? ex.getReason() : ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getAllErrors().forEach(err -> {
            String campo = err instanceof FieldError fe ? fe.getField() : err.getObjectName();
            campos.put(campo, err.getDefaultMessage());
        });
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Datos inválidos", "campos", campos));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor"));
    }
}
