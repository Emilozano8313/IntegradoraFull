package com.restaurante.api.service;

import com.restaurante.api.entity.*;
import com.restaurante.api.dto.*;
import com.restaurante.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class OrdenService {

    private static final BigDecimal IVA_RATE = new BigDecimal("0.16");

    private final OrdenRepository ordenRepo;
    private final MesaRepository mesaRepo;
    private final ProductoRepository productoRepo;

    @Transactional
    public OrdenResponseDTO crearOrden(OrdenRequestDTO req) {
        Mesa mesa = mesaRepo.findByNumero(req.getMesaNumero())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mesa no encontrada"));

        if (mesa.getEstado() == Mesa.Estado.ocupada) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La mesa ya está ocupada");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        Orden orden = new Orden();
        orden.setMesa(mesa);

        for (OrdenRequestDTO.ItemDTO itemDto : req.getItems()) {
            Producto producto = productoRepo.findById(itemDto.getProductoId())
                    .filter(Producto::getActivo)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Producto " + itemDto.getProductoId() + " no encontrado o inactivo"));

            BigDecimal lineTotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(itemDto.getCantidad()));
            subtotal = subtotal.add(lineTotal);

            DetalleOrden detalle = new DetalleOrden();
            detalle.setOrden(orden);
            detalle.setProducto(producto);
            detalle.setCantidad(itemDto.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setNotaCliente(itemDto.getNotaCliente());
            detalle.setKitchenId(producto.getKitchenId());
            orden.getDetalles().add(detalle);
        }

        BigDecimal iva = subtotal.multiply(IVA_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(iva).setScale(2, RoundingMode.HALF_UP);

        orden.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        orden.setIva(iva);
        orden.setTotal(total);

        Orden guardada = ordenRepo.save(orden);
        mesa.setEstado(Mesa.Estado.ocupada);
        mesaRepo.save(mesa);

        return OrdenResponseDTO.from(guardada);
    }

    @Transactional(readOnly = true)
    public OrdenResponseDTO obtenerOrden(Long id) {
        Orden orden = ordenRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Orden no encontrada"));
        return OrdenResponseDTO.from(orden);
    }

    @Transactional
    public OrdenResponseDTO cambiarEstado(Long id, String nuevoEstado, Usuario empleadoLogueado) {
        Orden.Estado estado;
        try {
            estado = Orden.Estado.valueOf(nuevoEstado);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Estado no válido: " + nuevoEstado);
        }

        Orden orden = ordenRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Orden no encontrada"));

        if (estado == Orden.Estado.confirmada && orden.getMesero() == null && empleadoLogueado != null) {
            orden.setMesero(empleadoLogueado);
        }

        orden.setEstado(estado);

        if (estado == Orden.Estado.confirmada) {
            orden.getDetalles().forEach(d -> d.setEstadoPreparacion(DetalleOrden.EstadoPreparacion.pendiente));
        }

        if (estado == Orden.Estado.cerrada || estado == Orden.Estado.cancelada) {
            orden.getMesa().setEstado(Mesa.Estado.libre);
            mesaRepo.save(orden.getMesa());
        }

        return OrdenResponseDTO.from(ordenRepo.save(orden));
    }

    @Transactional(readOnly = true)
    public java.util.List<OrdenResponseDTO> obtenerHistorial() {
        java.util.List<Orden.Estado> estadosFinales = java.util.List.of(
                Orden.Estado.cerrada,
                Orden.Estado.entregada,
                Orden.Estado.cancelada);
        return ordenRepo.findTop50ByEstadoInOrderByIdDesc(estadosFinales)
                .stream()
                .map(OrdenResponseDTO::from)
                .toList();
    }
}
