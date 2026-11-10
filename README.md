# 🏟️ SportBook — Sistema de Reservas de Canchas Deportivas
**NeuroCode Systems S.A.S · 2026**

---

## 🛠️ Tecnologías utilizadas
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Backend:** Java 25 + Spring Boot 4.1 + REST API
- **Base de datos:** PostgreSQL 18
- **Seguridad:** JWT
- **Documentación API:** Swagger / OpenAPI

---

## ✅ Requisitos previos
Instalar los siguientes programas antes de correr el proyecto:

| Programa   | Versión | Descarga                              |
|------------|---------|---------------------------------------|
| Java       | 25      | https://adoptium.net                  |
| Maven      | 3.9+    | https://maven.apache.org/download.cgi |
| PostgreSQL | 18      | https://www.postgresql.org/download   |
| VS Code    | Última  | https://code.visualstudio.com         |

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
spring.datasource.password=Tu_Contraseña_aqui
```
Por tu contraseña real de PostgreSQL.

### 4. correr el frontend
Cuando abres un HTML haciendo doble clic, el navegador lo carga con el protocolo file://. Esto activa restricciones de seguridad del navegador que bloquean peticiones HTTP, incluyendo localhost:8080 donde corre el backend. Ese error se le conoce como CORS.

Desde la raíz del repositorio, abrir una terminal en `Proyecto SportBook\front-end`
y ejecutar:
```powershell
python -m http.server 5500
```

### 5. Correr el backend
Abrir otra terminal de PowerShell y configurar Java 25 para esa sesión:
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.5.8-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
mvn -version
```
Verificar que Maven indique Java 25. Luego ir a la carpeta del backend y arrancarlo:
```powershell
Set-Location "Proyecto SportBook\Back-end\sportbook-backend\sportbook-backend"
mvn spring-boot:run
```
Esperar hasta ver:
```
Started SportBookApplication in X seconds
```
Mantener esta terminal abierta mientras se usa la aplicación. La configuración de Java solo dura en esa terminal; si se abre otra, repetir los dos comandos de `$env:` antes de iniciar Maven.

### 6. Abrir el frontend
Abrir el archivo `http://localhost:5500/login.html` en el navegador.
O usar la extensión **Live Server** de VS Code.

---

## 👥 Usuarios de prueba
| Correo              | Contraseña | Rol           |
|---------------------|------------|---------------|
| admin@sportbook.com | password   | Administrador |
| ana@sportbook.com   | password   | Cliente       |
| juan@sportbook.com  | password   | Cliente       |
| laura@sportbook.com | password   | Cliente       |

---

## 📡 Endpoints principales de la API
Una vez corriendo el backend, ver documentación completa en:
```
http://localhost:8080/swagger-ui.html
```

| Método | Endpoint                   | Descripción       |
|--------|----------------------------|-------------------|
| POST   | /api/auth/login            | Iniciar sesión    |
| POST   | /api/auth/registro         | Registrar usuario |
| GET    | /api/canchas               | Listar canchas    |
| POST   | /api/reservas              | Crear reserva     |
| GET    | /api/reservas/mis-reservas | Ver mis reservas  |
| GET    | /api/reportes/resumen      | Resumen admin     |

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
