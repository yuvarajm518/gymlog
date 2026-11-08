export const uid=()=>globalThis.crypto.randomUUID?.()||Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
export const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const clone=x=>JSON.parse(JSON.stringify(x));
export const toKg=(w,u)=>u==='lb'?w*0.45359237:w;
export const fromKg=(w,u)=>u==='lb'?w/0.45359237:w;
export const format=n=>Number(n.toFixed(2)).toLocaleString();
export const volume=s=>s.type==='gym'?s.exercises.reduce((sum,e)=>sum+e.sets.filter(x=>x.done).reduce((v,x)=>v+toKg(Number(x.weight),s.unit)*Number(x.reps),0),0):0;
export function newPlan(name){return {id:uid(),name,days:Array.from({length:7},(_,i)=>({id:uid(),name:`Day ${i+1}`,rest:false,exercises:[]}))};}
export const seedExercises=[['Barbell Bench Press','Chest','Barbell'],['Incline Dumbbell Press','Chest','Dumbbell'],['Chest Fly','Chest','Machine'],['Push-up','Chest','Bodyweight'],['Lat Pulldown','Back','Cable'],['Seated Cable Row','Back','Cable'],['Dumbbell Row','Back','Dumbbell'],['Deadlift','Back','Barbell'],['Overhead Press','Shoulders','Barbell'],['Lateral Raise','Shoulders','Dumbbell'],['Face Pull','Shoulders','Cable'],['Biceps Curl','Biceps','Dumbbell'],['Hammer Curl','Biceps','Dumbbell'],['Triceps Pushdown','Triceps','Cable'],['Overhead Triceps Extension','Triceps','Dumbbell'],['Back Squat','Legs','Barbell'],['Leg Press','Legs','Machine'],['Romanian Deadlift','Legs','Barbell'],['Leg Curl','Legs','Machine'],['Leg Extension','Legs','Machine'],['Calf Raise','Legs','Machine'],['Hip Thrust','Glutes','Barbell'],['Crunch','Abs','Bodyweight'],['Hanging Knee Raise','Abs','Bodyweight']].map(([name,muscle,equipment],i)=>({id:`ex-${i}`,name,muscle,equipment}));
export function initialState(){return {version:1,settings:{unit:'kg',name:'',rest:90},library:clone(seedExercises),plans:[],sessions:[],active:null,timer:null};}
export function points(state,exerciseId,dayId,range,metric,unit,at=new Date()){
 const start=new Date(at.getFullYear(),at.getMonth(),at.getDate());
 if(range==='30')start.setDate(start.getDate()-29); else if(range!=='all'){const months=Number(range),day=start.getDate();start.setDate(1);start.setMonth(start.getMonth()-months);start.setDate(Math.min(day,new Date(start.getFullYear(),start.getMonth()+1,0).getDate()));}
 const cut=range==='all'?'0000-00-00':localDate(start);
 return state.sessions.filter(s=>s.type==='gym'&&s.date>=cut&&(!dayId||s.dayId===dayId)).sort((a,b)=>a.date.localeCompare(b.date)||a.started-b.started).flatMap(s=>{
 const sets=s.exercises.filter(e=>e.exerciseId===exerciseId).flatMap(e=>e.sets).filter(x=>x.done);
 if(!sets.length)return [];
 let value=0;
 if(metric==='volume')value=sets.reduce((v,x)=>v+fromKg(toKg(Number(x.weight),s.unit),unit)*Number(x.reps),0);
 else if(metric.startsWith('reps:')){const kg=Number(metric.slice(5)),matching=sets.filter(x=>Math.abs(toKg(Number(x.weight),s.unit)-kg)<0.0001);if(!matching.length)return [];value=Math.max(...matching.map(x=>Number(x.reps)));}
 else value=Math.max(...sets.map(x=>fromKg(toKg(Number(x.weight),s.unit),unit)));
 return [{id:s.id,date:s.date,value}];});
}
export function validState(s){
 const str=v=>typeof v==='string'&&v.length<2000, id=v=>str(v)&&/^[a-zA-Z0-9_-]{1,120}$/.test(v), num=(v,max=Number.MAX_SAFE_INTEGER)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max;
 const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
 const set=v=>v&&num(v.weight,10000)&&Number.isInteger(v.reps)&&num(v.reps,10000)&&typeof v.done==='boolean'&&(!v.done||v.reps>=1);
 const ex=v=>v&&id(v.exerciseId)&&str(v.name)&&str(v.notes)&&Array.isArray(v.sets)&&v.sets.length<=100&&v.sets.every(set);
 const sess=v=>v&&id(v.id)&&str(v.name)&&date(v.date)&&num(v.started)&&num(v.duration)&&str(v.notes)&&(['gym','cardio'].includes(v.type))&&(v.type==='gym'?['kg','lb'].includes(v.unit)&&id(v.dayId)&&id(v.planId)&&Array.isArray(v.exercises)&&v.exercises.length<=100&&v.exercises.every(ex):str(v.activity)&&num(v.minutes)&&['km','mi'].includes(v.distanceUnit)&&['distance','calories','speed','incline','resistance'].every(k=>v[k]===null||num(v[k])));
 if(!s||s.version!==1||!s.settings||!['kg','lb'].includes(s.settings.unit)||!str(s.settings.name)||!num(s.settings.rest,3600))return false;
 if(!Array.isArray(s.library)||s.library.length>5000||!s.library.every(e=>e&&id(e.id)&&str(e.name)&&str(e.muscle)&&str(e.equipment)))return false;
 if(!Array.isArray(s.plans)||s.plans.length>500||!s.plans.every(p=>p&&id(p.id)&&str(p.name)&&Array.isArray(p.days)&&p.days.length===7&&p.days.every(d=>d&&id(d.id)&&str(d.name)&&typeof d.rest==='boolean'&&Array.isArray(d.exercises)&&d.exercises.length<=100&&d.exercises.every(e=>e&&id(e.exerciseId)&&num(e.sets,100)&&e.sets>=1&&Number.isInteger(e.sets)&&num(e.reps,10000)&&Number.isInteger(e.reps)&&num(e.rest,3600)&&str(e.notes)))))return false;
 if(!Array.isArray(s.sessions)||s.sessions.length>50000||!s.sessions.every(sess)||s.active!==null&&!sess(s.active))return false;
 const ids=s.sessions.map(x=>x.id);if(new Set(ids).size!==ids.length)return false;
 return s.timer===null||s.timer&&num(s.timer.end)&&num(s.timer.remaining)&&typeof s.timer.paused==='boolean';
}
