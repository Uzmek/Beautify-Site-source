'use strict';

// Product account flow: the profile belongs to the experience; an account is
// only needed to back it up and retrieve it on another device.
const AUTH_PROVIDER_LABELS={apple:'Apple',google:'Google',facebook:'Facebook',email:'E-mail'};

function authProviderMark(provider){
  if(provider==='apple')return '<span class="ux-auth-provider-mark ux-auth-provider-mark--apple" aria-hidden="true">&#63743;</span>';
  if(provider==='google')return '<span class="ux-auth-provider-mark ux-auth-provider-mark--google" aria-hidden="true">G</span>';
  return '<span class="ux-auth-provider-mark ux-auth-provider-mark--facebook" aria-hidden="true">f</span>';
}
function authProviderButton(provider,intent){
  const label='Continuer avec '+AUTH_PROVIDER_LABELS[provider];
  return A(authProviderMark(provider)+`<span>${label}</span>`,'auth-provider',{provider,intent,label},`secondary ux-auth-provider ux-auth-provider--${provider}`);
}
function authProviderStack(intent){
  return `<div class="ux-auth-provider-stack" aria-label="Options de connexion">${['apple','google','facebook'].map(provider=>authProviderButton(provider,intent)).join('')}</div>`;
}
function authBenefits(){
  return `<div class="ux-auth-benefits"><div>${lgBubble('bars')}<span><strong>Retrouvez vos analyses</strong><small>Sur tous vos appareils.</small></span></div><div>${lgBubble('sparkles')}<span><strong>Conservez vos routines</strong><small>Vos favoris et vos progrès restent avec vous.</small></span></div><div>${lgBubble('shield')}<span><strong>Gardez le contrôle</strong><small>Exportez ou supprimez vos données à tout moment.</small></span></div></div>`;
}
function authDivider(label='ou'){return `<div class="ux-auth-divider"><span>${esc(label)}</span></div>`;}

function completeAccount({provider='email',email='',name=''}={}){
  const current=M.profileEdit||M.profile;
  M.profile={...M.profile,...current,connected:true,authProvider:provider};
  if(email)M.profile.email=email.trim();
  if(name)M.profile.name=name.trim();
  M.profileEdit=null;
  M.pendingProfile=null;
  const destination=M.accountReturn||'PRF-02';
  M.accountReturn=null;
  M.accountReturnState=null;
  if(typeof persist==='function')persist();
  go(destination,{replace:true});
  toast(provider==='email'?'Compte connecté.':'Connexion avec '+AUTH_PROVIDER_LABELS[provider]+' réussie.');
}

function profileSyncCard(){
  if(M.profile.connected){
    const provider=AUTH_PROVIDER_LABELS[M.profile.authProvider]||'E-mail';
    const detail=M.profile.email||'Connexion avec '+provider;
    return lgCard(`<div class="ux-sync-heading">${lgBubble('check')}<div><span class="eyebrow">Sauvegarde et synchronisation</span><h2>Données synchronisées</h2></div></div><div class="ux-sync-account"><span>${esc(detail)}</span><small>Compte ${esc(provider)}</small></div>${A('Se déconnecter','logout-request',{},'text-button ux-sync-signout')}`,'ux-account-sync-card is-connected');
  }
  return lgCard(`<div class="pi-sync-intro"><img class="pi-shield" src="/assets/profile-information/shield.png" width="1024" height="1024" alt="" aria-hidden="true"><div class="pi-sync-copy"><span class="eyebrow">Sauvegarde</span><h2>Retrouvez tout, partout.</h2><p class="ux-sync-copy">Analyses, essais et routines synchronisés sur tous vos appareils.</p></div></div><div class="ux-sync-actions">${B('Créer un compte','ENT-05','primary')}${B('J’ai déjà un compte','ENT-06','secondary')}</div>`,'ux-account-sync-card pi-card');
}

// PRF-01 keeps the supplied reference copy, explicitly confirmed by the user.
// The account and synchronization flow starts at PRF-02.

V['PRF-02']=()=>{
  const profile=M.profileEdit||M.profile;
  const photo=profile.avatar?`<div class="ux-profile-photo-row">${imageFor(profile.avatar,'avatar','Ma photo de profil')}<div>${A(icon('image')+' Changer','file-pick',{purpose:'profile'},'secondary ux-profile-photo-action')}${A('Retirer','avatar-remove-request',{},'text-button')}</div></div>`:
    A(icon('image')+' Ajouter une photo','file-pick',{purpose:'profile'},'secondary ux-profile-photo-action');
  const nameField=`<label class="field pi-name"><span class="pi-name-label">Nom d’usage <span class="pi-optional">Facultatif</span></span><input name="name" type="text" value="${esc(profile.name||'')}" maxlength="160" autocomplete="nickname" placeholder="Entrez votre nom"></label>`;
  return lgPage(`<header class="pi-heading"><h1 tabindex="-1">Mon compte</h1><p>Profil et sauvegarde.</p></header>`+
    lgCard(form('profile',nameField+photo,'Enregistrer'),'ux-profile-identity-card pi-card')+
    profileSyncCard(),'ux-profile-screen ux-profile-account-screen pi-page');
};

V['ENT-05']=()=>lgPage(lgTitle('Créer un compte','Sauvegardez votre espace beauté et retrouvez-le partout.')+
  authBenefits()+authProviderStack('register')+authDivider('ou')+
  B('Créer avec mon e-mail','ENT-07','primary ux-auth-email')+
  `<p class="ux-auth-switch">Vous avez déjà un compte ? ${B('Se connecter','ENT-06','text-button')}</p>`+
  A('Continuer sans compte','account-cancel',{},'text-button ux-auth-cancel'),'ux-account-flow ux-account-choice ux-secondary');

V['ENT-06']=()=>lgPage(lgTitle('Se connecter','Retrouvez vos analyses, essais et routines.')+
  authProviderStack('login')+authDivider('ou par e-mail')+
  form('login',field('email','Adresse e-mail',M.profile.email||'','email',true)+field('password','Mot de passe','','password',true),'Se connecter')+
  B('Mot de passe oublié ?','ENT-08','text-button ux-auth-forgot')+
  `<p class="ux-auth-switch">Pas encore de compte ? ${B('Créer un compte','ENT-05','text-button')}</p>`+
  A('Annuler','account-cancel',{},'text-button ux-auth-cancel'),'ux-account-flow ux-account-login ux-secondary');

V['ENT-07']=()=>lgPage(lgTitle('Créer mon compte','Quelques informations suffisent pour commencer.')+
  form('register',field('name','Prénom ou pseudo',M.profile.name||'','text',true)+field('email','Adresse e-mail','','email',true)+field('password','Mot de passe','','password',true)+check('terms','J’accepte les Conditions d’utilisation et la Politique de confidentialité.'),'Créer mon compte')+
  `<p class="ux-auth-switch">Vous avez déjà un compte ? ${B('Se connecter','ENT-06','text-button')}</p>`,'ux-account-flow ux-account-email ux-secondary');

V['ENT-08']=()=>lgPage(lgTitle('Mot de passe oublié','Recevez un lien pour retrouver votre compte.')+
  form('recover',field('email','Adresse e-mail',M.profile.email||'','email',true),'Envoyer le lien')+
  B('Retour à la connexion','ENT-06','secondary'),'ux-account-flow ux-account-recover ux-secondary');

Object.assign(ACTIONS,{
  'auth-provider':data=>{
    const provider=AUTH_PROVIDER_LABELS[data.provider]?data.provider:'email';
    completeAccount({provider});
  },
  'logout-request':()=>confirmAction('Se déconnecter ?','Vous pourrez vous reconnecter à tout moment pour retrouver vos données.','logout'),
  logout:()=>{M.profile.connected=false;delete M.profile.authProvider;M.profileEdit=null;closeModal();go('PRF-02',{replace:true});toast('Vous êtes déconnecté.');},
  'profile-account-details':()=>profileHelpSheet('Sauvegarde et synchronisation','<div class="ux-help-facts"><div><strong>Sans compte</strong><p>Vous pouvez modifier votre profil et utiliser Beautify librement.</p></div><div><strong>Avec un compte</strong><p>Vos analyses, essais, routines et favoris sont synchronisés sur vos appareils.</p></div><div><strong>Vos choix</strong><p>Vous pouvez exporter vos données, vous déconnecter ou supprimer votre compte à tout moment.</p></div></div>')
});

Object.assign(F,{
  register:data=>{
    if((data.password||'').length<8)return formError('Choisissez un mot de passe d’au moins 8 caractères.');
    if(!data.terms)return formError('Acceptez les Conditions d’utilisation et la Politique de confidentialité.');
    completeAccount({provider:'email',email:data.email,name:data.name});
  },
  login:data=>{
    if(!data.email||!data.password)return formError('Renseignez votre e-mail et votre mot de passe.');
    completeAccount({provider:'email',email:data.email});
  },
  recover:data=>{
    M.pendingProfile={...M.profile,email:data.email};
    modal('Consultez votre messagerie',P('Si un compte correspond à cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe.')+B('Retour à la connexion','ENT-06','secondary'));
  },
  profile:data=>{
    M.profile={...M.profile,...(M.profileEdit||{}),name:(data.name||'').trim()};
    M.profileEdit=null;
    go('PRF-02',{replace:true});
    toast('Profil mis à jour.');
  }
});

// Remove build/review vocabulary from every customer-facing view. Product and
// medical caveats remain; only internal prototype language is rewritten.
function productFacingCopy(value){
  let html=String(value??'');
  for(const className of ['mock-notice','lg-intro-demo','reveal-demo','hair-trial-demo','sc-demo','sc-picker-note','pv2-meta']){
    const pattern=new RegExp(`<([a-z][\\w-]*)(?=[^>]*\\bclass="[^"]*\\b${className}\\b[^"]*")[^>]*>[\\s\\S]*?<\\/\\1>`,'gi');
    html=html.replace(pattern,'');
  }
  return html
    .replace(/Démonstration uniquement\.[^<]*/gi,'')
    .replace(/Mode démo\s*:\s*résultats illustratifs\.\s*/gi,'')
    .replace(/Démo\s*:\s*résultats? illustratifs?\.?/gi,'Résultats indicatifs')
    .replace(/Démo\s*:\s*photo privée dans cet onglet/gi,'Photo utilisée pour cette analyse')
    .replace(/Votre photo reste uniquement dans cet onglet\.?/gi,'Votre photo est utilisée pour cette analyse.')
    .replace(/Votre photo reste dans cet onglet[^.<]*(?:\.|$)/gi,'Votre photo est utilisée pour cette analyse.')
    .replace(/Photo (?:conservée|privée) uniquement (?:en mémoire )?dans cet onglet\.?/gi,'Photo utilisée pour cette analyse.')
    .replace(/dans cet onglet/gi,'dans Beautify')
    .replace(/en mémoire de la page/gi,'dans Beautify')
    .replace(/disparaissent au rechargement\.?/gi,'peuvent être supprimées depuis Photos et données.')
    .replace(/Aucune synchronisation réelle\.?/gi,'Activez la synchronisation depuis Mon profil.')
    .replace(/Aperçu de démonstration/gi,'Aperçu personnalisé')
    .replace(/Exemple de démonstration/gi,'Exemple')
    .replace(/Correspondance indicative de démonstration/gi,'Correspondance indicative')
    .replace(/repères de démonstration/gi,'repères visuels')
    .replace(/résultat de démonstration/gi,'résultat indicatif')
    .replace(/prix de démonstration[^.<]*(?:\.|$)/gi,'')
    .replace(/aucun(?:e)? (?:compte|paiement|débit|message|achat|abonnement|notification|email|e-mail)[^.<]*(?:\.|$)/gi,'')
    .replace(/\s+[—–-]\s+(?:démo|démonstration|simulation)\b/gi,'')
    .replace(/\bmockup\b/gi,'application')
    .replace(/\bprototype\b/gi,'application')
    .replace(/\bmaquette\b/gi,'expérience')
    .replace(/\bdémonstration\b/gi,'présentation')
    .replace(/\bdémo\b/gi,'aperçu')
    .replace(/simulées/gi,'illustratives')
    .replace(/simulée/gi,'illustrative')
    .replace(/simulés/gi,'illustratifs')
    .replace(/simulé/gi,'illustratif')
    .replace(/\bfictives\b/gi,'indicatives')
    .replace(/\bfictive\b/gi,'indicative')
    .replace(/\bfictifs\b/gi,'indicatifs')
    .replace(/\bfictif\b/gi,'indicatif')
    .replace(/application interactif\b/gi,'application interactive')
    .replace(/>\s*\.<\//g,'></');
}

for(const id of Object.keys(V)){
  const productView=V[id];
  V[id]=()=>productFacingCopy(productView());
}
const PRODUCT_MODAL=modal;
modal=(title,body)=>PRODUCT_MODAL(productFacingCopy(title),productFacingCopy(body));
const PRODUCT_TOAST=toast;
toast=(message,action)=>PRODUCT_TOAST(productFacingCopy(message),action);
const PRODUCT_CONFIRM=confirmAction;
confirmAction=(title,body,action,options={})=>PRODUCT_CONFIRM(productFacingCopy(title),productFacingCopy(body),action,options);

for(const [id,title] of Object.entries({'ENT-05':'Créer un compte','ENT-06':'Se connecter','ENT-07':'Créer avec mon e-mail','ENT-08':'Mot de passe oublié','PRF-02':'Mon profil'})){
  const page=FLOW_INDEX.find(item=>item.id===id);if(page)page.title=title;
}
