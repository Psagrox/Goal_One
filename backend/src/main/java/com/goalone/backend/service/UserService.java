package com.goalone.backend.service;

import com.goalone.backend.config.JwtTokenProvider;
import com.goalone.backend.model.User;
import com.goalone.backend.model.UserDTO;
import com.goalone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.goalone.backend.model.Role;

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

        // Eliminar, únicamente de prueba
        if (userRepository.count() == 0) {
            role = Role.ADMIN; // Este será el rol admin
        }

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

        return jwtTokenProvider.generateToken(user.getEmail(), user.getName(), user.getRole().name());
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
}