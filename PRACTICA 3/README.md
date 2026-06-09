# Ping

## Índice

- [Descripción del módulo](#descripción-del-módulo)
- [Requisitos del sistema](#requisitos-del-sistema)
- [Instalación de Python](#instalación-de-python-en-los-diferentes-sistemas-operativos)
- [Ejecución del módulo](#ejecución-del-módulo)
- [Uso del archivo dependencias.txt](#uso-del-archivo-dependenciastxt-opcional)
- [Validaciones y mensajes de error](#validaciones-y-mensajes-de-error)
- [Problemas frecuentes (FAQ)](#problemas-frecuentes-faq)

## Descripción del módulo

Este módulo se encarga de comprobar si la dirección IP introducida es válida y en consecuencia si está en la red, teniendo en cuenta el sistema operativo en el que se ejecute.

**Uso:**
> python ping.py <dirección_ip>

**Ejemplo:**
> python ping.py 192.168.1.1

## Requisitos del sistema

- **Python 3.10 o superior**.  
- Si en el futuro se añaden más librerías, se incluirán en el archivo **`dependencias.txt`** [(véase sección 5)](#uso-del-archivo-dependenciastxt-opcional)

---

## Instalación de Python en los diferentes sistemas operativos.

### Linux

#### Debian/Ubuntu
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv
python3 --version
python3 -m pip --version
```
#### Fedora

```bash
sudo dnf install -y python3 python3-pip python3-virtualenv
python3 --version
python3 -m pip --version
```
#### Arch/Manjaro

```bash
sudo pacman -S --needed python python-pip
python --version
python -m pip --version
```
***Recomendación:***
Usar un entorno virtual, a continuación se muestra como instalarlo en un entorno Linux:
```bash
pip install virtualenv
virtualenv env
./env/bin/activate
```

De la misma forma, cuando se desee desactivar el entorno virtual se indicará con el comando `. ./env/bin/deactivate`

### Windows

#### Opción A — Microsoft Store

1. Abre **Microsoft Store**, busca **Python 3.1x**. *Recuerda que se necesita Python 3.10 o superior*
2. Instala y comprueba la instalación:
```cmd
py --version
py -m pip --version
```

#### Opción B — Instalador oficial
1. Descarga el instalador desde [https://www.python.org/downloads/](https://www.python.org/downloads/).  
2. Marca la casilla “**Add Python to PATH**” durante la instalación. 
3. Verifica la instalación:
```cmd
py --version
py -m pip --version
```
***Recomendación:***
Usar un entorno virtual, a continuación se muestra como instalarlo en Windows:
```cmd
py -m venv .venv
..venv\Scripts\Activate.ps1
```
De la misma forma, cuando se desee desactivar el entorno virtual se indicará con el comando `..venv\Scripts\Deactivate.ps1`

---

## Ejecución del módulo

### Sintaxis general
```bash
python ping.py <dirección_ip>
```
En donde `dirección_ip`: Tiene que ser una dirección IP válida, es decir, tiene que cumplir las siguientes condiciones:

- Los octetos tienen que estar comprendidos entre 0 y 255.
- Cada octeto tiene que estar separado mediante un punto.
- Tiene que incluir 4 octetos.

## Uso del archivo `dependencias.txt` (opcional).

Si el proyecto requiere librerías externas, deben especificarse en el archivo **`dependencias.txt`** (una por línea).  
Ejemplo de contenido:
```txt
rich>=13.0
pytest
colorama==0.4.6
```
### Instalación de dependencias

> Usa el intérprete para invocar `pip` y evitar confusiones con `pip`/`pip3`. 

#### Linux/MacOS

```bash
python3 -m pip install -r dependencias.txt
```

#### Windows

```cmd
py -m pip install -r dependencias.txt
```

Si el archivo **no existe** o está vacío, el proyecto **no necesita ninguna dependencia** adicional.
## Validaciones y mensajes de error

El módulo realiza una serie de comprobaciones antes de interactuar con la red:

- Comprueba que la IP tenga 4 octetos separados exclusivamente por puntos.
- Todos los octetos deben estar en el rango de 0 a 255.
- Si algún octeto no es número o el separador no es un punto, se muestra un mensaje de error específico.
- Si el número de argumentos es incorrecto, se informa del uso adecuado.
- Si la IP no está disponible en la red, se muestra un mensaje de resultado explicativo.

**Ejemplos de errores:**

- Error. La dirección IP introducida no tiene una longitud válida. (Una dirección IP está formada por 4 octetos)
- Error. Los octetos tienen que estar separados mediante un punto.
- Error. La IP debe estar compuesta exclusivamente por números.
- Error. La dirección IP introducida no se encuentra en el rango permitido. (Desde 0 hasta 255)

## Problemas frecuentes (FAQ)

|Problema | Solución |
| :-- | :-- |
| El comando ping no guarda logs | Verifica que la carpeta `logs` exista. Crear manualmente si hace falta: `mkdir logs` |
| No se reconoce python/py | Confirma que Python esté añadido al PATH del sistema. Reinicia la terminal si cambias la configuración. |
| El módulo no limpia la consola | Según la terminal y sistema operativo, esta función puede no estar soportada. Prueba manualmente los comandos `clear`/`cls` en tu consola. |
| Error de separador al introducir la IP | Asegúrate de escribir la IP separando los octetos con puntos: `192.168.1.1` |
