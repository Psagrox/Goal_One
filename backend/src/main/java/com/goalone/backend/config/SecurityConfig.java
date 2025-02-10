package com.goalone.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    static final String JWT_SECRET = "mi_secreto";  // El mismo secreto usado para firmar el JWT

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilitar CSRF (común en APIs REST)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/users/login", "/api/users/register").permitAll() // Permitir acceso público a estos endpoints
                        .requestMatchers("/api/products").permitAll() // Permitir acceso público a /api/products
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/users/**", "/admin/**").hasAuthority("ROLE_ADMIN")// Proteger endpoints de admin
                        .anyRequest().authenticated() // Cualquier otra solicitud requiere autenticación
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class); // Añadir el filtro JWT

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Crear un usuario administrador por defecto
        UserDetails admin = User.withUsername("admin")
                .password(passwordEncoder().encode("admin123")) // Contraseña encriptada
                .roles("ADMIN")
                .build();

        // Crear un usuario normal por defecto
        UserDetails user = User.withUsername("user")
                .password(passwordEncoder().encode("user123")) // Contraseña encriptada
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(admin, user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Usar BCrypt para encriptar contraseñas
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("*");  // Permitir todas las conexiones
        config.addAllowedMethod("*");  // Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
        config.addAllowedHeader("*");  // Permitir todos los headers
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}