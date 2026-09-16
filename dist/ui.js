'use strict';

// Editorial preference: use natural sentences and commas, never middle-dot separators.

const icon=beautifyIcon;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const photo=(name,cls='',alt='Beauty inspiration')=>`<img class="${cls}" src="/assets/${name}.webp" alt="${alt}" loading="eager" draggable="false">`;
const logo=(large=false)=>`<div class="logo ${large?'large':''}"><strong>Beautify</strong></div>`;
