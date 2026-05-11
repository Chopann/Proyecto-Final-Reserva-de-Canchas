package com.neurocode.sportbook.dto;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UsuarioResponse {
    private Integer idUsuario;
    private String nombre;
    private String correo;
    private String telefono;
    private String rol;
}
