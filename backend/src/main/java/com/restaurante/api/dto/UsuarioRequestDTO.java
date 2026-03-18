package com.restaurante.api.dto;

import lombok.*;

/** DTO para crear/actualizar un usuario de staff */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password; // Opcional en edición
    private String rol; // "admin" | "mesero" | "chef"
    private Long kitchenId; // Chef → cocina asignada
    private Long mesaId; // Mesero → mesa asignada
}
