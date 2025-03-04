package com.goalone.backend.repository;

import com.goalone.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Obtener todas las reseñas de un producto
    List<Review> findByProductId(Long productId);

    // Obtener la puntuación media de un producto
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    // Contar el número de reseñas de un producto
    Long countByProductId(Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);
}