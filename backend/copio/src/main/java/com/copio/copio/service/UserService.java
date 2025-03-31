package com.copio.copio.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.UserRepository;
import com.copio.copio.security.JwtService;

@Service
public class UserService {

       @Autowired
    private UserRepository userRepository; // Repository per l'utente

    @Autowired
    private JwtService jwtService; // Servizio per generare il token

 // Metodo per creare un nuovo utente
 public String createUser(String username, String password) {
    // Creazione dell'utente nel database
    UserEntity newUser = new UserEntity();
    newUser.setUsername(username);
    newUser.setPassword(password); // Assicurati di crittografare la password

    // Salvataggio dell'utente
    UserEntity savedUser = userRepository.save(newUser);

    // Estrai l'ID dell'utente appena creato
    Long userId = savedUser.getId(); // L'ID viene generato automaticamente dal DB

    // Genera il token JWT includendo l'ID dell'utente
    String token = jwtService.generateAccessToken(username, userId);

    return token; // Restituisci il token al client
}

public Optional<UserEntity> findById(Integer userId) {
   return userRepository.findById(userId);
}
}