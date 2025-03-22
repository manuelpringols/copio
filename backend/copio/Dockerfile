# Usa un'immagine base JDK per l'esecuzione dell'applicazione
FROM eclipse-temurin:17-jdk-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia tutto il progetto nella directory di lavoro del container
COPY ./ /app

# Copia anche il file .env
COPY .env /app/.env

# Espone la porta su cui Spring Boot sarà in ascolto
EXPOSE 9000

# Comando per avviare l'applicazione Spring Boot
CMD ["./mvnw", "spring-boot:run"] 
