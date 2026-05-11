package com.neurocode.sportbook.controller;

import com.neurocode.sportbook.dto.ApiResponse;
import com.neurocode.sportbook.dto.UsuarioResponse;
import com.neurocode.sportbook.entity.Usuario;
import com.neurocode.sportbook.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    /** GET /api/usuarios — lista todos los usuarios (solo Admin) */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> listar() {
        List<UsuarioResponse> usuarios = usuarioRepository.findAll().stream()
                .map(u -> UsuarioResponse.builder()
                        .idUsuario(u.getIdUsuario())
                        .nombre(u.getNombre())
                        .correo(u.getCorreo())
                        .telefono(u.getTelefono())
                        .rol(u.getRol().getNombreRol())
                        .build())
                .toList();
        return ResponseEntity.ok(ApiResponse.ok("Usuarios obtenidos", usuarios));
    }
}
