/**
 * @file factorizacion.js
 * Contiene la lógica para el visualizador de descomposición en factores primos
 * (Algoritmo de Divisiones de Prueba o Trial Division).
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    const inputFactor = document.getElementById('input_factor');
    const btnFactorizar = document.getElementById('btn_factorizar');
    const divResultadoFactor = document.getElementById('resultado_factor');
    const divPasosFactor = document.getElementById('pasos_factor');

    // --- 2. "ESCUCHADOR" DE EVENTO ---
    btnFactorizar.addEventListener('click', function() {
        // Al hacer clic, llamamos a nuestra función controladora
        manejarFactorizacion();
    });

    // --- 3. FUNCIÓN CONTROLADORA ---
    /**
     * Función principal que se encarga de:
     * 1. Leer y validar el input.
     * 2. Llamar a la función del algoritmo.
     * 3. Mostrar los resultados en la página.
     */
    function manejarFactorizacion() {
        // Obtenemos el valor del input y lo convertimos a un número entero.
        const numero = parseInt(inputFactor.value);

        // --- Validación de la entrada ---
        // El Teorema Fundamental aplica para números > 1.
        if (isNaN(numero) || numero <= 1) {
            divResultadoFactor.textContent = "Error: Ingresá un número entero mayor que 1.";
            divPasosFactor.innerHTML = ""; // Limpiamos los pasos
            return; // Terminamos la ejecución
        }

        // --- Llamada al algoritmo ---
        const factorizacion = factorizarConPasos(numero);

        // --- 4. MOSTRAR RESULTADOS EN EL DOM ---
        // Unimos los factores con " x " para el resultado
        divResultadoFactor.textContent = factorizacion.factores.join(' x ');

        // Inyectamos el HTML de los pasos
        divPasosFactor.innerHTML = factorizacion.pasosHtml;
    }

    // --- 4. FUNCIÓN DEL ALGORITMO (Lógica Pura) ---
    /**
     * Implementa el algoritmo de divisiones de prueba.
     * @param {number} numero - El número entero > 1 a factorizar.
     * @returns {object} Un objeto con { factores: array, pasosHtml: string }
     */
    function factorizarConPasos(numero) {
        let n = numero; // Copia del número para ir modificando
        let factores = []; // Array para guardar los factores
        let pasosHtml = '<ul>'; // String para el HTML de los pasos

        // --- Paso 1: Sacar todos los factores '2' ---
        // Optimizamos tratando el '2' (único primo par) por separado.
        while (n % 2 === 0) {
            factores.push(2); // Añadimos el factor
            
            // --- Paso pedagógico ---
            pasosHtml += `<li> ${n} / <strong>2</strong> = ${n / 2}  (Factor encontrado: <strong>2</strong>) </li>`;
            
            n = n / 2; // Actualizamos el número
        }

        // --- Paso 2: Probar divisores impares ---
        // Empezamos en 3. Solo necesitamos probar impares (d = d + 2).
        // Solo necesitamos probar hasta la raíz cuadrada de n.
        // ¿Por qué? Si 'n' tiene un factor más grande que su raíz,
        // obligatoriamente debe tener uno más chico (que ya habríamos sacado).
        for (let d = 3; d * d <= n; d = d + 2) {
            
            // Verificamos si 'd' es factor (puede serlo varias veces, ej: 45)
            while (n % d === 0) {
                factores.push(d); // Añadimos el factor
                
                // --- Paso pedagógico ---
                pasosHtml += `<li> ${n} / <strong>${d}</strong> = ${n / d}  (Factor encontrado: <strong>${d}</strong>) </li>`;

                n = n / d; // Actualizamos el número
            }
        }

        // --- Paso 3: El número restante ---
        // Si al terminar el bucle 'n' es > 1, es porque
        // 'n' mismo es un número primo (ej: si el input fue 13, o si fue 26 -> n=13)
        if (n > 1) {
            factores.push(n); // Añadimos el último factor
            
            // --- Paso pedagógico ---
            pasosHtml += `<li> El número restante (<strong>${n}</strong>) es primo. Se añade como factor. </li>`;
        }

        pasosHtml += '</ul>';

        // Devolvemos el objeto con los resultados
        return {
            factores: factores,
            pasosHtml: pasosHtml
        };
    }
});