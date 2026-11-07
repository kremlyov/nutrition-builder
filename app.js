'use strict';
// Values are approximate per 100 g edible portion (or 100 ml for beverages).
// Order: kcal, protein g, fat g, carbohydrates g, fiber g, A mcg RAE, C mg, D mcg,
// E mg, K mcg, B12 mcg, folate mcg DFE, calcium mg, magnesium mg, potassium mg,
// iron mg, zinc mg, iodine mcg, selenium mcg.
const keys=['kcal','protein','fat','carbs','fiber','A','C','D','E','K','B12','folate','calcium','magnesium','potassium','iron','zinc','iodine','selenium'];
const metrics=[
 ['kcal','Калории','ккал','macro',2100,2500],['protein','Белки','г','macro',140,55],['fat','Жиры','г','macro',70,80],['carbs','Углеводы','г','macro',220,330],['fiber','Клетчатка','г','macro',35,25],
 ['A','Витамин A','мкг RAE','vit',900,600],['C','Витамин C','мг','vit',90,45],['D','Витамин D','мкг','vit',15,15],['E','Витамин E','мг','vit',15,11],['K','Витамин K','мкг','vit',120,60],['B12','Витамин B12','мкг','vit',2.4,1.8],['folate','Фолат B9','мкг DFE','vit',400,300],
 ['calcium','Кальций','мг','min',1000,1300],['magnesium','Магний','мг','min',420,240],['potassium','Калий','мг','min',3400,4500],['iron','Железо','мг','min',8,8],['zinc','Цинк','мг','min',11,8],['iodine','Йод','мкг','min',150,120],['selenium','Селен','мкг','min',55,40]
];
// Unknown/unreliable micronutrients are null, NOT zero. Each food row is approximate, not a laboratory analysis.
const raw=[
['Гречка сухая','Крупы',[343,13.3,3.4,71.5,10,0,0,0,.6,7,0,30,18,231,460,2.2,2.4,null,8]],
['Овсяные хлопья сухие','Крупы',[379,13.2,6.5,67.7,10.1,0,0,0,.4,2,0,32,52,138,362,4.3,3.6,null,29]],
['Рис белый сухой','Крупы',[365,7.1,.7,80,1.3,0,0,0,.1,0,0,8,28,25,115,.8,1.1,null,15]],
['Рис бурый сухой','Крупы',[370,7.5,2.7,77.2,3.5,0,0,0,.7,2,0,20,23,143,223,1.5,2,null,23]],
['Макароны сухие','Крупы',[371,13,1.5,74.7,3.2,0,0,0,.1,0,0,18,21,53,223,1.3,1.4,null,26]],
['Макароны цельнозерновые сухие','Крупы',[348,13.9,2.9,72,10.7,0,0,0,.7,0,0,57,40,143,363,3.6,3.1,null,60]],
['Пшено сухое','Крупы',[378,11,4.2,72.9,8.5,0,0,0,.1,1,0,85,8,114,195,3,1.7,null,2.7]],
['Перловка сухая','Крупы',[352,9.9,1.2,77.7,15.6,0,0,0,0,2,0,23,29,79,280,2.5,2.1,null,38]],
['Чечевица варёная','Бобовые',[116,9,.4,20.1,7.9,0,1.5,0,.1,1.7,0,181,19,36,369,3.3,1.3,null,2.8]],
['Горох варёный','Бобовые',[118,8.3,.4,21.1,8.3,7,.4,0,.1,5,0,65,14,36,362,1.3,1,null,1.8]],
['Фасоль красная варёная','Бобовые',[127,8.7,.5,22.8,6.4,0,1.2,0,.1,8,0,130,28,45,403,2.9,1.1,null,1.2]],
['Нут варёный','Бобовые',[164,8.9,2.6,27.4,7.6,1,1.3,0,.4,4,0,172,49,48,291,2.9,1.5,null,3.7]],
['Брокколи сырая','Овощи',[34,2.8,.4,6.6,2.6,31,89,0,.8,102,0,63,47,21,316,.7,.4,null,2.5]],
['Капуста белокочанная','Овощи',[25,1.3,.1,5.8,2.5,5,36.6,0,.2,76,0,43,40,12,170,.5,.2,null,.3]],
['Цветная капуста','Овощи',[25,1.9,.3,5,2,0,48,0,.1,15,0,57,22,15,299,.4,.3,null,.6]],
['Морковь сырая','Овощи',[41,.9,.2,9.6,2.8,835,5.9,0,.7,13,0,19,33,12,320,.3,.2,null,.1]],
['Свёкла варёная','Овощи',[44,1.7,.2,10,2,2,3.6,0,0,.2,0,80,16,23,305,.8,.4,null,.7]],
['Шпинат сырой','Овощи',[23,2.9,.4,3.6,2.2,469,28,0,2,483,0,194,99,79,558,2.7,.5,null,1]],
['Перец красный сладкий сырой','Овощи',[31,1,.3,6,2.1,157,128,0,1.6,5,0,46,7,12,211,.4,.3,null,.1]],
['Помидоры','Овощи',[18,.9,.2,3.9,1.2,42,14,0,.5,8,0,15,10,11,237,.3,.2,null,0]],
['Огурцы с кожурой','Овощи',[15,.7,.1,3.6,.5,5,2.8,0,0,16,0,7,16,13,147,.3,.2,null,.3]],
['Тыква','Овощи',[26,1,.1,6.5,.5,426,9,0,1.1,1,0,16,21,12,340,.8,.3,null,.3]],
['Картофель отварной','Овощи',[87,1.9,.1,20.1,1.8,0,7.4,0,0,2,0,10,5,22,379,.3,.3,null,.3]],
['Петрушка свежая','Овощи',[36,3,.8,6.3,3.3,421,133,0,.8,1640,0,152,138,50,554,6.2,1.1,null,.1]],
['Малина','Фрукты и ягоды',[52,1.2,.7,11.9,6.5,2,26,0,.9,7.8,0,21,25,22,151,.7,.4,null,.2]],
['Ежевика','Фрукты и ягоды',[43,1.4,.5,9.6,5.3,11,21,0,1.2,20,0,25,29,20,162,.6,.5,null,.4]],
['Смородина чёрная','Фрукты и ягоды',[63,1.4,.4,15.4,4.3,12,181,0,1,11,0,8,55,24,322,1.5,.3,null,1]],
['Клубника','Фрукты и ягоды',[32,.7,.3,7.7,2,1,59,0,.3,2.2,0,24,16,13,153,.4,.1,null,.4]],
['Голубика','Фрукты и ягоды',[57,.7,.3,14.5,2.4,3,9.7,0,.6,19,0,6,6,6,77,.3,.2,null,.1]],
['Киви','Фрукты и ягоды',[61,1.1,.5,14.7,3,4,93,0,1.5,40,0,25,34,17,312,.3,.1,null,.2]],
['Яблоко с кожурой','Фрукты и ягоды',[52,.3,.2,13.8,2.4,3,4.6,0,.2,2.2,0,3,6,5,107,.1,0,null,0]],
['Груша с кожурой','Фрукты и ягоды',[57,.4,.1,15.2,3.1,1,4.3,0,.1,4.4,0,7,9,7,116,.2,.1,null,.1]],
['Банан','Фрукты и ягоды',[89,1.1,.3,22.8,2.6,3,8.7,0,.1,.5,0,20,5,27,358,.3,.2,null,1]],
['Апельсин','Фрукты и ягоды',[47,.9,.1,11.8,2.4,11,53,0,.2,0,0,30,40,10,181,.1,.1,null,.5]],
['Грецкие орехи','Орехи и семена',[654,15.2,65.2,13.7,6.7,1,1.3,0,.7,2.7,0,98,98,158,441,2.9,3.1,null,4.9]],
['Тыквенные семечки очищенные','Орехи и семена',[559,30.2,49,10.7,6,0,1.9,0,2.2,7.3,0,58,46,592,809,8.8,7.8,null,9.4]],
['Чиа сухие','Орехи и семена',[486,16.5,30.7,42.1,34.4,0,1.6,0,.5,0,0,49,631,335,407,7.7,4.6,null,55]],
['Лён молотый','Орехи и семена',[534,18.3,42.2,28.9,27.3,0,.6,0,.3,4.3,0,87,255,392,813,5.7,4.3,null,25]],
['Миндаль','Орехи и семена',[579,21.2,49.9,21.6,12.5,0,0,0,25.6,0,0,44,269,270,733,3.7,3.1,null,4.1]],
['Отруби пшеничные','Орехи и семена',[216,15.6,4.3,64.5,42.8,0,0,0,1.5,2,0,79,73,611,1182,10.6,7.3,null,77]],
['Куриная грудка готовая','Мясо и яйца',[165,31,3.6,0,0,6,0,.1,.3,.3,.3,4,15,29,256,1,1, null,27.6]],
['Индейка грудка готовая','Мясо и яйца',[135,29,1.6,0,0,0,0,.1,.1,0,.7,8,14,28,239,1,1.5,null,28]],
['Говядина нежирная готовая','Мясо и яйца',[217,29,10,0,0,0,0,.1,.2,1,2.5,9,12,23,318,2.6,6,null,27]],
['Куриные сердечки готовые','Мясо и яйца',[185,26,8,0,0,9,0,.1,.2,0,7.3,72,12,22,177,9.0,7.3,null,8]],
['Яйцо куриное целое','Мясо и яйца',[143,12.6,9.5,.7,0,160,0,2,1.1,.3,.9,47,56,12,138,1.8,1.3,20,30.7]],
['Фарш говяжий готовый','Мясо и яйца',[250,26,15,0,0,0,0,.1,.2,1,2.4,9,18,21,310,2.4,5.5,null,21]],
['Скумбрия готовая без соли','Рыба',[262,24,17.8,0,0,50,0,13.8,1.5,5,19,1,12,76,401,1.6,1.3,30,44]],
['Скумбрия холодного копчения','Рыба',[260,23,18,0,0,50,0,10,1,3,12,1,12,70,350,1.5,1.2,null,35]],
['Дорада готовая','Рыба',[128,24,3.5,0,0,20,0,2,.6,0,2,10,25,35,380,.8,.7,null,36]],
['Килька в томате','Рыба',[180,15,12,4,0,20,2,3,1,0,5,10,160,35,300,2,1,null,30]],
['Кефир 2,5%','Молочные',[53,3,2.5,4,0,20,0,.03,.1,0,.9,13,120,12,150,.1,.5,9,3]],
['Молоко 2,5%','Молочные',[52,3,2.5,4.7,0,20,0,.03,.1,.3,.5,5,120,11,150,0,.4,9,2]],
['Греческий йогурт натуральный 2%','Молочные',[73,10,2,4,0,12,0,.02,.1,0,.8,7,110,11,140,.1,.5,8,8]],
['Творог 5%','Молочные',[121,17,5,2,0,40,0,.02,.1,0,1,12,120,23,112,.3,.6,8,10]],
['Сыр твёрдый','Молочные',[350,25,27,2,0,230,0,.5,.8,2,1.4,18,700,28,100,.7,3.1,12,15]],
['Ряженка 2,5%','Молочные',[54,3,2.5,4.5,0,20,0,.02,.1,0,.5,6,120,13,150,.1,.4,8,3]],
['Оливковое масло','Масла',[884,0,100,0,0,0,0,0,14.4,60,0,0,1,0,1,.6,0,0,0]],
['Сливочное масло','Масла',[717,.9,81,0,0,684,0,1.5,2.3,7,0,3,24,2,24,0,.1,null,1]]
];
const foods=raw.map((r,i)=>({id:i,name:r[0],category:r[1],v:Object.fromEntries(keys.map((k,j)=>[k,r[2][j]??null]))}));
const initial={version:1,active:'base',variants:[{id:'base',name:'Базовая неделя',items:[]}]};
const storageKey='ration-builder-v1';let state;
try{const parsed=JSON.parse(localStorage.getItem(storageKey));state=valid(parsed)?parsed:structuredClone(initial)}catch{state=structuredClone(initial)}
function valid(x){return x&&x.version===1&&Array.isArray(x.variants)&&x.variants.length>0&&x.variants.length<100&&x.variants.every(v=>typeof v.id==='string'&&typeof v.name==='string'&&Array.isArray(v.items)&&v.items.length<500&&v.items.every(i=>Number.isInteger(i.foodId)&&i.foodId>=0&&i.foodId<foods.length&&[i.a,i.c,i.days].every(Number.isFinite)&&i.a>=0&&i.a<=5000&&i.c>=0&&i.c<=5000&&i.days>=0&&i.days<=7))&&x.variants.some(v=>v.id===x.active)}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state))}catch(e){alert('Не удалось сохранить в браузере. Экспортируй данные в JSON.')}}
const $=id=>document.getElementById(id);const active=()=>state.variants.find(v=>v.id===state.active);const fmt=(x,d=0)=>Number(x).toLocaleString('ru-RU',{maximumFractionDigits:d});
function renderVariants(){ $('variants').innerHTML=state.variants.map(v=>`<option value="${escapeHtml(v.id)}" ${v.id===state.active?'selected':''}>${escapeHtml(v.name)}</option>`).join('');$('delete').disabled=state.variants.length===1 }
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderResults(){const term=$('search').value.trim().toLocaleLowerCase('ru');const cat=$('category').value;const found=foods.filter(f=>(!cat||f.category===cat)&&(!term||f.name.toLocaleLowerCase('ru').includes(term))).slice(0,35);$('results').innerHTML=found.length?found.map(f=>`<div class="result"><div><b style="font-size:13px">${escapeHtml(f.name)}</b><small>${escapeHtml(f.category)} · ${fmt(f.v.kcal)} ккал / 100 г</small></div><button class="btn" data-add="${f.id}" aria-label="Добавить ${escapeHtml(f.name)}">+ Добавить</button></div>`).join(''):'<div class="empty">Ничего не найдено</div>'}
function renderSelected(){const items=active().items;$('itemCount').textContent=`(${items.length})`;$('selected').innerHTML=items.length?items.map((item,i)=>{const f=foods[item.foodId];return `<div class="rowitem"><div class="rowhead"><strong>${escapeHtml(f.name)}</strong><button class="remove" data-remove="${i}" aria-label="Удалить">×</button></div><div class="controls"><label>Взрослый, г<input class="field" type="number" min="0" max="5000" step="5" inputmode="decimal" data-i="${i}" data-k="a" value="${item.a}"></label><label>Ребёнок, г<input class="field" type="number" min="0" max="5000" step="5" inputmode="decimal" data-i="${i}" data-k="c" value="${item.c}"></label><label>Дней / 7<input class="field" type="number" min="0" max="7" step="1" inputmode="numeric" data-i="${i}" data-k="days" value="${item.days}"></label></div></div>`}).join(''):'<div class="empty">Пока нет продуктов. Добавь первый из каталога выше.</div>'}
function calculate(){const out=[{},{}];for(const k of keys){out[0][k]=0;out[1][k]=0}const coverage=[{},{}];for(const k of keys){coverage[0][k]=0;coverage[1][k]=0}for(const item of active().items){const f=foods[item.foodId];for(const [person,portion] of [[0,item.a],[1,item.c]]){const factor=portion/100*item.days/7;for(const k of keys){if(f.v[k]!==null){out[person][k]+=f.v[k]*factor;coverage[person][k]+=factor}}}}return {out,coverage}}
function metricRow(m,calc){const [k,name,unit,,adult,child]=m;const values=[adult,child];return `<div class="stat"><div class="stathead"><span>${name}</span><small>ориентиры: ${fmt(adult)} / ${fmt(child)} ${unit}</small></div>${[0,1].map(p=>{const val=calc.out[p][k];const percent=val/values[p]*100;const missing=calc.coverage[p][k]===0&&active().items.some(i=>(p===0?i.a:i.c)>0&&i.days>0);return `<div class="barline"><div class="bar"><div class="fill ${p?'child':'adult'}" style="width:${Math.min(100,Math.max(0,percent))}%"></div></div><div class="barvalue">${fmt(val,val<10?1:0)} / ${fmt(values[p])} ${unit}${missing?' *':''}</div></div>`}).join('')}</div>`}
function renderStats(){const calc=calculate();for(const [id,group] of [['macros','macro'],['vitamins','vit'],['minerals','min']])$(id).innerHTML=metrics.filter(m=>m[3]===group).map(m=>metricRow(m,calc)).join('');$('totals').innerHTML=[0,1].map((p)=>`<div class="totalbox"><span class="dot ${p?'child':'adult'}"></span><span style="font-size:12px">${p?'Ребёнок':'Взрослый'}</span><div><b>${fmt(calc.out[p].kcal)}</b> <span style="font-size:12px;color:#78877c">ккал/день</span></div><small>ориентир ${p?'2500':'2100'} ккал</small></div>`).join('')}
function render(){renderVariants();renderResults();renderSelected();renderStats()}
$('category').innerHTML='<option value="">Все категории</option>'+[...new Set(foods.map(f=>f.category))].map(c=>`<option>${escapeHtml(c)}</option>`).join('');
$('search').addEventListener('input',renderResults);$('category').addEventListener('change',renderResults);
$('results').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;active().items.push({foodId:+b.dataset.add,a:100,c:100,days:3});save();renderSelected();renderStats()});
$('selected').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;active().items.splice(+b.dataset.remove,1);save();renderSelected();renderStats()});
$('selected').addEventListener('change',e=>{const el=e.target;if(!el.matches('[data-k]'))return;const item=active().items[+el.dataset.i];if(!item)return;const key=el.dataset.k;let v=Number(el.value);if(!Number.isFinite(v))v=0;v=Math.max(0,Math.min(key==='days'?7:5000,v));if(key==='days')v=Math.round(v);item[key]=v;el.value=v;save();renderStats()});
$('variants').addEventListener('change',e=>{state.active=e.target.value;save();render()});
let dialogAction='new';function promptName(action){dialogAction=action;$('dialogTitle').textContent=action==='new'?'Новый вариант':action==='duplicate'?'Дублировать вариант':'Переименовать вариант';$('variantName').value=action==='rename'?active().name:action==='duplicate'?active().name+' — копия':'';$('nameDialog').showModal();$('variantName').focus()}
$('newVariant').onclick=()=>promptName('new');$('duplicate').onclick=()=>promptName('duplicate');$('rename').onclick=()=>promptName('rename');
$('nameForm').addEventListener('submit',e=>{if(e.submitter?.value!=='ok')return;const name=$('variantName').value.trim();if(!name){e.preventDefault();return}if(dialogAction==='rename'){active().name=name}else{const id='v'+Date.now()+'-'+Math.floor(Math.random()*100000);state.variants.push({id,name,items:dialogAction==='duplicate'?active().items.map(i=>({...i})):[]});state.active=id}save();render()});
$('delete').onclick=()=>{if(state.variants.length===1)return;if(!confirm(`Удалить вариант «${active().name}»?`))return;state.variants=state.variants.filter(v=>v.id!==state.active);state.active=state.variants[0].id;save();render()};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ration-plans.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
$('import').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2_000_000)throw Error('Файл слишком большой');const parsed=JSON.parse(await file.text());if(!valid(parsed))throw Error('Неверный формат данных');if(confirm('Заменить текущие варианты импортированными?')){state=parsed;save();render()}}catch(err){alert('Не удалось импортировать: '+err.message)}e.target.value=''});
render();
