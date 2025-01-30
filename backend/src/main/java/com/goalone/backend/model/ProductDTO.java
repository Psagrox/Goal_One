package com.goalone.backend.model;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class ProductDTO {


    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }


}