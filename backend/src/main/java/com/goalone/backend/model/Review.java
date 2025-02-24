package com.goalone.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int rating; // Puntuación de 1 a 5

    @Column(length = 1000)
    private String comment; // Comentario opcional

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt; // Fecha de creación de la reseña

    // Constructor
    public Review() {
        this.createdAt = new Date();
    }
}