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

    @PutMapping("/users/{userId}/make-admin")
    public ResponseEntity<User> makeAdmin(@PathVariable Long userId) {
        User user = userService.findById(userId);  // Busca al usuario por ID
        if (user != null) {
            user.setRole(Role.ADMIN);  // Establece el rol como ADMIN
            userService.save(user);  // Guarda el usuario actualizado
            return ResponseEntity.ok(user);  // Devuelve el usuario actualizado
        }
        return ResponseEntity.notFound().build();  // Si no se encuentra el usuario, devuelve 404
    }
}
