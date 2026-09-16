const fs = require('node:fs');
const assert = require('node:assert/strict');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
const r = runtime();

r.run(`
  M.profile={...M.profile,name:'Mia',email:'',connected:false};M.profileEdit=null;
  go('PRF-01',{root:true});
  const root=V['PRF-01']();
  assert.match(root,/Mon profil/);assert.match(root,/Sans compte/);
  assert.ok(root.includes('<strong>Mon compte</strong>'));

  go('PRF-02');
  const profile=V['PRF-02']();
  assert.match(profile,/Mon compte/);assert.match(profile,/Profil et sauvegarde\./);
  assert.match(profile,/data-form="profile"/);
  assert.match(profile,/Sauvegarde/);
  assert.match(profile,/Créer un compte/);assert.match(profile,/J’ai déjà un compte/);
  assert.ok(profile.indexOf('Enregistrer')<profile.indexOf('Sauvegarde'));
  assert.doesNotMatch(profile,/Connexion facultative/);

  go('ENT-05');
  const create=V['ENT-05']();
  for(const provider of ['Apple','Google','Facebook'])assert.match(create,new RegExp('Continuer avec '+provider));
  assert.match(create,/Créer avec mon e-mail/);assert.match(create,/déjà un compte/);
  assert.doesNotMatch(create,/mockup|prototype|démo|démonstration|simulé|fictif/i);

  ACTIONS['auth-provider']({provider:'google',intent:'register'});
  assert.equal(M.profile.connected,true);assert.equal(M.profile.authProvider,'google');assert.equal(route,'PRF-02');
  assert.match(V['PRF-02'](),/Données synchronisées/);assert.match(V['PRF-02'](),/Compte Google/);
  ACTIONS.logout();assert.equal(M.profile.connected,false);assert.equal(route,'PRF-02');

  go('ENT-05');go('ENT-07');
  assert.match(V['ENT-07'](),/data-form="register"/);
  assert.match(V['ENT-07'](),/Conditions d’utilisation/);
  assert.equal(F.register({name:'Lina',email:'lina@example.com',password:'court',terms:true}),false);
  F.register({name:'Lina',email:'lina@example.com',password:'motdepasse',terms:true});
  assert.equal(M.profile.connected,true);assert.equal(M.profile.authProvider,'email');
  assert.equal(M.profile.email,'lina@example.com');assert.equal(M.profile.name,'Lina');

  M.profile.connected=false;go('PRF-02',{replace:true});go('ENT-06');
  const login=V['ENT-06']();
  assert.match(login,/Se connecter/);assert.match(login,/Mot de passe oublié/);
  assert.match(login,/Pas encore de compte/);assert.match(login,/Créer un compte/);
  assert.doesNotMatch(login,/mockup|prototype|démo|démonstration|simulé|fictif/i);

  const cleaned=productFacingCopy('<p>Prototype — démo de démonstration, contenu simulé et fictif.</p>');
  assert.doesNotMatch(cleaned,/mockup|prototype|démo|démonstration|simulé|fictif/i);

  sample();
  const banned=[];
  for(const [id,view] of Object.entries(V)){
    try{
      const text=view().replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ').replace(/\s+/g,' ');
      if(/mockup|prototype|maquette|démo|démonstration|simulé(?:e|es|s)?|fictif(?:s|ve|ves)?|aucune synchronisation réelle|dans cet onglet|en mémoire de la page/i.test(text))banned.push(id+': '+text.slice(0,120));
    }catch(error){}
  }
  assert.deepEqual(banned,[]);
`);

console.log('Account flow: profile/account separation, four sign-in paths, provider state, e-mail validation and product-facing copy passed.');
