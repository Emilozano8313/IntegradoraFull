package com.restaurante.api.controller;

import com.restaurante.api.entity.Producto;
import com.restaurante.api.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoRepository productoRepo;

    /**
     * GET /api/productos
     * Catálogo público del menú (solo activos).
     */
    @GetMapping
    public ResponseEntity<?> index() {
        List<Producto> productos = productoRepo.findByActivoTrue();

        var response = productos.stream().map(p -> Map.of(
                "id", p.getId(),
                "nombre", p.getNombre(),
                "descripcion", p.getDescripcion() != null ? p.getDescripcion() : "",
                "precio", p.getPrecio(),
                "imagen_url", p.getImagenUrl() != null ? p.getImagenUrl() : "",
                "categoria", p.getCategoria() != null ? p.getCategoria().getNombre() : "",
                "categoria_id", p.getCategoria() != null ? p.getCategoria().getId() : null,
                "kitchen_id", p.getKitchenId(),
                "stock_disponible", p.getStockDisponible(),
                "stock_bajo", p.getStockBajo())).toList();

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/{id}
     * Detalle de un producto.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> show(@PathVariable Long id) {
        return productoRepo.findById(id)
                .filter(Producto::getActivo)
                .map(p -> ResponseEntity.ok((Object) Map.of(
                        "id", p.getId(),
                        "nombre", p.getNombre(),
                        "precio", p.getPrecio())))
                .orElse(ResponseEntity.notFound().build());
    }
}
