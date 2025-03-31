package com.copio.copio.controller;

import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.UserRepository;
import com.copio.copio.security.JwtService;
import com.copio.copio.security.TokenResponse;
import com.copio.copio.security.AuthDTO;
import com.copio.copio.security.AuthResponseDTO;
import com.copio.copio.security.CustomUserDetailsService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Registrazione
    // Registrazione
     // Registrazione (senza JWT)
     @PostMapping("/register")
     public ResponseEntity<?> register(@RequestBody AuthDTO authDTO) {
         // Verifica che l'utente non esista già
         if (userRepository.existsByUsername(authDTO.getUsername())) {
             // Restituisce 400 Bad Request con il messaggio "Username già esistente"
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username già esistente");
         }
 
         // Cifra la password prima di salvarla
         String hashedPassword = passwordEncoder.encode(authDTO.getPassword());
 
         // Crea il nuovo utente
         UserEntity newUser = new UserEntity();
         newUser.setUsername(authDTO.getUsername());
         newUser.setEmail(authDTO.getEmail());
         newUser.setPassword(hashedPassword); // Salva la password cifrata
 
         // Salva l'utente
         userRepository.save(newUser);
 
         // Restituisci solo l'username come risposta (senza JWT)
         return ResponseEntity.ok(Map.of("message", "Registrazione avvenuta con successo"));
        }
 


      // Login (con JWT)
      @PostMapping("/login")
      public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
          // Recupera l'utente dal database usando l'email
          UserEntity user = userRepository.findByEmail(authDTO.getEmail())
                  .orElseThrow(() -> new RuntimeException("Email non trovata"));
  
          // Confronta la password
          if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
              return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Password errata");
          }
  
          // Genera il token con l'ID dell'utente
          String token = jwtService.generateAccessToken(user.getUsername(), user.getId()); // Aggiungi l'ID dell'utente nel token
  
          // Restituisci il token JWT
          return ResponseEntity.ok(new AuthResponseDTO(user.getEmail(), token));
      }


    /*   @PostMapping("/get-refresh-token")
public ResponseEntity<?> refreshToken(@RequestBody TokenRequest request) {
    String refreshToken = request.getRefreshToken(); // Supponiamo che venga passato nel body
    String username = jwtService.extractUsernameAllowingExpired(refreshToken);

    if (username == null) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid refresh token");
    }

    // Verifica nel database che il refresh token sia valido per l'utente
    UserEntity user = userService.findByUsername(username);
    if (user == null || !user.getRefreshToken().equals(refreshToken)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid refresh token");
    }

    // Genera un nuovo JWT valido
    String newAccessToken = jwtService.generateToken(user);

    return ResponseEntity.ok(new TokenResponse(newAccessToken));
}
    */

    }      