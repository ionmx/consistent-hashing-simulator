const H = 400;
const W = 400;
const R = W/2-40;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var colors;
var serverPoints = new Map();
var prevBlink = [0,0];

function setColors(c) {
  colors = c;
}

function drawRing() {
  canvas.width = W;
  canvas.height = H;
  ctx.strokeStyle = '#dddddd'
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0.5, 0.5);
  ctx.beginPath();
  ctx.arc(W/2, W/2, R, 0, Math.PI * 2, true); 
  ctx.stroke();
}

function drawServer(label, angle, color, hash) {
  let point_size = 12;
  let font_size = "9px";
  let x = W/2 + R * Math.cos(-angle*Math.PI/180);
  let y = W/2 + R * Math.sin(-angle*Math.PI/180);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, point_size, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = font_size;
  ctx.fillText(label,x-6,y+3);
  serverPoints.set(hash, {server_name: label, x: x, y: y, color: color, angle: angle});
}

function drawServers(servers) {
  let angle = 0;
  let prev = 'S0';
  let ns = 0;
  drawRing(); 
  servers.forEach( (value, key) => {
    angle = key;
    if (value.server_name != prev) ns += 1; 
    drawServer(value.server_name, angle, colors[ns % colors.length], key);
    prev = value.server_name;
    
  });
}

function blinkServer(hash) {
  let p = serverPoints.get(hash);
  let point_size = 2;
  let x = W/2 + R * Math.cos(-p.angle*Math.PI/180);
  let y = W/2 + R * Math.sin(-p.angle*Math.PI/180) - 20;

  ctx.beginPath();
  if ((prevBlink[0] > 0) && (prevBlink[1] > 0)) {
    ctx.fillStyle = '#ffffff'
    ctx.arc(prevBlink[0], prevBlink[1], point_size + 1, 0, 2 * Math.PI);
    ctx.fill();  
  }
  
  ctx.beginPath();
  ctx.fillStyle = p.color;
  ctx.arc(x, y, point_size, 0, 2 * Math.PI);
  ctx.fill();
  prevBlink = [x,y];
}

export { drawRing, drawServers, blinkServer, setColors }