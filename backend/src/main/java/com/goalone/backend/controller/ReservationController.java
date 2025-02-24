package com.goalone.backend.controller;

import com.goalone.backend.config.JwtTokenProvider;
import com.goalone.backend.model.Reservation;
import com.goalone.backend.service.ReservationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;  // Inyecta el proveedor de JWT

    // Crear una nueva reserva
    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam Long productId,
            @RequestParam LocalDate reservationDate) {

        // Extraer el token JWT del encabezado Authorization
        String token = authorizationHeader.replace("Bearer ", "");

        // Obtener el userId desde el token
        Long  userId = jwtTokenProvider.getUserIdFromToken(token);

        if (userId == null) {
            return ResponseEntity.status(401).build();  // Unauthorized
        }

        // Crear la reserva utilizando el userId extraído del token
        Reservation reservation = reservationService.createReservation(userId, productId, reservationDate);
        return ResponseEntity.ok(reservation);
    }

    // Marcar una reserva como completada
    @PutMapping("/{reservationId}/complete")
    public ResponseEntity<?> completeReservation(@PathVariable Long reservationId) {
        reservationService.completeReservation(reservationId);
        return ResponseEntity.ok().build();
    }

    // Obtener todas las reservas de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.getReservationsByUser(userId);
        return ResponseEntity.ok(reservations);
    }

    // Obtener todas las reservas de un producto
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Reservation>> getReservationsByProduct(@PathVariable Long productId) {
        List<Reservation> reservations = reservationService.getReservationsByProduct(productId);
        return ResponseEntity.ok(reservations);
    }

    // Verificar si un usuario tiene una reserva completada para un producto
    @GetMapping("/user/{userId}/product/{productId}/completed")
    public ResponseEntity<Boolean> hasUserCompletedReservation(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        boolean hasCompleted = reservationService.hasUserCompletedReservation(userId, productId);
        return ResponseEntity.ok(hasCompleted);
    }
}
