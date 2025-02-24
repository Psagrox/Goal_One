package com.goalone.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Usuario que realiza la reserva

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // Producto (cancha) reservado

    private LocalDate reservationDate; // Fecha de la reserva
    private boolean isCompleted; // Indica si la reserva ha sido completada

    // Constructor, getters y setters (generados automáticamente por Lombok @Data)
}