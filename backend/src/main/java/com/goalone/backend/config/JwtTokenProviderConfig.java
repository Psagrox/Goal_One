package com.goalone.backend.config;
import io.jsonwebtoken.Jwts;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;

import static com.goalone.backend.config.SecurityConfig.JWT_SECRET;

@Configuration
public class JwtTokenProviderConfig {

    public class JwtConstants {
        public static final String JWT_SECRET = "mi_secreto";
    }

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider(); // Asegúrate de que tu clase JwtTokenProvider esté correctamente configurada
    }

    public boolean validateToken(String token) {
        try {

            Jwts.parser()
                    .setSigningKey(JWT_SECRET) // Se establece la clave de firma
                    .build() // Construimos el parser
                    .parseClaimsJws(token); // Analizamos el token
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}