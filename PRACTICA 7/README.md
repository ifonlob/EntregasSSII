# Descifrador de archivos ZIP por fuerza bruta en Python (consola)

## Índice

- [Descripción del módulo](#descripci%C3%B3n-del-m%C3%B3dulo)
- [Requisitos del sistema](#requisitos-del-sistema)
- [Instalación de Python](#instalaci%C3%B3n-de-python-en-los-diferentes-sistemas-operativos)
- [Ejecución del módulo](#ejecuci%C3%B3n-del-m%C3%B3dulo)
- [Uso del archivo dependencias.txt](#uso-del-archivo-dependenciastxt-opcional)
- [Validaciones y mensajes de error](#validaciones-y-mensajes-de-error)
- [Problemas frecuentes (FAQ)](#problemas-frecuentes-faq)


## Descripción del módulo

Este proyecto consiste en un **descifrador de archivos ZIP protegido por contraseña** por fuerza bruta. El script prueba combinaciones posibles de caracteres (configurables) o contraseñas de un diccionario para intentar extraer el contenido de varios archivos ZIP (`diccionario.zip` y `compress.zip`).

- Los ZIP deben estar en el mismo directorio que el script.
- Usa mayúsculas, minúsculas, dígitos y admite la letra ñ/Ñ en la configuración.
- Muestra la contraseña encontrada (si la detecta), el número de intentos y el tiempo transcurrido.

**Uso principal:**

```bash
python ataque_zip.py
```


## Requisitos del sistema

- **Python 3.10 o superior**
- Usa las librerías estándar: sys, itertools, zipfile, zlib, time
- No se requieren dependencias externas (ver sección [Uso del archivo dependencias.txt](#uso-del-archivo-dependenciastxt-opcional))


## Instalación de Python en los diferentes sistemas operativos

### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv
```


### Fedora

```bash
sudo dnf install -y python3 python3-pip python3-virtualenv
```


### Arch/Manjaro

```bash
sudo pacman -S --needed python python-pip
```

**Recomendación:**

Trabaja en un entorno virtual para aislar dependencias:

```bash
python3 -m venv env
source env/bin/activate
```


### Windows

**Microsoft Store**

- Instala Python 3 desde la Store.
- Verifica con:

```cmd
py --version
```

**Instalador oficial**

- Desde [python.org/downloads](https://www.python.org/downloads/)
- Marca "Add Python to PATH" al instalar.

**Usa entorno virtual:**

```cmd
py -m venv .venv
.\.venv\Scripts\activate
```


## Ejecución del módulo

1. Coloca los archivos `diccionario.zip` y `compress.zip` en la misma carpeta que el script.
2. Ejecuta el script en consola:

```bash
python ataque_zip.py
```

3. Sigue las instrucciones en pantalla.

**Salida esperada:**

```
Se ha encontrado el archivo 'diccionario.zip'.
Se procederá a la desencriptación de éste.
Contraseña encontrada: 'ABñ7' en 105000 intentos
Tiempo transcurrido: 38.21 segundos.

Se ha encontrado el archivo 'compress.zip'.
Se procederá a la desencriptación de éste.               
Contraseña encontrada: 'root' en 281494 intentos
Tiempo transcurrido: 13.81 segundos.
```

Si no se encuentra la contraseña:

```
No se encontró la contraseña.
Tiempo transcurrido: 210.05 segundos.
```


## Uso del archivo `dependencias.txt` (opcional)

El proyecto **no requiere librerías externas**. Si añades alguna dependencia (por ejemplo, colorama para colores en consola), enumérala en `dependencias.txt` (una por línea).

**Instalación de dependencias:**

**Linux/MacOS**

```bash
python3 -m pip install -r dependencias.txt
```

**Windows**

```cmd
py -m pip install -r dependencias.txt
```


## Validaciones y mensajes de error

- **Archivo ZIP no encontrado:**
`"El archivo diccionario.zip NO está en la carpeta."`
- **Archivo compress.zip no encontrado:**
`"El archivo compress.zip NO está en la carpeta."`
- **Archivo de texto (diccionario) no encontrado:**
`"El archivo diccionario.txt NO está en la carpeta."`
- **Error al abrir/contenido ZIP corrupto:**
`"Error: diccionario.zip no es un archivo ZIP válido o está dañado."` / `"Error: compress.zip no es un archivo ZIP válido o está dañado."`
- **Archivo ZIP vacío:**
`"Error: el archivo ZIP está vacío."`
- **Permisos o errores inesperados:**
`"Se ha producido un error inesperado al procesar el archivo: [detalle]"`
- Si ningún intento tiene éxito, se muestra:
`"No se encontró la contraseña en el diccionario."`


## Problemas frecuentes (FAQ)

- **Error “no se encontró el archivo compress.zip o diccionario.zip”:**
    - Coloca los archivos ZIP en el mismo directorio.
    - Verifica los nombres y extensiones.
- **El procesamiento tarda mucho:**
    - El tiempo crece exponencialmente con el número de caracteres/repeticiones.
    - Para contraseñas largas, el proceso puede ser inviable.
- **Mensaje extraño o residuos en la barra de carga:**
    - Tu consola puede no limpiar la línea si la contraseña nueva es más corta que la anterior. El script añade espacios para evitarlo.
- **Permiso denegado o error de codificación:**
    - Ejecuta el script como admin si es necesario.
    - Verifica la codificación de los archivos.