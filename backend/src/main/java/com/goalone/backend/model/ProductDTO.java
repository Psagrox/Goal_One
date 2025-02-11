package com.goalone.backend.model;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class ProductDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El tipo es obligatorio")
    private String type;

    @NotNull(message = "El precio es obligatorio")
    private Double price;

    @DecimalMin("0.0") @DecimalMax("5.0")
    private Double rating;

    @NotEmpty(message = "Debe subir al menos una imagen")
    private List<String> images;

    private String description;

    private List<Long> featureIds; // Lista de IDs de características

    // Getters y Setters (generados automáticamente por Lombok @Data)
}