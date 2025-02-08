package com.goalone.backend.service;

import com.goalone.backend.model.Product;
import com.goalone.backend.model.ProductDTO;
import com.goalone.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public boolean productExists(String name) {
        return productRepository.existsByName(name);
    }

    public Product createProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setType(productDTO.getType());
        product.setPrice(String.format("$%,.0f/h", productDTO.getPrice()));
        product.setRating(productDTO.getRating());
        product.setImages(productDTO.getImages());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }

        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional
    public Product updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));


        product.setName(productDTO.getName());
        product.setType(productDTO.getType());
        product.setPrice(String.format("$%,.0f/h", productDTO.getPrice()));
        product.setRating(productDTO.getRating());
        product.setImages(productDTO.getImages());

        return productRepository.save(product);
    }
}

