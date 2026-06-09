import sys
import zipfile
import zlib
import itertools
import time

CARACTERES = (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZÑ"
    "abcdefghijklmnopqrstuvwxyzñ"
    "0123456789"
)


def comprobar_existencia_archivo(nombre_archivo: str) -> bool:
    '''
    Comprueba si un archivo existe en el directorio actual.
    '''
    try:
        with open(nombre_archivo, 'rb'):
            return True
    except FileNotFoundError:
        return False


def comprobar_existencia_archivo_diccionario() -> bool:
    return comprobar_existencia_archivo("diccionario.zip")


def comprobar_existencia_compress() -> bool:
    return comprobar_existencia_archivo("compress.zip")


def comprobar_existencia_diccionario_txt() -> bool:
    return comprobar_existencia_archivo("diccionario.txt")


def mostrar_progreso(contraseña: str, intentos: int, modulo: int) -> None:
    if intentos % modulo == 0:
        sys.stdout.write(f"\rIntentando: {contraseña} (Total: {intentos})")
        sys.stdout.flush()


def fuerza_bruta_diccionario(caracteres: str) -> str:
    '''
    Realiza un ataque por fuerza bruta sobre diccionario.zip probando
    contraseñas de 4 caracteres.

    Genera todas las combinaciones posibles de longitud 4 usando el
    conjunto de caracteres proporcionado y las prueba como contraseña
    del archivo diccionario.zip hasta encontrar la correcta o agotar
    todas las combinaciones.
    '''
    try:
        archivo_zip = zipfile.ZipFile('diccionario.zip')
        primer_archivo = archivo_zip.namelist()[0]
    except zipfile.BadZipFile:
        return "Error: diccionario.zip no es un archivo ZIP válido o está dañado."
    except IndexError:
        return "Error: el archivo ZIP está vacío."

    intentos = 0

    for combinacion in itertools.product(caracteres, repeat=4):
        contraseña = "".join(combinacion)
        intentos += 1
        mostrar_progreso(contraseña, intentos, 10000)

        try:
            with archivo_zip.open(primer_archivo, 'r', pwd=contraseña.encode('utf-8')) as archivo:
                archivo.read(1)
            archivo_zip.extractall(pwd=contraseña.encode('utf-8'))
            archivo_zip.close()
            print("\n")
            return f"Contraseña encontrada: '{contraseña}' en {intentos} intentos"

        except (RuntimeError, zipfile.BadZipFile, zlib.error):
            pass

    return "No se encontró la contraseña."


def fuerza_bruta_compress() -> str:
    '''
    Realiza un ataque por diccionario sobre compress.zip usando las
    contraseñas de diccionario.txt.

    Abre el archivo compress.zip y, para el primer fichero interno,
    va probando cada línea de diccionario.txt como contraseña hasta
    encontrar una que permita descomprimir el contenido o agotar
    todas las entradas del diccionario.
    '''
    try:
        compress = zipfile.ZipFile('compress.zip')
        primer_archivo = compress.namelist()[0]
    except zipfile.BadZipFile:
        return "Error: compress.zip no es un archivo ZIP válido o está dañado."
    except IndexError:
        return "Error: el archivo ZIP está vacío."

    try:
        with open('diccionario.txt', "r", encoding="utf-8") as archivo_de_texto:
            intentos = 0

            for linea in archivo_de_texto:
                contraseña = linea.strip()
                intentos += 1
                mostrar_progreso(contraseña, intentos, 5000)

                try:
                    with compress.open(primer_archivo, 'r', pwd=contraseña.encode('utf-8')) as archivo:
                        archivo.read(1)
                    compress.extractall(pwd=contraseña.encode('utf-8'))
                    print("\n")
                    compress.close()
                    return f"Contraseña encontrada: '{contraseña}' en {intentos} intentos"

                except (RuntimeError, zipfile.BadZipFile, zlib.error):
                    pass

        return "No se encontró la contraseña en el diccionario."

    except FileNotFoundError:
        return "Error: el archivo diccionario.txt no se encuentra en la carpeta."


def main():
    if not comprobar_existencia_archivo_diccionario():
        print("El archivo diccionario.zip NO está en la carpeta.")
        sys.exit(1)

    print("Se ha encontrado el archivo 'diccionario.zip'.")
    tiempo_inicio = time.time()
    print("Se procederá a la desencriptación de éste.")
    resultado = fuerza_bruta_diccionario(CARACTERES)
    tiempo_final = time.time()
    print(resultado)
    print(f"Tiempo transcurrido: {tiempo_final - tiempo_inicio:.2f} segundos.")

    if not comprobar_existencia_compress():
        print("El archivo compress.zip NO está en la carpeta.")
        sys.exit(1)

    print("Se ha encontrado el archivo 'compress.zip'.")

    if not comprobar_existencia_diccionario_txt():
        print("El archivo diccionario.txt NO está en la carpeta.")
        sys.exit(1)

    print("Se procederá a la desencriptación de éste.")
    tiempo_inicio = time.time()
    resultado = fuerza_bruta_compress()
    tiempo_final = time.time()
    print(resultado)
    print(f"Tiempo transcurrido: {tiempo_final - tiempo_inicio:.2f} segundos.")


if __name__ == "__main__":
    main()
