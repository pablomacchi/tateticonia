document.addEventListener('DOMContentLoaded', () => {
    const tableroDiv = document.getElementById('tablero');
    const casillas = document.querySelectorAll('.casilla');
    const mensajeDiv = document.getElementById('mensaje');
    const reiniciarBtn = document.getElementById('reiniciar');

    let tablero = ['', '', '', '', '', '', '', '', ''];
    let jugadorActual = 'X';
    let juegoActivo = true;

    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    // --- Funciones Principales ---

    function manejarClickCasilla(evento) {
        const indiceCasilla = parseInt(evento.target.dataset.indice);

        if (tablero[indiceCasilla] !== '' || !juegoActivo || jugadorActual === 'O') {
            return; // No hacer nada si la casilla está ocupada, el juego terminó o es turno de la IA
        }

        // Movimiento del jugador
        realizarMovimiento(indiceCasilla, 'X');

        // Verificar estado del juego después del movimiento del jugador
        if (verificarGanador('X')) {
            terminarJuego(false, 'X');
        } else if (verificarEmpate()) {
            terminarJuego(true);
        } else {
            cambiarTurno();
            // Retraso leve para el movimiento de la IA para que se sienta más natural
            setTimeout(movimientoIA, 500);
        }
    }

    function movimientoIA() {
        if (!juegoActivo) return; // No mover si el juego ya terminó

        console.log("Turno de la IA (O)...");
        const mejorMovimiento = encontrarMejorMovimiento();

        if (mejorMovimiento !== null) {
            realizarMovimiento(mejorMovimiento, 'O');

            // Verificar estado del juego después del movimiento de la IA
            if (verificarGanador('O')) {
                terminarJuego(false, 'O');
            } else if (verificarEmpate()) {
                terminarJuego(true);
            } else {
                cambiarTurno();
            }
        } else {
            console.log("IA no encontró movimiento (¿empate?)"); // No debería pasar si hay casillas libres
            if (verificarEmpate()) {
                 terminarJuego(true);
            }
        }
    }

    function encontrarMejorMovimiento() {
        const casillasLibres = obtenerCasillasLibres(tablero);

        // 1. Intentar ganar
        for (let i of casillasLibres) {
            const copiaTablero = [...tablero];
            copiaTablero[i] = 'O';
            if (verificarGanador('O', copiaTablero)) {
                console.log(`IA elige ${i} para ganar`);
                return i;
            }
        }

        // 2. Bloquear al jugador
        for (let i of casillasLibres) {
            const copiaTablero = [...tablero];
            copiaTablero[i] = 'X';
            if (verificarGanador('X', copiaTablero)) {
                console.log(`IA elige ${i} para bloquear`);
                return i;
            }
        }

        // 3. Estrategia: Centro > Esquinas > Lados
        // Centro (índice 4)
        if (casillasLibres.includes(4)) {
            console.log("IA elige centro (4)");
            return 4;
        }

        // Esquinas (0, 2, 6, 8)
        const esquinas = [0, 2, 6, 8];
        const esquinasLibres = casillasLibres.filter(i => esquinas.includes(i));
        if (esquinasLibres.length > 0) {
            const esquinaAleatoria = esquinasLibres[Math.floor(Math.random() * esquinasLibres.length)];
            console.log(`IA elige esquina (${esquinaAleatoria})`);
            return esquinaAleatoria;
        }

        // Lados (1, 3, 5, 7)
        const lados = [1, 3, 5, 7];
        const ladosLibres = casillasLibres.filter(i => lados.includes(i));
        if (ladosLibres.length > 0) {
            const ladoAleatorio = ladosLibres[Math.floor(Math.random() * ladosLibres.length)];
            console.log(`IA elige lado (${ladoAleatorio})`);
            return ladoAleatorio;
        }

        // 4. Movimiento aleatorio (fallback, si quedan casillas)
        if (casillasLibres.length > 0) {
           const movimientoAleatorio = casillasLibres[Math.floor(Math.random() * casillasLibres.length)];
           console.log(`IA elige aleatorio (${movimientoAleatorio})`);
           return movimientoAleatorio;
        }

        return null; // No hay movimientos posibles
    }


    // --- Funciones Auxiliares ---

    function realizarMovimiento(indice, jugador) {
        if (tablero[indice] === '' && juegoActivo) {
            tablero[indice] = jugador;
            actualizarUI();
            console.log(`Movimiento: Jugador ${jugador} en casilla ${indice}`);
        }
    }

    function verificarGanador(jugador, tableroActual = tablero) {
        for (const combo of combinacionesGanadoras) {
            const [a, b, c] = combo;
            if (tableroActual[a] === jugador && tableroActual[b] === jugador && tableroActual[c] === jugador) {
                // Opcional: resaltar casillas ganadoras
                // combo.forEach(index => casillas[index].classList.add('ganadora'));
                return true;
            }
        }
        return false;
    }

    function verificarEmpate() {
        // Es empate si no hay ganador y todas las casillas están llenas
        return !tablero.includes('') && !verificarGanador('X') && !verificarGanador('O');
    }

     function obtenerCasillasLibres(tableroActual = tablero) {
        return tableroActual.map((valor, indice) => valor === '' ? indice : null).filter(val => val !== null);
    }

    function cambiarTurno() {
        jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
        const textoTurno = jugadorActual === 'X' ? 'Humano' : 'IA';
        actualizarMensaje(`Turno de ${textoTurno}`);
    }

    function terminarJuego(esEmpate, ganador = null) {
        juegoActivo = false;
        if (esEmpate) {
            actualizarMensaje("¡Es un empate!");
        } else {
            if (ganador === 'O') {
                actualizarMensaje("Has sido victima de la IA, Perdiste!");
            } else {
                actualizarMensaje(`¡${ganador} ha ganado!`); // Mantenemos el mensaje para X
            }
        }
        // Podríamos añadir aquí la clase 'ganadora' a las casillas correspondientes si se desea
    }

    function reiniciarJuego() {
        tablero = ['', '', '', '', '', '', '', '', ''];
        jugadorActual = 'X';
        juegoActivo = true;
        actualizarMensaje('Turno del Humano'); // Mensaje inicial al reiniciar
        actualizarUI();
        // Quitar clases 'ganadora' si se usaron
        casillas.forEach(casilla => {
            casilla.classList.remove('x', 'o', 'ganadora');
            casilla.textContent = ''; // Limpiar visualmente
        });
        console.log("Juego reiniciado");
    }

    // --- Actualización UI ---

    function actualizarUI() {
        casillas.forEach((casilla, indice) => {
            if (tablero[indice] !== '') {
                casilla.textContent = tablero[indice];
                casilla.classList.add(tablero[indice].toLowerCase()); // Añade clase 'x' o 'o'
            } else {
                casilla.textContent = '';
                casilla.classList.remove('x', 'o');
            }
        });
    }

    function actualizarMensaje(texto) {
        mensajeDiv.textContent = texto;
    }

    // --- Event Listeners ---
    casillas.forEach(casilla => casilla.addEventListener('click', manejarClickCasilla));
    reiniciarBtn.addEventListener('click', reiniciarJuego);

    // --- Inicialización ---
    actualizarMensaje('Turno del Humano'); // Mensaje inicial al cargar
    console.log("Juego Ta-Te-Ti inicializado.");

});