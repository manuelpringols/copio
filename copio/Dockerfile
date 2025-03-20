# Usa l'immagine ufficiale di Node.js per costruire l'app
FROM node:18 AS build

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze dell'app
RUN npm install --legacy-peer-deps

# Copia il codice sorgente dell'app Angular
COPY . .

# Costruisci l'app Angular in modalità produzione
RUN npm run build --prod

# Usa l'immagine di Nginx per servire i file statici
FROM nginx:alpine

# Copia i file costruiti da Angular nella directory di Nginx
COPY --from=build /app/dist/copio/* /usr/share/nginx/html


# Copia le pagine di errore personalizzate nel contenitore Nginx
COPY src/assets/404.html /usr/share/nginx/html/404.html



# Espone la porta su cui Nginx servirà l'app
EXPOSE 80

# Comando per avviare Nginx
CMD ["nginx", "-g", "daemon off;"]

