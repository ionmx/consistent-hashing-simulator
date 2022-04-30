var crc32=function(r){for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r.charCodeAt(t))];return(-1^n)>>>0};

const servers = new Map();
const real_servers = new Map();
var server_qty = 0

function hash_function(string) {
    return crc32(string) % 360;
}

function addServer(vnodes) {
    let server_name = 'S' + server_qty;
    let prev_sizes = new Map();
    console.log('[ + ] Add new server ' + server_name);
    server_qty += 1
    let hash = hash_function(server_name)
    real_servers.set(server_name,{keys_size: 0 });
    servers.set(hash, {server_name: server_name, keys_size: 0, keys: new Map() });
    let sn = '';
    for (let i = 0; i < vnodes; i++) {
      sn = server_name + ' Virtual ' + i;
      hash = hash_function(sn)
      servers.set(hash, {server_name: server_name, keys_size: 0, keys: new Map() });
    }

    // Get previous keys size
    real_servers.forEach( (s, key) => {
      prev_sizes.set(key, { keys_size: s.keys_size } );
    });

    servers.forEach( (s, key) => {
      s.keys.forEach( (v, k) => {
        let closest = getClosest(k);
        if (closest != key) {
          s.keys_size -= s.keys.get(k).length;

          // Update previous new real server size
          let prev_rs = real_servers.get(s.server_name);
          prev_rs.keys_size -= s.keys.get(k).length;

          let ns = servers.get(closest);
          ns.keys.set(k, v); 
          ns.keys_size += v.length;
          s.keys.delete(k);     

          // Update new real server size
          let new_rs = real_servers.get(ns.server_name);
          new_rs.keys_size += v.length;             
        }
      });
      
    });

    // Log changes
    real_servers.forEach( (s, key) => {
      let prev = prev_sizes.get(key);
      if (key != server_name && prev.keys_size != s.keys_size) {
        console.log('Move ' + (prev.keys_size - s.keys_size) + ' keys from ' + key + ' to ' + server_name)
      }
    });

    
}


function removeServer(server_name) {

  console.log('[ - ] Remove server ' + server_name);

  if (parseInt(real_servers.size) == 1) {
    return false;
  }
  let removed_server_keys = new Map();
  let ns, rs;


  // Get removed_server_keys
  servers.forEach( (value, key) => {
    if (value.server_name == server_name) {
      removed_server_keys.set(key,{ keys_size: value.keys_size, keys: value.keys} );  
    }
  });

  // Remove server and vnodes 
  removed_server_keys.forEach((v, k) => {
    servers.delete(k);
  });
  
  // Reassign keys
  removed_server_keys.forEach((v, k) => {
    ns = servers.get(getClosest(k));
    ns.keys_size += v.keys_size;
    ns.keys = v.keys;
    rs = real_servers.get(ns.server_name);
    rs.keys_size += v.keys_size;

    console.log('Move ' + v.keys_size + ' keys from ' + server_name + ' to ' + ns.server_name)
  });
  
  real_servers.delete(server_name);
  return true; 
}

function addData(str) {
  let hash = hash_function(str);
  let k = getClosest(hash)
  let server = servers.get(k);
  let rs = real_servers.get(server.server_name);

  server.keys_size += 1;
  rs.keys_size += 1
  
  if (server.keys.has(hash)) {
    let c = server.keys.get(hash);
    c.push(str);
  } else {
    server.keys.set(hash, [str]);
  }

  return [k, server.server_name, server.keys_size, rs.keys_size];
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

export { addServer, removeServer, addData, resetRing, getServers }