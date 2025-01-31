package com.goalone.backend.controller;

import com.goalone.backend.model.Product;
import com.goalone.backend.model.ProductDTO;
import com.goalone.backend.service.ProductService;
import com.goalone.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {  

    private final ProductService productService;
    private final ProductRepository productRepository;

    public ProductController(ProductService productService, ProductRepository productRepository)
    {
        this.productService = productService;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            if (productService.productExists(productDTO.getName())) {
                return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "El nombre ya existe"));
            }
            
            Product createdProduct = productService.createProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        System.out.println("Buscando producto con ID: " + id);
        return productRepository.findById(id)
                .map(product -> {
                    System.out.println("Producto encontrado: " + product);
                    return ResponseEntity.ok(product);
                })
                .orElseGet(() -> {
                    System.out.println("Producto no encontrado.");
                    return ResponseEntity.notFound().build();
                });
    }
}