package com.copio.copio.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.UserRepository;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Recupera l'utente dal database (modifica a seconda della tua struttura)
        UserEntity user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Crea e restituisce un oggetto UserDetails
        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())  // Assicurati di criptare la password!
                .roles("USER")  // Aggiungi i ruoli dell'utente, se necessario
                .build();
    }
}