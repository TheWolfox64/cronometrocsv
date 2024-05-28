let startTimes = [];
let tIntervals = [];
let running = [];


 ///no jalo
/** function startTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Obtener el ID del cronómetro
    if (!running[id]) {
        startTimes[id] = new Date().getTime();
        tIntervals[id] = setInterval(() => { getShowTime(id); }, 10);
        running[id] = true;
    }
}*/

function startTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Obtener el ID del cronómetro
    if (!running[id]) {
        if (startTimes[id]) {
            // Si el cronómetro estaba pausado, ajusta la hora de inicio para mantener el tiempo transcurrido
            let pausedTime = new Date().getTime() - startTimes[id];
            startTimes[id] = new Date().getTime() - pausedTime;
        } else {
            startTimes[id] = new Date().getTime();
        }
        tIntervals[id] = setInterval(() => { getShowTime(id); }, 10);
        running[id] = true;
    }
}

function pauseTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Obtener el ID del cronómetro
    if (running[id]) {
        clearInterval(tIntervals[id]);
        running[id] = false;
    }
}

function resetTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Obtener el ID del cronómetro
    startTimes[id] = new Date().getTime(); // Reiniciar el tiempo de inicio
    document.getElementById('display' + id).innerHTML = "00:00:00"; // Reiniciar la visualización del tiempo
}


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

// Función para agregar un cronómetro
function addTimer() {
    // Obtener el número de cronómetros
    let numTimers = document.querySelectorAll('.row .col').length;

    // Crea un nuevo elemento div para el cronómetro
    let timerContainer = document.createElement('div');
    timerContainer.classList.add('col');

    // Definir el ID único del cronómetro
    let newTimerId = numTimers + 1;

    // HTML del cronómetro
    timerContainer.innerHTML = `
      <div class="card1 mb-3 rounded-1 border-primary">
          <div class="card-header1 py-3">
              <input id="timerName${newTimerId}" type="text" placeholder="Introduce el nombre"  autocomplete="off">
          </div>
          <div class="card-body">
              <div id="display${newTimerId}" class="display text-center h2">00:00:00</div>
              <button class="btn btn-primary mb-1" onclick="startTimer(this.parentNode.parentNode)"><img src="https://cdn-icons-png.flaticon.com/128/27/27223.png" loading="lazy" alt="punta de flecha del botón de reproducción " title="start" width="20" height="20"></button>
              <button class="btn btn-warning mb-1" onclick="pauseTimer(this.parentNode.parentNode)"><img src="https://cdn-icons-png.flaticon.com/128/3249/3249396.png" loading="lazy" alt="botón de pausa " title="pausa" width="20" height="20"></button>
              <button class="btn btn-danger mb-1" onclick="resetTimer(this.parentNode.parentNode)"><img src="https://cdn-icons-png.flaticon.com/512/8088/8088582.png" loading="lazy" alt="parada " title="stop" width="20" height="20"></button>
          </div>
      </div>
    `;

    // Agrega el cronómetro al contenedor de cronómetros
    document.querySelector('.row').appendChild(timerContainer);
}

// Función para eliminar el último cronómetro agregado
function removeTimer() {
    let timers = document.querySelectorAll('.row .col');
    // Verifica si hay cronómetros para eliminar
    if (timers.length > 0) {
        // Elimina el último cronómetro agregado
        let lastTimer = timers[timers.length - 1];
        lastTimer.parentNode.removeChild(lastTimer);
    }
}
function startAllTimers() {
    let timers = document.querySelectorAll('.row .col');
    timers.forEach(timer => {
        startTimer(timer);
    });
}
function saveTimersToCSV() {
    // Start all timers before saving


    // Wait for a brief moment to let the timers start counting
    setTimeout(() => {
        // Obtener todos los cronómetros
        let timers = document.querySelectorAll('.row .col');
        
        // Crear el contenido CSV
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Nombre,Cronometro\n"; // Encabezados
        
        // Iterar sobre cada cronómetro y obtener su nombre y tiempo
        timers.forEach((timer, index) => {
            let name = document.getElementById(`timerName${index + 1}`).value;
            let time = document.getElementById(`display${index + 1}`).textContent;
            csvContent += `"${name}",${time}\n`; // Agregar fila al CSV
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
    }, 1000); // Wait for 1 second to let the timers start
}
