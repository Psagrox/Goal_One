package com.goalone.backend.controller;

import com.goalone.backend.model.Review;
import com.goalone.backend.service.ReservationService;
import com.goalone.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReservationService reservationService;


    // Obtener todas las reseñas de un producto
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    // Obtener la puntuación media de un producto
    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByProductId(@PathVariable Long productId) {
        Double averageRating = reviewService.getAverageRatingByProductId(productId);
        return ResponseEntity.ok(averageRating);
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review, @RequestParam Long userId) {
        if (!reservationService.hasUserCompletedReservation(userId, review.getProduct().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        Review newReview = reviewService.createReview(review);
        return ResponseEntity.ok(newReview);
    }

    @GetMapping("/product/{productId}/review-count")
    public ResponseEntity<Long> getReviewCountByProductId(@PathVariable Long productId) {
        Long count = reviewService.getReviewCountByProductId(productId);
        return ResponseEntity.ok(count);
    }

}