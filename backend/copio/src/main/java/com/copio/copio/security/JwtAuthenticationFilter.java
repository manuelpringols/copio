package com.copio.copio.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;  // Il provider che gestisce il JWT (creato precedentemente)

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Ottieni il token dalla request header
        String token = getTokenFromRequest(request);

        if (token != null && jwtService.validateToken(token)) {
            // Se il token è valido, recuperiamo i dettagli dell'utente e settiamo il contesto di autenticazione
            String username = jwtService.getUsernameFromToken(token);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, null);  // Puoi anche aggiungere ruoli qui se necessario
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continua la catena di filtri
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // Rimuove "Bearer " e restituisce solo il token
        }

        return null;
    }
}
