package com.neurocode.sportbook.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CanchaRequest {
    @NotBlank @Size(max = 100)
    private String nombreCancha;
    @Size(max = 50)
    private String tipoSuperficie;
    @NotNull @DecimalMin("0.0")
    private BigDecimal precioHora;
    private String estado = "Disponible";
}
