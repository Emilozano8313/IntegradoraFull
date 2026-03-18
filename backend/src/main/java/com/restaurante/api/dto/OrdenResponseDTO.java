package com.restaurante.api.dto;

import com.restaurante.api.entity.DetalleOrden;
import com.restaurante.api.entity.Orden;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdenResponseDTO {

    private Long ordenId;
    private String estado;
    private BigDecimal subtotal;
    private BigDecimal iva;
    private BigDecimal total;
    private Integer mesaNumero;
    private LocalDateTime createdAt;
    private String meseroNombre;
    private List<DetalleDTO> detalles;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetalleDTO {
        private Long id;
        private String producto;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private String notaCliente;
        private String estadoPreparacion;
        private String preparadoPor;
        private String preparadoPorArea;

        public static DetalleDTO from(DetalleOrden d) {
            String preparadorNombre = null;
            String preparadorArea = null;

            try {
                if (d.getPreparador() != null) {
                    preparadorNombre = d.getPreparador().getNombre();
                    preparadorArea = d.getPreparador().getRol() != null ? d.getPreparador().getRol().name() : null;
                }
            } catch (Exception e) {
                preparadorNombre = "Personal Eliminado";
                preparadorArea = "Desconocido";
            }

            if (preparadorArea != null && (preparadorArea.equals("chef") || preparadorArea.equals("admin"))) {
                preparadorArea = "Cocina Principal";
            } else if (preparadorArea != null && !preparadorArea.equals("Desconocido")) {
                preparadorArea = preparadorArea.substring(0, 1).toUpperCase() + preparadorArea.substring(1);
            }

            String nombreProducto = "Producto Eliminado";
            try {
                if (d.getProducto() != null && d.getProducto().getNombre() != null) {
                    nombreProducto = d.getProducto().getNombre();
                }
            } catch (Exception e) { /* producto borrado */ }

            String estPrep = "pendiente";
            try {
                if (d.getEstadoPreparacion() != null) {
                    estPrep = d.getEstadoPreparacion().name();
                }
            } catch (Exception e) { /* estado null */ }

            return DetalleDTO.builder()
                    .id(d.getId())
                    .producto(nombreProducto)
                    .cantidad(d.getCantidad() != null ? d.getCantidad() : 1)
                    .precioUnitario(d.getPrecioUnitario() != null ? d.getPrecioUnitario() : BigDecimal.ZERO)
                    .notaCliente(d.getNotaCliente())
                    .estadoPreparacion(estPrep)
                    .preparadoPor(preparadorNombre)
                    .preparadoPorArea(preparadorArea)
                    .build();
        }
    }

    public static OrdenResponseDTO from(Orden o) {
        String meseroNombre = "Auto-Pedido";
        try {
            if (o.getMesero() != null && o.getMesero().getNombre() != null) {
                meseroNombre = o.getMesero().getNombre();
            }
        } catch (Exception e) {
            meseroNombre = "Mesero Eliminado";
        }

        Integer numMesa = -1;
        try {
            if (o.getMesa() != null && o.getMesa().getNumero() != null) {
                numMesa = o.getMesa().getNumero();
            }
        } catch (Exception e) { /* mesa borrada */ }

        String nomEstado = "pendiente_confirmacion";
        try {
            if (o.getEstado() != null) nomEstado = o.getEstado().name();
        } catch (Exception e) { /* estado nulo */ }

        var builder = OrdenResponseDTO.builder()
                .ordenId(o.getId())
                .estado(nomEstado)
                .subtotal(o.getSubtotal() != null ? o.getSubtotal() : BigDecimal.ZERO)
                .iva(o.getIva() != null ? o.getIva() : BigDecimal.ZERO)
                .total(o.getTotal() != null ? o.getTotal() : BigDecimal.ZERO)
                .mesaNumero(numMesa)
                .createdAt(o.getCreatedAt())
                .meseroNombre(meseroNombre);

        try {
            if (o.getDetalles() != null) {
                builder.detalles(o.getDetalles().stream().map(DetalleDTO::from).toList());
            }
        } catch (Exception e) { /* ignorar si cascade falla */ }
        return builder.build();
    }
}
