package com.goalone.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private final SecretKey jwtSecret;

    // Constructor que acepta la clave secreta como parámetro
    @Autowired
    public JwtTokenProvider(String jwtSecret) {
        // Convertir la cadena de texto en una clave secreta
        this.jwtSecret = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Clase interna para representar la respuesta del token JWT
    public static class JwtResponse {
        private final String token;

        public JwtResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }

    public String generateToken(String username,Long userId, Collection<? extends GrantedAuthority> authorities) {
        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("roles", authorities.stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 864_000_000)) // 10 días
                .signWith(jwtSecret) // Firmar con la clave secreta
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(jwtSecret) // Verificar con la clave secreta
                    .build()
                    .parseSignedClaims(token); // Analizar el token firmado
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(jwtSecret) // Verificar con la clave secreta
                .build()
                .parseSignedClaims(token) // Analizar el token firmado
                .getPayload() // Obtener el payload
                .getSubject(); // Obtener el nombre de usuario
    }

    public Collection<? extends GrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(jwtSecret) // Verificar con la clave secreta
                .build()
                .parseSignedClaims(token) // Analizar el token firmado
                .getPayload(); // Obtener el payload

        List<String> roles = claims.get("roles", List.class);
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public Long   getUserIdFromToken(String token) {
        // No necesitas convertir jwtSecret a bytes, ya es una SecretKey
        Claims claims = Jwts.parser()
                .verifyWith(jwtSecret)  // Usar directamente la clave secreta
                .build()
                .parseSignedClaims(token)  // Parsear el token y obtener las reclamaciones
                .getPayload();  // Obtener el cuerpo de las reclamaciones

        return claims.get("userId", Long.class);  // Asumimos que "userId" está almacenado como una reclamación en el token
    }




}