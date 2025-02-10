package com.goalone.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@RestController
public class FileUploadController {

    private final Path uploadDir = Paths.get("backend/uploads").toAbsolutePath().normalize();


    @PostMapping("/api/upload")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<String>> handleFileUpload(
            @RequestParam("files") MultipartFile[] files
    ) {
        List<String> fileUrls = new ArrayList<>();
        String baseUrl = "http://localhost:8080/uploads"; // URL base del backend

        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = uploadDir.resolve(fileName);

            try {
                Files.createDirectories(path.getParent());
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                // URL completa y accesible
                fileUrls.add(baseUrl + "/" + fileName);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }

        return ResponseEntity.ok(fileUrls);
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = uploadDir.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Asumiendo que las imágenes son JPEG. Cambiar si es necesario.
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}