package com.goalone.backend.repository;

import com.goalone.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);

    List<Product> findByNameContainingIgnoreCase(String query);

}