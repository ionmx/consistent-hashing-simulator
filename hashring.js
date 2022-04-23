var crc32=function(r){for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r.charCodeAt(t))];return(-1^n)>>>0};
const alpha='ABCDEFGHIJKLMNOPQRSTUVXYZ'

const servers = new Map();
const real_servers = new Map();
var server_qty = 0
var max = 0
var min = Number.MAX_SAFE_INTEGER;

function hash_function(string) {
    return crc32(string) % 360;
}

function addServer(vnodes) {
    let server_name = alpha.charAt(server_qty)
    server_qty += 1
    let hash = hash_function(server_name)
    if (hash > max) {
      max = hash
    }
    if (hash < min) {
      min = hash
    }
    real_servers.set(server_name,{cache_size: 0 });
    servers.set(hash, {server_name: server_name, cache_size: 0, cache: new Map() });
    var sn = '';
    for (var i = 0; i < vnodes; i++) {
      sn = server_name + '.' + i;
      hash = hash_function(sn)
      if (hash > max) {
        max = hash
      }
      if (hash < min) {
        min = hash
      }
      servers.set(hash, {server_name: server_name, cache_size: 0, cache: new Map() });
    }
}

function removeServer(server_name) {
  let caches = new Map();
  let ns, rs;


  // Get caches
  servers.forEach( (value, key) => {
    if (value.server_name == server_name) {
      caches.set(key,value.cache_size);  
    }
  });

  // Remove server and vnodes 
  caches.forEach((v, k) => {
    servers.delete(k);
  });
  
  // Reassign cache
  caches.forEach((v, k) => {
    ns = servers.get(getClosest(k));
    ns.cache_size += v;
    rs = real_servers.get(ns.server_name)
    rs.cache_size += v;
  });
  

  real_servers.delete(server_name);
  
}

function addToCache(str) {
  let hash = hash_function(str);
  let k = getClosest(hash)
  let server = servers.get(k);
  let rs = real_servers.get(server.server_name);
  
  server.cache_size += 1;
  rs.cache_size += 1
  
  if (server.cache.has(hash)) {
    let c = server.cache.get(hash);
    c.push(str);
  } else {
    server.cache.set(hash, [str]);
  }

  return [k, server.server_name, server.cache_size, rs.cache_size];
}

function getClosest(hash) {
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
  real_servers.clear();
  server_qty = 0;
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

export { addServer, removeServer, addToCache, resetRing, getServers, getMinHash, getMaxHash }