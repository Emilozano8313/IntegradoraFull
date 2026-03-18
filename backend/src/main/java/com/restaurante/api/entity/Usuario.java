package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Tabla usuarios: id, nombre, email, password_hash, rol, kitchen_id, activo,
 * created_at
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    /** Solo para chefs — FK a cocinas */
    @Column(name = "kitchen_id")
    private Long kitchenId;

    /** Solo para meseros — mesa asignada */
    @Column(name = "mesa_id")
    private Long mesaId;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Rol {
        admin, mesero, chef
    }
}
