## 1. Descripción de la Aplicación

**Bocado Mágico** es una aplicación web de estilo "Gourmet Minimalista" diseñada para mostrar platos y recetas de alta cocina.
Asimismo, sirve como un escaparate gastronómico donde los usuarios pueden descubrir la selección de recetas y platos exquisitos de la casa.
Finalmente, cabe destacar que la plataforma está construida con HTML, CSS, JavaScript y un backend Node.js, desplegándose completamente con Docker Compose.

## 2. Funcionalidades Principales

La aplicación cuenta con las siguientes características:

* **Exploración de Platos:** Los usuarios pueden visualizar los platos más irresistibles ofrecidos por Bocado Mágico directamente desde la página principal.
* **Sistema de Autenticación Integrado con Base de Datos Local:**
    * **Registro de Usuarios:** Los nuevos chefs/usuarios pueden crear una cuenta proporcionando un nombre de usuario, correo electrónico y contraseña. Los datos se almacenan de forma persistente en PostgreSQL.
    * **Inicio de Sesión:** Los usuarios existentes pueden acceder de forma segura a su cuenta mediante validación contra la base de datos.
    * **Cierre de Sesión:** Funcionalidad para cerrar la sesión activa del usuario.
* **Gestión de Sesiones:** Utiliza `localStorage` para mantener al usuario logueado e identificarlo por su nombre tras la autenticación contra el backend.
* **Despliegue en Contenedores Docker:** La aplicación se despliega mediante Docker Compose con cuatro servicios: base de datos PostgreSQL, backend Node.js/Express, servidor web Nginx con HTTPS, y túnel Cloudflare.
* **Persistencia de Datos:** Los usuarios registrados se almacenan en PostgreSQL con un volumen Docker dedicado (`pgdata`), garantizando que los datos sobrevivan a reinicios de los contenedores.
* **Servidor Web Seguro:** La aplicación funciona sobre un servidor Nginx configurado para redirigir todo el tráfico HTTP (puerto 80) a HTTPS (puerto 443) mediante certificados auto-firmados generados automáticamente.
* **Proxy Inverso Integrado:** Nginx sirve los archivos estáticos y redirige las peticiones a la API (`/api/`) hacia el backend Node.js, unificando todo bajo el mismo dominio.

## 3. Guía de Despliegue con Docker y Cloudflare

El proyecto está diseñado para ser desplegado fácilmente en cualquier entorno utilizando **Docker Compose** y expuesto a Internet de manera segura utilizando túneles de **Cloudflare (Cloudflared)**.

### 3.1. Arquitectura del Despliegue

El despliegue se compone de cuatro contenedores definidos en el archivo `docker-compose.yml`:

1. **`db`** (PostgreSQL 15 Alpine): Contenedor de base de datos que almacena los usuarios registrados. Dispone de un volumen (`pgdata`) para persistencia de datos y ejecuta automáticamente el script `init.sql` para crear la tabla `usuarios` al iniciarse por primera vez.
2. **`backend`** (Node.js 18 Alpine): API REST construida con Express que expone los endpoints `/api/registro` y `/api/login`. Se conecta a la base de datos PostgreSQL mediante las variables de entorno definidas en `docker-compose.yml`.
3. **`bocado-magico`** (Nginx Alpine): Construye la imagen basada en Nginx, genera los certificados SSL, sirve los archivos estáticos de la aplicación y actúa como proxy inverso para redirigir las peticiones `/api/` al servicio `backend`.
4. **`cloudflared`**: Crea un túnel seguro desde tu máquina local hacia la red de Cloudflare, permitiendo acceder a la web desde un dominio público sin necesidad de abrir puertos en tu router o firewall.

### 3.2. Archivos de Configuración

* **`Dockerfile`** (raíz): Utiliza la imagen `nginx:stable-alpine`. Durante la construcción, instala `openssl` y genera un certificado SSL auto-firmado (`privkey.pem` y `fullchain.pem`). Luego, copia la configuración de Nginx (`default.conf`) y el código fuente de la página web al directorio `/usr/share/nginx/html`.
* **`backend/Dockerfile`**: Utiliza `node:18-alpine`, instala las dependencias npm (express, pg, cors) y expone el puerto 3000 para servir la API REST.
* **`default.conf`**: Archivo de configuración de Nginx que escucha en el puerto 80 (redirigiendo al 443), sirve el sitio web de forma segura en el puerto 443 y redirige las peticiones `/api/` al backend mediante `proxy_pass http://backend:3000`.
* **`init.sql`**: Script SQL que crea la tabla `usuarios` con los campos `id` (serial, clave primaria), `nombre`, `correo` (único) y `contrasena`.
* **`docker-compose.yml`**: Orquesta los cuatro servicios. El servicio `backend` depende de `db`, el servicio `bocado-magico` depende de `backend`, y `cloudflared` depende de `bocado-magico`. Define las variables de entorno necesarias para la conexión a la base de datos y el volumen `pgdata` para persistencia.

### 3.3. Pasos para Desplegar

Sigue estos pasos para levantar la aplicación y generar el dominio público:

**Paso 1: Preparar el entorno**
Asegúrate de tener instalados **Docker** y **Docker Compose** en tu sistema. Ubícate en la raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`).

**Paso 2: Construir y levantar los contenedores**
Ejecuta el siguiente comando en tu terminal para construir las imágenes y levantar los cuatro servicios en segundo plano:

> docker compose up -d --build

**Paso 3: Verificar que todos los servicios están operativos**
Puedes comprobar el estado de los contenedores con:

> docker compose ps

Todos los servicios (`db`, `backend`, `bocado-magico`, `cloudflared`) deben aparecer como "Up".

**Paso 4: Obtener el dominio generado (Quick Tunnel)**
Dado que el archivo `docker-compose.yml` no especifica un token de Cloudflare preconfigurado, el contenedor creará automáticamente un **Quick Tunnel** (túnel rápido y temporal) asignando un subdominio aleatorio bajo la terminación `.trycloudflare.com`.

Para descubrir cuál es la URL pública que se te ha asignado, debes revisar los logs del contenedor de Cloudflare ejecutando el siguiente comando:

> docker logs bocado_tunnel

**Paso 5: Acceder a la aplicación**
En la salida de los logs, busca un bloque de texto que contenga unas líneas similares a estas:

```text
INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
INF |  https://alguna-palabra-aleatoria.trycloudflare.com
```

Copia ese enlace (ej. `https://...trycloudflare.com`) y pégalo en tu navegador web. ¡Tu aplicación **Bocado Mágico** ya está desplegada y es accesible mundialmente a través de un dominio seguro provisto por Cloudflare!

También puedes acceder localmente mediante `https://localhost`.

### 3.4. Ejecución de Tests Automatizados

El proyecto incluye un script de tests que verifica el correcto funcionamiento de todos los servicios. Para ejecutarlo:

> bash tests/test.sh

Este script comprueba automáticamente:
- Que los cuatro contenedores están en ejecución.
- Que el servidor web Nginx responde correctamente en HTTP y HTTPS.
- Que el registro de usuarios funciona a través de la API (vía el proxy inverso de Nginx).
- Que el inicio de sesión valida correctamente las credenciales contra PostgreSQL.
- Que los datos persisten en la base de datos (conexión real app-BD).
- Que las credenciales incorrectas son rechazadas (seguridad).
- Que el volumen de persistencia (`pgdata`) está creado.

## 4. Resumen de Endpoints de la API

| Método | Ruta            | Descripción                                   |
|--------|-----------------|-----------------------------------------------|
| POST   | `/api/registro` | Registra un nuevo usuario en la base de datos |
| POST   | `/api/login`    | Inicia sesión validando contra PostgreSQL      |

Ambos endpoints reciben y devuelven JSON, y son accesibles tanto directamente en `http://backend:3000` (dentro de la red Docker) como a través de Nginx en `https://localhost/api/...`.
