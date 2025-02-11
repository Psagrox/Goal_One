package com.goalone.backend.service;

import com.goalone.backend.model.Feature;
import com.goalone.backend.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeatureService {

    private final FeatureRepository featureRepository;

    @Autowired
    public FeatureService(FeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }

    public Feature createFeature(String name, String icon) {
        Feature feature = new Feature();
        feature.setName(name);
        feature.setIcon(icon);
        return featureRepository.save(feature);
    }

    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    public Feature updateFeature(Long id, String name, String icon) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica no encontrada"));
        feature.setName(name);
        feature.setIcon(icon);
        return featureRepository.save(feature);
    }

    public void deleteFeature(Long id) {
        featureRepository.deleteById(id);
    }
}