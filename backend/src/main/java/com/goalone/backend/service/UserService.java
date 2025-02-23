package com.goalone.backend.service;

import com.goalone.backend.config.JwtTokenProvider;
import com.goalone.backend.model.Product;
import com.goalone.backend.model.User;
import com.goalone.backend.model.UserDTO;
import com.goalone.backend.repository.ProductRepository;
import com.goalone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.goalone.backend.model.Role;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ProductRepository productRepository;

    public User save(User user) {
        return userRepository.save(user);
    }

    public User registerUser(UserDTO userDTO) {
        // Verificamos si el correo ya existe antes de crear el usuario
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El correo ya está registrado");
        }

        // Asignamos "USER" como rol por defecto
        Role role = Role.USER;


        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());
        user.setRole(role);

        // Guardamos el usuario en la base de datos
        return userRepository.save(user);
    }

    public String loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException("Contraseña incorrecta");
        }

        // Convertir el rol del usuario en una lista de autoridades
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().name())
        );

        // Generar el token JWT
        return jwtTokenProvider.generateToken(user.getEmail(), authorities);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null);  // Si no lo encuentra, retorna null
    }

    // Excepciones personalizadas
    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }

    public static class InvalidPasswordException extends RuntimeException {
        public InvalidPasswordException(String message) {
            super(message);
        }
    }

    @Transactional
    public void addFavorite(Long userId, Long productId) {
        // Obtener el usuario por su ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Obtener el producto por su ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar si el producto ya está en la lista de favoritos del usuario
        if (user.getFavorites().contains(product)) {
            throw new RuntimeException("El producto ya está en la lista de favoritos");
        }

        // Agregar el producto a la lista de favoritos del usuario
        user.getFavorites().add(product);

        // Guardar el usuario actualizado en la base de datos
        userRepository.save(user);
    }

    @Transactional
    public void removeFavorite(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!user.getFavorites().contains(product)) {
            throw new RuntimeException("El producto no está en la lista de favoritos");
        }

        user.getFavorites().remove(product);
        userRepository.save(user);
    }

    public List<Product> getFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new ArrayList<>(user.getFavorites());
    }
}