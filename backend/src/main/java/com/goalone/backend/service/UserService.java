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

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

import static com.goalone.backend.config.JwtTokenProviderConfig.JwtConstants.JWT_SECRET;

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

        // Eliminar, unicamente de prueba
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

    public String loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException("Contraseña incorrecta");
        }

        return jwtTokenProvider.generateToken(user.getEmail(), user.getName(), user.getRole().name());
    }

    private String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())  // Incluir el rol como parte del token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))  // Expira en 1 día
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Excepción personalizada
    public class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }


    public User findById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null);  // Si no lo encuentra, retorna null
    }

}
