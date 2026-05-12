package com.copio.copio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// La configurazione CORS è gestita interamente in SecurityConfig tramite corsConfigurationSource().
// WebMvcConfigurer rimane qui per eventuali future configurazioni MVC
// (es. formatters, view resolvers, resource handlers).
@Configuration
public class WebConfig implements WebMvcConfigurer {
}