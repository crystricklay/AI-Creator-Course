const KEY='ai-course-progress-v1';
const valid=n=>Number.isInteger(n)&&n>=1&&n<=21;
export function createProgress(storage){
 let completed=[],lastDay=null,persistent=!!storage;
 try{const raw=JSON.parse(storage?.getItem(KEY)||'null');if(raw&&typeof raw==='object'){completed=[...new Set(Array.isArray(raw.completed)?raw.completed.filter(valid):[])];lastDay=valid(raw.lastDay)?raw.lastDay:null;}}catch{persistent=false;}
 const save=()=>{try{if(!storage)throw Error();storage.setItem(KEY,JSON.stringify({completed,lastDay}));persistent=true;}catch{persistent=false;}};
 return {get:()=>({completed:[...completed],lastDay,persistent}),toggleDay(n){if(!valid(n))return;completed=completed.includes(n)?completed.filter(x=>x!==n):[...completed,n].sort((a,b)=>a-b);save();},visitDay(n){if(valid(n)){lastDay=n;save();}},reset(){completed=[];lastDay=null;save();}};
}
