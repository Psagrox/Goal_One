package com.goalone.backend.repository;

import com.goalone.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Buscar reservas por usuario
    List<Reservation> findByUserId(Long userId);

    // Buscar reservas por producto
    List<Reservation> findByProductId(Long productId);

    // Verificar si un usuario tiene una reserva completada para un producto
    boolean existsByUserIdAndProductIdAndIsCompletedTrue(Long userId, Long productId);
}