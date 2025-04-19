# Plan de Desarrollo: Ta-Te-Ti en Consola con IA (Python)

1.  **Configuración Inicial:**
    *   Crear un archivo Python principal, por ejemplo, `tateti_ai.py`.
    *   Importar el módulo `random` para la elección de movimientos de la IA.

2.  **Representación del Tablero:**
    *   Usaremos una lista de 9 elementos para representar el tablero (índices 0-8). Inicialmente, contendrá números del 1 al 9 para que el jugador sepa qué número ingresar.
    *   `tablero = ['1', '2', '3', '4', '5', '6', '7', '8', '9']`

3.  **Mostrar el Tablero:**
    *   Crear una función `mostrar_tablero(tablero)` que imprima el estado actual del tablero en un formato visualmente claro en la consola (3x3).

4.  **Verificar Ganador:**
    *   Crear una función `verificar_ganador(tablero, marca)` que revise todas las combinaciones ganadoras (filas, columnas, diagonales) para la `marca` ('X' o 'O') dada. Devolverá `True` si hay un ganador, `False` en caso contrario.

5.  **Verificar Empate:**
    *   Crear una función `verificar_empate(tablero)` que compruebe si todas las casillas están ocupadas y no hay un ganador. Devolverá `True` si es empate, `False` si no.

6.  **Movimiento del Jugador:**
    *   Crear una función `movimiento_jugador(tablero)` que:
        *   Pida al jugador que ingrese un número de casilla (1-9).
        *   Valide que la entrada sea un número válido y que la casilla esté libre.
        *   Actualice el `tablero` con la marca del jugador ('X').
        *   Vuelva a pedir la entrada si no es válida.

7.  **Movimiento de la IA (Simple):**
    *   Crear una función `movimiento_ia(tablero)` que:
        *   **Prioridad 1 (Ganar):** Revise si la IA ('O') puede ganar en el próximo movimiento y haga ese movimiento.
        *   **Prioridad 2 (Bloquear):** Revise si el jugador ('X') puede ganar en el próximo movimiento y bloquee esa casilla.
        *   **Prioridad 3 (Estratégico Básico):** Intente tomar el centro (si está libre), luego una esquina (si está libre), luego un lado (si está libre).
        *   **Prioridad 4 (Aleatorio):** Si ninguna de las anteriores aplica, elija una casilla libre al azar.
        *   Actualice el `tablero` con la marca de la IA ('O').

8.  **Bucle Principal del Juego:**
    *   Inicializar el tablero.
    *   Decidir quién empieza (puede ser aleatorio o siempre el jugador).
    *   Alternar turnos entre el jugador y la IA:
        *   Mostrar el tablero.
        *   Realizar el movimiento correspondiente (jugador o IA).
        *   Verificar si hay un ganador después de cada movimiento.
        *   Verificar si hay empate.
        *   Si el juego termina (victoria o empate), mostrar el resultado y preguntar si quieren jugar de nuevo.

## Visualización del Flujo del Juego (Mermaid)

```mermaid
graph TD
    A[Inicio del Juego] --> B{Mostrar Tablero};
    B --> C{Turno del Jugador?};
    C -- Sí --> D[Pedir Movimiento Jugador];
    C -- No --> E[Calcular Movimiento IA];
    D --> F{Validar Movimiento};
    F -- Válido --> G[Actualizar Tablero con 'X'];
    F -- Inválido --> D;
    E --> H[Actualizar Tablero con 'O'];
    G --> I{Verificar Ganador ('X')};
    H --> J{Verificar Ganador ('O')};
    I -- Sí --> K[Fin: Gana Jugador];
    I -- No --> L{Verificar Empate};
    J -- Sí --> M[Fin: Gana IA];
    J -- No --> L;
    L -- Sí --> N[Fin: Empate];
    L -- No --> C;
    K --> O{Jugar de Nuevo?};
    M --> O;
    N --> O;
    O -- Sí --> A;
    O -- No --> P[Fin del Programa];