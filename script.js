let startTimes = [];
let tIntervals = [];
let running = [];
let pausedTimes = [];

// Function to start the timer
function startTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Get the timer ID
    if (!running[id]) {
        if (pausedTimes[id]) {
            // If the timer was paused, adjust the start time to maintain elapsed time
            startTimes[id] = new Date().getTime() - pausedTimes[id];
            pausedTimes[id] = null;
        } else {
            startTimes[id] = new Date().getTime();
        }
        tIntervals[id] = setInterval(() => { getShowTime(id); }, 10);
        running[id] = true;
    }
}

// Function to pause the timer
function pauseTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Get the timer ID
    if (running[id]) {
        clearInterval(tIntervals[id]);
        pausedTimes[id] = new Date().getTime() - startTimes[id];
        running[id] = false;
    }
}

// Function to reset the timer
function resetTimer(element) {
    let id = element.querySelector('.display').id.substring(7); // Get the timer ID
    clearInterval(tIntervals[id]);
    startTimes[id] = null;
    pausedTimes[id] = null;
    running[id] = false;
    document.getElementById('display' + id).innerHTML = "00:00:00"; // Reset the display
}

// Function to display the current time of the timer
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

// Function to add a new timer
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

// Function to remove the last timer added
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

        lastTimer.parentNode.removeChild(lastTimer);
    }
}

// Function to start all timers
function startAllTimers() {
    let timers = document.querySelectorAll('.row .col');
    timers.forEach(timer => {
        startTimer(timer);
    });
}

// Function to save timers to CSV
function saveTimersToCSV() {
    setTimeout(() => {
        let timers = document.querySelectorAll('.row .col');
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Nombre,Cronometro\n"; // Headers

        timers.forEach((timer, index) => {
            let name = document.getElementById(`timerName${index + 1}`).value;
            let time = document.getElementById(`display${index + 1}`).textContent;
            csvContent += `"${name}",${time}\n`;
        });

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cronometros.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 1000); // Wait for 1 second to let the timers start
}
