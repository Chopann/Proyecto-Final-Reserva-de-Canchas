package com.neurocode.sportbook.service;

import com.neurocode.sportbook.dto.CanchaRequest;
import com.neurocode.sportbook.dto.CanchaResponse;
import com.neurocode.sportbook.entity.Cancha;
import com.neurocode.sportbook.repository.CanchaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CanchaService {

    private final CanchaRepository canchaRepository;

    public List<CanchaResponse> listarTodas() {
        return canchaRepository.findAll().stream()
                .map(this::toResponse).toList();
    }

    public List<CanchaResponse> listarDisponibles() {
        return canchaRepository.findByEstado("Disponible").stream()
                .map(this::toResponse).toList();
    }

    public List<CanchaResponse> filtrar(String estado, String superficie) {
        if (estado != null && superficie != null) {
            return canchaRepository.findByEstadoAndTipoSuperficie(estado, superficie)
                    .stream().map(this::toResponse).toList();
        } else if (estado != null) {
            return canchaRepository.findByEstado(estado).stream().map(this::toResponse).toList();
        } else if (superficie != null) {
            return canchaRepository.findByTipoSuperficie(superficie).stream().map(this::toResponse).toList();
        }
        return listarTodas();
    }

    public CanchaResponse obtenerPorId(Integer id) {
        return toResponse(buscarOError(id));
    }

    public CanchaResponse crear(CanchaRequest request) {
        Cancha cancha = Cancha.builder()
                .nombreCancha(request.getNombreCancha())
                .tipoSuperficie(request.getTipoSuperficie())
                .precioHora(request.getPrecioHora())
                .estado(request.getEstado() != null ? request.getEstado() : "Disponible")
                .build();
        return toResponse(canchaRepository.save(cancha));
    }

    public CanchaResponse actualizar(Integer id, CanchaRequest request) {
        Cancha cancha = buscarOError(id);
        cancha.setNombreCancha(request.getNombreCancha());
        cancha.setTipoSuperficie(request.getTipoSuperficie());
        cancha.setPrecioHora(request.getPrecioHora());
        cancha.setEstado(request.getEstado());
        return toResponse(canchaRepository.save(cancha));
    }

    public void cambiarEstado(Integer id, String nuevoEstado) {
        Cancha cancha = buscarOError(id);

        // Mejora: Si pasamos a mantenimiento, podriamos imprimir un log especial
        if ("Mantenimiento".equalsIgnoreCase(nuevoEstado)) {
            System.out.println("AERTA: La cancha " + cancha.getNombreCancha() + "ha salido de servicio.");
        }
        cancha.setEstado(nuevoEstado);
        canchaRepository.save(cancha);
    }

    public void eliminar(Integer id) {
        buscarOError(id);
        canchaRepository.deleteById(id);
    }

    // ── helpers ────────────────────────────────────────────────────────────────

    private Cancha buscarOError(Integer id) {
        return canchaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cancha no encontrada: " + id));
    }

    private CanchaResponse toResponse(Cancha c) {
        String nombre = c.getNombreCancha().toLowerCase();
        String query;

        // Usamos etiquetas en inglés (funcionan mejor) y variamos según el deporte
        if (nombre.contains("tenis") || nombre.contains("tennis")) {
            query = "tennis";
        } else if (nombre.contains("basket") || nombre.contains("baloncesto")) {
            query = "basketball";
        } else if (nombre.contains("futbol") || nombre.contains("fútbol") || nombre.contains("soccer")) {
            query = "soccer";
        } else {
            query = "stadium";
        }

        // EXPLICACIÓN DEL CAMBIO:
        // Añadimos el ID al final de la ruta para que LoremFlickr lo vea como URLs
        // distintas
        // Formato: /640/480/deporte?lock=ID
        String fotoUrl = "https://loremflickr.com/640/480/" + query + "?lock=" + c.getIdCancha();

        return CanchaResponse.builder()
                .idCancha(c.getIdCancha())
                .nombreCancha(c.getNombreCancha())
                .tipoSuperficie(c.getTipoSuperficie())
                .precioHora(c.getPrecioHora())
                .estado(c.getEstado())
                .fotoUrl(fotoUrl)
                .build();
    }

    public void eliminar_cancha(Integer id) {
        // Primero verificamos si existe para lanzar el error antes de intentar borrar
        if (!canchaRepository.existsById(id)) {
            throw new IllegalArgumentException("La cancha con ID " + id + " no existe.");
        }
        canchaRepository.deleteById(id);
    }
}
