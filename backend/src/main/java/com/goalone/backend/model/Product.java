package com.goalone.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Product {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String price;
    private Double rating;
    private String description;

    public List<String> getImages() {
        return images;
    }

    @ElementCollection
    private List<String> images = new ArrayList<>();

    @ElementCollection
    private List<LocalDate> occupiedDates = new ArrayList<>(); // Fechas ocupadas

    private String location; // Ubicación de la cancha

    @ManyToMany
    @JoinTable(
            name = "product_features",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Relación con el usuario (proveedor)
    private User user; // El usuario que ofrece el producto


    private List<Feature> features = new ArrayList<>();

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImages(List<String> images) {
    this.images = images != null ? images : new ArrayList<>();
    }

    public List<LocalDate> getOccupiedDates() {
        return occupiedDates;
    }

    public void setOccupiedDates(List<LocalDate> occupiedDates) {
        this.occupiedDates = occupiedDates != null ? occupiedDates : new ArrayList<>();
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}