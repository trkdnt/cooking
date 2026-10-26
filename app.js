import {recipes} from './data/recipes.js';
import {ingredients,ingredientMap,findIngredients,matchRecipe,selectRecipes,readSaved,saveState,wikiURL,extractOnlineText,validCachedSource} from './core.js';
const $=id=>document.getElementById(id);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let storage;
try {storage=window.localStorage;}catch {storage=null;}
let {pantry,favorites,available}=readSaved(storage,new Set(recipes.map(r=>r.id)));
let showFavorites=false, activeRecipe=null, lastFocused=null, sourceController=null, toastTimer;
const sourceCache=new Map();
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4200);}
function persist(){if(!saveState(storage,pantry,favorites)&&available){available=false;toast('A böngésző nem engedi a mentést. A választásaid most csak ezen a lapon maradnak meg.');}}
function ingredientButton(i,selected=false){return `<button class="chip ${selected?'selected':''}" data-ingredient="${i.id}" aria-pressed="${pantry.has(i.id)}">${i.emoji?`<span aria-hidden="true">${i.emoji}</span>`:''}${escape(i.label)}${selected?'<span aria-hidden="true">×</span>':''}</button>`;}
function renderPantry(){
 $('pantry-count').textContent=pantry.size;
 $('selected-area').hidden=pantry.size===0;
 $('selected-ingredients').innerHTML=[...pantry].map(id=>ingredientButton(ingredientMap.get(id),true)).join('');
 const matches=findIngredients($('ingredient-search').value);
 const groups=[...new Set(ingredients.map(i=>i.group))];
 $('ingredient-groups').innerHTML=groups.map(group=>{const items=matches.filter(i=>i.group===group);return items.length?`<section class="ingredient-group"><h3>${escape(group)}</h3><div class="chips">${items.map(i=>ingredientButton(i)).join('')}</div></section>`:'';}).join('')||'<p class="small muted">Ez az alapanyag még nincs az első receptgyűjteményben.</p>';
}
function filterState(){return {favorites:showFavorites,minutes:Number($('time-filter').value),diet:$('diet-filter').value,complete:$('complete-filter').checked,sort:$('sort').value};}
function favoriteButton(r,extra=''){return `<button class="heart ${extra} ${favorites.has(r.id)?'saved':''}" data-favorite="${r.id}" aria-pressed="${favorites.has(r.id)}" aria-label="${escape(r.title)} ${favorites.has(r.id)?'eltávolítása a kedvencekből':'mentése a kedvencek közé'}">${favorites.has(r.id)?'♥':'♡'}</button>`;}
function renderResults(){
 $('favorite-count').textContent=favorites.size;
 $('browse-tab').classList.toggle('active',!showFavorites);$('favorites-tab').classList.toggle('active',showFavorites);
 $('browse-tab').setAttribute('aria-pressed',!showFavorites);$('favorites-tab').setAttribute('aria-pressed',showFavorites);
 const list=selectRecipes(recipes,pantry,filterState(),favorites);
 $('recipes-title').textContent=showFavorites?'A te kedvenc fogásaid':pantry.size?'Ezekhez már közel vagy':'Egy kis inspiráció';
 $('results-summary').textContent=`${list.length} recept${pantry.size?` · ${pantry.size} kiválasztott alapanyag alapján`:' · Jelöld be, mid van otthon az egyezéshez.'}`;
 $('result-grid').innerHTML=list.map(r=>{
  const m=r.match,missing=m.missing.map(id=>ingredientMap.get(id).label);
  return `<article class="recipe-card"><div class="food-art ${r.color}"><span class="category-tag">${escape(r.category)}</span>${favoriteButton(r)}<span class="food-emoji" aria-hidden="true">${r.emoji}</span><span class="food-doodle" aria-hidden="true">✧</span></div><div class="card-body"><div class="card-meta"><span>◷ ~${r.minutes} perc</span>${r.vegan?'<span>✿ Vegán</span>':r.vegetarian?'<span>✿ Vegetáriánus</span>':'<span>Házi kedvenc</span>'}</div><h3><button class="recipe-title" data-recipe="${r.id}">${escape(r.title)}</button></h3><p class="card-description">${escape(r.description)}</p><div class="match-area">${pantry.size?`<div class="match-heading"><strong>${m.percent}% egyezés</strong><span>${m.have}/${m.total} megvan</span></div><meter min="0" max="100" value="${m.percent}" aria-label="Hozzávalók egyezése">${m.percent}%</meter><p class="missing-line ${missing.length?'':'complete'}">${missing.length?`Még kell: ${escape(missing.slice(0,3).join(', '))}${missing.length>3?` +${missing.length-3}`:''}`:'✓ Minden hozzávaló megvan'}</p>`:'<p class="unselected-note">Jelöld az alapanyagokat az egyezéshez</p>'}</div><button class="recipe-open" data-recipe="${r.id}">Megnézem a receptet <span aria-hidden="true">↗</span></button></div></article>`;
 }).join('');
 $('empty-state').hidden=list.length>0;
 $('empty-title').textContent=showFavorites&&favorites.size===0?'Még üres a receptfüzeted.':'Most nincs ilyen találat.';
 $('empty-description').textContent=showFavorites&&favorites.size===0?'A recepteken lévő szívre kattintva mentheted a kedvenceidet.':'Próbálj más szűrőket, vagy jelölj be több alapanyagot.';
 $('reset-filters').textContent=showFavorites&&favorites.size===0?'Mutasd a recepteket':'Szűrők törlése';
}
function refresh(){renderPantry();renderResults();}
function renderRecipe(id){
 const r=recipes.find(r=>r.id===id);if(!r)return;
 activeRecipe=r;const m=matchRecipe(r,pantry);
 $('recipe-content').innerHTML=`<div class="dialog-art food-art ${r.color}"><span class="food-emoji" aria-hidden="true">${r.emoji}</span><span class="category-tag">${escape(r.category)}</span></div><div class="dialog-body"><div class="dialog-title-row"><h2 id="dialog-title">${escape(r.title)}</h2>${favoriteButton(r,'dialog-heart')}</div><p class="muted">${escape(r.description)}</p><div class="recipe-facts"><span>◷ ~${r.minutes} perc</span><span>♧ ${escape(r.servings)} adag</span>${r.vegan?'<span>Vegán</span>':r.vegetarian?'<span>Vegetáriánus</span>':''}</div><div class="detail-columns"><section><h3>Hozzávalók <span class="muted small">${pantry.size?`${m.have}/${m.total} megvan`:''}</span></h3><p class="muted small">A mennyiségeket is ellenőrizd: az egyezés az alapanyagok meglétét méri.</p><ul class="detail-ingredients">${r.ingredients.map(i=>`<li class="${pantry.has(i.id)?'have':'need'}"><span aria-hidden="true">${pantry.has(i.id)?'✓':'○'}</span><span>${escape(i.label||ingredientMap.get(i.id).label)}<small>${escape(i.amount)}</small></span><button class="ingredient-toggle" data-detail-ingredient="${i.id}" aria-pressed="${pantry.has(i.id)}" aria-label="${escape(ingredientMap.get(i.id).label)} ${pantry.has(i.id)?'eltávolítása':'hozzáadása'} az otthoni alapanyagokhoz">${pantry.has(i.id)?'Megvan':'Van otthon +'}</button></li>`).join('')}</ul>${m.missing.length?'<button class="button secondary" id="copy-missing">Hiányzók másolása</button>':'<p class="complete">✓ Minden hozzávalót bejelöltél.</p>'}</section><section><h3>Így készítsd el</h3><ol class="steps">${r.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol></section></div><div class="recipe-note"><strong>A receptváltozatról</strong><p>${escape(r.note)}</p><p>Az idők becslések. A víz nincs beleszámítva az egyezésbe. Az egyezés a fenti, mentett hozzávalólistára vonatkozik.</p></div><section class="source-panel"><div class="section-kicker">ONLINE RECEPTFORRÁS</div><h3>Wikikönyvek · magyar szakácskönyv</h3><p class="small">Szerkesztett recept a Wikikönyvek közreműködőitől, <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.hu" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a> licenccel. A részletek és a változtatások fent szerepelnek.</p><div class="source-actions"><a class="text-button" href="${wikiURL(r.page)}" target="_blank" rel="noopener noreferrer">Eredeti recept ↗</a><a class="text-button" href="https://hu.wikibooks.org/w/index.php?title=${encodeURIComponent(r.page)}&action=history" target="_blank" rel="noopener noreferrer">Szerzők és laptörténet ↗</a><button class="button secondary small" id="load-online">Online leírás betöltése</button></div><p class="source-status small muted" id="source-status" role="status"></p><pre class="source-text" id="source-text" hidden></pre></section></div>`;
 if(sourceCache.has(id))showSource(sourceCache.get(id));
 $('load-online').addEventListener('click',()=>loadOnline(r));
 $('copy-missing')?.addEventListener('click',()=>copyMissing(r));
}
function openRecipe(id){lastFocused=document.activeElement;renderRecipe(id);$('recipe-dialog').showModal();$('recipe-dialog').scrollTop=0;}
function showSource(data){
 $('source-text').textContent=data.text;$('source-text').hidden=false;
 $('source-status').textContent=`Online változat · ${new Date(data.fetched).toLocaleString('hu-HU')} · ${data.revid}. verzió. Az online eredeti eltérhet a fent szerkesztett változattól; az egyezés továbbra is a fenti hozzávalólistára vonatkozik.`;
 $('load-online').textContent='Online leírás frissítése';
}
async function loadOnline(r){
 const button=$('load-online');button.disabled=true;button.textContent='Betöltés…';$('source-status').textContent='Az eredeti magyar recept lekérése a Wikikönyvekből…';
 sourceController?.abort();sourceController=new AbortController();const controller=sourceController;const timeout=setTimeout(()=>controller.abort(),12000);
 try {
  const url=new URL('https://hu.wikibooks.org/w/api.php');url.search=new URLSearchParams({action:'parse',page:r.page,prop:'wikitext|revid',format:'json',origin:'*'});
  const response=await fetch(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();if(data.error||!Number.isSafeInteger(data.parse?.revid))throw new Error('Érvénytelen forrás');
  const source={page:r.page,text:extractOnlineText(data.parse.wikitext['*']),revid:data.parse.revid,fetched:new Date().toISOString()};
  sourceCache.set(r.id,source);
  try{storage?.setItem('cooking:source:'+r.id,JSON.stringify(source));}catch{}
  if(activeRecipe?.id===r.id&&$('recipe-dialog').open)showSource(source);
 }catch(error){
  if(activeRecipe?.id!==r.id||!$('recipe-dialog').open)return;
  let cached=sourceCache.get(r.id);
  try{const saved=JSON.parse(storage?.getItem('cooking:source:'+r.id)||'null');if(validCachedSource(saved,r.page))cached=saved;}catch{}
  if(cached)showSource(cached);
  $('source-status').textContent=(cached?'A korábban letöltött online változatot mutatjuk. ':'')+'Az online forrás most nem érhető el (hálózati hiba, időtúllépés vagy forráskorlátozás). A fenti mentett recept használható, az eredeti a hivatkozáson is megnyitható.';
 }finally{clearTimeout(timeout);if(activeRecipe?.id===r.id&&$('recipe-dialog').open){button.disabled=false;button.textContent='Online leírás frissítése';}}
}
async function copyMissing(r){
 const ids=matchRecipe(r,pantry).missing;const text=`${r.title} – bevásárlólista\n`+r.ingredients.filter(i=>ids.includes(i.id)).map(i=>`${i.label||ingredientMap.get(i.id).label}: ${i.amount}`).join('\n');
 try{await navigator.clipboard.writeText(text);toast('A bevásárlólista a vágólapra került.');}catch{const area=document.createElement('textarea');area.value=text;area.setAttribute('aria-label','Másolható bevásárlólista');$('copy-missing').after(area);area.focus();area.select();toast('Jelöld ki és másold a megjelent bevásárlólistát.');}
}
document.addEventListener('click',event=>{
 const ingredient=event.target.closest('[data-ingredient]');if(ingredient){const id=ingredient.dataset.ingredient;pantry.has(id)?pantry.delete(id):pantry.add(id);persist();refresh();document.querySelector(`[data-ingredient="${id}"]`)?.focus();return;}
 const detail=event.target.closest('[data-detail-ingredient]');if(detail){const id=detail.dataset.detailIngredient;pantry.has(id)?pantry.delete(id):pantry.add(id);persist();refresh();renderRecipe(activeRecipe.id);document.querySelector(`[data-detail-ingredient="${id}"]`)?.focus();return;}
 const favorite=event.target.closest('[data-favorite]');if(favorite){const id=favorite.dataset.favorite;favorites.has(id)?favorites.delete(id):favorites.add(id);persist();renderResults();if($('recipe-dialog').open){renderRecipe(activeRecipe.id);document.querySelector('.dialog-heart')?.focus();}else{document.querySelector(`[data-favorite="${id}"]`)?.focus();}toast(favorites.has(id)?'Elmentve a kedvencek közé.':'Eltávolítva a kedvencek közül.');return;}
 const recipe=event.target.closest('[data-recipe]');if(recipe)openRecipe(recipe.dataset.recipe);
});
$('ingredient-search').addEventListener('input',renderPantry);
for(const id of ['sort','time-filter','diet-filter','complete-filter'])$(id).addEventListener('change',renderResults);
$('browse-tab').addEventListener('click',()=>{showFavorites=false;renderResults();});
$('favorites-tab').addEventListener('click',()=>{showFavorites=true;renderResults();$('recipes').scrollIntoView({behavior:'smooth',block:'start'});});
$('clear-pantry').addEventListener('click',()=>{pantry.clear();persist();refresh();});
$('add-basics').addEventListener('click',()=>{['so','bors','olaj'].forEach(id=>pantry.add(id));persist();refresh();});
$('reset-filters').addEventListener('click',()=>{if(showFavorites&&favorites.size===0)showFavorites=false;$('time-filter').value='0';$('diet-filter').value='all';$('complete-filter').checked=false;renderResults();});
$('close-dialog').addEventListener('click',()=>$('recipe-dialog').close());
$('recipe-dialog').addEventListener('close',()=>{sourceController?.abort();activeRecipe=null;if(lastFocused?.isConnected)lastFocused.focus();});
$('about-button').addEventListener('click',()=>{$('storage-status').textContent=available?'A mentés a böngésződ helyi tárhelyén működik.':'A böngésző helyi tárhelye nem érhető el; a választások az oldal bezárásakor elveszhetnek.';$('about-dialog').showModal();});
$('close-about').addEventListener('click',()=>$('about-dialog').close());
for(const dialog of [$('recipe-dialog'),$('about-dialog')])dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
$('clear-data').addEventListener('click',()=>{pantry.clear();favorites.clear();sourceCache.clear();let ok=true;try{storage?.removeItem('cooking:v1');recipes.forEach(r=>storage?.removeItem('cooking:source:'+r.id));}catch{ok=false;}refresh();$('storage-status').textContent=ok?'A mentett alapanyagokat, kedvenceket és online receptmásolatokat töröltük.':'A választásokat töröltük, de a böngésző nem engedte a mentett tárhely módosítását.';});
refresh();
if(!available)toast('A helyi mentés nem érhető el. Az alkalmazást továbbra is használhatod.');
