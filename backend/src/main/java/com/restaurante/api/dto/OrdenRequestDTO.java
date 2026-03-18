package com.restaurante.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

/** Body del POST /api/ordenes — enviado por el cliente de la mesa */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrdenRequestDTO {

    @JsonProperty("mesa_numero")
    @NotNull(message = "mesa_numero es requerido")
    @Min(value = 1, message = "mesa_numero debe ser >= 1")
    private Integer mesaNumero;

    @NotEmpty(message = "Debe incluir al menos un ítem")
    @Valid
    private List<ItemDTO> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDTO {

        @JsonProperty("producto_id")
        @NotNull
        private Long productoId;

        @NotNull
        @Min(1)
        private Integer cantidad;

        @JsonProperty("nota_cliente")
        private String notaCliente = "";
    }
}
