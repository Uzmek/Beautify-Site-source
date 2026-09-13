// Exercise the real motion enhancement with DOM/animation API doubles.
// Complements the live browser review; does not claim to measure frame rate.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const motion = fs.readFileSync('dist/glass-motion.js', 'utf8');
const css = fs.readFileSync('dist/glass-motion.css', 'utf8');
const skinStudio = fs.readFileSync('dist/skin-studio.js', 'utf8');
assert.doesNotMatch(motion, /setTimeout|setInterval|requestAnimationFrame|cloneNode/,
  'Decorative motion must not delay actions, duplicate screens or run pointer loops');
assert.doesNotMatch(css, /:hover/, 'No hover movement');
assert.match(css, /prefers-reduced-motion:reduce/);
assert.doesNotMatch(motion + css, /motion-complete-ring/,
  'Completion feedback must stay inside the progress circle');
assert.doesNotMatch(motion, /function groups|previousSelections/,
  'Routes animate as one surface instead of cascading every card');
assert.match(css, /\.reveal-tiles\s*\{ animation:none;/, 'Only the route-aware controller owns reveal entrances');
assert.match(skinStudio, /data-motion-key="skin-progress-\$\{moment\}"/, 'Skin progress has a stable identity across renders');

async function scenario(reduced = false, supported = true) {
  let screen, lens, report, backdrop, sheet, selections = [], progresses = [], counters = [], toggles = [], next, closes = 0, renders = 0;
  const calls = [], listeners = new Map(), globals = new Map();
  const preference = { matches: reduced, addEventListener(type, fn) { this.changed = fn; } };
  const listen = (map, type, fn) => { if (!map.has(type)) map.set(type, []); map.get(type).push(fn); };
  const fire = (type, event = {}) => { for (const fn of listeners.get(type) || []) fn(event); };
  const make = (name, dataset = {}, attributes = {}) => {
    const classes = new Set();
    const el = { name, dataset, attributes, isConnected: true, children: [], hidden: false, tagName: 'DIV', className: '', textContent: '',
      querySelector: () => null, querySelectorAll: () => [], matches(selector) { return selector === '.ss-mini-progress' && this.className.includes('ss-mini-progress'); },
      getAttribute: attr => attr in attributes ? attributes[attr] : attr === 'aria-label' ? name : null,
      classList: { add: value => classes.add(value), remove: value => classes.delete(value) },
      append(...children) { this.children.push(...children); children.forEach(child => child.parentElement = this); },
      remove() { this.isConnected = false; },
      closest: selector => selector === '[inert]' ? null : selector === '#phone-surface' ? phone : el };
    if (supported) el.animate = (frames, options) => {
      let resolve, reject;
      const a = { frames, options, effect: { target: el }, finished: new Promise((yes, no) => { resolve = yes; reject = no; }),
        finish() { a.completed = true; resolve(); }, cancel() { a.cancelled = true; reject(new Error('Cancelled')); } };
      calls.push(a); return a;
    };
    return el;
  };
  const phone = make('phone'), notification = make('toast');
  function detach(el) { if (!el) return; el.isConnected = false; el.children.forEach(detach); }
  function paint(route, index = 0, label = 'Visage', chosen = false, done = null) {
    detach(screen); detach(lens); detach(report); selections.forEach(detach);
    progresses.forEach(detach); counters.forEach(detach); toggles.forEach(detach);
    screen = make('screen', { route });
    const content = make('content'); content.children = [make('card1'), make('card2'), make('card3')];
    screen.children = [content]; screen.firstElementChild = content; screen.querySelector = () => content;
    lens = make('lens', { index: String(index) }); report = make(label);
    selections = chosen ? [make('choice', { act: 'offer', value: 'monthly' })] : [];
    progresses = []; counters = []; toggles = [];
    if (done !== null) {
      const progress = make('skin-progress', { motionKey: 'skin-progress-Matin' }, { 'aria-valuenow': String(done), 'aria-valuemax': '3' });
      progress.className = 'ss-mini-progress'; progresses.push(progress);
      if (done === 3) { const check = make('skin-progress-check'); progress.querySelector = () => check; }
      const counter = make('skin-count', { motionKey: 'skin-count-Matin', motionValue: String(done) }); counter.textContent = String(done); counters.push(counter);
      const toggle = make('skin-toggle', { act: 'skin-check-step', routine: 'morning', step: 'cleanse' }, { 'aria-pressed': String(done > 0) });
      const toggleIcon = make('skin-toggle-check'); toggle.querySelector = () => toggleIcon;
      toggles.push(toggle);
    }
  }
  const lookup = selector => ({ '#app > .mock-screen': screen, '.lg-nav-lens': lens,
    '.canonical-report-panel': report, '#overlay .modal-backdrop': backdrop,
    '#overlay .modal': sheet, '#toast': notification })[selector] || null;
  const context = { Set, Map, WeakMap, Date, Math, window: { matchMedia: () => preference,
      getComputedStyle: () => ({ scale: '1', translate: '0 0', transform: 'none' }),
      addEventListener: (type, fn) => listen(globals, type, fn) },
    document: { hidden: false, querySelector: lookup, createElement: () => make('created'),
      querySelectorAll: selector => selector.includes('[role="progressbar"]') ? progresses :
        selector.includes('[data-motion-value]') ? counters :
        selector.includes('button[aria-pressed]') && !selector.includes('[aria-pressed="true"]') ? toggles :
        selector.includes('[role="tab"]') ? [] : selections,
      addEventListener: (type, fn) => listen(listeners, type, fn) },
    render() { renders++; paint(...next); },
    modal() { detach(backdrop); detach(sheet); backdrop = make('backdrop'); sheet = make('sheet'); },
    closeModal() { closes++; detach(backdrop); detach(sheet); backdrop = null; sheet = null; }, toast() {} };
  vm.createContext(context); vm.runInContext(motion, context);
  const enabled = !reduced && supported;
  next = ['ACC-01', 0]; context.render();
  assert.equal(renders, 1, 'Initial render completes synchronously');
  if (enabled) assert.ok(calls.length > 0, 'Initial content receives an entrance');
  else assert.equal(calls.length, 0, 'Reduced motion and unsupported browsers render immediately');
  let before = calls.length;
  context.render(); assert.equal(calls.length, before, 'Identical rerenders do not replay arrivals');
  next = ['ANA-01', 1]; context.render();
  assert.equal(renders, 3, 'Navigation never waits for an animation');
  if (enabled) {
    const entrance = calls.slice(before);
    assert.ok(entrance.some(a => a.effect.target === lens), 'Dock lens moves between stops');
    assert.ok(entrance.some(a => a.effect.target === screen.firstElementChild),
      'The destination enters as one coherent surface');
    assert.equal(entrance.filter(a => a.effect.target.name.startsWith('card')).length, 0,
      'Individual cards never receive a generic cascade');
    assert.ok(calls.slice(0,before).every(a => a.cancelled), 'Rapid navigation releases detached arrivals');
  }
  before = calls.length;
  next = ['ANA-01', 1, 'Palette', true]; context.render();
  if (enabled) assert.ok(calls.slice(before).some(a => a.effect.target === report), 'Report tab content animates locally');

  next = ['ANA-01', 1, 'Palette', false, 0]; context.render(); before = calls.length;
  next = ['ANA-01', 1, 'Palette', false, 1]; context.render();
  if (enabled) {
    const update = calls.slice(before);
    const fill = update.find(a => a.effect.target.name === 'skin-progress' && '--progress' in a.frames[0]);
    assert.equal(fill.frames[0]['--progress'], '0%', 'The ring starts at the previous percentage');
    assert.ok(parseFloat(fill.frames[1]['--progress']) > 33, 'The ring reaches the new percentage smoothly');
    assert.ok(update.some(a => a.effect.target.name === 'created'), 'The number rolls from its old value to its new value');
    assert.ok(update.some(a => a.effect.target.name === 'skin-toggle-check'), 'The changed check receives confirmation feedback');
  }

  next = ['ANA-01', 1, 'Palette', false, 2]; context.render(); before = calls.length;
  next = ['ANA-01', 1, 'Palette', false, 3]; context.render();
  if (enabled) {
    const completion = calls.slice(before);
    const check = completion.find(a => a.effect.target.name === 'skin-progress-check');
    assert.ok(check, '100% completion confirms with the check inside the progress circle');
    assert.equal(check.options.delay, 200, 'The check follows the final progress fill');
  }

  const button = make('button', { act: 'offer', value: 'monthly' });
  const pointer = { target: button, button: 0, isPrimary: true, pointerId: 7, clientX: 50, clientY: 50 };
  before = calls.length; fire('pointerdown', pointer);
  if (enabled) {
    assert.equal(calls.at(-1).options.fill, 'forwards', 'Pressure remains while a finger is down');
    const held = calls.at(-1); held.finish(); await Promise.resolve();
    fire('pointermove', { ...pointer, clientY: 68 });
    assert.ok(held.cancelled, 'Scrolling releases even an already-finished hold');
    assert.equal(calls.at(-1).options.duration, 120, 'Cancelled press settles without rebound');
  } else assert.equal(calls.length, before, 'Reduced/unsupported press adds no effects');
  fire('pointerdown', pointer); fire('pointerup', pointer);
  if (enabled) assert.equal(calls.at(-1).frames.at(-1).scale, '1', 'Released control returns to its exact size');
  before = calls.length; button.disabled = true; fire('pointerdown', pointer);
  assert.equal(calls.length, before, 'Disabled History never gets a pressure effect'); button.disabled = false;
  fire('keydown', { target: button, key: ' ', repeat: false }); fire('keyup', { target: button, key: ' ' });
  if (enabled) assert.equal(calls.at(-1).options.duration, 260, 'Keyboard activation has the same release');

  context.modal(); const previous = closes; context.closeModal(false);
  assert.equal(closes, previous+1, 'Route changes close sheets synchronously');
  context.modal(); context.closeModal();
  if (enabled) {
    const exit = calls.at(-1); before = calls.length;
    context.closeModal(); assert.equal(calls.length, before, 'Repeated dismiss does not stack exits');
    context.modal(); const replacement = backdrop;
    exit.finish(); await Promise.resolve(); await Promise.resolve();
    assert.equal(backdrop, replacement, 'An old exit cannot close a new dialog');
    context.closeModal(); calls.at(-1).finish(); await Promise.resolve(); await Promise.resolve();
    assert.equal(backdrop, null, 'Normal dismissal completes');
    context.modal(); context.closeModal();
    preference.matches = true; preference.changed({ matches: true });
    await Promise.resolve(); await Promise.resolve();
    assert.equal(backdrop, null, 'Reduced motion enabled during dismissal cannot trap focus');
    assert.ok(calls.every(a => a.cancelled || a.completed), 'Reduced motion clears every running effect');
  } else assert.equal(backdrop, null, 'Modal dismissal is immediate without motion');
}
(async () => {
  await scenario(); await scenario(true); await scenario(false, false);
  console.log('Motion lifecycle verified in 3 modes: navigation, press, cancellation, keyboard, dialogs and reduced motion.');
})().catch(error => { console.error(error); process.exitCode = 1; });
