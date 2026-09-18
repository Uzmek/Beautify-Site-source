'use strict';

// Progressive optical treatment. SVG backdrop displacement is currently reliable
// in Chromium; other engines retain the clear CSS material and native controls.
(() => {
  if (typeof navigator === 'undefined' || typeof CSS === 'undefined') return;
  if (!/Chrome\//.test(navigator.userAgent) || !CSS.supports('backdrop-filter', 'url("#glass")')) return;
  const selector = '.profile-system :is(.primary,.secondary,.pf-manage,.choice-chips button,.lg-bubble), #phone-surface:has(.profile-system) #overlay :is(.primary,.secondary,.close)';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:fixed;pointer-events:none';
  const defs = document.createElementNS(ns, 'defs');
  svg.append(defs);
  document.body.append(svg);
  const filters = new Map();
  const observed = new Set();
  let sequence = 0;

  function lens(width, height, radius) {
    const key = `${width}:${height}:${radius}`;
    if (filters.has(key)) return filters.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const pixels = context.createImageData(width, height);
    const bevel = Math.min(10, height / 3);
    // A rounded-rectangle distance field bends only the bevel. The middle of
    // the control stays optically quiet, and foreground labels are never filtered.
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x + .5 - width / 2;
        const dy = y + .5 - height / 2;
        const qx = Math.abs(dx) - (width / 2 - radius);
        const qy = Math.abs(dy) - (height / 2 - radius);
        const ax = Math.max(qx, 0);
        const ay = Math.max(qy, 0);
        const length = Math.hypot(ax, ay);
        const distance = radius - length - Math.min(Math.max(qx, qy), 0);
        let nx = 0;
        let ny = 0;
        if (length > 0) { nx = ax / length * Math.sign(dx); ny = ay / length * Math.sign(dy); }
        else if (qx > qy) nx = Math.sign(dx);
        else ny = Math.sign(dy);
        const bend = distance > 0 && distance < bevel ? Math.sin(distance / bevel * Math.PI) : 0;
        const i = (y * width + x) * 4;
        pixels.data[i] = Math.round(128 + nx * bend * 127);
        pixels.data[i + 1] = Math.round(128 + ny * bend * 127);
        pixels.data[i + 2] = 128;
        pixels.data[i + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    const id = `profile-lens-${++sequence}`;
    const filter = document.createElementNS(ns, 'filter');
    for (const [name, value] of Object.entries({ id, x:'0%', y:'0%', width:'100%', height:'100%', 'color-interpolation-filters':'sRGB' })) filter.setAttribute(name, value);
    const map = document.createElementNS(ns, 'feImage');
    map.setAttribute('href', canvas.toDataURL());
    map.setAttribute('width', '100%');
    map.setAttribute('height', '100%');
    map.setAttribute('preserveAspectRatio', 'none');
    map.setAttribute('result', 'lens');
    const displacement = document.createElementNS(ns, 'feDisplacementMap');
    for (const [name, value] of Object.entries({ in:'SourceGraphic', in2:'lens', scale:'4', xChannelSelector:'R', yChannelSelector:'G' })) displacement.setAttribute(name, value);
    filter.append(map, displacement);
    defs.append(filter);
    filters.set(key, id);
    return id;
  }

  function refresh() {
    const live = new Set(document.querySelectorAll(selector));
    for (const el of observed) if (!live.has(el)) { resize.unobserve(el); observed.delete(el); }
    for (const el of live) {
      if (!observed.has(el)) { observed.add(el); resize.observe(el); }
      const width = Math.round(el.offsetWidth);
      const height = Math.round(el.offsetHeight);
      if (!width || !height) continue;
      const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, width / 2, height / 2);
      const id = lens(width, height, Math.round(radius));
      const value = `url("#${id}") blur(2px) saturate(1.1)`;
      if (el.style.getPropertyValue('--profile-control-filter') !== value) el.style.setProperty('--profile-control-filter', value);
    }
    // Remove unused maps as routes/viewport sizes change. No navigation cache of
    // bitmaps or observers is retained once a control leaves the page.
    const used = new Set(Array.from(live, el => el.style.getPropertyValue('--profile-control-filter')));
    for (const [key, id] of filters) {
      if (![...used].some(value => value.includes(`#${id}"`))) { document.getElementById(id)?.remove(); filters.delete(key); }
    }
  }
  // Mutation/resize observers run before paint. A further animation-frame hop
  // can expose the fallback for a frame during navigation; prepare lenses now.
  const resize = new ResizeObserver(refresh);
  const mutation = new MutationObserver(refresh);
  mutation.observe(document.getElementById('app'), { childList:true, subtree:true });
  const overlay = document.getElementById('overlay');
  if (overlay) mutation.observe(overlay, { childList:true, subtree:true });
  refresh();
})();
