# 🎵 Proyecto Musicallyx – Guía completa para arrancar desde cero

Este documento explica cómo poner en marcha el proyecto **Musicallyx**, incluyendo backend, frontend, base de datos y pruebas con Postman.  
Ideal para usuarios sin experiencia previa.

---

## 1️⃣ Requisitos previos

Antes de arrancar el proyecto, necesitas instalar varias herramientas:

- **Java 21**  
  Comprobar instalación: `java -version`  
  Si no está instalado, instalar según tu sistema operativo o WSL.

- **Maven**  
  Comprobar instalación: `mvn -v`  
  Maven se usa para compilar y ejecutar el backend.

- **Node.js y npm**  
  Comprobar instalación: `node -v` y `npm -v`  
  Necesarios para ejecutar el frontend.

- **Angular CLI**  
  Instalar: `npm install -g @angular/cli`  
  Comprobar versión: `ng version`

- **Docker**  
  Comprobar instalación: `docker --version`  
  Se usa para ejecutar la base de datos MySQL.

- **Postman**  
  Descargar: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

- **Driver MySQL (si no está incluido)**  
  Descargar: [https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/)

---

## 2️⃣ Base de datos MySQL 🐬

1. Arranca el contenedor Docker que contiene MySQL:  
   `sudo docker start mysql-db1`

2. Configura `application.properties` en `backend/src/main/resources/application.properties`:

spring.application.name=musicallyxx
spring.datasource.url=jdbc:mysql://<TU_IP>:3306/musicallyx?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=secret
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto=update

yaml
Copiar código

> **Notas importantes:**
> - `<TU_IP>`: Si estás en WSL u otro subsistema Linux, reemplaza por la IP de tu subsistema; si no, usa `localhost`.
> - `spring.jpa.hibernate.ddl-auto=update` permite que Hibernate cree o actualice tablas automáticamente.
> - Ajusta `musicallyx` si quieres otro nombre de base de datos.

3. Comprueba que la base de datos está activa: `sudo docker ps`  
   Debe aparecer `mysql-db1` en estado `Up`.

---

## 3️⃣ Backend ⚙️

1. Entra en la carpeta del backend: `cd backend`
2. Compila y descarga dependencias: `mvn clean install`
3. Arranca el backend: `mvn spring-boot:run`

- El backend se ejecutará en `http://localhost:8080/`
- Comprueba que funciona usando un navegador o Postman.

---

## 4️⃣ Frontend 🌐

1. Entra en la carpeta del frontend: `cd ../frontend`
2. Instala dependencias: `npm install`
3. Arranca el frontend: `ng serve`
4. Abre el navegador en: `http://localhost:4200/`

---

## 5️⃣ Probar la API con Postman 🧪

1. Abre Postman.
2. Importa la colección de requests desde la carpeta `postman/`.
3. Asegúrate de que las URLs apunten al puerto del backend: `http://localhost:8080`
4. Ejecuta requests y comprueba que todo funciona correctamente.

---

## 6️⃣ Dependencias principales 📦

### Spring Boot Starters
- `spring-boot-starter-web` → Endpoints REST
- `spring-boot-starter-data-jpa` → Conexión con MySQL
- `spring-boot-starter-security` → Seguridad y autenticación
- `spring-boot-starter-mail` → Enviar emails
- `spring-boot-starter-websocket` → Comunicación en tiempo real
- `spring-boot-devtools` → Herramientas de desarrollo
- `spring-boot-starter-validation` → Validaciones de datos

### Otras librerías
- `stripe-java` → Pagos con Stripe
- `mysql-connector-j` → Conexión con MySQL
- `lombok` → Reducir código repetitivo (getters/setters)

> Todas se descargan automáticamente con `mvn install`.

---

## 7️⃣ Consejos y tips finales 💡

- No tocar carpetas: `target/`, `.idea/`, `.maven/`.
- Rutas relativas: si mueves archivos internos, revisa las importaciones en backend.
- IP de MySQL: si cambias de máquina o usas WSL, actualizar `application.properties`.
- Orden recomendado de arranque: **Docker (MySQL)** → **Backend** → **Frontend**.
- Postman funciona independientemente de la estructura interna; solo asegúrate de que las URLs sean correctas.

---

