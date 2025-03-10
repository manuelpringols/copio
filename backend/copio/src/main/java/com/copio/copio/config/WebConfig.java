package com.copio.copio.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Consenti tutte le origini
        registry.addMapping("/**") 
                .allowedOrigins("chrome-extension://oanncbfojagekhicaaknndjalhhimhbg", "http://localhost:4200","chrome-extension://boplbicfliibinhjacpeepmmdmjobgng") // Aggiungi l'origini della tua estensione e dell'app
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // Permetti tutti gli header
                .allowCredentials(true) // Consenti i cookie se necessario
                .maxAge(3600); // Aggiungi un maxAge per la cache della richiesta CORS
    }
}
