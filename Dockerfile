# Etapa 1: Construcción de Angular
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: Servir con NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/riu-frontend-ailin-rutchle/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
