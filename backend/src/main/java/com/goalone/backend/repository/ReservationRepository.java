package com.goalone.backend.repository;

import com.goalone.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Buscar reservas por usuario
    List<Reservation> findByUserId(Long userId);

    // Buscar reservas por producto
    List<Reservation> findByProductId(Long productId);

    // Verificar si un usuario tiene una reserva completada para un producto
    boolean existsByUserIdAndProductIdAndIsCompletedTrue(Long userId, Long productId);

    // Buscar reservas cuya fecha sea anterior a una fecha dada y que no estén completadas
    List<Reservation> findByReservationDateBeforeAndIsCompletedFalse(LocalDate date);
}