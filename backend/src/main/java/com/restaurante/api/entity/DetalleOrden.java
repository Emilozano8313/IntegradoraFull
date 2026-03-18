package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "detalles_orden")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "nota_cliente", length = 500)
    private String notaCliente;

    @Column(name = "kitchen_id")
    private Long kitchenId;

    /** Usuario que preparó este ítem (chef, barista, parrillero, etc.) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preparado_por_id")
    private Usuario preparador;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_preparacion", nullable = false)
    private EstadoPreparacion estadoPreparacion = EstadoPreparacion.pendiente;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum EstadoPreparacion {
        pendiente, en_preparacion, listo, entregado
    }
}
