import {ingredients,catalog,searchIngredients,loadState,saveState,selectedItems,addCustom,buildList,buildPrompt} from './core.js';
const $=id=>document.getElementById(id);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let storage;try{storage=window.localStorage;}catch{storage=null;}
let loaded=loadState(storage),state=loaded.state,saved=loaded.available,toastTimer,undoState=null;
const groups=[...new Set(ingredients.map(i=>i.group))];
for(const group of [...groups,'Saját alapanyagok']){const option=document.createElement('option');option.value=group;option.textContent=group;$('category').append(option);}
function showToast(message,undo=false){clearTimeout(toastTimer);$('toast-message').textContent=message;$('undo').hidden=!undo;$('toast').hidden=false;toastTimer=setTimeout(()=>{$('toast').hidden=true;undoState=null;},undo?12000:4000);}
function save(){saved=saveState(storage,state);updateSaveStatus();}
function updateSaveStatus(){$('save-status').textContent=saved?'✓ Mentve ezen az eszközön':'A mentés nem érhető el';$('save-status').classList.toggle('warning',!saved);if(!saved)$('save-status').textContent='A böngésző nem engedi a mentést; másold ki a listád bezárás előtt.';}
function renderCatalog(){
 const all=catalog(state),found=searchIngredients(all,$('search').value,$('category').value),selected=new Set(state.selected);
 $('catalog-count').textContent=`${all.length} alapanyag`;
 $('result-count').textContent=$('search').value||$('category').value!=='all'?`${found.length} találat`:'';
 $('empty-search').hidden=found.length>0;
 $('groups').innerHTML=[...groups,'Saját alapanyagok'].map(group=>{const items=found.filter(i=>i.group===group);return items.length?`<section class="ingredient-group"><h3>${escape(group)}</h3><div class="chips">${items.map(i=>`<button class="chip ${selected.has(i.id)?'selected':''}" data-id="${escape(i.id)}" aria-pressed="${selected.has(i.id)}"><span class="chip-icon" aria-hidden="true">${selected.has(i.id)?'✓':i.emoji||'+'}</span>${escape(i.label)}</button>`).join('')}</div></section>`:'';}).join('');
}
function updateExport(){const empty=state.selected.length===0;$('copy-prompt').disabled=empty;$('copy-list').disabled=empty;$('prompt-preview').textContent=buildPrompt(state)||'Először válassz legalább egy alapanyagot.';}
function renderInventory(){
 const items=selectedItems(state);$('selected-count').textContent=items.length;$('empty-inventory').hidden=items.length>0;$('clear-list').hidden=items.length===0;
 $('inventory-list').innerHTML=items.map(i=>`<li><div><span aria-hidden="true">${i.emoji||'•'}</span><strong>${escape(i.label)}</strong></div><div><input type="text" maxlength="60" class="quantity" data-quantity="${escape(i.id)}" aria-label="${escape(i.label)} mennyisége" placeholder="Mennyiség (opcionális)" value="${escape(state.quantities[i.id]||'')}"><button class="remove" data-remove="${escape(i.id)}" aria-label="${escape(i.label)} eltávolítása" title="Elfogyott / eltávolítás">×</button></div></li>`).join('');
 updateExport();
}
function refresh(){renderCatalog();renderInventory();updateSaveStatus();}
function invalidateUndo(){if(undoState){undoState=null;$('undo').hidden=true;}}
function toggle(id){invalidateUndo();const selected=state.selected.includes(id);state.selected=selected?state.selected.filter(v=>v!==id):[...state.selected,id];if(selected)delete state.quantities[id];save();refresh();}
$('groups').addEventListener('click',event=>{const button=event.target.closest('[data-id]');if(!button)return;const id=button.dataset.id;toggle(id);[...$('groups').querySelectorAll('[data-id]')].find(b=>b.dataset.id===id)?.focus({preventScroll:true});});
$('inventory-list').addEventListener('click',event=>{const button=event.target.closest('[data-remove]');if(!button)return;toggle(button.dataset.remove);showToast('Kivéve az otthoni készletből.');});
$('inventory-list').addEventListener('input',event=>{const input=event.target.closest('[data-quantity]');if(!input)return;state.quantities[input.dataset.quantity]=input.value.slice(0,60);save();updateExport();});
$('search').addEventListener('input',renderCatalog);$('category').addEventListener('change',renderCatalog);
$('notes').value=state.notes;$('notes').addEventListener('input',()=>{invalidateUndo();state.notes=$('notes').value;save();updateExport();});
$('custom-form').addEventListener('submit',event=>{event.preventDefault();invalidateUndo();const item=addCustom(state,$('custom-name').value);if(!item){showToast('Adj meg egy alapanyagot. Legfeljebb 300 saját alapanyagot menthetsz.');return;}save();$('custom-name').value='';$('search').value='';$('category').value='all';refresh();showToast(`${item.label} hozzáadva az otthoni készlethez.`);});
$('clear-list').addEventListener('click',()=>{undoState=structuredClone(state);state.selected=[];state.quantities={};save();refresh();showToast('A készletlistát kiürítettük.',true);});
$('undo').addEventListener('click',()=>{if(!undoState)return;state=undoState;undoState=null;$('notes').value=state.notes;save();refresh();showToast('A készletlistát visszaállítottuk.');});
async function copy(kind){const text=kind==='prompt'?buildPrompt(state):buildList(state);if(!text)return;try{await navigator.clipboard.writeText(text);showToast(kind==='prompt'?'A receptkérés kimásolva. Illeszd be a beszélgetésbe.':'Az alapanyaglista kimásolva.');}catch{$('manual-copy').value=text;$('copy-dialog').showModal();$('manual-copy').focus();$('manual-copy').select();}}
$('copy-prompt').addEventListener('click',()=>copy('prompt'));$('copy-list').addEventListener('click',()=>copy('list'));
$('close-copy').addEventListener('click',()=>$('copy-dialog').close());
refresh();
if(loaded.corrupt)showToast('A korábbi mentést nem sikerült beolvasni. Új listát kezdhetsz.');
// A régi receptajánló bejelölései az első betöltéskor átkerülnek az új listába.
if(saved)save();
