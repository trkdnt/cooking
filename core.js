import { ingredients } from './ingredients.js';
export { ingredients };
export const STORAGE_KEY='cooking:pantry:v2';
export const normalize=value=>String(value).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('hu').trim().replace(/\s+/g,' ');
export const emptyState=()=>({selected:[],custom:[],quantities:{},notes:''});
const aliases={krumpli:'burgonya',repa:'sargarepa',chili:'csilipaprika',csili:'csilipaprika'};
export function catalog(state){return [...ingredients,...state.custom];}
export function searchIngredients(items,query,group='all'){
 const n=normalize(query),alias=aliases[n]||n;
 return items.filter(i=>(group==='all'||i.group===group)&&(normalize(i.label).includes(n)||normalize(i.label).includes(alias)));
}
export function validateState(data){
 const state=emptyState();
 if(!data||typeof data!=='object')return state;
 const seen=new Set(ingredients.map(i=>normalize(i.label)));
 if(Array.isArray(data.custom))for(const item of data.custom.slice(0,300)){
  if(!item||typeof item.label!=='string')continue;
  const label=item.label.trim().slice(0,60),key=normalize(label);
  if(!label||seen.has(key))continue;
  seen.add(key);state.custom.push({id:'custom:'+key,label,group:'Saját alapanyagok',emoji:''});
 }
 const validIds=new Set(catalog(state).map(i=>i.id));
 state.selected=Array.isArray(data.selected)?[...new Set(data.selected.filter(id=>validIds.has(id)))]:[];
 for(const id of state.selected){const amount=data.quantities?.[id];if(typeof amount==='string')state.quantities[id]=amount.trim().slice(0,60);}
 if(typeof data.notes==='string')state.notes=data.notes.slice(0,1000);
 return state;
}
export function loadState(storage){
 try{
  const raw=storage.getItem(STORAGE_KEY);
  if(raw!==null){try{return {state:validateState(JSON.parse(raw)),available:true};}catch{return {state:emptyState(),available:true,corrupt:true};}}
  let legacy;try{legacy=JSON.parse(storage.getItem('cooking:v1')||'{}');}catch{legacy={};}
  return {state:validateState({selected:legacy?.pantry}),available:true};
 }catch{return {state:emptyState(),available:false};}
}
export function saveState(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}
export function addCustom(state,label){
 label=label.trim().replace(/\s+/g,' ').slice(0,60);
 if(!label)return null;
 let item=catalog(state).find(i=>normalize(i.label)===normalize(label));
 if(!item){if(state.custom.length>=300)return null;item={id:'custom:'+normalize(label),label,group:'Saját alapanyagok',emoji:''};state.custom.push(item);}
 if(!state.selected.includes(item.id))state.selected.push(item.id);
 return item;
}
export function selectedItems(state){
 const ids=new Set(state.selected);
 return catalog(state).filter(i=>ids.has(i.id)).sort((a,b)=>a.label.localeCompare(b.label,'hu'));
}
export function buildList(state){
 return selectedItems(state).map(i=>`- ${i.label}${state.quantities[i.id]?`: ${state.quantities[i.id]}`:''}`).join('\n');
}
export function buildPrompt(state){
 const list=buildList(state);
 if(!list)return '';
 return `Ezek az alapanyagok vannak most otthon nálam:\n\n${list}\n\nKeress az interneten és ajánlj 5 olyan ételt, amelyhez minél több otthoni alapanyagot felhasználhatok. Adj valódi receptforrásokat kattintható hivatkozással, becsült elkészítési időt és külön hiányzóhozzávaló-listát minden ötlethez. Ne feltételezd, hogy a fel nem sorolt alapanyagokból van otthon. Ahol nincs mennyiség, kérdezz rá, ha az a recepthez lényeges. Magyarul válaszolj.${state.notes.trim()?`\n\nTovábbi kéréseim: ${state.notes.trim()}`:''}`;
}
