function log(msg) {
  document.getElementById('log').innerHTML = msg;
}

function simulationLog(msg) {
  document.getElementById('simulation-log').innerHTML += '<div class="simulation-log-message">' + msg + '</div>';
}

function clearSimulationLog() {
  document.getElementById('simulation-log').innerHTML = '';
}

export { log, simulationLog, clearSimulationLog }