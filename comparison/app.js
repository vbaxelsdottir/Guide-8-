const names = { react: 'React', vue: 'Vue', angular: 'Angular' };
const $ = selector => document.querySelector(selector);
const data = await fetch('./data.json').then(response => {
  if (!response.ok) throw new Error('Could not load comparison data');
  return response.json();
});
let concept = data.concepts[0];
let framework = 'react';
const tools = { react: 'TypeScript · Vite · JSX · hooks', vue: 'TypeScript · Vite · Single-File Components', angular: 'TypeScript · Angular CLI · standalone components' };
for (const m of data.metrics) {
  const card = document.createElement('article');
  const heading = document.createElement('h3'); heading.textContent = names[m.id];
  const version = document.createElement('span'); version.textContent = `v${m.version}`; heading.append(version);
  const description = document.createElement('p'); description.textContent = tools[m.id];
  card.append(heading,description); $('#overview').append(card);
}
for (const c of data.concepts) {
  const option = document.createElement('option'); option.value = c.id; option.textContent = c.title; $('#concept-select').append(option);
  const button = document.createElement('button'); button.type = 'button'; button.textContent = c.title; button.dataset.concept = c.id;
  button.addEventListener('click',()=>selectConcept(c.id)); $('#concept-buttons').append(button);
}
function selectConcept(id) {
  concept = data.concepts.find(c=>c.id===id); $('#concept-select').value=id; renderCode();
}
function renderCode() {
  const example = concept.examples[framework];
  document.querySelectorAll('[data-concept]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.concept===concept.id)));
  document.querySelectorAll('[data-framework]').forEach(button=>{
    const active=button.dataset.framework===framework; button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
  });
  $('#code-panel').setAttribute('aria-labelledby',`tab-${framework}`);
  $('#concept-title').textContent=concept.title; $('#concept-summary').textContent=concept.summary;
  $('#example-position').textContent=`${data.concepts.indexOf(concept)+1} / ${data.concepts.length}`;
  $('#source-file').textContent=`${example.file} · lines ${example.start}–${example.end}`;
  $('#source-code').textContent=example.code; $('#code-explanation').textContent=example.explanation;
  $('#copy-status').textContent='';
}
$('#concept-select').addEventListener('change',event=>selectConcept(event.target.value));
const tabs=[...document.querySelectorAll('[data-framework]')];
tabs.forEach((button,index)=>{
  button.addEventListener('click',()=>{framework=button.dataset.framework;renderCode();});
  button.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight') next=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft') next=(index+tabs.length-1)%tabs.length;
    else if(event.key==='Home') next=0;
    else if(event.key==='End') next=tabs.length-1;
    else return;
    event.preventDefault();tabs[next].click();tabs[next].focus();
  });
});
$('#copy-code').addEventListener('click',async()=>{
  try {await navigator.clipboard.writeText(concept.examples[framework].code);$('#copy-status').textContent='Code copied.';}
  catch {$('#copy-status').textContent='Clipboard unavailable. Select and copy the code directly.';}
});
document.querySelectorAll('[data-concept-link]').forEach(button=>button.addEventListener('click',()=>{
  selectConcept(button.dataset.conceptLink);$('#explorer').scrollIntoView();$('#tab-'+framework).focus({preventScroll:true});
}));
let openDay=null;let history=[];
const demoMovies=[{day:3,title:'The Polar Express'},{day:7,title:'Arthur Christmas'},{day:10,title:'Home Alone 2: Lost in New York'}];
for(const movie of demoMovies){
 const button=document.createElement('button');button.className='demo-door';button.dataset.day=movie.day;
 button.addEventListener('click',()=>{openDay=openDay===movie.day?null:movie.day;if(!history.includes(movie.day))history.push(movie.day);renderDemo();});
 $('#demo-doors').append(button);
}
function renderDemo(){
 for(const movie of demoMovies){
  const button=$(`[data-day="${movie.day}"]`);const open=openDay===movie.day;
  button.replaceChildren();button.setAttribute('aria-pressed',String(open));button.setAttribute('aria-label',`December ${movie.day}${open?`: ${movie.title}. Close door`:'. Open door'}`);
  const label=document.createElement('span');label.className='demo-label';label.textContent=`DECEMBER ${open?movie.day:''}`;
  const body=document.createElement('span');body.className=open?'demo-title':'day';body.textContent=open?movie.title:String(movie.day).padStart(2,'0');
  const status=document.createElement('span');status.className='demo-status';status.textContent=open?'Movie revealed':history.includes(movie.day)?'✓ Opened':'Open door';button.append(label,body,status);
 }
 $('#open-value').textContent=`openDay = ${openDay}`;$('#history-value').textContent=`openedDays = [${history.join(', ')}]`;
 $('#demo-message').textContent=openDay===null?'No door is open. History is separate from the visible card.':`Only day ${openDay} matches openDay. Every other door is closed.`;
}
$('#reset-demo').addEventListener('click',()=>{openDay=null;history=[];renderDemo();});
const oneDoor=data.concepts.find(c=>c.id==='one-door');
for(const f of Object.keys(names)){
 const card=document.createElement('article');const title=document.createElement('h3');title.textContent=names[f];
 const pre=document.createElement('pre');const code=document.createElement('code');
 code.textContent=oneDoor.examples[f].code.split('\n').find(line=>f==='react'?line.includes('setOpenDay'):f==='vue'?line.includes('openDay.value ='):line.includes('this.openDay.update')).trim();pre.append(code);
 const p=document.createElement('p');p.textContent={react:'setOpenDay is the React setter. The callback uses the previous state.',vue:'openDay.value is the Vue ref. Assign the next day directly.',angular:'.update() changes the Angular signal using its current value.'}[f];
 const source=document.createElement('p');source.className='source-note';source.textContent=oneDoor.examples[f].file;
 card.append(title,pre,p,source);$('#approach-cards').append(card);
}
const measures=[['Source files','files'],['Application source lines','lines'],['Component / template lines','componentLines'],['Direct runtime dependencies','dependencies'],['Direct development dependencies','devDependencies']];
for(const [title,key] of measures){const tr=document.createElement('tr');const th=document.createElement('th');th.scope='row';th.textContent=title;tr.append(th);for(const m of data.metrics){const td=document.createElement('td');td.textContent=m[key];tr.append(td);}$('#metrics-table').append(tr);}
function renderBars(){
 const key=$('#metric-select').value;const max=Math.max(...data.metrics.map(m=>m[key]));$('#metric-bars').replaceChildren();
 for(const m of data.metrics){const row=document.createElement('div');row.className='metric-row';const label=document.createElement('span');label.textContent=names[m.id];const track=document.createElement('div');track.className='bar-track';track.setAttribute('aria-hidden','true');const fill=document.createElement('div');fill.className='bar-fill';fill.style.width=`${m[key]/max*100}%`;track.append(fill);const value=document.createElement('strong');value.textContent=m[key];row.append(label,track,value);$('#metric-bars').append(row);}
}
$('#metric-select').addEventListener('change',renderBars);
for(const m of data.metrics){const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent=`${names[m.id]}: counted files`;const list=document.createElement('ul');for(const file of m.fileList){const li=document.createElement('li');li.textContent=file;list.append(li);}details.append(summary,list);$('#measured-files').append(details);}
renderCode();renderDemo();renderBars();
