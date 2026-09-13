'use strict';

// Beautify motion: pressure, settling glass, directional navigation and reveals.
// Decorative only. Business actions, focus, history and analysis timers are synchronous.
(() => {
  const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const running = new Set(), channels = new WeakMap();
  const settle = 'cubic-bezier(.2,.8,.2,1)';
  const soft = 'cubic-bezier(.25,.75,.25,1)';
  const controls = 'button,a[href],summary';
  let pressed = null, closingSheet = null, direction = 1, activation = null;
  const query = selector => document.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const canMove = element => !preference?.matches && !!element?.animate;
  const key = element => ['act','go','value','key','id','step','routine','domain']
    .map(name => element?.dataset?.[name] || '').join('|');
  try {
    window.CSS?.registerProperty?.({ name: '--progress', syntax: '<percentage>', inherits: false, initialValue: '0%' });
  } catch { /* The property can already be registered after a development reload. */ }

  function play(element, frames, duration = 420, options = {}) {
    if (!canMove(element)) return null;
    const { channel = 'arrival', ...timing } = options;
    let own = channels.get(element);
    if (!own) channels.set(element, own = new Map());
    own.get(channel)?.cancel();
    const animation = element.animate(frames, { duration, easing: settle, fill: 'backwards', ...timing });
    own.set(channel, animation); running.add(animation);
    const clean = () => {
      running.delete(animation);
      if (own.get(channel) === animation && timing.fill !== 'forwards') own.delete(channel);
    };
    animation.finished.then(clean, clean);
    return animation;
  }
  function cleanDetached() {
    for (const animation of running) if (animation.effect?.target?.isConnected === false) animation.cancel();
  }
  function neutralize() {
    pressed?.hold?.cancel(); pressed = null; activation = null;
    for (const animation of running) animation.cancel();
  }
  preference?.addEventListener?.('change', event => { if (event.matches) neutralize(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) neutralize(); });
  window.addEventListener('blur', neutralize);

  // Press has its own compositor properties, so it never fights a card entrance,
  // the phone preview scale, a swipe transform or the illustration's proportions.
  function targetControl(target) {
    const element = target?.closest?.(controls);
    return element?.closest('#phone-surface') && !element.disabled &&
      element.getAttribute('aria-disabled') !== 'true' && !element.closest('[inert]') ? element : null;
  }
  function currentPressure(element) {
    const style = window.getComputedStyle?.(element);
    return { scale: style?.scale || '1', translate: style?.translate || '0 0' };
  }
  function rebound(element, from, cancel = false) {
    if (!canMove(element)) return;
    play(element, cancel ? [from, { scale: '1', translate: '0 0' }] : [
      { ...from, offset: 0, easing: soft },
      { scale: '1.006', translate: '0 0', offset: .58, easing: soft },
      { scale: '1', translate: '0 0', offset: 1 }
    ], cancel ? 120 : 260, { channel: 'pressure', easing: 'linear' });
  }
  function release(cancel = false) {
    if (!pressed) return;
    const { element, hold } = pressed;
    const from = currentPressure(element);
    pressed = null; hold?.cancel();
    if (element.isConnected) rebound(element, from, cancel);
  }
  function press(element, event) {
    release(true);
    if (!canMove(element)) return;
    const from = currentPressure(element);
    pressed = { element, pointer: event.pointerId, x: event.clientX, y: event.clientY,
      hold: play(element, [from, { scale: '.985', translate: '0 .75px' }], 90,
        { channel: 'pressure', easing: soft, fill: 'forwards' }) };
  }
  document.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false) { release(true); return; }
    const element = targetControl(event.target);
    if (element) press(element, event);
  }, { passive: true });
  // No pointer tracking/tilting loop: this listener only cancels a press once the
  // finger starts scrolling. Native scrolling and the routine gestures keep priority.
  document.addEventListener('pointermove', event => {
    if (pressed && event.pointerId === pressed.pointer &&
      Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) > 10) release(true);
  }, { passive: true });
  document.addEventListener('pointerup', event => { if (pressed?.pointer === event.pointerId) release(); }, { passive: true });
  document.addEventListener('pointercancel', () => release(true), { passive: true });
  document.addEventListener('scroll', () => release(true), { passive: true, capture: true });
  document.addEventListener('keydown', event => {
    if (!event.repeat && ['Enter',' '].includes(event.key)) {
      const element = targetControl(event.target); if (element) press(element, event);
    }
    if (event.key === 'Escape') release(true);
  });
  document.addEventListener('keyup', event => { if (['Enter',' '].includes(event.key)) release(); });
  document.addEventListener('click', event => {
    const element = targetControl(event.target);
    if (!element) return;
    activation = { key: key(element), time: Date.now() };
    if (element.dataset.act === 'back' || element.dataset.act === 'premium-return') direction = -1;
  }, true);
  window.addEventListener('popstate', () => { direction = -1; }, true);

  function enter(element, axis = 'y', distance = 14, duration = 320) {
    const shift = value => axis === 'x' ? `translateX(${value}px)` : `translateY(${value}px)`;
    return play(element, [
      { opacity: 0, transform: shift(distance) },
      { opacity: 1, transform: shift(0) }
    ], duration);
  }
  const lists = ['.ux-home-care-list','.ss-product-list','.hair-catalogue-grid','.lg-history-list'];
  function listState() {
    return new Map(lists.map(selector => {
      const list = query(selector);
      const items = [...(list?.children || [])].map(element => ({ element,
        id: element.dataset.stepId || key(element.querySelector('button[data-step],button[data-id]')) }));
      return [selector, items];
    }));
  }
  function motionIdentity(element, index) {
    const classes = typeof element.className === 'string' ? element.className.trim().replace(/\s+/g,'.') : '';
    return element.dataset.motionKey || `${element.tagName || element.name || 'element'}.${classes}:${index}`;
  }
  function progressState() {
    return new Map(all('#app [role="progressbar"][aria-valuenow]').map((element, index) => [
      motionIdentity(element, index), {
        value: Number(element.getAttribute('aria-valuenow')) || 0,
        max: Math.max(1, Number(element.getAttribute('aria-valuemax')) || 100)
      }
    ]));
  }
  function counterState() {
    return new Map(all('#app [data-motion-value]').map((element, index) => [
      motionIdentity(element, index), Number(element.dataset.motionValue)
    ]));
  }
  function pressedState() {
    return new Map(all('#app button[aria-pressed]').map(element => [key(element), element.getAttribute('aria-pressed') === 'true']));
  }
  function animateCounter(element, from, to) {
    if (!canMove(element) || !Number.isFinite(from) || !Number.isFinite(to) || from === to) return;
    const ghost = document.createElement('span');
    const current = document.createElement('span');
    ghost.className = 'motion-counter-ghost'; ghost.textContent = String(from);
    current.textContent = String(to);
    element.textContent = ''; element.classList.add('motion-counter');
    element.append(ghost, current);
    play(ghost, [{ opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: `translateY(${to > from ? -42 : 42}%)` }], 260,
      { channel: 'counter-old', easing: soft });
    const arrival = play(current, [{ opacity: 0, transform: `translateY(${to > from ? 45 : -45}%) scale(.96)` },
      { opacity: 1, transform: 'translateY(0) scale(1)' }], 300,
      { channel: 'counter-new', easing: settle });
    const finish = () => {
      if (!element.isConnected || element.dataset.motionValue !== String(to)) return;
      element.classList.remove('motion-counter'); element.textContent = String(to);
    };
    arrival?.finished.then(finish, finish);
  }
  function animateProgress(element, previous) {
    const value = Number(element.getAttribute('aria-valuenow')) || 0;
    const max = Math.max(1, Number(element.getAttribute('aria-valuemax')) || 100);
    if (!previous || previous.value === value) return;
    const before = Math.max(0, Math.min(100, previous.value / previous.max * 100));
    const after = Math.max(0, Math.min(100, value / max * 100));
    if (element.matches('.ss-mini-progress')) {
      play(element, [{ '--progress': `${before}%` }, { '--progress': `${after}%` }], 520,
        { channel: 'progress', easing: settle });
    } else {
      const visual = element.querySelector(':scope>.bar>span,:scope>span,:scope>i');
      if (visual && after > 0) play(visual,
        [{ transform: `scaleX(${Math.max(.02, before / after)})` }, { transform: 'scaleX(1)' }],
        420, { channel: 'progress', easing: settle });
    }
    if (element.matches('.ss-mini-progress') && value === max && previous.value < previous.max) {
      const check = element.querySelector('.b-icon,svg');
      play(check, [{ opacity: 0, scale: '.86' },
        { opacity: 1, scale: '1' }], 240,
        { channel: 'completion', delay: 200, easing: settle });
    }
  }
  function animateStateChanges(previousProgress, previousCounters, previousPressed) {
    all('#app [role="progressbar"][aria-valuenow]').forEach((element, index) =>
      animateProgress(element, previousProgress.get(motionIdentity(element, index))));
    all('#app [data-motion-value]').forEach((element, index) => {
      const previous = previousCounters.get(motionIdentity(element, index));
      if (previous !== undefined) animateCounter(element, previous, Number(element.dataset.motionValue));
    });
    for (const button of all('#app button[aria-pressed]')) {
      const before = previousPressed.get(key(button));
      const after = button.getAttribute('aria-pressed') === 'true';
      if (before === undefined || before === after) continue;
      const glyph = button.querySelector('.icon,.b-icon,svg');
      if (glyph) play(glyph, [{ scale: after ? '.88' : '1', opacity: after ? .55 : 1 },
        { scale: '1', opacity: 1 }], 260,
        { channel: 'confirmation', easing: settle });
    }
  }
  function reportState() {
    const panel = query('.canonical-report-panel');
    return { panel, name: panel?.getAttribute('aria-label') || panel?.getAttribute('aria-labelledby'),
      tab: all('[role="tab"],.canonical-report-rail button').findIndex(el =>
        el.getAttribute('aria-selected') === 'true' || el.getAttribute('aria-pressed') === 'true') };
  }
  const baseRender = render;
  render = function(options = {}) {
    const previousScreen = query('#app > .mock-screen');
    const previousRoute = previousScreen?.dataset.route;
    const previousReport = reportState();
    const previousLists = listState();
    const previousLens = query('.lg-nav-lens');
    const previousIndex = previousLens ? Number(previousLens.dataset.index) : null;
    const previousProgress = progressState();
    const previousCounters = counterState();
    const previousPressed = pressedState();
    const result = baseRender(options);
    cleanDetached();
    if (pressed?.element.isConnected === false) { pressed.hold?.cancel(); pressed = null; }
    const screen = query('#app > .mock-screen');
    const lens = query('.lg-nav-lens');
    const currentIndex = lens ? Number(lens.dataset.index) : null;
    const routeChanged = screen?.dataset.route !== previousRoute;
    if (previousIndex !== null && currentIndex !== null && previousIndex !== currentIndex) {
      // The three main tabs share identical geometry and evenly spaced stops.
      play(lens, [
        { translate: `${(previousIndex-currentIndex)*100}% 0` },
        { translate: '0 0' }
      ], 320);
    }
    if (screen && (!previousRoute || routeChanged)) {
      const content = screen.querySelector('.lg-page') || screen.firstElementChild;
      const isRoot = ['ACC-01','ANA-01','PRF-01'].includes(screen.dataset.route);
      const isReveal = !!content?.matches('.result-reveal');
      const axis = previousRoute && !isReveal ? 'x' : 'y';
      const sign = isRoot && previousIndex !== null && currentIndex !== previousIndex
        ? Math.sign(currentIndex-previousIndex) : direction;
      enter(content, axis, (isReveal ? 10 : isRoot ? 12 : 16) * sign, isReveal ? 360 : 320);
      direction = 1;
    } else if (previousRoute) {
      const report = reportState();
      const changedReport = report.panel && previousReport.name !== report.name;
      if (changedReport) {
        const sign = report.tab >= 0 && previousReport.tab >= 0 ? Math.sign(report.tab-previousReport.tab) || 1 : 1;
        enter(report.panel, 'x', 12 * sign, 280);
      }
      if (!changedReport) for (const [selector, items] of listState()) {
        const previousIds = new Set((previousLists.get(selector) || []).map(item => item.id));
        const newcomers = items.filter(item => item.id.replaceAll('|','') && !previousIds.has(item.id));
        if (newcomers.length === 1) enter(newcomers[0].element, 'y', 8, 240);
        else if (newcomers.length > 1) enter(query(selector), 'y', 8, 240);
      }
      animateStateChanges(previousProgress, previousCounters, previousPressed);
      // Recreated controls continue the tactile release after a same-page action.
      if (activation && Date.now()-activation.time < 250) {
        const replacement = all('#app button').find(element => key(element) === activation.key);
        if (replacement) rebound(replacement, { scale: '.985', translate: '0 .75px' });
      }
    }
    activation = null;
    return result;
  };

  const baseModal = modal;
  modal = function(...args) {
    const replacing = !!query('#overlay .modal');
    closingSheet = null;
    release(true);
    const result = baseModal(...args);
    cleanDetached();
    const sheet = query('#overlay .modal');
    if (!replacing) play(query('#overlay .modal-backdrop'), [{ opacity: 0 }, { opacity: 1 }], 240);
    play(sheet, replacing ? [
      { opacity: .35, transform: 'translateX(8px)' }, { opacity: 1, transform: 'none' }
    ] : [
      { opacity: 0, transform: 'translateY(42px) scale(.985)', offset: 0, easing: settle },
      { opacity: 1, transform: 'none', offset: 1 }
    ], replacing ? 240 : 400, { easing: 'linear' });
    return result;
  };
  const baseClose = closeModal;
  closeModal = function(restore = true) {
    const backdrop = query('#overlay .modal-backdrop');
    const sheet = query('#overlay .modal');
    if (!restore || !canMove(backdrop)) {
      closingSheet = null; const result = baseClose(restore); cleanDetached(); return result;
    }
    if (closingSheet === backdrop) return;
    closingSheet = backdrop;
    const style = window.getComputedStyle?.(sheet);
    play(sheet, [{ transform: style?.transform || 'none' }, { transform: 'translateY(48px) scale(.98)' }],
      180, { easing: 'cubic-bezier(.4,0,1,1)' });
    const exit = play(backdrop, [{ opacity: 1 }, { opacity: 0 }], 180, { easing: 'ease-out' });
    const finish = () => {
      if (closingSheet === backdrop && query('#overlay .modal-backdrop') === backdrop) {
        closingSheet = null; baseClose(restore); cleanDetached();
      }
    };
    exit.finished.then(finish, finish);
  };
  const baseToast = toast;
  toast = function(...args) {
    const result = baseToast(...args);
    play(query('#toast'), [{ opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'none' }], 240);
    return result;
  };
})();
