package com.copio.copio.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    private static final String JWT_SECRET = "IQ67Gq5vyhu2ZyvY4oHh5y30NXbuAAhO79V50TLNQ7He2z5nr3irsi1bfOt6VbZL6NsIWFdooXCg3xIZj1wF5XYFLhI0i2djGsgqpNVhiL7+v1XvZjE5APznRZW6XfVxa0IUmiTcSqWpHBS4dyoptTJDg3lhdJ/Kd3eNgOQRJ1Mu/TYCX3h34BWY7rpw3EUGvKzaAjztOsf595eJLssIlaQSNIFzAmWjSjwzO02i+f7hlkF0WrIhhLDKlrFdtp4u/eGlPGgrNbCJW3rxTyFs11N8D2RyKLE/x7p1Cp4R4YO+h/OlQjX8EFWAr6PPqjrWokgUL8Ix9a/zRYGTcSjdDBUeF1JMFTXSmMC7P1XV3u58oxjpPsrNfJbr1Rfn/4H2dKEqnfpDCyOyYvoX0fEXcMY4kmLucFHb53S0NWa0f1oEaOrUQzdjeyrLtn3oQyTJgxavT+IieX7oVtYnQMcawjQGWHUtgyeZsvvYFuuCNqPYhzqHiGMO/YoObi93XT/BKjXGCh9Yf5zeVRvXkRTLdEHxaTPelYYlygEj/O8LvSY=";
    
    private static final long ACCESS_TOKEN_EXPIRATION = 3600000L;        // 1 ora in millisecondi
    private static final long REFRESH_TOKEN_EXPIRATION = 604800000L;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
    }

    // 🔹 Generazione Access Token (scade in 1 ora)
    public String generateAccessToken(String username, Long userId) {
        logger.info("Generazione di un nuovo Access Token per l'utente: {}", username);
        String token = Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(getSigningKey())
                .compact();
        logger.debug("Access Token generato: {}", token);
        return token;
    }

    // 🔹 Generazione Refresh Token (scade in 7 giorni)
    public String generateRefreshToken(String username, Long userId) {
        logger.info("Generazione di un nuovo Refresh Token per l'utente: {}", username);
        String token = Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(getSigningKey())
                .compact();
        logger.debug("Refresh Token generato: {}", token);
        return token;
    }

    // 🔹 Metodo per ottenere un nuovo access token da un refresh token valido
    public String generateNewAccessToken(String refreshToken) {
        logger.info("Generazione di un nuovo Access Token dal Refresh Token: {}", refreshToken);
        if (!validateToken(refreshToken)) {
            logger.error("Il Refresh Token non è valido o è scaduto: {}", refreshToken);
            throw new RuntimeException("Refresh token non valido o scaduto.");
        }

        String username = getUsernameFromToken(refreshToken);
        Long userId = getUserIdFromToken(refreshToken);

        logger.debug("Refresh Token valido. Generazione di un nuovo Access Token per l'utente: {}", username);
        return generateAccessToken(username, userId);
    }

    // 🔹 Estrai username dal token
    public String getUsernameFromToken(String token) {
        String username = parseClaims(token).getSubject();
        logger.debug("Estrazione dell'username dal token: {}", username);
        return username;
    }

    // 🔹 Estrai userId dal token
    public Long getUserIdFromToken(String token) {
        Long userId = parseClaims(token).get("userId", Long.class);
        logger.debug("Estrazione dell'userId dal token: {}", userId);
        return userId;
    }

    // 🔹 Metodo per validare il token
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            logger.info("Il token è valido.");
            return true;
        } catch (Exception e) {
            logger.error("Errore durante la validazione del token: {}", e.getMessage());
            return false;
        }
    }

    // 🔹 Metodo per verificare se il token è scaduto
    public boolean isTokenExpired(String token) {
        boolean expired = parseClaims(token).getExpiration().before(new Date());
        logger.debug("Il token è scaduto: {}", expired);
        return expired;
    }

    // 🔹 Metodo privato per ottenere i claims
    private Claims parseClaims(String token) {
        logger.debug("Parsing del token per ottenere i claims...");
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsernameAllowingExpired(String token) {
        try {
            return Jwts.parser()
                .setSigningKey(JWT_SECRET) // Usa la stessa chiave del JWT
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        } catch (ExpiredJwtException ex) {
            logger.warn("Il token è scaduto. Username estratto: {}", ex.getClaims().getSubject());
            return ex.getClaims().getSubject(); // Permette di ottenere l'utente anche se il token è scaduto
        } catch (Exception e) {
            logger.error("Errore durante l'estrazione dell'username dal token: {}", e.getMessage());
            return null;
        }
    }
}
