package com.goalone.backend.service;

import com.goalone.backend.model.Feature;
import com.goalone.backend.model.Product;
import com.goalone.backend.model.ProductDTO;
import com.goalone.backend.repository.FeatureRepository;
import com.goalone.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FeatureRepository featureRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, FeatureRepository featureRepository) {
        this.productRepository = productRepository;
        this.featureRepository = featureRepository;
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
        product.setDescription(productDTO.getDescription());
        product.setOccupiedDates(productDTO.getOccupiedDates());
        product.setLocation(productDTO.getLocation());

        // Obtener características por sus IDs
        List<Feature> features = featureRepository.findAllById(productDTO.getFeatureIds());
        product.setFeatures(features);

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

    public List<String> findProductNamesContaining(String query) {
        return productRepository.findByNameContainingIgnoreCase(query)
                .stream()
                .map(Product::getName)
                .toList();
    }


    public List<Product> searchProducts(String searchTerm, String startDate, String endDate) {
        return productRepository.findByNameContainingIgnoreCase(searchTerm);
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
        product.setDescription(productDTO.getDescription());
        product.setOccupiedDates(productDTO.getOccupiedDates());
        product.setLocation(productDTO.getLocation());
        product.setOccupiedDates(productDTO.getOccupiedDates());
        product.setLocation(productDTO.getLocation());

        // Obtener características por sus IDs
        List<Feature> features = featureRepository.findAllById(productDTO.getFeatureIds());
        product.setFeatures(features);

        return productRepository.save(product);
    }
}