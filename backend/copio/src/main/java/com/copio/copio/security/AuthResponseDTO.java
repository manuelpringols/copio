package com.copio.copio.security;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String email;
    private String token;

    // Costruttore
    public AuthResponseDTO(String email, String token) {
        this.email = email;
        this.token = token;
    }

    // Getter and Setter
}
