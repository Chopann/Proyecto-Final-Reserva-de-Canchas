package com.neurocode.sportbook.dto;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private String token;
    private String tipo;
    private String correo;
    private String nombre;
    private String rol;
}
