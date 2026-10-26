export const ingredients = [
 ['hagyma','Vöröshagyma','Zöldségek','🧅'],['fokhagyma','Fokhagyma','Zöldségek','🧄'],['krumpli','Burgonya','Zöldségek','🥔'],['paradicsom','Paradicsom','Zöldségek','🍅'],['paprika','Paprika','Zöldségek','🫑'],['gomba','Gomba','Zöldségek','🍄'],['zoldborso','Zöldborsó','Zöldségek','🫛'],['petrezselyem','Petrezselyem','Zöldségek','🌿'],
 ['tojas','Tojás','Tejtermékek és tojás','🥚'],['tej','Tej','Tejtermékek és tojás','🥛'],['tejfol','Tejföl','Tejtermékek és tojás','🥣'],
 ['kolbasz','Kolbász','Húsfélék','🥩'],['virsli','Virsli','Húsfélék','🌭'],['szalonna','Szalonna / szalonnabőr','Húsfélék','🥓'],['zsir','Sertészsír','Húsfélék',''],['huskocka','Füstölthús-ízesítésű kocka','Húsfélék',''],
 ['rizs','Gyorsrizs','Kamra és fűszerek','🍚'],['liszt','Búzaliszt','Kamra és fűszerek',''],['lencse','Lencse','Kamra és fűszerek',''],['olaj','Növényi olaj','Kamra és fűszerek',''],['so','Só','Kamra és fűszerek',''],['bors','Bors','Kamra és fűszerek',''],['pirospaprika','Pirospaprika','Kamra és fűszerek',''],['cukor','Cukor','Kamra és fűszerek',''],['baber','Babérlevél','Kamra és fűszerek',''],['mustar','Mustár','Kamra és fűszerek',''],['ecet','Ecet','Kamra és fűszerek',''],['gulyaskrem','Gulyáskrém','Kamra és fűszerek',''],['eteliz','Ételízesítő','Kamra és fűszerek',''],
 ['keszlecso','Kész, húsmentes lecsó','Kész ételek',''],['keszpalacsinta','Kész sós palacsinta','Kész ételek','']
].map(([id,label,group,emoji])=>({id,label,group,emoji}));
export const ingredientMap = new Map(ingredients.map(i=>[i.id,i]));
export const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('hu').trim();
const aliases = {krumpli:'burgonya', hagyma:'voroshagyma', liszt:'buzaliszt', rizs:'gyorsrizs'};
export function findIngredients(query) {
 const n=normalize(query), q=aliases[n]||n;
 return ingredients.filter(i=>normalize(i.label).includes(q)||normalize(i.label).includes(n));
}
export function matchRecipe(recipe, pantry) {
 const required=[...new Set(recipe.ingredients.map(i=>i.id))];
 const missing=required.filter(id=>!pantry.has(id));
 return {have:required.length-missing.length,total:required.length,missing,percent:Math.round((required.length-missing.length)/required.length*100)};
}
export function selectRecipes(recipes, pantry, filters, favorites) {
 return recipes.map(recipe=>({...recipe,match:matchRecipe(recipe,pantry)})).filter(r=>(!filters.favorites||favorites.has(r.id))&&(!filters.minutes||r.minutes<=filters.minutes)&&(filters.diet==='all'||r[filters.diet]===true)&&(!filters.complete||r.match.missing.length===0)).sort((a,b)=>filters.sort==='time'?a.minutes-b.minutes:filters.sort==='missing'?a.match.missing.length-b.match.missing.length||b.match.percent-a.match.percent:b.match.percent-a.match.percent||a.minutes-b.minutes);
}
export function readSaved(storage, knownRecipes) {
 try {
  const data=JSON.parse(storage.getItem('cooking:v1')||'{}');
  return {pantry:new Set(Array.isArray(data?.pantry)?data.pantry.filter(id=>ingredientMap.has(id)):[]),favorites:new Set(Array.isArray(data?.favorites)?data.favorites.filter(id=>knownRecipes.has(id)):[]),available:true};
 }catch{return {pantry:new Set(),favorites:new Set(),available:false};}
}
export function saveState(storage, pantry, favorites) {
 try { storage.setItem('cooking:v1',JSON.stringify({pantry:[...pantry],favorites:[...favorites]})); return true; } catch { return false; }
}
export function wikiURL(page) { return `https://hu.wikibooks.org/wiki/${encodeURIComponent(page.replaceAll(' ','_'))}`; }
export function cleanWiki(text) {
 return text.replace(/<!--[\s\S]*?-->/g,'').replace(/<noinclude>[\s\S]*?<\/noinclude>/gi,'').replace(/\[\[(?:Fájl|File|Kép|Kategória):[^\]]*\]\]/gi,'').replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'$2').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g,'$1').replace(/\{\{[^{}]*\}\}/g,'').replace(/<[^>]*>/g,'').replace(/'{2,}/g,'').replace(/^[:*#]+\s*/gm,'').replace(/^\s*[|!].*$/gm,'').replace(/__\w+__/g,'').replace(/\n{3,}/g,'\n\n').trim();
}
export function extractOnlineText(wikitext) {
 const start=wikitext.search(/hozzávalók/i);
 if(start<0) throw new Error('A forrás formátuma eltér a várttól.');
 const text=cleanWiki(wikitext.slice(start));
 if(text.length<100||text.length>30000||!/elkészít/i.test(text)) throw new Error('Nem található teljes receptleírás.');
 return text;
}
export function validCachedSource(value, page) {
 return value && value.page===page && Number.isSafeInteger(value.revid) && value.revid>0 && typeof value.text==='string' && value.text.length>=100 && value.text.length<=30000 && typeof value.fetched==='string' && Number.isFinite(Date.parse(value.fetched));
}
