# 🏟️ SportBook — Sistema de Reservas de Canchas Deportivas
**NeuroCode Systems S.A.S · 2026**

---

## 🛠️ Tecnologías utilizadas
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Backend:** Java 17 + Spring Boot 3.2 + REST API
- **Base de datos:** PostgreSQL 18
- **Seguridad:** JWT
- **Documentación API:** Swagger / OpenAPI

---

## ✅ Requisitos previos
Instalar los siguientes programas antes de correr el proyecto:

| Programa | Versión | Descarga |
|----------|---------|----------|
| Java | 17 | https://adoptium.net |
| Maven | 3.9+ | https://maven.apache.org/download.cgi |
| PostgreSQL | 18 | https://www.postgresql.org/download |
| VS Code | Última | https://code.visualstudio.com |

**Extensiones de VS Code necesarias:**
- Extension Pack for Java (Microsoft)
- Maven for Java (Microsoft)
- Spring Boot Extension Pack (VMware)

---

## 🚀 Pasos para ejecutar el proyecto

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
```

### 2. Configurar la base de datos
- Abrir **pgAdmin**
- Crear una base de datos llamada `Canchas_deportivas`
- Abrir el Query Tool y ejecutar el archivo:
```
sportbook-backend/src/main/resources/data.sql
```

### 3. Configurar contraseña de PostgreSQL
Abrir el archivo:
```
sportbook-backend/src/main/resources/application.properties
```
Cambiar la línea:
```properties
spring.datasource.password=TU_PASSWORD_AQUI
```
Por tu contraseña real de PostgreSQL.

### 4. Correr el backend
Abrir terminal en la carpeta `sportbook-backend` y ejecutar:
```bash
mvn spring-boot:run
```
Esperar hasta ver:
```
Started SportBookApplication in X seconds
```

### 5. Abrir el frontend
Abrir el archivo `frontend-sportbook/index.html` en el navegador.
O usar la extensión **Live Server** de VS Code.

---

## 👥 Usuarios de prueba
| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@sportbook.com | password | Administrador |
| ana@sportbook.com | password | Cliente |
| juan@sportbook.com | password | Cliente |
| laura@sportbook.com | password | Cliente |

---

## 📡 Endpoints principales de la API
Una vez corriendo el backend, ver documentación completa en:
```
http://localhost:8080/swagger-ui.html
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/registro | Registrar usuario |
| GET | /api/canchas | Listar canchas |
| POST | /api/reservas | Crear reserva |
| GET | /api/reservas/mis-reservas | Ver mis reservas |
| GET | /api/reportes/resumen | Resumen admin |

---

## 📁 Estructura del proyecto
```
SportBook/
├── sportbook-backend/          ← Backend Java Spring Boot
│   ├── src/main/java/          ← Código fuente
│   ├── src/main/resources/     ← application.properties + data.sql
│   └── pom.xml                 ← Dependencias Maven
└── frontend-sportbook/         ← Frontend HTML/CSS/JS
    ├── index.html
    ├── login.html
    ├── css/styles.css
    └── js/app.js
```
