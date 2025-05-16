package com.copio.copio.security;

import lombok.Data;

@Data
public class AuthDTO {
    private String username;
    private String email;
    private String password;
    private boolean rememberMe;  // aggiunto per "rimani connesso"


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

      // Getter
      public boolean isRememberMe() {
        return rememberMe;
    }

    // Setter
    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }

    // Getter and Setter
}
