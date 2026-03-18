package com.restaurante.api.repository;

import com.restaurante.api.entity.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    /** Órdenes activas: todo excepto cerradas y canceladas */
    List<Orden> findByEstadoNotIn(List<Orden.Estado> estadosExcluidos);

    /** Historial: últimas 50 órdenes de ciertos estados */
    List<Orden> findTop50ByEstadoInOrderByIdDesc(List<Orden.Estado> estados);

    /** Todas las órdenes de un número de mesa (incluye cerradas) */
    List<Orden> findByMesa_Numero(Integer mesaNumero);

    /** Shortcut para el dashboard */
    default List<Orden> findActivas() {
        return findByEstadoNotIn(
                List.of(Orden.Estado.cerrada, Orden.Estado.cancelada));
    }

    /** Órdenes activas de una mesa específica */
    default List<Orden> findActivasPorMesa(Integer mesaNumero) {
        return findByMesa_Numero(mesaNumero).stream()
                .filter(o -> o.getEstado() != Orden.Estado.cerrada
                        && o.getEstado() != Orden.Estado.cancelada)
                .toList();
    }
}
