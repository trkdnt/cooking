import test from 'node:test';
import assert from 'node:assert/strict';
import {recipes} from '../data/recipes.js';
import {ingredientMap,findIngredients,matchRecipe,selectRecipes,readSaved,saveState,extractOnlineText,validCachedSource,wikiURL} from '../core.js';
const filters={favorites:false,minutes:0,diet:'all',complete:false,sort:'match'};
test('Minden recept teljes, egyedi és csak ismert alapanyagot kér',()=>{
 assert.equal(new Set(recipes.map(r=>r.id)).size,recipes.length);
 for(const r of recipes){assert(r.steps.length>=3);assert(r.ingredients.length>=5);assert(r.page);assert(r.minutes>0);for(const i of r.ingredients)assert(ingredientMap.has(i.id),i.id);assert.equal(new Set(r.ingredients.map(i=>i.id)).size,r.ingredients.length);}
});
test('Az egyezés minden hozzávalót számol, rejtett kamra-alapok nélkül',()=>{
 const r=recipes.find(r=>r.id==='gombapaprikas');
 assert.equal(matchRecipe(r,new Set()).percent,0);
 const all=new Set(r.ingredients.map(i=>i.id));assert.equal(matchRecipe(r,all).percent,100);
 all.delete('so');assert.equal(matchRecipe(r,all).percent,88);assert.deepEqual(matchRecipe(r,all).missing,['so']);
});
test('A rendezés, az idő, az étrend és a kedvencek együtt szűrnek',()=>{
 const ids=new Set(recipes.flatMap(r=>r.ingredients.map(i=>i.id)));
 const selected=selectRecipes(recipes,ids,{...filters,minutes:30,diet:'vegetarian',favorites:true,complete:true},new Set(['gombapaprikas','rakott-krumpli']));
 assert.deepEqual(selected.map(r=>r.id),['gombapaprikas']);
 assert.equal(selectRecipes(recipes,new Set(),{...filters,complete:true},new Set()).length,0);
 assert(selectRecipes(recipes,new Set(),{...filters,diet:'vegan'},new Set()).every(r=>r.vegan));
});
test('Az ékezet nélküli keresés és a gyakori alapanyag-nevek működnek',()=>{
 assert(findIngredients('krumpli').some(i=>i.id==='krumpli'));
 assert(findIngredients('tejfol').some(i=>i.id==='tejfol'));
 assert(findIngredients('hagyma').some(i=>i.id==='hagyma'));
 assert.equal(findIngredients('nincsilyen').length,0);
});
test('A hibás, régi és tiltott tárhely nem akadályozza az indulást',()=>{
 const known=new Set(recipes.map(r=>r.id));
 const storage={getItem:()=>JSON.stringify({pantry:['so','unknown'],favorites:['gombapaprikas','unknown']})};
 assert.deepEqual([...readSaved(storage,known).pantry],['so']);
 assert.deepEqual([...readSaved(storage,known).favorites],['gombapaprikas']);
 assert.equal(readSaved({getItem:()=>'{broken'},known).pantry.size,0);
 assert.equal(readSaved({getItem:()=>null},known).available,true);
 assert.equal(readSaved({getItem:()=> 'null'},known).pantry.size,0);
 assert.equal(readSaved(null,known).available,false);
 assert.equal(saveState({setItem(){throw Error('quota');}},new Set(),new Set()),false);
});
test('A mentési formátum visszaállítható',()=>{
 let saved;const storage={setItem:(key,value)=>saved=value,getItem:()=>saved};
 assert(saveState(storage,new Set(['so']),new Set(['gombapaprikas'])));
 assert.equal(readSaved(storage,new Set(['gombapaprikas'])).favorites.has('gombapaprikas'),true);
});
test('Az online parser eltávolítja a wikijelölést és elutasítja a hiányos választ',()=>{
 const raw="{{cím2|Cím}}\n'''Hozzávalók:'''\n* 50 dkg [[Gomba|gomba]]\n* 1 fej hagyma\n| valign=top |\n'''Elkészítés:'''\n:A hozzávalókat keverd össze és főzd meg fedő alatt, amíg teljesen megpuhulnak. Melegen tálald.\n|}";
 const text=extractOnlineText(raw);assert(text.includes('50 dkg gomba'));assert(!text.includes('valign'));assert(!text.includes("'''"));
 assert.throws(()=>extractOnlineText('Átirányítás'));assert.throws(()=>extractOnlineText('Hozzávalók: liszt'));
});
test('A gyorsítótár és a forráshivatkozás csak ellenőrzött formátumot fogad el',()=>{
 const cache={page:'Szakácskönyv/Recept',text:'A'.repeat(101),revid:123,fetched:new Date().toISOString()};
 assert(validCachedSource(cache,cache.page));assert(!validCachedSource({...cache,revid:'javascript:alert(1)'},cache.page));assert(!validCachedSource(cache,'Másik recept'));
 assert(wikiURL('Szakácskönyv/Recept').startsWith('https://hu.wikibooks.org/wiki/'));
});

test('A cukkinihez tartozik recept, és az olívaolaj csak egyirányúan helyettesít',()=>{
 assert(findIngredients('cukkini').some(i=>i.id==='cukkini'));
 const r=recipes.find(r=>r.id==='cukkinis-teszta');assert(r);
 const m=matchRecipe(r,new Set(['cukkini','olivaolaj']));
 assert.equal(m.have,2);assert(!m.missing.includes('olaj'));
 assert.equal(matchRecipe({ingredients:[{id:'olivaolaj'}]},new Set(['olaj'])).have,0);
});
