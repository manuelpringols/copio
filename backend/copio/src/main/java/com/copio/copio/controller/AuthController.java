package com.copio.copio.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.UserRepository;
import com.copio.copio.security.AuthDTO;
import com.copio.copio.security.AuthResponseDTO;
import com.copio.copio.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;
    @Autowired private UserRepository userRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    // ── Registrazione ───────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDTO authDTO) {
        logger.info("Richiesta di registrazione per username: {}", authDTO.getUsername());

        if (userRepository.existsByUsername(authDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username già esistente");
        }

        UserEntity newUser = new UserEntity();
        newUser.setUsername(authDTO.getUsername());
        newUser.setEmail(authDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(authDTO.getPassword()));
        userRepository.save(newUser);

        logger.info("Registrazione avvenuta con successo per: {}", newUser.getUsername());
        return ResponseEntity.ok(Map.of("message", "Registrazione avvenuta con successo"));
    }

    // ── Login ────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        logger.info("Tentativo di login per email: {}", authDTO.getEmail());

        try {
            UserEntity user = userRepository.findByEmail(authDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email non trovata"));

            if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
                logger.warn("Password errata per: {}", authDTO.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Password errata");
            }

            String accessToken = jwtService.generateAccessToken(user.getUsername(), user.getId());

            if (authDTO.isRememberMe()) {
                String refreshToken = jwtService.generateRefreshToken(user.getUsername(), user.getId());
                logger.info("Login con rememberMe per: {}", user.getUsername());
                return ResponseEntity.ok(new AuthResponseDTO(user.getEmail(), accessToken, refreshToken));
            }

            logger.info("Login riuscito per: {}", user.getUsername());
            return ResponseEntity.ok(new AuthResponseDTO(user.getEmail(), accessToken));

        } catch (Exception e) {
            logger.error("Errore login per {}: {}", authDTO.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante il login");
        }
    }

    // ── Refresh token ────────────────────────────────────────────
    // FIX 1: era @PostMapping("/auth/refresh") → path risultante /api/auth/auth/refresh (doppio).
    //         Corretto in /refresh → path finale /api/auth/refresh.
    // FIX 2: la risposta restituiva "accessToken" ma il frontend si aspetta "token".
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");

        if (refreshToken == null || refreshToken.isBlank()) {
            logger.warn("Refresh token mancante nella richiesta.");
            return ResponseEntity.badRequest().body("Refresh token mancante o non valido.");
        }

        if (!jwtService.validateToken(refreshToken)) {
            logger.warn("Refresh token non valido o scaduto.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token non valido o scaduto.");
        }

        String username     = jwtService.getUsernameFromToken(refreshToken);
        Long   userId       = jwtService.getUserIdFromToken(refreshToken);
        String newAccess    = jwtService.generateAccessToken(username, userId);
        String newRefresh   = jwtService.generateRefreshToken(username, userId);

        Map<String, String> tokens = new HashMap<>();
        // FIX 2: chiave "token" (non "accessToken") — allineata con AuthResponseDTO e frontend
        tokens.put("token",        newAccess);
        tokens.put("refreshToken", newRefresh);

        logger.info("Nuovi token generati per: {}", username);
        return ResponseEntity.ok(tokens);
    }
}