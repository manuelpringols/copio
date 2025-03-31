package com.copio.copio.security;

import lombok.Data;

@Data
public class AuthDTO {
    private String username;
    private String email;
    private String password;

    public AuthDTO() {
    }

    // Costruttori
    public AuthDTO(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public AuthDTO(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // Getter and Setter
}
