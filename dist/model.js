'use strict';
const DOMAINS=[['Cheveux','hair','HAI-01','waves'],['Colorimétrie','palette','COL-01','portrait'],['Maquillage','brush','MAQ-01','bun'],['Peau','leaf','PEA-01','portrait'],['Garde-robe','dress','GAR-01','wardrobe']];
const CATALOG=[
 {id:'waves',name:'Ondulations naturelles',domain:'Cheveux',type:'Look',image:'waves',occasion:'Quotidien',desc:'Des mèches souples qui encadrent le visage et laissent vivre la texture.',why:'Une inspiration pour les personnes qui apprécient les coiffures souples.',steps:['Démêlez doucement les longueurs.','Dessinez votre raie habituelle.','Travaillez les mèches vers l’extérieur du visage.','Séparez les ondulations avec les doigts.']},
 {id:'bun',name:'Le chignon flou',domain:'Cheveux',type:'Look',image:'bun-small',occasion:'Événement',desc:'Un chignon aérien, quelques mèches libres et beaucoup de naturel.',why:'Une option pour dégager le visage avec un fini décontracté.',steps:['Rassemblez les cheveux sans les plaquer.','Enroulez les longueurs autour de la base.','Fixez avec quelques épingles.','Libérez deux mèches autour du visage.']},
 {id:'layers',name:'Dégradé tout en mouvement',domain:'Cheveux',type:'Look',image:'layers',occasion:'Quotidien',desc:'Des longueurs légères et un mouvement souple.',why:'Une référence à montrer à votre coiffeur pour parler du résultat souhaité.',steps:['Observez la longueur et le mouvement de la référence.','Notez votre temps d’entretien souhaité.','Discutez des possibilités avec votre coiffeur.']},
 {id:'glam',name:'Éclat naturel',domain:'Maquillage',type:'Look',image:'bun',occasion:'Quotidien',desc:'Des tons chauds, une bouche satinée et un regard doucement souligné.',why:'Une inspiration pour un maquillage discret et lumineux.',steps:['Préparez votre matériel.','Travaillez le teint par touches légères.','Choisissez des nuances douces pour les yeux.','Terminez par la couleur de lèvres souhaitée.'],products:['foundation','lips','eyes']},
 {id:'evening-look',name:'Lumières du soir',domain:'Maquillage',type:'Look',image:'date',occasion:'Rendez-vous',desc:'Un regard bronze et des lèvres aux tons chauds.',why:'Une variante plus définie pour une soirée.',steps:['Choisissez votre nuance principale.','Travaillez progressivement l’intensité.','Équilibrez le regard et les lèvres.']},
 {id:'everyday',name:'Le quotidien, naturellement',domain:'Garde-robe',type:'Look',image:'wardrobe',occasion:'Quotidien',desc:'Une silhouette simple, des matières douces et des teintes faciles à associer.',why:'Une proposition pour les journées où confort et simplicité comptent.',steps:['Choisissez une pièce principale.','Associez une couleur neutre.','Ajoutez une texture douce.','Vérifiez que la tenue convient à votre journée.']},
 {id:'work',name:'L’élégance au travail',domain:'Garde-robe',type:'Look',image:'work',occasion:'Travail',desc:'Des lignes nettes et une veste structurée.',why:'Une inspiration pour un contexte professionnel.',steps:['Choisissez votre veste.','Gardez une base de couleur sobre.','Ajustez les accessoires à votre contexte.']},
 {id:'date',name:'Un soir à deux',domain:'Garde-robe',type:'Look',image:'date',occasion:'Rendez-vous',desc:'Des couleurs profondes et une silhouette fluide.',why:'Une option pour une occasion habillée.',steps:['Choisissez une tenue confortable.','Essayez une association de tons chauds.','Préparez les accessoires.']},
 {id:'wedding',name:'Invitée de mariage',domain:'Garde-robe',type:'Look',image:'wedding',occasion:'Événement',desc:'Un satin rose profond et des détails dorés.',why:'Une référence à adapter au dress code de votre événement.',steps:['Relisez le dress code.','Choisissez la tenue et les accessoires.','Préparez votre coiffure et votre maquillage.']},
 {id:'palette',name:'Palette neutre chaude',domain:'Colorimétrie',type:'Palette',image:'portrait',occasion:'Toutes',desc:'Caramel, terre cuite, beige chaud et touches de pêche.',why:'Une palette d’exemple à explorer selon vos goûts.'},
 {id:'morning',name:'Mon rituel du matin',domain:'Peau',type:'Routine',image:'morning',occasion:'Quotidien',desc:'Un moment simple pour retrouver vos gestes habituels.'},
 {id:'evening',name:'Mon rituel du soir',domain:'Peau',type:'Routine',image:'evening',occasion:'Quotidien',desc:'Une pause pour clôturer la journée.'},
 {id:'foundation',name:'Fluide de teint lumineux',domain:'Maquillage',type:'Produit',image:'foundation',occasion:'Toutes',desc:'Fini léger et lumineux. Produit fictif pour explorer la fiche.',price:29,variants:['Beige chaud','Beige neutre','Caramel'],stock:true},
 {id:'lips',name:'Rouge à lèvres satiné',domain:'Maquillage',type:'Produit',image:'lips',occasion:'Toutes',desc:'Une teinte rose chaude au fini satiné. Référence fictive.',price:19,variants:['Rose chaud','Pêche','Terre cuite'],stock:true},
 {id:'eyes',name:'Palette de tons chauds',domain:'Maquillage',type:'Produit',image:'eyes',occasion:'Toutes',desc:'Une harmonie de bruns et de tons cuivrés. Référence fictive.',price:35,variants:['Cuivre doux','Bronze'],stock:true},
 {id:'article-colors',name:'Associer les couleurs simplement',domain:'Colorimétrie',type:'Conseil',image:'portrait',occasion:'Toutes',desc:'Une couleur principale, une base neutre et un détail qui vous plaît.'},
 {id:'tutorial-bun',name:'Réaliser un chignon flou',domain:'Cheveux',type:'Tutoriel',image:'bun-small',occasion:'Toutes',desc:'Un pas à pas pour explorer ce look.',source:'bun'}
];
const PALETTE=[['Caramel','#95603d'],['Terre cuite','#833d32'],['Beige chaud','#b17b56'],['Olive','#50472a'],['Pêche','#ef9172'],['Corail','#be5546'],['Crème','#f6e1c8'],['Taupe','#a48a7f'],['Moka','#644539'],['Chocolat','#38221c']];
const DATE=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const uid=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
function initial(){return {profile:{name:'',email:'',connected:false,avatar:''},prefs:{interests:[],style:'Sans préférence',time:'Sans préférence',budget:'',hair:'Je ne sais pas',makeup:'Sans préférence',avoid:''},analyses:[],draft:{domain:'Cheveux',photo:'',phase:'ANA-02',answers:{},consent:false,status:'draft'},saved:[],collections:[],routines:[{id:'morning',name:'Mon rituel du matin',domain:'Peau',moment:'Matin',frequency:'Chaque jour',steps:['Préparer mon matériel','Réaliser mes gestes habituels','Noter mon ressenti'],image:'morning',type:'Routine',version:1},{id:'evening',name:'Mon rituel du soir',domain:'Peau',moment:'Soir',frequency:'Chaque jour',steps:['Préparer mon espace','Réaliser mes gestes habituels','Prendre un moment pour moi'],image:'evening',type:'Routine',version:1}],active:[],sessions:[],actions:[],events:[],observations:[],goals:[],clothes:[],outfits:[],simulations:[],cart:[],orders:[],subscription:{status:'free',offer:'yearly'},checkout:{method:'standard',shipping:4.9,status:'draft'},reminders:{},messages:[],tickets:[],started:false,schedules:{},skippedOccurrences:[],dayNotes:{},context:{look:'waves',product:'foundation',routine:'morning',domain:'Cheveux',collection:'',event:'',goal:'',analysis:'',saved:'waves',returnTo:'ACC-01',selection:null},filters:{domain:'Tous',type:'Tous',occasion:'Toutes',q:''},scenario:'normal',tutorialStep:0,formDrafts:{}};}
const BEAUTIFY_STORAGE_KEY='beautify-mockup-v2';
function readBeautifyState(){
  const candidates=[];
  for(const kind of ['localStorage','sessionStorage']){
    try{const storage=kind==='localStorage'?localStorage:sessionStorage;const value=JSON.parse(storage.getItem(BEAUTIFY_STORAGE_KEY));if(value&&Array.isArray(value.routines)&&value.profile&&Array.isArray(value.analyses))candidates.push(value);}catch{}
  }
  return candidates.length?{...initial(),...candidates.sort((a,b)=>(b.savedAt||0)-(a.savedAt||0))[0]}:initial();
}
let M=readBeautifyState();
const memoryPhotos={};
function defaultFilters(){return {domain:'Tous',type:'Tous',occasion:'Toutes',q:'',time:'Tous',budget:'Tous'};}
function migrate(){
  M.formDrafts||={};M.context||=initial().context;M.schedules||={};M.skippedOccurrences||=[];M.dayNotes||={};
  M.filters={...defaultFilters(),...M.filters};M.started=!!(M.started||M.profile.name||M.saved.length||M.events.length||M.analyses.length);
  if(M.dayNote&&!Object.keys(M.dayNotes).length)M.dayNotes[M.day||DATE()]=M.dayNote;delete M.dayNote;
  M.routines.forEach(r=>{r.type='Routine';r.version||=1;});
  M.active=M.active.filter(id=>M.routines.some(r=>r.id===id));
  M.active.forEach(id=>M.schedules[id]||={start:M.actions.find(a=>a.ref===id)?.date||DATE(),days:[1,3,5]});
  M.sessions.filter(s=>s.kind==='routine').forEach(s=>{const r=M.routines.find(r=>r.id===s.ref);s.labels||=r?.steps.slice(0,s.steps.length)||s.steps.map((_,i)=>'Étape '+(i+1));s.version||=r?.version||1;});
  if(typeof routineContentMigration==='function')routineContentMigration();
  M.collections.forEach(c=>c.items.forEach(id=>{if(item(id)&&!M.saved.includes(id))M.saved.push(id);}));
}
function routineDue(r,date){const schedule=M.schedules?.[r.id];if(!schedule||date<schedule.start||M.skippedOccurrences?.includes(r.id+':'+date))return false;const weekday=new Date(date+'T12:00:00').getDay();return r.frequency==='Chaque jour'||(r.frequency==='3 fois par semaine'&&(schedule.days||[1,3,5]).includes(weekday))||(r.frequency==='Chaque semaine'&&weekday===new Date(schedule.start+'T12:00:00').getDay());}
function sessionComplete(s){return !!(s?.confirmed&&s.steps?.length&&s.steps.every(x=>x==='done'));}
function dailyActions(date=DATE()){
  const list=M.actions.filter(a=>a.date===date).map(a=>({...a}));
  M.routines.filter(r=>M.active.includes(r.id)&&routineDue(r,date)).forEach(r=>{if(!list.some(a=>a.kind==='routine'&&a.ref===r.id))list.push({id:'due:'+r.id+':'+date,name:r.name,date,kind:'routine',ref:r.id});});
  M.sessions.filter(s=>s.kind==='routine'&&s.date===date&&!list.some(a=>a.kind==='routine'&&a.ref===s.ref)).forEach(s=>list.push({id:'session:'+s.id,name:s.name||'Ma routine',date,kind:'routine',ref:s.ref,session:s.id}));
  return list.map(a=>a.kind==='routine'?{...a,done:sessionComplete(M.sessions.find(s=>s.kind==='routine'&&s.ref===a.ref&&s.date===date))}:a);
}
function findAction(id){const date=id.startsWith('due:')||id.startsWith('session:')?id.slice(-10):(M.actions.find(a=>a.id===id)?.date||M.day||DATE());return dailyActions(date).find(a=>a.id===id);}
migrate();
let storageWarningShown=false;
function persist(){
  M.savedAt=Date.now();const value=JSON.stringify(M);let durable=false,session=false;
  try{localStorage.setItem(BEAUTIFY_STORAGE_KEY,value);durable=true;}catch{}
  try{sessionStorage.setItem(BEAUTIFY_STORAGE_KEY,value);session=true;}catch{}
  if(!durable&&!storageWarningShown&&'localStorage' in globalThis){storageWarningShown=true;toast(session?'Sauvegarde limitée à cet onglet : le stockage de l’appareil est indisponible.':'Sauvegarde indisponible. Gardez cette page ouverte.');}
}
function item(id){return M.routines.find(x=>x.id===id)||CATALOG.find(x=>x.id===id&&x.type!=='Routine')||M.outfits.find(x=>x.id===id)||M.simulations.find(x=>x.id===id);}
function currentLook(){return item(M.context.look);}
function currentRoutine(){return M.routines.find(x=>x.id===M.context.routine);}
function currentEvent(){return M.events.find(x=>x.id===M.context.event);}
function report(){return M.context.analysis?M.analyses.find(x=>x.id===M.context.analysis):M.analyses.at(-1);}
function goal(){return M.goals.find(x=>x.id===M.context.goal);}
function money(v){return Number(v).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});}
function dateText(v){return v?new Date(v.slice(0,10)+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'Date à choisir';}
function totals(){const subtotal=M.cart.reduce((n,c)=>n+(item(c.id)?.price||0)*c.qty,0);return {subtotal,shipping:M.cart.length?Number(M.checkout.shipping):0,total:subtotal+(M.cart.length?Number(M.checkout.shipping):0)};}
function sample(){M=initial();M.started=true;M.profile={name:'Mia',email:'mia@example.test',connected:true,avatar:'bun'};M.prefs.interests=['Cheveux','Maquillage','Peau'];M.saved=['bun','glam','palette'];M.collections=[{id:'weekend',name:'Mes envies du week-end',desc:'Douceur et naturel',items:['bun','glam']}];M.active=['morning'];M.actions=[{id:'a1',name:'Mon rituel du matin',date:DATE(),done:false,kind:'routine',ref:'morning'},{id:'a2',name:'Réaliser un chignon flou',date:DATE(),done:true,kind:'look',ref:'bun'}];M.analyses=[{id:'sample-analysis',date:DATE(),domain:'Ensemble beauté & style',status:'complete',photo:'bun',source:'Exemple de démonstration',prefs:JSON.parse(JSON.stringify(M.prefs)),findings:['Ondulations naturelles','Palette neutre chaude','Maquillage discret']}];M.context.analysis='sample-analysis';M.events=[{id:'e1',name:'Mariage de Camille',date:new Date(Date.now()+14*86400000).toISOString().slice(0,10),occasion:'Événement',place:'Jardin des Ormes — lieu fictif',dresscode:'Élégant et naturel',notes:'Privilégier les matières fluides.',needs:['Cheveux','Maquillage','Garde-robe'],look:{Cheveux:'bun',Maquillage:'glam','Garde-robe':'wedding'},tasks:{}}];M.context.event='e1';M.observations=[{id:'o1',date:new Date(Date.now()-7*86400000).toISOString().slice(0,10),note:'J’ai pris le temps de préparer mon look.',feeling:'Bien',photo:'before'},{id:'o2',date:DATE(),note:'Cette routine est facile à suivre.',feeling:'Très bien',photo:'after'}];M.goals=[{id:'g1',name:'Prendre un moment pour moi',target:5,routine:'morning',status:'active',date:DATE(),criterion:'Réaliser ma routine',baseline:0}];M.context.goal='g1';M.clothes=[{id:'c1',name:'Veste noire',category:'Haut',color:'Noir',season:'Toutes',image:'work'},{id:'c2',name:'Robe satinée',category:'Robe',color:'Rose',season:'Été',image:'satin'}];M.messages=[{id:'m1',text:'Votre exemple d’analyse est disponible.',route:'ANA-10',objectKey:'analysis',objectId:'sample-analysis',read:false},{id:'m2',text:'Retrouvez votre prochaine préparation.',route:'EVE-03',objectKey:'event',objectId:'e1',read:false}];persist();}

CATALOG.push(
 {id:'coils',name:'Boucles libres',domain:'Cheveux',type:'Look',image:'boucles-libres',occasion:'Toutes',texture:['Bouclés','Crépus'],minutes:5,budget:'Sans achat',desc:'Votre volume naturel, une forme ronde et des boucles qui vivent.',why:'Une référence pour les textures bouclées et crépues, à adapter à vos gestes habituels.',steps:['Choisissez la forme que vous aimez dans la référence.','Mettez les boucles en place avec vos gestes habituels, sans tirer.','Ajustez le volume autour du visage.']},
 {id:'sleek',name:'Lisse et léger',domain:'Cheveux',type:'Look',image:'lisse-et-leger',occasion:'Travail',texture:['Raides'],minutes:5,budget:'Sans achat',desc:'Une ligne simple, les cheveux dégagés autour du visage.',why:'Une idée rapide pour des cheveux raides et une journée active.',steps:['Dessinez la raie qui vous plaît.','Placez les longueurs derrière les oreilles si vous le souhaitez.','Ajustez les mèches autour du visage.']},
 {id:'pixie',name:'Court, tout simplement',domain:'Cheveux',type:'Look',image:'court-tout-simplement',occasion:'Toutes',texture:['Raides','Ondulés'],minutes:5,budget:'Sans achat',desc:'Une coupe courte argentée, du mouvement et une allure naturelle.',why:'Une référence de coupe à montrer au salon, sans objectif de changement imposé.',steps:['Observez les longueurs et la forme de la référence.','Notez les détails que vous souhaitez conserver.','Parlez de l’entretien et de votre texture avec votre coiffeur.']},
 {id:'bare-face',name:'Naturellement vous',domain:'Maquillage',type:'Look',image:'lisse-et-leger',occasion:'Toutes',minutes:5,budget:'Sans achat',desc:'Une inspiration sans maquillage, avec une tenue et une coiffure qui vous plaisent.',why:'Parce que ne pas se maquiller est aussi un choix de style.',steps:['Choisissez une coiffure dans laquelle vous vous sentez bien.','Associez une pièce ou un accessoire que vous aimez.','Gardez simplement ce qui vous ressemble.']},
 {id:'soft-glam',name:'Un éclat cuivré',domain:'Maquillage',type:'Look',image:'eye',occasion:'Événement',minutes:15,budget:'Avec mes produits',desc:'Un regard cuivré, une intensité douce et des lèvres satinées.',why:'Une inspiration plus habillée pour une occasion, à réaliser avec vos teintes habituelles.',products:['eyes','lips'],steps:['Choisissez une nuance cuivrée qui vous plaît.','Travaillez progressivement l’intensité sur les yeux.','Terminez avec la couleur de lèvres souhaitée.']}
);
const CONTENT_META={waves:[10,'Sans achat',['Ondulés']],bun:[15,'Sans achat',['Ondulés','Bouclés']],layers:[5,'Référence de coupe',['Raides','Ondulés']],glam:[10,'Avec mes produits'], 'evening-look':[15,'Avec mes produits'],everyday:[5,'Sans achat'],work:[10,'Sans achat'],date:[15,'Sans achat'],wedding:[15,'Sans achat']};
Object.entries(CONTENT_META).forEach(([id,[minutes,budget,texture]])=>Object.assign(CATALOG.find(x=>x.id===id),{minutes,budget,texture}));

['layers','pixie'].forEach(id=>Object.assign(CATALOG.find(x=>x.id===id),{referenceOnly:true,budget:'Référence de coupe',minutes:5}));
const PRODUCT_DETAILS={
 foundation:{summary:'Un voile de couleur léger au rendu lumineux. Choisissez la profondeur et le sous-ton que vous souhaitez explorer.',details:'Fiche de démonstration : couvrance légère, fini lumineux. Une formule et une liste d’ingrédients réelles devront être documentées avant toute vente.',shades:[['#cc9c77','Clair à moyen, sous-ton chaud'],['#bea088','Clair à moyen, sous-ton neutre'],['#995b37','Moyen à foncé, sous-ton chaud']]},
 lips:{summary:'Une couleur satinée pour souligner les lèvres. Trois familles de teintes à comparer.',details:'Fiche fictive : fini satiné et intensité modulable. Le rendu dépend de la couleur naturelle des lèvres.',shades:[['#ba7378','Rose doux, nuance chaude'],['#d68c69','Pêche orangé, nuance chaude'],['#9d4f3e','Brun rouge, nuance profonde']]},
 eyes:{summary:'Une harmonie de bruns et de cuivres, pour une touche légère ou un regard plus défini.',details:'Référence fictive : associez une nuance de base et une touche lumineuse, avec vos gestes habituels.',shades:[['#b4754c','Cuivre lumineux, reflets chauds'],['#7c6040','Brun bronze, intensité plus soutenue']]}
};

const PALETTES={
 'palette':{mood:'Chaudes',colors:PALETTE},
 'palette-cool':{mood:'Fraîches',colors:[['Rose poudré','#ceadb9'],['Framboise','#974b68'],['Prune','#604258'],['Bleu brume','#9cabbf'],['Marine','#263852'],['Lilas','#b4a3be'],['Vert sauge','#9eaea2'],['Gris perle','#c3c3c9'],['Ivoire frais','#eee8e6'],['Anthracite','#373740']]},
 'palette-neutral':{mood:'Neutres',colors:[['Écru','#e8dfd0'],['Sable','#d0bfa7'],['Greige','#b4a79d'],['Taupe doux','#968880'],['Brun cacao','#644a3e'],['Noir doux','#242224'],['Denim','#5b7188'],['Kaki doux','#85836c'],['Blanc cassé','#f1eee8'],['Argile','#bba292']]}
};
CATALOG.push({id:'palette-cool',name:'Nuances fraîches',type:'Palette',domain:'Colorimétrie',image:'lisse-et-leger',occasion:'Toutes',desc:'Des roses, des bleus et des neutres doux à associer.'},{id:'palette-neutral',name:'Mes bases neutres',type:'Palette',domain:'Colorimétrie',image:'court-tout-simplement',occasion:'Toutes',desc:'Des bases simples pour associer les pièces que vous aimez.'});
