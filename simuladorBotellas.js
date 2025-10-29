/**
 * @file simuladorBotellas.js
 * Contiene la lógica para el simulador del problema
 * "Escape Room" (Botellas y Copas), que demuestra
 * la codificación binaria.
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    const inputBotella = document.getElementById('input_botella');
    const btnSimular = document.getElementById('btn_sim_botella');
    const divCopasContainer = document.getElementById('copas_sim_container');
    const codeResultado = document.getElementById('resultado_binario_sim');

    // --- 2. "ESCUCHADORES" DE EVENTOS ---

    // Queremos que funcione tanto al hacer clic como al cambiar el número
    btnSimular.addEventListener('click', actualizarSimulador);
    inputBotella.addEventListener('input', actualizarSimulador);
    
    // --- 3. FUNCIÓN PRINCIPAL DE LA SIMULACIÓN ---
    
    /**
     * Lee el valor del input, calcula el binario y
     * actualiza tanto el texto como las copas visuales.
     */
    function actualizarSimulador() {
        
        let numeroBotella = parseInt(inputBotella.value);

        // --- Validación ---
        // Si el campo está vacío o no es un número, mostramos el estado '0'
        if (isNaN(numeroBotella)) {
            numeroBotella = 0;
        }

        // Forzamos el rango 0-15
        if (numeroBotella < 0) {
            numeroBotella = 0;
            inputBotella.value = 0; // Corregimos el input
        }
        if (numeroBotella > 15) {
            numeroBotella = 15;
            inputBotella.value = 15; // Corregimos el input
        }

        // --- Lógica de Conversión ---
        
        // 1. Convertimos el número a string binario (ej: 5 -> "101")
        const binario = numeroBotella.toString(2); 

        // 2. Rellenamos con ceros a la izquierda para que siempre tenga 4 dígitos
        // (ej: "101" -> "0101")
        const binarioPadding = binario.padStart(4, '0');

        // --- Actualización del DOM ---

        // 1. Mostramos el resultado en el <code>
        codeResultado.textContent = binarioPadding;
        
        // 2. Actualizamos las copas visuales
        actualizarCopas(binarioPadding);
    }

    /**
     * Genera las 4 copas visuales (divs) basadas en el string binario.
     * @param {string} binarioPadding - Un string de 4 bits, ej: "0101".
     */
    function actualizarCopas(binarioPadding) {
        
        // Limpiamos las copas anteriores
        divCopasContainer.innerHTML = ''; 

        // Recorremos el string binario (ej: "0101")
        for (let i = 0; i < 4; i++) {
            const bit = binarioPadding[i]; // '0' o '1'

            const copaDiv = document.createElement('div');
            copaDiv.classList.add('copa-sim'); // Estilo base

            // El número de la copa es 3 - i para que vayan 3, 2, 1, 0
            copaDiv.innerHTML = `<span>Copa</span> ${3 - i}`;

            // Asignamos la clase de estado (on/off)
            if (bit === '1') {
                copaDiv.classList.add('copa-on'); // Prende
            } else {
                copaDiv.classList.add('copa-off'); // Apaga
            }
            
            divCopasContainer.appendChild(copaDiv);
        }
    }
    
    // --- INICIALIZACIÓN ---
    // Al cargar la página, mostramos el estado para la botella 0.
    actualizarSimulador();
});