
const NodeCache = require( "node-cache" ); 
const myCache = new NodeCache();


function store(key,value,time){
   return myCache.set(key,value,time);
}
function get(key){
    return myCache.get(key);
}
function hasKey(key){
    return myCache.has(key);
}
module.exports={
    store,
    get,
    hasKey
}