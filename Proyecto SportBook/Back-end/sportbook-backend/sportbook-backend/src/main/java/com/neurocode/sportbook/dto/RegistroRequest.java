package com.neurocode.sportbook.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegistroRequest {
    @NotBlank @Size(max = 100)
    private String nombre;
    @NotBlank @Email @Size(max = 100)
    private String correo;
    @NotBlank @Size(min = 6, max = 255)
    private String password;
    @Size(max = 20)
    private String telefono;
}
