var crc32=function(r){for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r.charCodeAt(t))];return(-1^n)>>>0};
var alpha='ABCDEFGHIJKLMNOPQRSTUVXYZ'

const servers = new Map();
var server_list = new Array();
var max = 0
var min = Number.MAX_SAFE_INTEGER;

function log(msg) {
  document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + msg + "\n"
}

function hash_function(string) {
    return crc32(string) % 360;
}

function addServer(vnodes) {
    let server_name = alpha.charAt(server_list.length)
    let hash = hash_function(server_name)
    if (hash > max) {
      max = hash
    }
    if (hash < min) {
      min = hash
    }
    servers.set(hash, server_name);
    var sn = '';
    server_list.push(server_name);
    for (var i = 0; i < vnodes; i++) {
      sn = server_name + '.' + i;
      hash = hash_function(sn)
      if (hash > max) {
        max = hash
      }
      if (hash < min) {
        min = hash
      }
      servers.set(hash, server_name);
    }
    log('ADD Server ' + server_name + ' (+'+ vnodes + ' vnodes)');
}

function getKey() {

}

function getServers() {
    return [servers, min, max];
}

export { addServer, getKey, getServers }