import { drawRing, drawServers, setColors, blinkServer} from './canvas.js';
import { addServer, addToCache, resetRing, getServers, getMinHash, getMaxHash } from './hashring.js';

var isSimulating = false;
var colors = ['#f44336','#f06292','#ab47bc','#673ab7','#5c6bc0','#2196f3','#01579b','#00acc1','#00897b','#43a047','#aed581','#f4ff81','#fff59d','#ffc109','#ff9800','#ff5722'];
var randomArray = [];
var speed = 20;
var procInterval;
var totalProc = 0;

function initRing() {
  drawRing();
  log('Waiting for simulation...')
}

document.getElementById("simulate-button").addEventListener("click", function() {
  let button = this;
  let input_qty = document.getElementById("qty");
  let input_vnodes = document.getElementById("vnodes");
  if (!isSimulating) {
    isSimulating = true;
    resetRing();
    let qty = input_qty.value;
    let vnodes = input_vnodes.value;
    for (var i = 0; i < qty; i++) {
      addServer(vnodes);  
    }
    let servers = getServers();
    drawServers(servers, getMinHash(), getMaxHash());
    createTable(servers);

    button.innerHTML = 'Stop';
    button.classList.remove('is-success');
    button.classList.add('is-danger');
    input_qty.disabled = true;
    input_vnodes.disabled = true;
    document.getElementById('add-server-button').disabled = false;
    startProcess();
    
  } else {
    stopProcess();
    isSimulating = false;
    button.innerHTML = 'Simulate';
    button.classList.remove('is-danger');
    button.classList.add('is-success');
    input_qty.disabled = false;
    input_vnodes.disabled = false;
    document.getElementById('add-server-button').disabled = true;
  }
  
});

document.getElementById("add-server-button").addEventListener("click", function() {
    let vnodes = document.getElementById("vnodes").value;
    addServer(vnodes);
    let servers = getServers()
    drawServers(servers, getMinHash(), getMaxHash());
    createTable(servers);
  });



function createTable(servers) {
  document.getElementById('simulation-area').replaceChildren();
  let vnodes = document.getElementById("vnodes").value;
  let table = document.createElement('table');
  let rh = document.createElement('tr');
  let th1 = document.createElement('th'); 
  let th2 = document.createElement('th'); 
  let th3 = document.createElement('th'); 
  let tr, td;
  let prev = '';

  table.classList.add('table');
  table.classList.add('is-fullwidth');
  table.classList.add('simulate-table');
  
  th1.innerHTML = 'Server';
  th2.innerHTML = 'Keys';
  th3.innerHTML = 'Percentage';
  
  rh.appendChild(th1);
  rh.appendChild(th2);
  rh.appendChild(th3);
  table.appendChild(rh)

  
  servers.forEach( (value, key) => {
    
    tr = document.createElement('tr'); 
    
    td = document.createElement('td');
    td.innerHTML = value.server_name + '(' + key + ')';
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = 'keys_' + key;
    td.innerHTML = value.cache;
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = 'perc_' + key;
    td.classList.add('percentage');
    td.innerHTML = '0%';
    tr.appendChild(td);

    table.appendChild(tr);

  });

  document.getElementById('simulation-area').appendChild(table);
  
}

function startProcess() {
  procInterval = setInterval(processQueue, speed);
}

function stopProcess() {
  clearInterval(procInterval);
}

function processQueue() {
  let res = [];
  if (randomArray.length > 0) {
    let str = randomArray.pop();
    res = addToCache(str);
    totalProc += 1
    document.getElementById('keys_' + res[0]).innerHTML = res[2];
    log('Adding to ' + res[1] + ': "' + str + '"');
    blinkServer(res[0]);
    updatePercentages();
  } else {
    stopProcess();
    getRandomWikipedia();  
  }
}

function updatePercentages() {
  const percs = document.getElementsByClassName("percentage");
  for (let i = 0; i < percs.length; i++) {
    let k = percs[i].id;
    k = k.replace('perc_', 'keys_');
    let qty = parseInt(document.getElementById(k).innerHTML);
    let perc = Math.round(qty * 100 / totalProc, 2);
    percs[i].innerHTML = perc + '%';
  }
}

function getRandomWikipedia() {
  let url = 'https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=500&format=json&origin=*'
  log('Fetching random articles from wikipedia...');
  fetch(url)
    .then(response => response.json())
    .then(data => fillRandomArray(data))
}

function fillRandomArray(data) {
  let arts = data.query.random;
  for (var i in arts) {
    randomArray.push(arts[i].title);
  }  
  startProcess();
}

function log(msg) {
  document.getElementById('log').innerHTML = msg;
  console.log(msg);
}

window.onload = function(e) {
  setColors(colors)
  initRing();
};

