# Fase 1: Build dell'app Angular
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build --prod

# Fase 2: Servire con NGINX
FROM nginx:alpine

# Rimuove la configurazione di default di NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Copia il file di configurazione personalizzato
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file buildati da Angular nella directory pubblica di NGINX
COPY --from=build /app/dist/copio/browser/ /usr/share/nginx/html/


# Espone la porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
