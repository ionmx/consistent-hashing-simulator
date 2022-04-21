const H = 400;
const W = 400;
const R = W/2-40;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function drawRing() {
  canvas.width = W;
  canvas.height = H;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0.5, 0.5);
  ctx.beginPath();
  ctx.arc(W/2, W/2, R, 0, Math.PI * 2, true); 
  ctx.stroke();
}

function drawServer(label, angle) {
  var point_size = 4;
  var font_size = "10px";
  var x = W/2 + R * Math.cos(-angle*Math.PI/180);
  var y = W/2 + R * Math.sin(-angle*Math.PI/180);

  ctx.beginPath();
  ctx.arc(x, y, point_size, 0, 2 * Math.PI);
  ctx.fill();

  ctx.font = font_size;
  ctx.fillText(label,x + 10,y);
}

function drawServers(data) {
  let servers = data[0];
  let min = data[1];
  let max = data[2];
  let angle = 0;
  let label = '';
  let prev = '';
  let c = 0;
  drawRing(); 
  // Use 350 degrees to avoid overlap
  servers.forEach( (value, key) => {
    angle = Math.floor(((350 - 1) / (min - max)) * (key - min))
    if (value != prev) {
      c = 0;
    } else {
      c += 1;
    }
    label = value
    if (c > 0) {
      label = label + c
    }
    prev = value;
    drawServer(label, angle);
    console.log('MIN: ' + min + ' MAX:' + max + ' S:' + label + ' KEY:' + key);
  });
}

export { drawRing, drawServers }