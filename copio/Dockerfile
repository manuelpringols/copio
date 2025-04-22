# Usa l'immagine node per la build
FROM node:18 as build

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file necessari per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze senza interazioni di rete non necessarie
RUN npm install --legacy-peer-deps --verbose

# Copia il resto dei file sorgenti nel container
COPY . .

# Esegui il build in modalità di produzione
RUN npm run build --prod

# Usa l'immagine Apache per servire i file statici
FROM bitnami/apache:latest

# Copia i file di build nella directory htdocs di Apache
COPY --from=build /app/dist/copio/* /opt/bitnami/apache/htdocs/

# Espone la porta 80
EXPOSE 80





#/app/dist/project_name
FROM bitnami/apache:latest
COPY --chown=1001:1001 --from=build /app/dist/copio/* /opt/bitnami/apache/htdocs 
#COPY --chown=1001:1001 certss /opt/bitnami/apache/conf/bitnami/certs
COPY --chown=1001:1001 config/bitnami.conf /opt/bitnami/apache/conf/bitnami
COPY --chown=1001:1001 config/httpd.conf /opt/bitnami/apache/conf
