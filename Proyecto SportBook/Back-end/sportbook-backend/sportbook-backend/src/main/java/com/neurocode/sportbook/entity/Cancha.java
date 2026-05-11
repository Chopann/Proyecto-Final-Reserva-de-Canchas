package com.neurocode.sportbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "canchas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cancha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cancha")
    private Integer idCancha;

    @Column(name = "nombre_cancha", nullable = false, length = 100)
    private String nombreCancha;

    @Column(name = "tipo_superficie", length = 50)
    private String tipoSuperficie;

    @Column(name = "precio_hora", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioHora;

    @Column(name = "estado", length = 20)
    private String estado = "Disponible";
}
