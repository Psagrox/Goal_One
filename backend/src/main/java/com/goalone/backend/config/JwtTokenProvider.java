package com.goalone.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {

    private static final Key JWT_SECRET = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Genera una clave segura
    private static final long JWT_EXPIRATION = 86400000L; // 1 día en milisegundos

    public String generateToken(String email, String name, String role) {
        return Jwts.builder()
                .setSubject(email) // Email del usuario
                .claim("name", name)  // Agregar el nombre
                .claim("role", role)  // Agregar el rol sin el prefijo ROLE_
                .setIssuedAt(new Date()) // Fecha de emisión
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION)) // Fecha de expiración
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET) // Firmar el token
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(JWT_SECRET)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<GrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        // Asegúrate de que el rol no tenga el prefijo "ROLE_" duplicado
        if (role.startsWith("ROLE_")) {
            return List.of(new SimpleGrantedAuthority(role));
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_" + role));
        }
    }

    @Getter
    public static class JwtResponse {
        private final String token;

        public JwtResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }
}