package com.neurocode.sportbook.controller;

import com.neurocode.sportbook.dto.ApiResponse;
import com.neurocode.sportbook.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    /** GET /api/reportes/resumen — métricas generales para dashboard admin */
    @GetMapping("/resumen")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resumen() {
        return ResponseEntity.ok(ApiResponse.ok("Resumen generado", reporteService.resumenGeneral()));
    }

    /** GET /api/reportes/canchas — rendimiento por cancha */
    @GetMapping("/canchas")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> rendimientoCanchas() {
        return ResponseEntity.ok(ApiResponse.ok("Rendimiento por cancha", reporteService.rendimientoPorCancha()));
    }

    /** GET /api/reportes/facturacion?estadoPago=Pagado */
    @GetMapping("/facturacion")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> facturacion(
            @RequestParam(required = false) String estadoPago) {
        return ResponseEntity.ok(ApiResponse.ok("Detalle de facturación", reporteService.detalleFacturacion(estadoPago)));
    }
}
