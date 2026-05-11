package com.neurocode.sportbook.controller;

import com.neurocode.sportbook.dto.*;
import com.neurocode.sportbook.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    /** GET /api/reservas/mis-reservas — reservas del usuario autenticado */
    @GetMapping("/mis-reservas")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> misReservas() {
        return ResponseEntity.ok(ApiResponse.ok("Reservas obtenidas", reservaService.misReservas()));
    }

    /** GET /api/reservas — todas las reservas (solo Admin) */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarTodas() {
        return ResponseEntity.ok(ApiResponse.ok("Todas las reservas", reservaService.listarTodas()));
    }

    /** GET /api/reservas/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservaResponse>> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Reserva obtenida", reservaService.obtenerPorId(id)));
    }

    /**
     * POST /api/reservas
     * Crea una reserva con validación de disponibilidad y cálculo de monto automático.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ReservaResponse>> crear(@Valid @RequestBody ReservaRequest request) {
        ReservaResponse response = reservaService.crear(request);
        return ResponseEntity.status(201).body(ApiResponse.ok("Reserva creada exitosamente", response));
    }

    /** PUT /api/reservas/{id} — modifica una reserva */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservaResponse>> modificar(
            @PathVariable Integer id,
            @Valid @RequestBody ReservaRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Reserva modificada", reservaService.modificar(id, request)));
    }

    /** DELETE /api/reservas/{id} — cancela la reserva (estado = Cancelado) */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelar(@PathVariable Integer id) {
        reservaService.cancelar(id);
        return ResponseEntity.ok(ApiResponse.ok("Reserva cancelada exitosamente"));
    }
}
