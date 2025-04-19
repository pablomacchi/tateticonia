import random
import os # Importamos os para limpiar la consola

# Representación del tablero: Lista del 0 al 8. Inicialmente con números.
tablero = [' '] * 9 # Usaremos espacios en blanco para casillas vacías inicialmente
numeros_guia = [str(i) for 3i in range(1, 10)] # Guía visual para el jugador

def mostrar_tablero(tablero_actual, guia=False):
    """Muestra el tablero 3x3 en la consola."""
    # Limpia la consola (funciona en Windows y Linux/Mac)
    os.system('cls' if os.name == 'nt' else 'clear')

    print("\n  TA-TE-TI IA\n")
    if guia:
        print(" Guía de casillas:")
        print(f"  {numeros_guia[0]} | {numeros_guia[1]} | {numeros_guia[2]} ")
        print(" ---|---|---")
        print(f"  {numeros_guia[3]} | {numeros_guia[4]} | {numeros_guia[5]} ")
        print(" ---|---|---")
        print(f"  {numeros_guia[6]} | {numeros_guia[7]} | {numeros_guia[8]} ")
        print("-" * 15) # Separador

    print(" Tablero actual:")
    print(f"  {tablero_actual[0]} | {tablero_actual[1]} | {tablero_actual[2]} ")
    print(" ---|---|---")
    print(f"  {tablero_actual[3]} | {tablero_actual[4]} | {tablero_actual[5]} ")
    print(" ---|---|---")
    print(f"  {tablero_actual[6]} | {tablero_actual[7]} | {tablero_actual[8]} ")
    print("\n")

def verificar_ganador(tablero_actual, marca):
    """Verifica si la marca ('X' o 'O') ha ganado."""
    # Combinaciones ganadoras (índices)
    combinaciones = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8), # Filas
        (0, 3, 6), (1, 4, 7), (2, 5, 8), # Columnas
        (0, 4, 8), (2, 4, 6)             # Diagonales
    ]
    for combo in combinaciones:
        if (tablero_actual[combo[0]] == marca and
            tablero_actual[combo[1]] == marca and
            tablero_actual[combo[2]] == marca):
            return True
    return False

def verificar_empate(tablero_actual):
    """Verifica si el tablero está lleno (empate)."""
    # Si no hay espacios en blanco ' ' y nadie ha ganado (implícito), es empate.
    return ' ' not in tablero_actual


def movimiento_jugador(tablero_actual):
    """Pide al jugador su movimiento, lo valida y actualiza el tablero."""
    while True:
        try:
            casilla = input("Tu turno (X). Elige una casilla (1-9): ")
            casilla_num = int(casilla)
            if 1 <= casilla_num <= 9:
                indice = casilla_num - 1 # Convertimos a índice 0-8
                if tablero_actual[indice] == ' ':
                    tablero_actual[indice] = 'X'
                    break # Salimos del bucle si el movimiento es válido
                else:
                    print("¡Esa casilla ya está ocupada! Intenta de nuevo.")
            else:
                print("Número inválido. Debe ser entre 1 y 9.")
        except ValueError:
            print("Entrada inválida. Por favor, ingresa un número.")
        except Exception as e:
            print(f"Ocurrió un error inesperado: {e}")


def obtener_casillas_libres(tablero_actual):
    """Devuelve una lista con los índices de las casillas libres."""
    return [i for i, valor in enumerate(tablero_actual) if valor == ' ']

def movimiento_ia(tablero_actual):
    """Calcula y realiza el movimiento de la IA ('O')."""
    print("Turno de la IA (O)...")
    casillas_libres = obtener_casillas_libres(tablero_actual)

    # Prioridad 1: Intentar ganar
    for i in casillas_libres:
        copia_tablero = tablero_actual[:] # Copiamos para no modificar el original
        copia_tablero[i] = 'O'
        if verificar_ganador(copia_tablero, 'O'):
            tablero_actual[i] = 'O'
            print(f"IA elige la casilla {i+1}")
            return

    # Prioridad 2: Bloquear al jugador
    for i in casillas_libres:
        copia_tablero = tablero_actual[:]
        copia_tablero[i] = 'X'
        if verificar_ganador(copia_tablero, 'X'):
            tablero_actual[i] = 'O'
            print(f"IA elige la casilla {i+1} (bloqueando)")
            return

    # Prioridad 3: Estrategia (Centro > Esquinas > Lados)
    # Centro (índice 4)
    if 4 in casillas_libres:
        tablero_actual[4] = 'O'
        print(f"IA elige la casilla 5 (centro)")
        return

    # Esquinas (índices 0, 2, 6, 8)
    esquinas_libres = [i for i in casillas_libres if i in [0, 2, 6, 8]]
    if esquinas_libres:
        indice_elegido = random.choice(esquinas_libres)
        tablero_actual[indice_elegido] = 'O'
        print(f"IA elige la casilla {indice_elegido+1} (esquina)")
        return

    # Lados (índices 1, 3, 5, 7)
    lados_libres = [i for i in casillas_libres if i in [1, 3, 5, 7]]
    if lados_libres:
        indice_elegido = random.choice(lados_libres)
        tablero_actual[indice_elegido] = 'O'
        print(f"IA elige la casilla {indice_elegido+1} (lado)")
        return

    # Prioridad 4: Movimiento aleatorio (si todo lo demás falla, aunque no debería pasar si hay casillas libres)
    if casillas_libres: # Asegurarnos de que todavía hay casillas
        indice_elegido = random.choice(casillas_libres)
        tablero_actual[indice_elegido] = 'O'
        print(f"IA elige la casilla {indice_elegido+1} (aleatorio)")
        return


# --- Bucle Principal del Juego ---
if __name__ == "__main__":
    while True: # Bucle para permitir jugar de nuevo
        tablero_juego = [' '] * 9
        jugador_actual = 'X' # El jugador humano siempre empieza
        juego_terminado = False
        mostrar_guia_inicial = True # Mostrar la guía solo la primera vez

        while not juego_terminado:
            mostrar_tablero(tablero_juego, guia=mostrar_guia_inicial)
            mostrar_guia_inicial = False # Ya no mostrar la guía en los siguientes turnos

            if jugador_actual == 'X':
                movimiento_jugador(tablero_juego)
                if verificar_ganador(tablero_juego, 'X'):
                    mostrar_tablero(tablero_juego) # Mostrar tablero final
                    print("¡Felicidades! ¡Has ganado (X)!")
                    juego_terminado = True
                elif verificar_empate(tablero_juego):
                    mostrar_tablero(tablero_juego) # Mostrar tablero final
                    print("¡Es un empate!")
                    juego_terminado = True
                else:
                    jugador_actual = 'O' # Cambiar turno a la IA
            else: # Turno de la IA
                movimiento_ia(tablero_juego)
                # Pequeña pausa para que se vea el movimiento de la IA
                input("Presiona Enter para continuar...")
                if verificar_ganador(tablero_juego, 'O'):
                    mostrar_tablero(tablero_juego) # Mostrar tablero final
                    print("¡La IA (O) ha ganado!")
                    juego_terminado = True
                elif verificar_empate(tablero_juego):
                    mostrar_tablero(tablero_juego) # Mostrar tablero final
                    print("¡Es un empate!")
                    juego_terminado = True
                else:
                    jugador_actual = 'X' # Cambiar turno al jugador

        # Preguntar si quiere jugar de nuevo
        jugar_de_nuevo = input("¿Quieres jugar otra partida? (s/n): ").lower()
        if jugar_de_nuevo != 's':
            print("¡Gracias por jugar!")
            break # Salir del bucle principal