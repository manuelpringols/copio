# Usa un'immagine base JDK per l'esecuzione dell'applicazione
FROM eclipse-temurin:17-jdk-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia tutto il progetto nella directory di lavoro del container
COPY ./ /app

# Espone la porta su cui Spring Boot sarà in ascolto
EXPOSE 8080

# Comando per avviare l'applicazione Spring Boot
CMD ["./mvnw", "spring-boot:run"] 
