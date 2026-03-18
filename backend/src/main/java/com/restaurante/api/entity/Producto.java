package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Tabla productos: id, categoria_id, kitchen_id, nombre, descripcion,
 * alergenos, precio, stock_disponible, imagen_url, activo
 */
@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(name = "kitchen_id", nullable = false)
    private Long kitchenId;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 255)
    private String alergenos;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "stock_disponible", nullable = false)
    private Integer stockDisponible = 0;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(nullable = false)
    private Boolean activo = true;

    /** Campo calculado — no existe como columna en MySQL */
    @Transient
    private Boolean stockBajo;

    @PostLoad
    void calcularStockBajo() {
        this.stockBajo = (stockDisponible != null && stockDisponible <= 5);
    }
}
