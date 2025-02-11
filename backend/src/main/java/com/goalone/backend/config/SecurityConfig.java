package com.goalone.backend.config;


import com.goalone.backend.mapper.UserMapper;
import com.goalone.backend.model.Role;
import com.goalone.backend.model.UserDTO;
import com.goalone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.beans.factory.annotation.Value;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    public SecurityConfig(@Lazy JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public JwtTokenProvider jwtTokenProvider(@Value("${jwt.secret}") String jwtSecret) {
        return new JwtTokenProvider(jwtSecret);
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilitar CSRF (común en APIs REST)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Habilitar CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permitir solicitudes OPTIONS
                        .requestMatchers("/api/users/login", "/api/users/register").permitAll() // Permitir acceso público a estos endpoints
                        .requestMatchers("/api/products/**").permitAll() // Permitir acceso público a /api/products y sus subrutas
                        .requestMatchers("/api/products").permitAll()
                        .requestMatchers("/uploads/**").permitAll() // Permitir acceso público a las imágenes subidas
                        .requestMatchers("/api/users/**", "/admin/**").hasAuthority("ADMIN") // Proteger endpoints de admin
                        .requestMatchers("/api/features").hasAuthority("ADMIN")
                        .anyRequest().authenticated() // Cualquier otra solicitud requiere autenticación
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class); // Añadir el filtro JWT

        return http.build();
    }

    @Autowired
    private UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        // Verificar si el usuario admin existe en la base de datos
        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
            // Crear usuario admin por defecto si no existe
            UserDTO adminDTO = new UserDTO();
            adminDTO.setEmail("admin@admin.com");
            adminDTO.setPassword(passwordEncoder().encode("admin123"));
            adminDTO.setRole(Role.ADMIN);
            adminDTO.setName("Admin");

            com.goalone.backend.model.User admin = UserMapper.toEntity(adminDTO);

            userRepository.save(admin);
        }

        // Verificar si el usuario normal existe en la base de datos
        if (userRepository.findByEmail("user@user.com").isEmpty()) {
            // Crear usuario normal por defecto si no existe
            UserDTO userDTO = new UserDTO();
            userDTO.setEmail("user@user.com");
            userDTO.setPassword(passwordEncoder().encode("user123"));
            userDTO.setRole(Role.USER);
            userDTO.setName("User");

            com.goalone.backend.model.User user = UserMapper.toEntity(userDTO);

            userRepository.save(user);
        }

        // Cargar los usuarios desde la base de datos para la autenticación
        UserDetails adminDetails = User.withUsername("admin@admin.com")
                .password(passwordEncoder().encode("admin123"))
                .roles("ADMIN")
                .build();

        UserDetails userDetails = User.withUsername("user@user.com")
                .password(passwordEncoder().encode("user123"))
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(adminDetails, userDetails);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Usar BCrypt para encriptar contraseñas
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000"); // Permitir todas las conexiones
        config.addAllowedMethod("*"); // Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
        config.addAllowedHeader("*"); // Permitir todos los headers
        config.setAllowCredentials(true); // Permitir credenciales (opcional, dependiendo de tu caso de uso)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Aplicar la configuración CORS a todas las rutas
        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource()); // Crear el filtro CORS
    }
}