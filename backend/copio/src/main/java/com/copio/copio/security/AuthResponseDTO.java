package com.copio.copio.security;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String email;
    private String token;
    private String refreshToken;  // aggiunto


    // Costruttore
    public AuthResponseDTO(String email, String token) {
        this.email = email;
        this.token = token;
    }

  public AuthResponseDTO(String email, String accessToken, String refreshToken) {
        this.email = email;
        this.token = accessToken;
        this.refreshToken = refreshToken;
    }

}
