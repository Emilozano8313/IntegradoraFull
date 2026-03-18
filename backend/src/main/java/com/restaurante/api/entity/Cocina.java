package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cocinas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cocina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;
}
