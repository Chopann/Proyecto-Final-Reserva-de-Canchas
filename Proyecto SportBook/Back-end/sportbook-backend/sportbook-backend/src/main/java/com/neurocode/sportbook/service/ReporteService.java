package com.neurocode.sportbook.service;

import com.neurocode.sportbook.entity.Reserva;
import com.neurocode.sportbook.repository.CanchaRepository;
import com.neurocode.sportbook.repository.ReservaRepository;
import com.neurocode.sportbook.repository.UsuarioRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;

    /** Resumen general para el dashboard de admin */
    public Map<String, Object> resumenGeneral() {
        List<Reserva> todas = reservaRepository.findAll();

        BigDecimal ingresosTotales = todas.stream()
                .filter(r -> "Pagado".equals(r.getEstadoPago()))
                .map(Reserva::getMontoTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pagosPendientes = todas.stream()
                .filter(r -> "Pendiente".equals(r.getEstadoPago()))
                .map(Reserva::getMontoTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long reservasActivas = todas.stream()
                .filter(r -> !"Cancelado".equals(r.getEstadoPago()))
                .count();

        // Cancha más reservada
        String canchaTopNombre = todas.stream()
                .filter(r -> !"Cancelado".equals(r.getEstadoPago()))
                .collect(Collectors.groupingBy(r -> r.getCancha().getNombreCancha(), Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("totalUsuarios",      usuarioRepository.count());
        resumen.put("totalCanchas",       canchaRepository.count());
        resumen.put("reservasActivas",    reservasActivas);
        resumen.put("ingresosTotales",    ingresosTotales);
        resumen.put("pagosPendientes",    pagosPendientes);
        resumen.put("canchaTopReservada", canchaTopNombre);
        resumen.put("fechaReporte",       LocalDate.now().toString());
        return resumen;
    }

    /** Rendimiento por cancha — muestra todas las canchas aunque no tengan reservas */
    public List<Map<String, Object>> rendimientoPorCancha() {
        List<Reserva> todas = reservaRepository.findAll();

        return canchaRepository.findAll().stream().map(cancha -> {
            List<Reserva> reservasCancha = todas.stream()
                    .filter(r -> r.getCancha().getIdCancha().equals(cancha.getIdCancha()))
                    .filter(r -> !"Cancelado".equals(r.getEstadoPago()))
                    .toList();

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("idCancha",         cancha.getIdCancha());
            item.put("nombreCancha",     cancha.getNombreCancha());
            item.put("tipoSuperficie",   cancha.getTipoSuperficie());
            item.put("estado",           cancha.getEstado());
            item.put("totalReservas",    reservasCancha.size());
            item.put("ingresosGenerados", reservasCancha.stream()
                    .map(Reserva::getMontoTotal)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
            return item;
        }).toList();
    }

    /** Detalle de facturación con filtro por estado de pago */
    public List<Map<String, Object>> detalleFacturacion(String estadoPago) {
        List<Reserva> reservas = estadoPago != null
                ? reservaRepository.findByEstadoPago(estadoPago)
                : reservaRepository.findAll();

        return reservas.stream().map(r -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("idReserva",    r.getIdReserva());
            item.put("usuario",      r.getUsuario().getNombre());
            item.put("cancha",       r.getCancha().getNombreCancha());
            item.put("fecha",        r.getFecha().toString());
            item.put("horaInicio",   r.getHoraInicio().toString());
            item.put("horaFin",      r.getHoraFin().toString());
            item.put("montoTotal",   r.getMontoTotal());
            item.put("estadoPago",   r.getEstadoPago());
            return item;
        }).toList();
    }
}
