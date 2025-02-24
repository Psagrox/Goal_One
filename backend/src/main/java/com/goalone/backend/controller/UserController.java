package com.goalone.backend.controller;

import com.goalone.backend.config.JwtTokenProvider;
import com.goalone.backend.model.LoginRequest;
import com.goalone.backend.model.Product;
import com.goalone.backend.model.User;
import com.goalone.backend.model.UserDTO;
import com.goalone.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public UserController() {
        logger.info("UserController cargado correctamente");
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDto) {
        // Lógica para guardar el usuario en la base de datos
        User newUser = userService.registerUser(userDto);

        // Obtener el rol del usuario
        String userRole = newUser.getRole().name();

        // Imprimir el rol en la consola
        System.out.println("Usuario registrado con rol: " + userRole);

        // Crear el token JWT
        String token = jwtTokenProvider.generateToken(
                newUser.getEmail(),
                newUser.getId(),
                List.of(new SimpleGrantedAuthority(userRole)) // Convertir el rol a una lista de autoridades
        );

        // Retornar el token en la respuesta
        return ResponseEntity.ok(new JwtTokenProvider.JwtResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(new JwtTokenProvider.JwtResponse(token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/favorites/add")
    public ResponseEntity<?> addFavorite(@RequestParam Long userId, @RequestParam Long productId) {
        try {
            userService.addFavorite(userId, productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/favorites/remove")
    public ResponseEntity<?> removeFavorite(@RequestParam Long userId, @RequestParam Long productId) {
        try {
            userService.removeFavorite(userId, productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Product>> getFavorites(@RequestParam Long userId) {
        try {
            List<Product> favorites = userService.getFavorites(userId);
            return ResponseEntity.ok(favorites);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}