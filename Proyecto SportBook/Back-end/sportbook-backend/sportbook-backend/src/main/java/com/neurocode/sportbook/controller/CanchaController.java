package com.neurocode.sportbook.controller;

import com.neurocode.sportbook.dto.*;
import com.neurocode.sportbook.service.CanchaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/canchas")
@RequiredArgsConstructor
public class CanchaController {

    private final CanchaService canchaService;

    /** GET /api/canchas?estado=Disponible&superficie=Sintética */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CanchaResponse>>> listar(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String superficie) {
        List<CanchaResponse> canchas = canchaService.filtrar(estado, superficie);
        return ResponseEntity.ok(ApiResponse.ok("Canchas obtenidas", canchas));
    }

    /** GET /api/canchas/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CanchaResponse>> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Cancha obtenida", canchaService.obtenerPorId(id)));
    }

    /** POST /api/canchas — solo Administrador */
    @PostMapping
    public ResponseEntity<ApiResponse<CanchaResponse>> crear(@Valid @RequestBody CanchaRequest request) {
        CanchaResponse response = canchaService.crear(request);
        return ResponseEntity.status(201).body(ApiResponse.ok("Cancha creada exitosamente", response));
    }

    /** PUT /api/canchas/{id} — solo Administrador */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CanchaResponse>> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CanchaRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Cancha actualizada", canchaService.actualizar(id, request)));
    }

    /** PATCH /api/canchas/{id}/estado — cambia estado: Disponible / Mantenimiento */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<Void>> cambiarEstado(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("El campo 'estado' es requerido."));
        }
        canchaService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(ApiResponse.ok("Estado actualizado a: " + nuevoEstado));
    }

    /** DELETE /api/canchas/{id} — solo Administrador */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Integer id) {
        canchaService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Cancha eliminada"));
    }
}
