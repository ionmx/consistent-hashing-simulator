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
  let point_size = 10;
  let font_size = "10px";
  let x = W/2 + R * Math.cos(-angle*Math.PI/180);
  let y = W/2 + R * Math.sin(-angle*Math.PI/180);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, point_size, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = font_size;
  ctx.fillText(label,x-3,y+3);
  serverPoints.set(hash, {server_name: label, x: x, y: y, color: color});
}

function drawServers(pservers, pmin, pmax) {
  let servers = pservers;
  let min = pmin;
  let max = pmax;
  let angle = 0;
  let label = '';
  let prev = '';
  let c = 0;
  let ns = 0;
  drawRing(); 
  // Use 350 degrees to avoid overlap
  servers.forEach( (value, key) => {
    angle = Math.floor(((350 - 1) / (min - max)) * (key - min))
    if (value.server_name != prev) {
      c = 0;
      ns += 1
    } else {
      c += 1;
    }
    label = value.server_name
    // if (c > 0) {
    //   label = label + c
    // }
    prev = value.server_name;
    drawServer(label, angle, colors[ns % colors.length], key);
  });
}

function blinkServer(hash) {
  let p = serverPoints.get(hash);
  let point_size = 2;
  ctx.beginPath();
  if ((prevBlink[0] > 0) && (prevBlink[1] > 0)) {
    ctx.fillStyle = '#ffffff'
    ctx.arc(prevBlink[0] + 15, prevBlink[1], point_size + 1, 0, 2 * Math.PI);
    ctx.fill();  
  }
  
  ctx.beginPath();
  ctx.fillStyle = p.color;
  ctx.arc(p.x + 15, p.y, point_size, 0, 2 * Math.PI);
  ctx.fill();
  prevBlink = [p.x,p.y];
}

export { drawRing, drawServers, blinkServer, setColors }