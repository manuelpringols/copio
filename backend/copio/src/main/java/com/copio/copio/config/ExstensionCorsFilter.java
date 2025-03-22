// package com.copio.copio.config;

// import java.io.IOException;

// import jakarta.servlet.Filter;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.FilterConfig;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.ServletRequest;
// import jakarta.servlet.ServletResponse;
// import jakarta.servlet.annotation.WebFilter;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;


// @WebFilter("/*")
// public class ExstensionCorsFilter implements Filter {

//     @Override
//     public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
//         HttpServletRequest httpRequest = (HttpServletRequest) request;
//         HttpServletResponse httpResponse = (HttpServletResponse) response;  // Cast to HttpServletResponse

//         // Leggi l'ID dell'estensione dal header
//         String extensionId = httpRequest.getHeader("X-Extension-ID");

//         if (extensionId != null && isValidExtensionId(extensionId)) {
//             // Aggiungi dinamicamente l'origine CORS
//             httpResponse.setHeader("Access-Control-Allow-Origin", "chrome-extension://" + extensionId);
//             httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//             httpResponse.setHeader("Access-Control-Allow-Headers", "*");
//         }

//         // Continua la catena di filtri
//         chain.doFilter(request, response);
//     }

//     private boolean isValidExtensionId(String extensionId) {
//         // Controlla se l'ID dell'estensione è valido (esempio di controllo)
//         // In un'applicazione reale, puoi avere una lista di ID validi o altre logiche di validazione
//         return extensionId != null && !extensionId.isEmpty();
//     }

//     @Override
//     public void init(FilterConfig filterConfig) throws ServletException {}

//     @Override
//     public void destroy() {}
// }