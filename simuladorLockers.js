/**
 * @file simuladorLockers.js
 * Contiene la lógica para el simulador animado del problema
 * de los casilleros (lockers).
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    const inputN = document.getElementById('input_n_lockers');
    const btnIniciar = document.getElementById('btn_iniciar_sim');
    const btnReset = document.getElementById('btn_reset_sim');
    const sliderVelocidad = document.getElementById('slider_velocidad');
    const infoPaso = document.getElementById('info_paso_sim');
    const grilla = document.getElementById('grilla_lockers_sim');

    // --- 2. VARIABLES DE ESTADO DE LA SIMULACIÓN ---
    let lockers = []; // Array que guardará el estado (true=abierto, false=cerrado)
    let n = 0; // Cantidad total de lockers
    let estudianteActual = 1;
    let isRunning = false;
    let velocidad = 500; // Velocidad inicial (en ms)
    let timeoutId = null; // Para poder pausar/cancelar el setTimeout

    // --- 3. "ESCUCHADORES" DE EVENTOS ---

    btnIniciar.addEventListener('click', () => {
        if (isRunning) {
            pausarSimulacion();
        } else {
            iniciarSimulacion();
        }
    });

    btnReset.addEventListener('click', resetSimulacion);

    // Actualiza la velocidad en tiempo real
    sliderVelocidad.addEventListener('input', (e) => {
        // Invertimos el valor para que "más" sea "más rápido"
        velocidad = 1050 - parseInt(e.target.value);
    });

    // --- 4. FUNCIONES PRINCIPALES DE LA SIMULACIÓN ---

    /**
     * Inicia o reanuda la simulación.
     */
    function iniciarSimulacion() {
        isRunning = true;
        btnIniciar.textContent = 'Pausar';
        // Si es una reanudación, no hace falta leer el N
        if (estudianteActual === 1) { 
            n = parseInt(inputN.value);
            crearGrilla(n);
        }
        infoPaso.textContent = `Iniciando...`;
        // Arranca el bucle de simulación
        simularPasoEstudiante();
    }

    /**
     * Pausa la simulación.
     */
    function pausarSimulacion() {
        isRunning = false;
        btnIniciar.textContent = 'Reanudar';
        infoPaso.textContent += ' (Pausado)';
        clearTimeout(timeoutId); // Detiene la próxima ejecución programada
    }

    /**
     * Resetea la simulación a su estado inicial.
     */
    function resetSimulacion() {
        pausarSimulacion(); // Detiene todo
        n = parseInt(inputN.value);
        estudianteActual = 1;
        isRunning = false; // Nos aseguramos
        btnIniciar.textContent = 'Iniciar';
        infoPaso.textContent = 'Estado: Listo para iniciar.';
        crearGrilla(n); // Regenera la grilla
    }

    /**
     * Crea la grilla visual de lockers en el HTML.
     */
    function crearGrilla(n) {
        grilla.innerHTML = ''; // Limpia la grilla anterior
        lockers = [false]; // Creamos el array de estado
        for (let i = 1; i <= n; i++) {
            lockers.push(false); // false = cerrado (estado inicial)
            
            const lockerDiv = document.createElement('div');
            lockerDiv.id = `locker-${i}`;
            lockerDiv.classList.add('locker', 'cerrado');
            lockerDiv.textContent = i;
            grilla.appendChild(lockerDiv);
        }
    }

    // --- 5. LÓGICA DEL BUCLE DE ANIMACIÓN ---

    /**
     * Función que simula el paso de UN estudiante.
     * Es el "bucle for" exterior.
     */
    function simularPasoEstudiante() {
        if (!isRunning) return; // Si se pausó, no hace nada

        // Condición de fin: ya pasaron todos los estudiantes
        if (estudianteActual > n) {
            infoPaso.textContent = '¡Simulación Completa! Lockers abiertos: ' + lockers.filter(l => l).length;
            isRunning = false;
            btnIniciar.textContent = 'Iniciar';
            estudianteActual = 1;
            return;
        }

        infoPaso.textContent = `Pasa Estudiante ${estudianteActual}...`;
        
        // Empezamos a tocar los múltiplos, arrancando por el primero (estudianteActual)
        // Esta es la llamada al "bucle for" interior
        tocarSiguienteMultiplo(estudianteActual);
    }

    /**
     * Función RECURSIVA que simula el "bucle for" interior.
     * Toca un locker, y luego se auto-llama para el siguiente múltiplo
     * usando setTimeout.
     * @param {number} lockerNum - El número de locker a tocar.
     */
    function tocarSiguienteMultiplo(lockerNum) {
        if (!isRunning) return; // Si se pausó, no hace nada

        // Condición de fin: ya pasamos el último locker
        if (lockerNum > n) {
            // Terminó este estudiante.
            // Pasamos al siguiente estudiante y llamamos al "bucle exterior"
            estudianteActual++;
            // Damos una pausa un poco más larga entre estudiantes
            timeoutId = setTimeout(simularPasoEstudiante, velocidad * 1.5); 
            return;
        }

        // --- El "corazón" de la animación ---
        const lockerDiv = document.getElementById(`locker-${lockerNum}`);

        // 1. Cambiamos el estado lógico
        lockers[lockerNum] = !lockers[lockerNum]; // Toggle (true/false)

        // 2. Aplicamos la animación visual
        lockerDiv.classList.add('highlight'); // Destaca el locker
        
        // 3. Cambiamos el estado visual (abierto/cerrado)
        if (lockers[lockerNum]) {
            lockerDiv.classList.remove('cerrado');
            lockerDiv.classList.add('abierto');
        } else {
            lockerDiv.classList.remove('abierto');
            lockerDiv.classList.add('cerrado');
        }

        // 4. Quitamos la animación después de un ratito
        setTimeout(() => {
            lockerDiv.classList.remove('highlight');
        }, velocidad / 2);

        // 5. Programamos el próximo paso de ESTE MISMO estudiante
        // (el siguiente múltiplo)
        timeoutId = setTimeout(() => {
            tocarSiguienteMultiplo(lockerNum + estudianteActual);
        }, velocidad);
    }

    // --- INICIALIZACIÓN ---
    // Al cargar la página, creamos la grilla inicial
    resetSimulacion();
});