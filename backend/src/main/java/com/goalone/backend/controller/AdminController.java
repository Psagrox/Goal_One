package com.goalone.backend.controller;

import com.goalone.backend.model.Role;
import com.goalone.backend.model.User;
import com.goalone.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long userId, @RequestParam String role) {
        // Validamos que el rol sea válido
        if (!role.equalsIgnoreCase("USER") && !role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.badRequest().body(null);  // O una respuesta de error
        }

        // Convertimos el string a un enum Role
        Role newRole = Role.valueOf(role.toUpperCase());

        // Lógica para actualizar el rol del usuario
        User user = userService.findById(userId);  // Asegúrate de tener un método para encontrar al usuario por ID
        if (user != null) {
            user.setRole(newRole);  // Establecemos el nuevo rol
            userService.save(user);  // Guardamos el usuario con el nuevo rol
            return ResponseEntity.ok(user);  // Devolvemos el usuario actualizado
        }

        return ResponseEntity.notFound().build();  // Si no encontramos el usuario, devolvemos 404
    }
}
