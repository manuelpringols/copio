package com.copio.copio.controller;
import com.copio.copio.security.RefreshTokenRequest;

import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.UserRepository;
import com.copio.copio.security.JwtService;
import com.copio.copio.security.TokenResponse;
import com.copio.copio.security.AuthDTO;
import com.copio.copio.security.AuthResponseDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ✅ Registrazione
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDTO authDTO) {
        logger.info("Richiesta di registrazione ricevuta per username: {}", authDTO.getUsername());

        if (userRepository.existsByUsername(authDTO.getUsername())) {
            logger.warn("Tentativo di registrazione fallito: username '{}' già esistente", authDTO.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username già esistente");
        }

        String hashedPassword = passwordEncoder.encode(authDTO.getPassword());

        UserEntity newUser = new UserEntity();
        newUser.setUsername(authDTO.getUsername());
        newUser.setEmail(authDTO.getEmail());
        newUser.setPassword(hashedPassword);

        userRepository.save(newUser);

        logger.info("Registrazione avvenuta con successo per utente: {}", newUser.getUsername());
        return ResponseEntity.ok(Map.of("message", "Registrazione avvenuta con successo"));
    }

    // ✅ Login con JWT
  /*  @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        logger.info("Tentativo di login per email: {}", authDTO.getEmail());

        try {
            UserEntity user = userRepository.findByEmail(authDTO.getEmail())
                    .orElseThrow(() -> {
                        logger.warn("Login fallito: email '{}' non trovata", authDTO.getEmail());
                        return new RuntimeException("Email non trovata");
                    });

            if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
                logger.warn("Password errata per utente con email: {}", authDTO.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Password errata");
            }

            String token = jwtService.generateAccessToken(user.getUsername(), user.getId());

            logger.info("Login riuscito per utente: {}. JWT generato.", user.getUsername());
            return ResponseEntity.ok(new AuthResponseDTO(user.getEmail(), token));

        } catch (Exception e) {
            logger.error("Errore durante il login per email {}: {}", authDTO.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante il login");
        }
    }
*/

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
    logger.info("Tentativo di login per email: {}", authDTO.getEmail());

    try {
        UserEntity user = userRepository.findByEmail(authDTO.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login fallito: email '{}' non trovata", authDTO.getEmail());
                    return new RuntimeException("Email non trovata");
                });

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            logger.warn("Password errata per utente con email: {}", authDTO.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Password errata");
        }

        String accessToken = jwtService.generateAccessToken(user.getUsername(), user.getId());
        logger.info("Access Token generato per utente: {}", user.getUsername());

        logger.info("Valore rememberMe ricevuto: {}", authDTO.isRememberMe());

        if (authDTO.isRememberMe()) {
            // Genera anche il refresh token
            String refreshToken = jwtService.generateRefreshToken(user.getUsername(), user.getId());
            logger.info("Refresh Token generato per utente: {}", user.getUsername());
            return ResponseEntity.ok(new AuthResponseDTO(user.getEmail(), accessToken, refreshToken));
        } else {
            // Solo access token
            return ResponseEntity.ok(new AuthResponseDTO(user.getEmail(), accessToken));
        }

    } catch (Exception e) {
        logger.error("Errore durante il login per email {}: {}", authDTO.getEmail(), e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante il login");
    }
}


    
  /*  @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshTokenRequest request) {
        logger.info("Richiesta di refresh del token ricevuta.");

        String refreshToken = request.getRefreshToken();

        if (refreshToken == null || refreshToken.isBlank()) {
            logger.warn("Refresh token mancante o vuoto nella richiesta.");
            return ResponseEntity.badRequest().body("Refresh token mancante o non valido.");
        }

        try {
            logger.debug("Tentativo di generazione di un nuovo Access Token dal Refresh Token...");
            String newAccessToken = jwtService.generateNewAccessToken(refreshToken);
            logger.info("Nuovo Access Token generato con successo.");
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            logger.error("Errore durante la generazione di un nuovo Access Token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token non valido o scaduto.");
        }
    }

    */

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
    
        if (refreshToken == null || refreshToken.isBlank()) {
            logger.warn("Refresh token mancante o vuoto nella richiesta.");
            return ResponseEntity.badRequest().body("Refresh token mancante o non valido.");
        }
    
        if (jwtService.validateToken(refreshToken)) {
            // Estrai username e userId dal refresh token
            String username = jwtService.getUsernameFromToken(refreshToken);
            Long userId = jwtService.getUserIdFromToken(refreshToken);
    
            // Genera nuovi token
            String newAccessToken = jwtService.generateAccessToken(username, userId);
            String newRefreshToken = jwtService.generateRefreshToken(username, userId);
    
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", newRefreshToken);
    
            logger.info("Nuovi token generati per utente: {}", username);
    
            return ResponseEntity.ok(tokens);
        } else {
            logger.warn("Refresh token non valido o scaduto.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token non valido o scaduto.");
        }
    }
}