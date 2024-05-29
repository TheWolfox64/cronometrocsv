let startTimes = [];
let tIntervals = [];
let running = [];
let pausedTimes = [];
let startTimeLogs = [];
let endTimeLogs = [];

// Función para iniciar el cronómetro
function startTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Obtener el ID del cronómetro
    if (!running[id]) {
        if (pausedTimes[id]) {
            // Si el cronómetro estaba pausado, ajusta la hora de inicio para mantener el tiempo transcurrido
            startTimes[id] = new Date().getTime() - pausedTimes[id];
            pausedTimes[id] = null;
        } else {
            startTimes[id] = new Date().getTime();
            startTimeLogs[id] = new Date(); // Registrar la hora de inicio
        }
        tIntervals[id] = setInterval(() => { getShowTime(id); }, 10);
        running[id] = true;
    }
}

// Función para pausar el cronómetro
function pauseTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Obtener el ID del cronómetro
    if (running[id]) {
        clearInterval(tIntervals[id]);
        pausedTimes[id] = new Date().getTime() - startTimes[id];
        running[id] = false;
        endTimeLogs[id] = new Date(); // Registrar la hora de fin
    }
}

// Función para reiniciar el cronómetro
function resetTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Obtener el ID del cronómetro
    clearInterval(tIntervals[id]);
    startTimes[id] = null;
    pausedTimes[id] = null;
    running[id] = false;
    startTimeLogs[id] = null;
    endTimeLogs[id] = null;
    document.getElementById('display' + id).innerHTML = "00:00:00"; // Reiniciar la visualización del tiempo
}

// Función para mostrar el tiempo actual del cronómetro
function getShowTime(id) {
    let startTime = startTimes[id];
    let updatedTime = new Date().getTime();
    let difference = updatedTime - startTime;

    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

    document.getElementById('display' + id).innerHTML = minutes + ':' + seconds + ':' + milliseconds;
}

// Función para agregar un nuevo cronómetro
function addTimer() {
    let numTimers = document.querySelectorAll('.row .col').length;

    let timerContainer = document.createElement('div');
    timerContainer.classList.add('col');

    let newTimerId = numTimers + 1;

    timerContainer.innerHTML = `
      <div class="card1 mb-3 rounded-1 border-primary">
          <div class="card-header1 py-3">
              <input id="timerName${newTimerId}" type="text" placeholder="Introduce el nombre" autocomplete="off">
          </div>
          <div class="card-body">
              <div id="display${newTimerId}" class="display text-center h2">00:00:00</div>
              <button class="btn btn-primary mb-1" onclick="startTimer(this.parentNode.parentNode)">
                  <img src="https://cdn-icons-png.flaticon.com/128/27/27223.png" loading="lazy" alt="punta de flecha del botón de reproducción" title="start" width="20" height="20">
              </button>
              <button class="btn btn-warning mb-1" onclick="pauseTimer(this.parentNode.parentNode)">
                  <img src="https://cdn-icons-png.flaticon.com/128/3249/3249396.png" loading="lazy" alt="botón de pausa" title="pausa" width="20" height="20">
              </button>
              <button class="btn btn-danger mb-1" onclick="resetTimer(this.parentNode.parentNode)">
                  <img src="https://cdn-icons-png.flaticon.com/512/8088/8088582.png" loading="lazy" alt="parada" title="stop" width="20" height="20">
              </button>
          </div>
      </div>
    `;

    document.querySelector('.row').appendChild(timerContainer);
}

// Función para eliminar el último cronómetro agregado
function removeTimer() {
    let timers = document.querySelectorAll('.row .col');
    if (timers.length > 0) {
        let lastTimer = timers[timers.length - 1];
        let id = lastTimer.querySelector('.display').id.substring(7);

        // Clear the interval and reset the timer data
        clearInterval(tIntervals[id]);
        startTimes[id] = null;
        pausedTimes[id] = null;
        running[id] = false;
        tIntervals[id] = null;
        startTimeLogs[id] = null;
        endTimeLogs[id] = null;

        lastTimer.parentNode.removeChild(lastTimer);
    }
}

// Función para iniciar todos los cronómetros
function startAllTimers() {
    let timers = document.querySelectorAll('.row .col');
    timers.forEach(timer => {
        startTimer(timer);
    });
}

// Función para guardar los cronómetros en un archivo CSV
function saveTimersToCSV() {
    setTimeout(() => {
        let timers = document.querySelectorAll('.row .col');
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Nombre,Cronometro,Hora de Inicio,Hora de Fin\n"; // Encabezados

        timers.forEach((timer, index) => {
            let nameElement = document.getElementById(`timerName${index + 1}`);
            let displayElement = document.getElementById(`display${index + 1}`);
            
            if (nameElement && displayElement) {
                let name = nameElement.value || "Sin nombre";
                let time = displayElement.textContent;

                // Convertir el tiempo en milisegundos a formato MM:SS:MS
                let timeComponents = time.split(':');
                let minutes = parseInt(timeComponents[0]) || 0;
                let seconds = parseInt(timeComponents[1]) || 0;
                let milliseconds = parseInt(timeComponents[2]) || 0;

                // Convertir milisegundos a centésimas de segundo (redondear a 2 decimales)
                let centiseconds = Math.floor(milliseconds / 10);

                // Ajustar los valores de los segundos y los minutos según las centésimas de segundo
                seconds += Math.floor(centiseconds / 100);
                centiseconds %= 100;
                minutes += Math.floor(seconds / 60);
                seconds %= 60;

                // Ajustar el formato del tiempo
                let formattedTime = `${padZero(minutes)}:${padZero(seconds)}:${padZero(centiseconds)}`;

                // Obtener las horas de inicio y fin
                let startTime = startTimeLogs[index + 1] ? startTimeLogs[index + 1].toLocaleTimeString() : "N/A";
                let endTime = endTimeLogs[index + 1] ? endTimeLogs[index + 1].toLocaleTimeString() : "N/A";

                // Agregar la fila al CSV
                csvContent += `"${name}",${formattedTime},${startTime},${endTime}\n`;
            }
        });

        // Crear un enlace de descarga
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cronometros.csv");

        // Simular clic en el enlace para iniciar la descarga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 1000); // Espera 1 segundo para permitir que los cronómetros actualicen su tiempo
}

// Función para asegurarse de que los números tengan dos dígitos
function padZero(number) {
    return (number < 10 ? '0' : '') + number;
}
