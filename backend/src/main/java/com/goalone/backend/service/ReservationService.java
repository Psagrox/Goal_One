package com.goalone.backend.service;

import com.goalone.backend.model.Reservation;
import com.goalone.backend.model.User;
import com.goalone.backend.model.Product;
import com.goalone.backend.repository.ReservationRepository;
import com.goalone.backend.repository.UserRepository;
import com.goalone.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Crear una nueva reserva
    @Transactional
    public Reservation createReservation(Long userId, Long productId, LocalDate reservationDate) {


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProduct(product);
        reservation.setReservationDate(reservationDate);
        reservation.setCompleted(false); // La reserva se marca como no completada por defecto

        System.out.println("Antes de guardar la reserva");
        reservationRepository.save(reservation);
        System.out.println("Después de guardar la reserva");

        return reservationRepository.save(reservation);
    }

    // Marcar una reserva como completada
    @Transactional
    public void completeReservation(Long reservationId) {
        System.out.println("Buscando reserva con ID: " + reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reservation.setCompleted(true);
        reservationRepository.save(reservation);

        System.out.println("Reserva marcada como completada: " + reservation.getId());
    }

    // Obtener todas las reservas de un usuario
    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    // Obtener todas las reservas de un producto
    public List<Reservation> getReservationsByProduct(Long productId) {
        return reservationRepository.findByProductId(productId);
    }

    // Verificar si un usuario tiene una reserva completada para un producto
    public boolean hasUserCompletedReservation(Long userId, Long productId) {
        return reservationRepository.existsByUserIdAndProductIdAndIsCompletedTrue(userId, productId);
    }

    @Transactional
    public void markPastReservationsAsCompleted() {
        LocalDate today = LocalDate.now();
        List<Reservation> pastReservations = reservationRepository.findByReservationDateBeforeAndIsCompletedFalse(today);

        for (Reservation reservation : pastReservations) {
            reservation.setCompleted(true);
            reservationRepository.save(reservation);
        }
    }

    @Transactional
    public void deleteReservation(Long reservationId) {
        if (!reservationRepository.existsById(reservationId)) {
            throw new RuntimeException("Reserva no encontrada");
        }
        reservationRepository.deleteById(reservationId);
    }
}