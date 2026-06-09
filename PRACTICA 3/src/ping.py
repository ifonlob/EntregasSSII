import sys
import threading
import os
import time
  
def limpiar():
    """Limpia la consola para Windows, Linux y macOS."""
    if os.name == "nt":
        comando = "cls"
    else:
        comando = "clear"
    try:
        os.system(comando)
    except:
        print("No se pudo limpiar la consola en este entorno.")   
        
def pantalla_carga():
    """Muestra una pantalla de carga animada en la consola."""
    print("Cargando", end="")
    for i in range(10):
        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(0.3)

def comprobacion_ip()->str:
    """
    Verifica la validez de la IP dada por argumento y devuelve la IP correcta.
    
    Comprueba longitud, formato y rango de los octetos.
    Termina el programa si hay error en el proceso de validación de la IP.
    """
    if len(sys.argv) != 2:
        print("Uso: 'nombre_del_archivo.py <direccion_ip>")
        sys.exit()
    lista_octetos = sys.argv[1].split(".")
    if len(lista_octetos) != 4:
        print("Error. La dirección IP introducida no tiene una longitud válida o estás usando separadores incorrectos. (Una dirección IP está formada por 4 octetos)")
        sys.exit()
    for octeto in lista_octetos:
        try:
            if int(octeto) < 0 or int(octeto) > 255:
                print("Error. La dirección IP introducida no se encuentra en el rango permitido. (Desde 0 hasta 255)")
                sys.exit()
            elif not octeto.isdigit():
                print("Error. Los octetos tienen que estar separados mediante un punto.")
                print("Uso: <primer_octeto>.<segundo_octeto>.<tercer.octeto>.<cuarto_octeto>")
                sys.exit()
        except ValueError:
            print("Error. La IP debe estar compuesta exclusivamente por números.")
            sys.exit()
    return str(sys.argv[1])

def hacer_ping(ip:str,resultado:dict[str,int]):
    """
    Realiza un ping a la IP indicada y almacena el resultado en el diccionario.

    El valor 0 indica éxito; cualquier otro valor indica fallo.
    El resultado se almacena en la clave 'valor' del diccionario resultado.
    """
    if os.name == "nt":
        respuesta = os.system(f'ping {ip} -n 1 > NUL 2>&1')
    else:
        respuesta = os.system(f"ping {ip} -c 1 > /dev/null 2>&1")
    resultado["valor"] = respuesta # Se crea un diccionario y se le asigna el valor que devuelva el ping.

def verificar_ip(ip:str)->str:
    """
    Verifica la conectividad de la IP usando un hilo y muestra una animación de carga.
    """
    resultado = {}
    hilo_ping = threading.Thread(target=hacer_ping, args=(ip,resultado))
    hilo_ping.start()
    while hilo_ping.is_alive():
        limpiar()
        pantalla_carga()
        time.sleep(0.5)
    print("¡Listo!")
    if resultado["valor"] == 0:
        return f"La IP {ip} está en la red."
    else:
        return f"La IP {ip} no está en la red."
    
def main():
    ip = comprobacion_ip()
    final = verificar_ip(ip)
    print(final)

    
if __name__ == "__main__":
    main()