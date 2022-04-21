import { drawRing, drawServers } from './canvas.js';
import { addServer, getKey, getServers } from './hashring.js';

function initRing() {
  drawRing();
}

document.getElementById("add-server").addEventListener("click", function() {
  let vnodes = document.getElementById("vnodes").value;
  addServer(vnodes);
  drawServers(getServers());
});

window.onload = function(e) {
  initRing();
};