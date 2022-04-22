var crc32=function(r){for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r.charCodeAt(t))];return(-1^n)>>>0};
var alpha='ABCDEFGHIJKLMNOPQRSTUVXYZ'

const servers = new Map();
var server_list = new Array();
var max = 0
var min = Number.MAX_SAFE_INTEGER;

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
    servers.set(hash, {server_name: server_name, cache: 0});
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
      servers.set(hash, {server_name: server_name, cache: 0});
    }
}

function addToCache(str) {
  let k = getKey(str);
  let server = servers.get(k);
  server.cache += 1;
  return [k, server.server_name, server.cache];
}

function getKey(str) {
  let hash = hash_function(str);
  let keys = Array.from( servers.keys() );
  keys.sort((a,b)=>a-b);
  let closest = binarySearch(keys, hash);
  return closest;
}

function getServers() {
    return servers;
}

function resetRing() {
  max = 0
  min = Number.MAX_SAFE_INTEGER;
  servers.clear();
  while(server_list.length > 0) {
    server_list.pop();
  }
}

function binarySearch(arr, target, lo = 0, hi = arr.length - 1) {
   if (target < arr[lo]) {return arr[0]}
   if (target > arr[hi]) {return arr[hi]}
   
   const mid = Math.floor((hi + lo) / 2);

   return hi - lo < 2 
     ? (target - arr[lo]) < (arr[hi] - target) ? arr[lo] : arr[hi]
     : target < arr[mid]
       ? binarySearch(arr, target, lo, mid)
       : target > arr[mid] 
         ? binarySearch(arr, target, mid, hi)
         : arr[mid]
}

function getMinHash() {
  return min;
}

function getMaxHash() {
  return max;
}

export { addServer, addToCache, resetRing, getServers, getMinHash, getMaxHash }