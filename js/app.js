const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('spl').innerHTML=KNOWN.map(k=>`<option value="${k}">`).join('');
let S={title:'',pages:{},cur:'main',sel:null};
function tok(s){const o=[],a=Array.from(s);for(let i=0;i<a.length;){if(a[i]==='['){let d=0,j=i;for(;j<a.length;j++){if(a[j]==='[')d++;else if(a[j]===']'&&--d===0)break}if(j<a.length){o.push(a.slice(i,j+1).join(''));i=j+1;continue}}o.push(a[i]);i++}return o}
function kind(t){if(t.length>1&&t[0]==='['&&t.endsWith(']')){const m=t.slice(1,-1).match(/^(4D|1\+4):([\s\S]*)$/);if(m)return{k:'swipe',mode:m[1],slots:tok(m[2])};return{k:'sp',v:t.slice(1,-1)}}return{k:'ch',v:t}}
const build=(mode,sl)=>'['+mode+':'+(sl.join('').replace(/ +$/,'')||' ')+']';
const G=()=>S.pages[S.cur];
function load(o){S.title=o.title||'';S.pages={};for(const[n,rows]of Object.entries(o.onScreen||{}))if(Array.isArray(rows))S.pages[n]=rows.filter(r=>typeof r==='string').map(tok);if(!Object.keys(S.pages).length)S.pages.main=[[]];S.cur=Object.keys(S.pages)[0];S.sel=null}
function data(){const ids=PAGES.map(p=>p.id).filter(i=>S.pages[i]).concat(Object.keys(S.pages).filter(n=>!PAGES.some(p=>p.id===n)));const p={};ids.forEach(n=>p[n]=S.pages[n].map(r=>r.join('')));return{title:S.title||'DIY-untitled',onScreen:p}}
function upTok(t){const p=kind(t);if(p.k==='ch'){const u=t.toUpperCase();return Array.from(u).length===1?u:t}if(p.k==='swipe')return build(p.mode,p.slots.map(s=>kind(s).k==='ch'?upTok(s):s));return t}
function derive(def){const base=S.pages[def.base]||S.pages.main;return base.map(r=>r.map(t=>def.upper?upTok(t):t))}
function createPage(id){const def=PAGES.find(p=>p.id===id);S.pages[id]=def&&def.base?derive(def):[['a']];S.cur=id;S.sel=null;all();msg('Halaman '+(def?def.label:id)+' dibuat'+(def&&def.base?' dari '+def.base+'.':'.'))}

function lab(t){if(t===' ')return'␣';return t.length>1&&t[0]==='['?t.slice(1,-1):t}
function keyHTML(t){const p=kind(t);if(p.k==='swipe'){const pos=['c','l','t','r','b','tr','tl','bl','br'];return'<span class="sw">'+p.slots.map((s,i)=>`<i class="${pos[i]}">${esc(lab(s))}</i>`).join('')+'</span>'}return esc(lab(t))}
function renderTabs(){
 const tab=(id,l)=>`<button role="tab" aria-selected="${id===S.cur}" class="${id===S.cur?'on':''}" data-p="${esc(id)}">${esc(l)}</button>`;
 let h=PAGES.map(p=>S.pages[p.id]?tab(p.id,p.label):`<button class="ghost" data-new="${p.id}" title="Buat halaman ${p.label}">+ ${p.label}</button>`).join('');
 h+=Object.keys(S.pages).filter(n=>!PAGES.some(p=>p.id===n)).map(n=>tab(n,n)).join('');
 $('tabs').innerHTML=h;
 const d=PAGES.find(p=>p.id===S.cur),ok=d&&d.base&&S.pages[d.base]||d&&d.base&&S.pages.main;
 $('regen').hidden=!ok;if(ok)$('regen').textContent='Isi ulang dari '+(PAGES.find(p=>p.id===d.base)||{}).label+' (menimpa)'}

function renderKb(){$('kb').innerHTML=G().map((row,r)=>'<div class="row">'+row.map((t,c)=>{const sel=S.sel&&S.sel.r===r&&S.sel.c===c;return`<button class="key${kind(t).k==='sp'?' s':''}${sel?' on':''}" data-r="${r}" data-c="${c}" aria-label="Tombol ${esc(lab(t))}">${keyHTML(t)}</button>`}).join('')+`<button class="add" data-add="${r}" aria-label="Tambah tombol di baris ${r+1}">+</button></div>`).join('')}
function renderOut(){$('out').value=JSON.stringify(data(),null,2)}
function renderInsp(){const el=$('insp');if(!S.sel||!G()[S.sel.r]||G()[S.sel.r][S.sel.c]===undefined){S.sel=null;el.innerHTML='<h2>Tombol</h2><p class="hint">Pilih tombol di keyboard untuk mengubahnya, atau tekan + di ujung baris untuk menambah tombol.</p><p class="hint">Tombol swipe: tekan biasa memasukkan karakter tengah, geser ke arah lain memasukkan karakter di arah itu. Kotak kosong berarti arah tidak dipakai.</p>';return}
 const{r,c}=S.sel,t=G()[r][c],p=kind(t),ty=p.k==='swipe'?p.mode:p.k;
 let h=`<h2>Baris ${r+1}, tombol ${c+1}</h2><label>Jenis<select data-f="type">`+[['ch','Karakter'],['sp','Spesial, mis. [SHIFT]'],['4D','Swipe 4D (9 arah)'],['1+4','Swipe 1+4 (5 arah)']].map(([v,n])=>`<option value="${v}"${v===ty?' selected':''}>${n}</option>`).join('')+'</select></label>';
 if(p.k==='ch')h+=`<label>Karakter<input data-f="ch" value="${esc(p.v===' '?'':p.v)}"></label>`;
 else if(p.k==='sp')h+=`<label>Isi di dalam [ ]<input data-f="sp" list="spl" value="${esc(p.v)}"></label>`;
 else{const n=p.mode==='4D'?9:5,ord=[6,2,5,1,0,3,7,4,8],ar=['↖','↑','↗','←','●','→','↙','↓','↘'];
  h+='<div class="sg">'+ord.map((i,k)=>i<n?`<label>${ar[k]}<input data-f="slot" data-i="${i}" value="${esc(p.slots[i]&&p.slots[i]!==' '?p.slots[i]:'')}"></label>`:'<span></span>').join('')+'</div><p class="hint">Isi satu karakter, atau token seperti [DEL].</p>'}
 h+='<div class="acts"><button data-a="left">◀ Geser</button><button data-a="right">Geser ▶</button><button data-a="dup">Gandakan</button><button data-a="del">Hapus tombol</button></div><div class="acts"><button data-a="rowup">Baris ▲</button><button data-a="rowdown">Baris ▼</button><button data-a="rowdel">Hapus baris</button></div>';
 el.innerHTML=h}
function save(){try{localStorage.setItem('mlk-builder',JSON.stringify(data()))}catch(e){}}
function upd(){renderKb();renderOut();save()}
function all(){renderTabs();renderKb();renderInsp();renderOut();save()}
function msg(s){$('msg').textContent=s;setTimeout(()=>{if($('msg').textContent===s)$('msg').textContent=''},3500)}
$('kb').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.add!==undefined){const r=+b.dataset.add;G()[r].push('a');S.sel={r,c:G()[r].length-1}}else S.sel={r:+b.dataset.r,c:+b.dataset.c};all()};
$('tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.new)return createPage(b.dataset.new);S.cur=b.dataset.p;S.sel=null;all()};
$('regen').onclick=()=>{const d=PAGES.find(p=>p.id===S.cur);if(!d||!d.base)return;S.pages[S.cur]=derive(d);S.sel=null;all();msg('Halaman diisi ulang.')};

$('title').oninput=e=>{S.title=e.target.value;renderOut();save()};
$('addRow').onclick=()=>{G().push(['a']);S.sel={r:G().length-1,c:0};all()};
$('addPage').onclick=()=>{const n=$('newPage').value.trim();if(!n||/[^\w-]/.test(n))return msg('Nama halaman: huruf, angka, _ atau - saja.');if(S.pages[n])return msg('Halaman itu sudah ada.');S.pages[n]=[['a']];S.cur=n;S.sel=null;$('newPage').value='';all()};
$('delPage').onclick=()=>{if(Object.keys(S.pages).length<2)return msg('Minimal harus ada satu halaman.');delete S.pages[S.cur];S.cur=Object.keys(S.pages)[0];S.sel=null;all()};
$('loadPreset').onclick=()=>{load(PRESETS[$('preset').value]);$('title').value=S.title;all();msg('Contoh dimuat.')};
$('doImp').onclick=()=>{let t=$('imp').value.trim(),o;try{o=JSON.parse(t)}catch(e){try{o=JSON.parse(decodeURIComponent(t))}catch(e2){return msg('JSON tidak valid. Periksa tanda kutip dan koma.')}}if(!o||typeof o.onScreen!=='object')return msg('Tidak ada objek "onScreen" di JSON ini.');load(o);$('title').value=S.title;all();msg('Layout dimuat.')};
$('copy').onclick=async()=>{const o=$('out');try{await navigator.clipboard.writeText(o.value);msg('JSON tersalin.')}catch(e){o.select();msg('Teks dipilih. Salin manual dengan Ctrl+C atau tekan lama.')}};
$('out').onclick=e=>e.target.select();
function setType(v){const{r,c}=S.sel,t=G()[r][c],p=kind(t);let n;
 if(v==='ch')n=p.k==='ch'?t:'a';else if(v==='sp')n=p.k==='sp'?t:'[SPACE]';
 else{const sl=p.k==='swipe'?p.slots.slice(0,v==='4D'?9:5):[p.k==='ch'?t:' '];n=build(v,sl)}
 G()[r][c]=n;all()}
$('insp').addEventListener('change',e=>{if(e.target.dataset.f==='type')setType(e.target.value)});
$('insp').addEventListener('input',e=>{const f=e.target.dataset.f;if(!f||f==='type'||!S.sel)return;const{r,c}=S.sel,v=e.target.value,t=G()[r][c];
 if(f==='ch')G()[r][c]=tok(v)[0]||' ';
 else if(f==='sp')G()[r][c]='['+v+']';
 else{const p=kind(t),sl=p.slots.slice();while(sl.length<(p.mode==='4D'?9:5))sl.push(' ');sl[+e.target.dataset.i]=tok(v)[0]||' ';G()[r][c]=build(p.mode,sl)}
 upd()});
$('insp').addEventListener('click',e=>{const a=e.target.dataset.a;if(!a||!S.sel)return;const{r,c}=S.sel,g=G(),row=g[r];
 if(a==='left'&&c>0){[row[c-1],row[c]]=[row[c],row[c-1]];S.sel.c--}
 else if(a==='right'&&c<row.length-1){[row[c+1],row[c]]=[row[c],row[c+1]];S.sel.c++}
 else if(a==='dup')row.splice(c+1,0,row[c]);
 else if(a==='del'){row.splice(c,1);S.sel=null}
 else if(a==='rowup'&&r>0){[g[r-1],g[r]]=[g[r],g[r-1]];S.sel.r--}
 else if(a==='rowdown'&&r<g.length-1){[g[r+1],g[r]]=[g[r],g[r+1]];S.sel.r++}
 else if(a==='rowdel'){g.splice(r,1);S.sel=null;if(!g.length)g.push([])}
 all()});
(function init(){let o=PRESETS.qwerty;try{const s=localStorage.getItem('mlk-builder');if(s)o=JSON.parse(s)}catch(e){}load(o);$('title').value=S.title;all()})();
