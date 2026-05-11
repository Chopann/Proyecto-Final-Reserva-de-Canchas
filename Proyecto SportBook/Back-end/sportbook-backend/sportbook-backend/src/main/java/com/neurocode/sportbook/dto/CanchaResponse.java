package com.neurocode.sportbook.dto;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CanchaResponse {
    private Integer idCancha;
    private String nombreCancha;
    private String tipoSuperficie;
    private BigDecimal precioHora;
    private String estado;
}
