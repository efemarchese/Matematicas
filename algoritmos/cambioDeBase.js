/**
 * @file cambioDeBase.js
 * Contiene la lógica para el visualizador de conversión de base
 * (Algoritmo de Divisiones Sucesivas).
 */

// Usamos 'DOMContentLoaded' para asegurarnos de que el script se ejecuta
// solo después de que todo el HTML se haya cargado completamente.
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    // Buscamos en el HTML los elementos con los que vamos a interactuar.
    const inputDecimal = document.getElementById('input_decimal');
    const btnBinario = document.getElementById('btn_binario');
    const btnHexa = document.getElementById('btn_hexa');
    const divResultado = document.getElementById('resultado_base');
    const divPasos = document.getElementById('pasos_base');

    // --- 2. "ESCUCHADORES" DE EVENTOS (Event Listeners) ---
    // Le decimos a los botones qué función ejecutar cuando se les hace clic.

    btnBinario.addEventListener('click', function() {
        // Al hacer clic, llamamos a nuestra función principal para base 2
        manejarConversion(2);
    });

    btnHexa.addEventListener('click', function() {
        // Al hacer clic, llamamos a nuestra función principal para base 16
        manejarConversion(16);
    });

    // --- 3. FUNCIÓN CONTROLADORA ---
    /**
     * Función principal que se encarga de:
     * 1. Leer y validar el input.
     * 2. Llamar a la función del algoritmo.
     * 3. Mostrar los resultados en la página.
     * @param {number} base - La base a la que se quiere convertir (ej: 2 o 16).
     */
    function manejarConversion(base) {
        // Obtenemos el valor del input y lo convertimos a un número entero.
        const numeroDecimal = parseInt(inputDecimal.value);

        // --- Validación de la entrada ---
        // Verificamos si es un número válido y positivo.
        if (isNaN(numeroDecimal) || numeroDecimal < 0) {
            divResultado.textContent = "Error: Ingresá un número positivo.";
            divPasos.innerHTML = ""; // Limpiamos los pasos
            return; // Terminamos la ejecución
        }

        // --- Caso especial: Cero ---
        if (numeroDecimal === 0) {
            divResultado.textContent = "0";
            divPasos.innerHTML = "<p>El número es 0, no hay divisiones que hacer.</p>";
            return; // Terminamos la ejecución
        }

        // --- Llamada al algoritmo ---
        // Llamamos a la función que hace la lógica y nos devuelve los resultados.
        const conversion = convertirBaseConPasos(numeroDecimal, base);

        // --- 4. MOSTRAR RESULTADOS EN EL DOM ---
        // Definimos el subíndice para el resultado.
        let subindice = (base === 2) ? '₂' : '₁₆';
        divResultado.textContent = conversion.resultado + subindice;

        // Inyectamos el HTML de los pasos en el div correspondiente.
        divPasos.innerHTML = conversion.pasosHtml;
    }

    // --- 4. FUNCIÓN DEL ALGORITMO (Lógica Pura) ---
    /**
     * Implementa el algoritmo de divisiones sucesivas.
     * @param {number} numeroDecimal - El número en base 10 a convertir.
     * @param {number} base - La base de destino (ej: 2 o 16).
     * @returns {object} Un objeto con { resultado: string, pasosHtml: string }
     */
    function convertirBaseConPasos(numeroDecimal, base) {
        
        // Para Hexadecimal, necesitamos mapear 10-15 a A-F
        const digitosHexa = '0123456789ABCDEF';
        
        let numero = numeroDecimal; // Variable temporal para ir dividiendo
        let restos = []; // Array donde guardamos los restos
        
        // Esta variable irá construyendo el HTML de los pasos
        let pasosHtml = '<ol>'; 
        
        // --- El corazón del algoritmo (ver pseudocódigo) ---
        while (numero > 0) {
            let cociente = Math.floor(numero / base); // División entera
            let resto = numero % base; // Módulo o resto
            
            restos.push(resto); // Guardamos el resto
            
            // --- ¡La parte pedagógica! ---
            // Armamos el string de este paso para mostrarlo.
            // Si es base 16, mostramos el dígito (ej: 'C' en vez de 12)
            let digitoParaMostrar = (base === 16) ? digitosHexa[resto] : resto;
            
            pasosHtml += `<li> ${numero} / ${base} = ${cociente}  (Resto: <strong>${resto}</strong> -> Dígito: <strong>${digitoParaMostrar}</strong>) </li>`;
            
            // Actualizamos el número para la próxima iteración
            numero = cociente; 
        }
        
        pasosHtml += '</ol>';
        pasosHtml += '<p>El resultado se lee tomando los restos de abajo hacia arriba (o el último resto primero).</p>';

        // --- Armado del resultado final ---
        // Para el resultado final, damos vuelta los restos y los unimos
        let resultadoFinal;
        if (base === 16) {
            // Convertimos restos (ej: 12) a dígitos hexa (ej: 'C')
            resultadoFinal = restos.map(r => digitosHexa[r]).reverse().join('');
        } else {
            // Solo damos vuelta y unimos
            resultadoFinal = restos.reverse().join('');
        }

        // La función devuelve un objeto con ambas cosas
        return {
            resultado: resultadoFinal,
            pasosHtml: pasosHtml
        };
    }
});