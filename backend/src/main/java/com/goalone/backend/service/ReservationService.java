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
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService; // Inyecta el servicio de correo

    // Crear una nueva reserva
    @Transactional
    public Reservation createReservation(Long userId, Long productId, LocalDate reservationDate) {
        // Obtener el usuario que hizo la reserva
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Obtener el producto reservado
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Obtener el proveedor del producto
        User provider = product.getUser(); // Asegúrate de que Product tenga una relación con User

        // Crear la reserva
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProduct(product);
        reservation.setReservationDate(reservationDate);
        reservation.setCompleted(false); // La reserva se marca como no completada por defecto

        reservationRepository.save(reservation);

        // Enviar correo de confirmación de reserva al usuario que hizo la reserva
        String subject = "Confirmación de reserva";
        String body = "Hola " + user.getName() + ",\n\n" +
                "Tu reserva para " + product.getName() + " ha sido confirmada.\n" +
                "Fecha de reserva: " + reservationDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n" +
                "Ubicación: " + product.getLocation() + "\n" +
                "Contacto del proveedor:\n" +
                " - Correo: " + provider.getEmail() + "\n" +
                "Gracias por usar nuestro servicio.";

        // Enviar el correo al usuario que hizo la reserva
        emailService.sendReservationConfirmation(user.getEmail(), subject, body);

        return reservation;
    }

    // Marcar una reserva como completada
    @Transactional
    public void completeReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reservation.setCompleted(true);
        reservationRepository.save(reservation);

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