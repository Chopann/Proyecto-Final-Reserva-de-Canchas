package com.neurocode.sportbook.controller;

import com.neurocode.sportbook.dto.*;
import com.neurocode.sportbook.service.CanchaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/canchas")
@RequiredArgsConstructor
public class CanchaController {

    private final CanchaService canchaService;

    // Carpeta donde se guardan las imágenes
    private static final String UPLOAD_DIR = "uploads/canchas/";

    /** GET /api/canchas */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CanchaResponse>>> listar(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String superficie) {
        return ResponseEntity.ok(ApiResponse.ok("Canchas obtenidas", canchaService.filtrar(estado, superficie)));
    }

    /** GET /api/canchas/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CanchaResponse>> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Cancha obtenida", canchaService.obtenerPorId(id)));
    }

    /** POST /api/canchas — crea cancha con datos JSON */
    @PostMapping
    public ResponseEntity<ApiResponse<CanchaResponse>> crear(@Valid @RequestBody CanchaRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.ok("Cancha creada", canchaService.crear(request)));
    }

    /** POST /api/canchas/{id}/imagen — sube imagen de la cancha */
    @PostMapping("/{id}/imagen")
    public ResponseEntity<ApiResponse<String>> subirImagen(
            @PathVariable Integer id,
            @RequestParam("imagen") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No se envió ninguna imagen."));
        }

        try {
            // Crear carpeta si no existe
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Nombre único para la imagen
            String extension  = file.getOriginalFilename()
                    .substring(file.getOriginalFilename().lastIndexOf("."));
            String nombreArchivo = "cancha_" + id + "_" + UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(nombreArchivo);

            // Guardar imagen en disco
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL pública de la imagen
            String imageUrl = "http://localhost:8080/uploads/canchas/" + nombreArchivo;

            // Actualizar cancha con la URL de la imagen
            CanchaResponse cancha = canchaService.obtenerPorId(id);
            CanchaRequest request = new CanchaRequest();
            request.setNombreCancha(cancha.getNombreCancha());
            request.setTipoSuperficie(cancha.getTipoSuperficie());
            request.setPrecioHora(cancha.getPrecioHora());
            request.setEstado(cancha.getEstado());
            request.setImagenUrl(imageUrl);
            canchaService.actualizar(id, request);

            return ResponseEntity.ok(ApiResponse.ok("Imagen subida exitosamente", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Error al guardar la imagen: " + e.getMessage()));
        }
    }

    /** PUT /api/canchas/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CanchaResponse>> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CanchaRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Cancha actualizada", canchaService.actualizar(id, request)));
    }

    /** PATCH /api/canchas/{id}/estado */
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

    /** DELETE /api/canchas/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Integer id) {
        canchaService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Cancha eliminada"));
    }
}