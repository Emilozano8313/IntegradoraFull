package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Tabla mesas: id, numero, estado
 * (No tiene FK a cocinas en el DDL real)
 */
@Entity
@Table(name = "mesas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.libre;

    public enum Estado {
        libre, ocupada
    }
}
