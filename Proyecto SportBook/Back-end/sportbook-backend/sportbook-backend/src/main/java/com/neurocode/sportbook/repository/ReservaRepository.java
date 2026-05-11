package com.neurocode.sportbook.repository;

import com.neurocode.sportbook.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    List<Reserva> findByUsuario_IdUsuario(Integer idUsuario);

    List<Reserva> findByCancha_IdCancha(Integer idCancha);

    List<Reserva> findByEstadoPago(String estadoPago);

    List<Reserva> findByFecha(LocalDate fecha);

    /**
     * Detecta conflictos de horario para una cancha en una fecha dada.
     * Una reserva existe si hay traslape de horario y no está cancelada.
     */
    @Query("""
        SELECT COUNT(r) > 0 FROM Reserva r
        WHERE r.cancha.idCancha = :idCancha
          AND r.fecha = :fecha
          AND r.estadoPago <> 'Cancelado'
          AND r.horaInicio < :horaFin
          AND r.horaFin > :horaInicio
    """)
    boolean existeConflictoHorario(
        @Param("idCancha")   Integer idCancha,
        @Param("fecha")      LocalDate fecha,
        @Param("horaInicio") LocalTime horaInicio,
        @Param("horaFin")    LocalTime horaFin
    );

    /**
     * Igual que el anterior pero excluye la propia reserva (para modificaciones).
     */
    @Query("""
        SELECT COUNT(r) > 0 FROM Reserva r
        WHERE r.cancha.idCancha = :idCancha
          AND r.fecha = :fecha
          AND r.estadoPago <> 'Cancelado'
          AND r.horaInicio < :horaFin
          AND r.horaFin > :horaInicio
          AND r.idReserva <> :idReserva
    """)
    boolean existeConflictoHorarioExcluyendo(
        @Param("idCancha")   Integer idCancha,
        @Param("fecha")      LocalDate fecha,
        @Param("horaInicio") LocalTime horaInicio,
        @Param("horaFin")    LocalTime horaFin,
        @Param("idReserva")  Integer idReserva
    );

    /** Para reportes: reservas de una cancha en un rango de fechas */
    @Query("""
        SELECT r FROM Reserva r
        WHERE r.cancha.idCancha = :idCancha
          AND r.fecha BETWEEN :desde AND :hasta
        ORDER BY r.fecha, r.horaInicio
    """)
    List<Reserva> findByCanchaAndFechaRango(
        @Param("idCancha") Integer idCancha,
        @Param("desde")    LocalDate desde,
        @Param("hasta")    LocalDate hasta
    );
}
