export function parseRoute(hash){
 if(!hash||hash==='#/'||hash==='#')return{page:'home'};
 if(hash==='#/materials')return{page:'materials'};
 if(hash==='#/tools')return{page:'tools'};
 const m=hash.match(/^#\/day\/(\d+)$/);if(m&&+m[1]>=1&&+m[1]<=21)return{page:'lesson',day:+m[1]};
 return{page:'not-found'};
}
