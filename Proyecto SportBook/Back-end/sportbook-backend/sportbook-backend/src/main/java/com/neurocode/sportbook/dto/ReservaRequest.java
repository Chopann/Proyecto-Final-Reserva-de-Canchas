package com.neurocode.sportbook.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReservaRequest {
    @NotNull
    private Integer idCancha;
    @NotNull @Future
    private LocalDate fecha;
    @NotNull
    private LocalTime horaInicio;
    @NotNull
    private LocalTime horaFin;
    private String estadoPago = "Pendiente";
}
