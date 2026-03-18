package com.restaurante.api.repository;

import com.restaurante.api.entity.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {

    /** Tickets KDS filtrados por kitchen_id para los estados activos */
    @Query("""
            SELECT d FROM DetalleOrden d
            JOIN FETCH d.orden o
            JOIN FETCH d.producto p
            WHERE d.kitchenId = :kitchenId
              AND o.estado IN ('confirmada','en_preparacion')
              AND d.estadoPreparacion IN ('pendiente','en_preparacion','listo')
            ORDER BY d.createdAt ASC
            """)
    List<DetalleOrden> findTicketsByKitchen(Long kitchenId);
}
