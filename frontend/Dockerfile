# Usamos nginx oficial
FROM nginx:alpine

# Limpiar html por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar solo la build de Angular
COPY dist/angularPrueba/ /usr/share/nginx/html/

# Exponer puerto 80
EXPOSE 80

# Iniciar nginx en foreground
CMD ["nginx", "-g", "daemon off;"]
