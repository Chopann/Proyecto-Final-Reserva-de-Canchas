package com.neurocode.sportbook.controller;

import com.neurocode.sportbook.dto.*;
import com.neurocode.sportbook.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * Body: { "correo": "...", "password": "..." }
     * Devuelve: token JWT + info del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login exitoso", response));
    }

    /**
     * POST /api/auth/registro
     * Body: { "nombre": "...", "correo": "...", "password": "...", "telefono": "..." }
     * Devuelve: datos del usuario creado
     */
    @PostMapping("/registro")
    public ResponseEntity<ApiResponse<UsuarioResponse>> registro(@Valid @RequestBody RegistroRequest request) {
        UsuarioResponse response = authService.registrar(request);
        return ResponseEntity.status(201).body(ApiResponse.ok("Usuario registrado exitosamente", response));
    }
}
