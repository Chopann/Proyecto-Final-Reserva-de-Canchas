package com.neurocode.sportbook.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LoginRequest {
    @NotBlank @Email
    private String correo;
    @NotBlank @Size(min = 6)
    private String password;
}
