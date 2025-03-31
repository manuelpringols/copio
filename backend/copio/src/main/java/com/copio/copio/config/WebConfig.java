package com.copio.copio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Mappa tutte le richieste che iniziano con /api
               .allowedOrigins("http://localhost:4200","https://copio.online:3000")  // Permetti il frontend Angular su localhost:4200
               .allowedMethods("GET", "POST", "PUT", "DELETE","OPTIONS")  // Consenti i metodi HTTP
               .allowedHeaders("*")
               .exposedHeaders(HttpHeaders.AUTHORIZATION)   // Permetti tutte le intestazioni
               .allowCredentials(true);  // Permetti i cookie (se necessario)
    }
}
