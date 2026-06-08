## 1. Descripción de la Aplicación

**Bocado Mágico** es una aplicación web de estilo "Gourmet Minimalista" diseñada para mostrar platos y recetas de alta cocina. 
Asimismo, sirve como un escaparate gastronómico donde los usuarios pueden descubrir la selección de recetas y platos exquisitos de la casa. 
Finalmente, cabe destacar que la plataforma está construida con HTML, CSS, y JavaScript, y cuenta con un sistema de usuarios gestionado en la nube.

## 2. Funcionalidades Principales

La aplicación cuenta con las siguientes características:

* **Exploración de Platos:** Los usuarios pueden visualizar los platos más irresistibles ofrecidos por Bocado Mágico directamente desde la página principal.
* **Sistema de Autenticación Integrado (Firebase):** * **Registro de Usuarios:** Los nuevos chefs/usuarios pueden crear una cuenta proporcionando un nombre de usuario, correo electrónico y contraseña.
    * **Inicio de Sesión:** Los usuarios existentes pueden acceder de forma segura a su cuenta.
    * **Cierre de Sesión:** Funcionalidad para cerrar la sesión activa del usuario.
* **Gestión de Sesiones:** Utiliza `localStorage` combinado con Firebase Auth para mantener al usuario logueado e identificarlo por su nombre.
* **Servidor Web Seguro:** La aplicación funciona sobre un servidor Nginx configurado para redirigir todo el tráfico HTTP (puerto 80) a HTTPS (puerto 443) mediante certificados auto-firmados generados automáticamente.

## 3. Guía de Despliegue con Docker y Cloudflare

El proyecto está diseñado para ser desplegado fácilmente en cualquier entorno utilizando **Docker** y expuesto a Internet de manera segura utilizando túneles de **Cloudflare (Cloudflared)**.

### 3.1. Arquitectura del Despliegue

El despliegue se compone de dos contenedores principales definidos en el archivo `docker-compose.yml`:
1.  `bocado-magico`: Construye la imagen basada en Nginx, genera los certificados SSL y sirve los archivos estáticos de la aplicación.
2.  `cloudflared`: Crea un túnel seguro desde tu máquina local hacia la red de Cloudflare, permitiendo acceder a la web desde un dominio público sin necesidad de abrir puertos en tu router o firewall.

### 3.2. Archivos de Configuración

* **`Dockerfile`**: Utiliza la imagen `nginx:stable-alpine`. Durante la construcción, instala `openssl` y genera un certificado SSL auto-firmado (`privkey.pem` y `fullchain.pem`). Luego, copia la configuración de Nginx (`default.conf`) y el código fuente de la página web al directorio `/usr/share/nginx/html`.
* **`default.conf`**: Archivo de configuración de Nginx que escucha en el puerto 80 (redirigiendo al 443) y sirve el sitio web de forma segura en el puerto 443.
* **`docker-compose.yml`**: Orquesta ambos servicios. En el servicio `cloudflared`, se ejecuta el comando `tunnel --url https://bocado-magico:443 --no-autoupdate --no-tls-verify`. El flag `--no-tls-verify` es esencial, ya que permite a Cloudflare conectarse al servidor Nginx ignorando que el certificado SSL es auto-firmado.

### 3.3. Pasos para Desplegar

Sigue estos pasos para levantar la aplicación y generar el dominio público:

**Paso 1: Preparar el entorno**
Asegúrate de tener instalados **Docker** y **Docker Compose** en tu sistema. Ubícate en la raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`).

**Paso 2: Construir y levantar los contenedores**
Ejecuta el siguiente comando en tu terminal para construir la imagen web y levantar ambos servicios en segundo plano:

> docker-compose up -d --build

**Paso 3: Obtener el dominio generado (Quick Tunnel)**
Dado que el archivo `docker-compose.yml` no especifica un token de Cloudflare preconfigurado, el contenedor creará automáticamente un **Quick Tunnel** (túnel rápido y temporal) asignando un subdominio aleatorio bajo la terminación `.trycloudflare.com`.

Para descubrir cuál es la URL pública que se te ha asignado, debes revisar los logs del contenedor de Cloudflare ejecutando el siguiente comando:

> docker logs bocado_tunnel

**Paso 4: Acceder a la aplicación**
En la salida de los logs, busca un bloque de texto que contenga unas líneas similares a estas:

```text
INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
INF |  https://alguna-palabra-aleatoria.trycloudflare.com
```

Copia ese enlace (ej. `https://...trycloudflare.com`) y pégalo en tu navegador web. ¡Tu aplicación **Bocado Mágico** ya está desplegada y es accesible mundialmente a través de un dominio seguro provisto por Cloudflare!
