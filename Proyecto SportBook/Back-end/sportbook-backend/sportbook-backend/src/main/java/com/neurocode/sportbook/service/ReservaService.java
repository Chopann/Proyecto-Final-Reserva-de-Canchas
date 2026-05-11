package com.neurocode.sportbook.service;

import com.neurocode.sportbook.dto.ReservaRequest;
import com.neurocode.sportbook.dto.ReservaResponse;
import com.neurocode.sportbook.entity.Cancha;
import com.neurocode.sportbook.entity.Reserva;
import com.neurocode.sportbook.entity.Usuario;
import com.neurocode.sportbook.repository.CanchaRepository;
import com.neurocode.sportbook.repository.ReservaRepository;
import com.neurocode.sportbook.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;

    /** Reservas del usuario autenticado */
    public List<ReservaResponse> misReservas() {
        Usuario usuario = obtenerUsuarioAutenticado();
        return reservaRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
                .stream().map(this::toResponse).toList();
    }

    /** Todas las reservas (solo Admin) */
    public List<ReservaResponse> listarTodas() {
        return reservaRepository.findAll().stream()
                .map(this::toResponse).toList();
    }

    public ReservaResponse obtenerPorId(Integer id) {
        return toResponse(buscarOError(id));
    }

    /** Crea una reserva con validación de disponibilidad y cálculo de monto */
    public ReservaResponse crear(ReservaRequest request) {
        // 1. Validar que horaFin > horaInicio
        if (!request.getHoraFin().isAfter(request.getHoraInicio())) {
            throw new IllegalArgumentException("La hora de fin debe ser posterior a la hora de inicio.");
        }

        // 2. Validar que la cancha exista y esté disponible
        Cancha cancha = canchaRepository.findById(request.getIdCancha())
                .orElseThrow(() -> new IllegalArgumentException("Cancha no encontrada."));

        if (!"Disponible".equals(cancha.getEstado())) {
            throw new IllegalStateException("La cancha no está disponible (estado: " + cancha.getEstado() + ").");
        }

        // 3. Validar que no haya conflicto de horario
        boolean conflicto = reservaRepository.existeConflictoHorario(
                request.getIdCancha(),
                request.getFecha(),
                request.getHoraInicio(),
                request.getHoraFin());

        if (conflicto) {
            throw new IllegalStateException("La cancha ya está reservada en ese horario.");
        }

        // 4. Calcular monto total: precio_hora × horas_reservadas
        long minutos = Duration.between(request.getHoraInicio(), request.getHoraFin()).toMinutes();
        BigDecimal horas = BigDecimal.valueOf(minutos).divide(BigDecimal.valueOf(60));
        BigDecimal montoTotal = cancha.getPrecioHora().multiply(horas);

        // 5. Guardar reserva
        Usuario usuario = obtenerUsuarioAutenticado();

        Reserva reserva = Reserva.builder()
                .usuario(usuario)
                .cancha(cancha)
                .fecha(request.getFecha())
                .horaInicio(request.getHoraInicio())
                .horaFin(request.getHoraFin())
                .montoTotal(montoTotal)
                .estadoPago(request.getEstadoPago() != null ? request.getEstadoPago() : "Pendiente")
                .build();

        return toResponse(reservaRepository.save(reserva));
    }

    /** Modifica una reserva existente (solo el dueño o admin) */
    public ReservaResponse modificar(Integer id, ReservaRequest request) {
        Reserva reserva = buscarOError(id);

        if (!request.getHoraFin().isAfter(request.getHoraInicio())) {
            throw new IllegalArgumentException("La hora de fin debe ser posterior a la hora de inicio.");
        }

        boolean conflicto = reservaRepository.existeConflictoHorarioExcluyendo(
                request.getIdCancha(),
                request.getFecha(),
                request.getHoraInicio(),
                request.getHoraFin(),
                id);

        if (conflicto) {
            throw new IllegalStateException("La cancha ya está reservada en ese horario.");
        }

        Cancha cancha = canchaRepository.findById(request.getIdCancha())
                .orElseThrow(() -> new IllegalArgumentException("Cancha no encontrada."));

        long minutos = Duration.between(request.getHoraInicio(), request.getHoraFin()).toMinutes();
        BigDecimal horas = BigDecimal.valueOf(minutos).divide(BigDecimal.valueOf(60));
        BigDecimal montoTotal = cancha.getPrecioHora().multiply(horas);

        reserva.setCancha(cancha);
        reserva.setFecha(request.getFecha());
        reserva.setHoraInicio(request.getHoraInicio());
        reserva.setHoraFin(request.getHoraFin());
        reserva.setMontoTotal(montoTotal);
        if (request.getEstadoPago() != null) reserva.setEstadoPago(request.getEstadoPago());

        return toResponse(reservaRepository.save(reserva));
    }

    /** Cancela una reserva cambiando su estado */
    public void cancelar(Integer id) {
        Reserva reserva = buscarOError(id);
        reserva.setEstadoPago("Cancelado");
        reservaRepository.save(reserva);
    }

    // ── helpers ────────────────────────────────────────────────────────────────

    private Reserva buscarOError(Integer id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada: " + id));
    }

    private Usuario obtenerUsuarioAutenticado() {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado."));
    }

    private ReservaResponse toResponse(Reserva r) {
        return ReservaResponse.builder()
                .idReserva(r.getIdReserva())
                .nombreUsuario(r.getUsuario().getNombre())
                .nombreCancha(r.getCancha().getNombreCancha())
                .fecha(r.getFecha())
                .horaInicio(r.getHoraInicio())
                .horaFin(r.getHoraFin())
                .montoTotal(r.getMontoTotal())
                .estadoPago(r.getEstadoPago())
                .build();
    }
}
