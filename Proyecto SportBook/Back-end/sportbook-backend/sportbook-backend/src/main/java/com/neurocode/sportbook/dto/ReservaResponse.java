package com.neurocode.sportbook.dto;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReservaResponse {
    private Integer idReserva;
    private String nombreUsuario;
    private String nombreCancha;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private BigDecimal montoTotal;
    private String estadoPago;
}
