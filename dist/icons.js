'use strict';

/* Beautify Atelier: one purpose-built symbol family, on a shared 24px grid.
   Precision controls stay vector-sharp. Branded objects gain raster artwork in
   larger placements; both variants share the same semantic name and footprint. */
const BEAUTIFY_SYMBOLS=Object.freeze({
  'face-front':['','<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3M7 9c0-3 2-4.5 5-4.5S17 6 17 9v3c0 4-2.7 6.5-5 6.5S7 16 7 12Z"/><path d="M9 10h.2m5.6 0h.2m-5 4.5q2 1.5 4 0"/>'],
  'skin-clean':['','<path d="M14 3.5c-5-1.5-8.5 1.5-8.5 6.5 0 5.5 3 10 6.5 10 2.5 0 4.5-2 5.6-5M8.7 10h.4m4.6 0h.4M10 15q2 1.5 4 0M18 2.5c-1 1.8-2.5 3.3-2.5 4.7a2.5 2.5 0 0 0 5 0C20.5 5.8 19 4.3 18 2.5Z"/>'],
  'hair-clear':['','<path d="M6 10c0-4.5 2-7 6-7s6 2.5 6 7v2c0 4.5-3.2 8-6 8s-6-3.5-6-8ZM6.5 8q3.5-1 5.5-4 2 3 5.5 4M9 11h.3m5.4 0h.3m-5 4q2 1.5 4 0M3 7v8m18-8v8"/>'],
  'no-filter':['','<path d="m4 18 5-5m3-3 5-5 2 2-5 5m-3 3-5 5-2-2M3 3l18 18M7 3v2M3 7h2M18 2v2m2 2h2"/>'],
  selfie:['<rect x="5" y="2" width="14" height="20" rx="3"/>','<path d="M10 4.5h4m-4 15h4M8 16v-1a4 3 0 0 1 8 0v1"/><circle cx="12" cy="9.5" r="2.3"/>'],
  'photo-stack':['<rect x="6" y="6" width="15" height="15" rx="3"/>','<path d="M16 3H5a2 2 0 0 0-2 2v11m3 1 4-4 4 4 3-3 4 4"/><circle cx="16" cy="10.5" r="1.2"/>'],
  history:['','<path d="M3.6 10a8.6 8.6 0 1 1 .6 6.1M3.6 5.7V10h4.3M12 6.8v5.4l3.4 2.1"/>'],
  clock:['<circle cx="12" cy="12" r="8.4"/>','<path d="M12 6.6v5.6l3.7 2.1"/>'],
  refresh:['','<path d="M19.6 9A8 8 0 0 0 5.9 5.9L3.8 8M3.8 3.8V8H8M4.4 15a8 8 0 0 0 13.7 3.1l2.1-2.1M16 16h4.2v4.2"/>'],
  bag:['<path d="M5.8 7.8h12.4l1.1 11.4a1.1 1.1 0 0 1-1.1 1.2H5.8a1.1 1.1 0 0 1-1.1-1.2Z"/>','<path d="M8.5 8V6.2a3.5 3.5 0 0 1 7 0V8"/>'],
  cosmetic:['<path d="m8.2 9.2 6.6 6.6-5.1 5.1H3.1v-6.6Z"/>','<path d="m11.1 6.3 4.3-4.2a1.6 1.6 0 0 1 2.2 0l4.3 4.3a1.6 1.6 0 0 1 0 2.2l-4.2 4.3M6.1 12l5.9 5.9"/>'],
  guide:['<rect x="4.7" y="3.2" width="14.6" height="17.6" rx="2.7"/>','<path d="M8.2 3.4v17M11.4 8.1h4.3M11.4 11.5h4.3M11.4 14.9h2.6"/>'],
  arrow:['','<path d="M4.5 12h14.7m-5.7-5.7L19.2 12l-5.7 5.7"/>'],
  back:['','<path d="M19.5 12H4.8m5.7-5.7L4.8 12l5.7 5.7"/>'],
  chev:['','<path d="m9 5.7 6.3 6.3L9 18.3"/>'],
  x:['','<path d="m6.2 6.2 11.6 11.6m0-11.6L6.2 17.8"/>'],
  check:['','<path d="m5 12.4 4.5 4.5L19 7.4"/>'],
  plus:['','<path d="M12 5v14M5 12h14"/>'],
  home:['<path d="m4.3 10.4 6.3-5.6a2.1 2.1 0 0 1 2.8 0l6.3 5.6v8.1a1.5 1.5 0 0 1-1.5 1.5h-4.1v-6h-4.2v6H5.8a1.5 1.5 0 0 1-1.5-1.5Z"/>','<path d="m2.8 11.7 1.5-1.3m15.4 0 1.5 1.3"/>'],
  heart:['<path d="M12 20.1 4.6 13a5 5 0 0 1 7.4-6.7 5 5 0 0 1 7.4 6.7Z"/>',''],
  user:['<circle cx="12" cy="7.3" r="3.6"/><path d="M4.6 20.1v-1.3a7.4 5.2 0 0 1 14.8 0v1.3Z"/>',''],
  bookmark:['<path d="M6.3 3.5h11.4v17L12 17l-5.7 3.5Z"/>',''],
  search:['','<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.2 15.2 5 5"/>'],
  spark:['<path d="M12 3.1c1 5.6 3.3 7.9 8.9 8.9-5.6 1-7.9 3.3-8.9 8.9-1-5.6-3.3-7.9-8.9-8.9 5.6-1 7.9-3.3 8.9-8.9Z"/>',''],
  sparkles:['<path d="M9 3.4c.7 4.2 2.4 5.9 6.6 6.6-4.2.7-5.9 2.4-6.6 6.6-.7-4.2-2.4-5.9-6.6-6.6C6.6 9.3 8.3 7.6 9 3.4ZM18.3 14.1c.4 2.3 1.4 3.3 3.7 3.7-2.3.4-3.3 1.4-3.7 3.7-.4-2.3-1.4-3.3-3.7-3.7 2.3-.4 3.3-1.4 3.7-3.7Z"/>','<path d="M18.8 2.5v4.8m-2.4-2.4h4.8"/>'],
  sun:['<circle cx="12" cy="12" r="4"/>','<path d="M12 2.8v1.4m0 15.6v1.4M2.8 12h1.4m15.6 0h1.4M5.5 5.5l1 1m11 11 1 1m-13 0 1-1m11-11 1-1"/>'],
  moon:['<path d="M19.9 14.4A8.1 8.1 0 0 1 9.6 4.1a8.3 8.3 0 1 0 10.3 10.3Z"/>',''],
  hair:['<rect x="3" y="4.5" width="18" height="4.5" rx="2"/>','<path d="M4.5 9v10.5M7.5 9v10.5M10.5 9v10.5M13.5 9v10.5M16.5 9v10.5M19.5 9v10.5"/>'],
  brush:['<path d="m8.8 12.1 3.1 3.1-5.7 5.7a2.2 2.2 0 0 1-3.1-3.1ZM8.8 12.1c-1.3-3.9.6-7.7 4.1-9.1 1.2 3.8 4.3 3.8 7.2 3.1-1 4.4-4.4 8.2-8.2 9.1Z"/>','<path d="m7.1 13.8 3.1 3.1"/>'],
  dress:['<path d="M8.8 3h2a1.2 1.2 0 0 0 2.4 0h2l1.3 4.8-2.1 1.1.7 3 4.2 8.6a24 24 0 0 1-14.6 0l4.2-8.6.7-3-2.1-1.1Z"/>','<path d="M9 12h6"/>'],
  hanger:['','<path d="M9.6 5.5a2.4 2.4 0 1 1 4.2 1.6L12 8.7v2l8.1 5.6a1.5 1.5 0 0 1-.9 2.7H4.8a1.5 1.5 0 0 1-.9-2.7l8.1-5.6"/>'],
  drop:['<path d="M12 2.8c-2.1 3.1-7.1 7.7-7.1 11.9a7.1 7.1 0 0 0 14.2 0c0-4.2-5-8.8-7.1-11.9Z"/>','<path d="M8.4 14.7a3.6 3.6 0 0 0 2.3 3.4"/>'],
  waves:['','<path d="M3 6.5c3-3 6 3 9 0s6 3 9 0M3 12c3-3 6 3 9 0s6 3 9 0M3 17.5c3-3 6 3 9 0s6 3 9 0"/>'],
  palette:['<rect x="3.5" y="3" width="6.2" height="18" rx="2.7"/><path d="m9.7 5.9 6.6 3.8a2.7 2.7 0 0 1 1 3.7l-4.2 7.2H6.6M9.7 14.3l8.3-2.2a2.7 2.7 0 0 1 3.3 1.9l.6 2.2a2.7 2.7 0 0 1-1.9 3.3l-5.4 1.5H6.6"/>','<path d="M3.6 8.9h6M3.6 13.6h6"/><circle cx="6.6" cy="17.9" r=".7"/>'],
  leaf:['<path d="M20.2 3.8c-9.6-.8-16.4 2.1-15 9.3 1.7 8 15.6 5.6 15-9.3Z"/>','<path d="M3.5 21 16.2 8.3M9 15.5v-4.4m3.5 1h4.2"/>'],
  calendar:['<rect x="3.9" y="5.5" width="16.2" height="15.2" rx="2.7"/>','<path d="M7.8 3v5m8.4-5v5M4 10.5h16M8 14.5h1m6 0h1m-8 3.2h1"/>'],
  bars:['<rect x="3.5" y="13.1" width="3.5" height="7.4" rx="1.4"/><rect x="10.3" y="8.4" width="3.5" height="12.1" rx="1.4"/><rect x="17" y="3.5" width="3.5" height="17" rx="1.4"/>',''],
  target:['','<circle cx="11.5" cy="12.5" r="8.2"/><circle cx="11.5" cy="12.5" r="4.4"/><path d="m11.5 12.5 9.2-9.2m-4.1 0h4.1v4.1"/>'],
  eye:['<path d="M2.5 12c4.8-8 14.2-8 19 0-4.8 8-14.2 8-19 0Z"/>','<circle cx="12" cy="12" r="3.2"/>'],
  face:['<path d="M12 3.2c-4.9 0-6.8 3.1-6.6 7.8.2 5.1 3.5 9.8 6.6 9.8s6.4-4.7 6.6-9.8C18.8 6.3 16.9 3.2 12 3.2Z"/>','<path d="M8 10h1.4m5.2 0H16m-4 1.6v2m-1.8 3h3.6"/>'],
  bottle:['<rect x="6.3" y="8.9" width="11.4" height="12.1" rx="2.7"/>','<path d="M9.2 8.9V5.5h5.6v3.4M12 5.5V2.8h5.3v1.9M9.5 13.7h5"/>'],
  camera:['<path d="M8.4 4h7.2l1.5 2.8h2.2a1.9 1.9 0 0 1 1.9 1.9v10a1.9 1.9 0 0 1-1.9 1.9H4.7a1.9 1.9 0 0 1-1.9-1.9v-10a1.9 1.9 0 0 1 1.9-1.9h2.2Z"/>','<circle cx="12" cy="13.2" r="4"/><path d="M17.8 9.5h.3"/>'],
  image:['<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3"/>','<circle cx="15.9" cy="8.5" r="1.6"/><path d="m3.5 16.9 5.3-5.4 5.4 5.4 3.1-3.1 3.2 3.2"/>'],
  settings:['','<path d="M4 6h5m5 0h6M4 12h10m5 0h1M4 18h1m5 0h10"/><circle cx="11.5" cy="6" r="2.5"/><circle cx="16.5" cy="12" r="2.5"/><circle cx="7.5" cy="18" r="2.5"/>'],
  lock:['<rect x="5.3" y="10" width="13.4" height="11" rx="2.4"/>','<path d="M8.2 10V6.8a3.8 3.8 0 0 1 7.6 0V10M12 14.5v2.5"/>'],
  star:['<path d="m12 2.9 2.8 5.9 6.5.9-4.7 4.6 1.1 6.5-5.7-3.1-5.7 3.1 1.1-6.5-4.7-4.6 6.5-.9Z"/>',''],
  scissors:['','<circle cx="6.2" cy="17.5" r="3.1"/><circle cx="17.8" cy="17.5" r="3.1"/><path d="m8.2 15.1 10-11.6m-2.4 11.6L5.8 3.5"/>'],
  flame:['<path d="M13.1 2.8c.7 4.1 4.9 5.4 4.7 9.6.9-.8 1.6-1.8 1.7-3 4 8.1-2 13-7.5 12-6.5-1.3-9.7-7.6-3.2-14.6 0 2.5 1.1 3.5 2.1 4.2 2.2-2.5 2.9-5.2 2.2-8.2Z"/>',''],
  trend:['','<path d="m3.7 17.8 5.9-6.1 4 3.3 6.7-9.1M15 5.9h5.3v5.3"/>'],
  more:['','<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'],
  menu:['','<path d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15"/>'],
  wine:['<path d="M4 3h6l.7 5.8a3.7 3.7 0 0 1-7.4 0ZM14 3h6l.7 5.8a3.7 3.7 0 0 1-7.4 0Z"/>','<path d="M7 12.5v7.8m-3 0h6m7-7.8v7.8m-3 0h6"/>'],
  wifi:['','<path d="M2.8 8.5a15 15 0 0 1 18.4 0M6 12a10 10 0 0 1 12 0m-9 3.5a5.1 5.1 0 0 1 6 0M12 19h.01"/>'],
  signal:['','<path d="M4 16.5v4M9.3 12v8.5m5.4-13v13M20 3v17.5"/>'],
  battery:['<rect x="2.5" y="6.5" width="17.5" height="11" rx="2"/>','<path d="M22 10v4M6 9.5v5m3-5v5m3-5v5m3-5v5"/>'],
  ban:['','<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>'],
  pores:['','<circle cx="6" cy="6" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="18" cy="6" r="1"/><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/><circle cx="6" cy="18" r="1"/><circle cx="12" cy="18" r="1"/><circle cx="18" cy="18" r="1"/>'],
  scan:['','<path d="M8 3.8H6A2.2 2.2 0 0 0 3.8 6v2m12-4.2H18A2.2 2.2 0 0 1 20.2 6v2M3.8 16v2A2.2 2.2 0 0 0 6 20.2h2m8 0h2a2.2 2.2 0 0 0 2.2-2.2v-2M7.7 12h8.6"/>'],
  crown:['<path d="m3.4 6.1 4.5 3.5L12 3.3l4.1 6.3 4.5-3.5-2 13.6H5.4Z"/>','<path d="M5.2 16.1h13.6"/>'],
  globe:['','<circle cx="12" cy="12" r="8.6"/><ellipse cx="12" cy="12" rx="3.8" ry="8.6"/><path d="M3.4 12h17.2M5.1 7.1h13.8M5.1 16.9h13.8"/>'],
  bell:['<path d="M6.3 9.2a5.7 5.7 0 0 1 11.4 0c0 5.1 2.1 6.1 2.1 8H4.2c0-1.9 2.1-2.9 2.1-8Z"/>','<path d="M9.3 20a3.1 3.1 0 0 0 5.4 0"/>'],
  credit:['<rect x="2.9" y="5.2" width="18.2" height="13.6" rx="2.7"/>','<path d="M3 9.5h18M6.8 15h4.5"/>'],
  help:['<circle cx="12" cy="12" r="8.5"/>','<path d="M9.6 8.6a2.5 2.5 0 0 1 4.9.7c0 2.1-2.5 1.9-2.5 4M12 16.8h.01"/>'],
  play:['<path d="m8.2 4.7 11.3 6.4a1 1 0 0 1 0 1.8L8.2 19.3a1 1 0 0 1-1.5-.9V5.6a1 1 0 0 1 1.5-.9Z"/>',''],
  oval:['<path d="M12 3.1c-4.9 0-7 3.2-6.7 7.9.4 5.4 3.8 9.9 6.7 9.9s6.3-4.5 6.7-9.9C19 6.3 16.9 3.1 12 3.1Z"/>',''],
  snow:['','<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5m-5 15L12 17l2.5 2.5M4.3 10.3l3.4-.9-.9-3.4m10.4 12-.9-3.4 3.4-.9M4.3 13.7l3.4.9-.9 3.4M17.2 6l-.9 3.4 3.4.9"/>'],
  shield:['<path d="M12 2.8c2.7 2.1 5.5 3 8 3.3v5.6c0 4.7-3.7 7.7-8 9.5-4.3-1.8-8-4.8-8-9.5V6.1c2.5-.3 5.3-1.2 8-3.3Z"/>','<path d="m8.2 11.9 2.5 2.5 5.1-5.1"/>'],
  edit:['<path d="m15.7 3.9 4.4 4.4-11.8 11.8-5.4 1 1-5.4Z"/>','<path d="m13.3 6.3 4.4 4.4M3.9 15.7l4.4 4.4"/>'],
  mail:['<rect x="3.2" y="5" width="17.6" height="14" rx="2.7"/>','<path d="m3.8 6.1 7 5.4a2 2 0 0 0 2.4 0l7-5.4"/>'],
  trash:['<path d="m5.4 7.4 1 12.5a1.5 1.5 0 0 0 1.5 1.4h8.2a1.5 1.5 0 0 0 1.5-1.4l1-12.5Z"/>','<path d="M3.8 7.4h16.4M8.4 7.4V3.8h7.2v3.6M9.5 11v6.5m5-6.5v6.5"/>'],
  download:['','<path d="M12 3.3v11.3m-4-4 4 4 4-4M4.4 15.6v3a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2v-3"/>'],
  info:['<circle cx="12" cy="12" r="8.5"/>','<path d="M12 11v6m0-9.8h.01"/>']
});

const BEAUTIFY_ICON_ART=Object.freeze({hair:'comb',scissors:'scissors',bars:'results',clock:'history',lock:'lock',palette:'palette',drop:'skin',bottle:'bottle',brush:'makeup',cosmetic:'makeup',hanger:'wardrobe',dress:'wardrobe'});
let beautifyIconSequence=0;
function beautifyIcon(name,cls=''){
  const symbol=BEAUTIFY_SYMBOLS[name]||BEAUTIFY_SYMBOLS.help;
  const art=BEAUTIFY_ICON_ART[name];
  const id='bi-'+(++beautifyIconSequence);
  // The generated objects are illustrations, not evidence, labels or hit targets.
  const image=art?`<image class="b-icon-art" href="/assets/icons/${art}.webp" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet"/>`:'';
  return `<svg class="icon b-icon ${art?'b-icon-illustrated ':''}${cls}" data-icon="${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" shape-rendering="geometricPrecision"${BEAUTIFY_SYMBOLS[name]?'':' data-icon-missing="true"'}><defs><linearGradient id="${id}" x1="0" y1="0" x2=".75" y2="1"><stop stop-color="#fffefa"/><stop offset=".38" stop-color="#f3ded0"/><stop offset="1" stop-color="#c9987b"/></linearGradient></defs><g class="b-icon-symbol" stroke-linecap="round" stroke-linejoin="round"><g class="b-icon-solid" fill="url(#${id})">${symbol[0]}</g><g class="b-icon-line" fill="none">${symbol[1]}</g></g>${image}</svg>`;
}
