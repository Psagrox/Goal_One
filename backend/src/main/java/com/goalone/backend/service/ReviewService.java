package com.goalone.backend.service;

import com.goalone.backend.model.Review;
import com.goalone.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // Crear una nueva reseña
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    // Obtener todas las reseñas de un producto
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    // Obtener la puntuación media de un producto
    public Double getAverageRatingByProductId(Long productId) {
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        return averageRating != null ? averageRating : 0.0; // Si no hay reseñas, devolver 0.0
    }

    // Obtener el número total de reseñas de un producto
    public Long getReviewCountByProductId(Long productId) {
        return reviewRepository.countByProductId(productId);
    }


}