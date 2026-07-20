# ESTÁGIO 1: Construção (Instala dependências do Node e faz o build do Angular)
FROM node:20-alpine AS build
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia o resto do código e gera a versão de produção
COPY . .
RUN npm run build --configuration=production

# ESTÁGIO 2: Servidor Web (Nginx)
FROM nginx:alpine

# Limpa a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos compilados do Angular para o servidor
COPY --from=build /app/dist/frontend-angular/browser /usr/share/nginx/html

# Copia o arquivo de configuração de rotas do Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta HTTP
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]