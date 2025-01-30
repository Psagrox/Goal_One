package com.goalone.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@RestController
public class FileUploadController {

    @PostMapping("/api/upload")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<String>> handleFileUpload(
            @RequestParam("files") MultipartFile[] files
    ) {
        List<String> fileUrls = new ArrayList<>();
        String baseUrl = "http://localhost:8080"; // URL base del backend

        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);

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
}