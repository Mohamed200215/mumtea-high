/* ---------- the Bone Boutique's product pictures: thick outlines, flat colour and real detail ---------- */
const ART_INK = '#14101a';
const artShade = (hex: string, amount: number): string => {
  const n = parseInt(hex.slice(1), 16), part = (v: number): number => Math.max(0, Math.min(255, Math.round(v + (amount > 0 ? (255 - v) * amount : v * amount))));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => part(v).toString(16).padStart(2, '0')).join('');
};
const artPath = (d: string, fill: string, w = 3): string => '<path d="' + d + '" fill="' + fill + '" stroke="' + ART_INK + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"/>';
const artLine = (d: string, colour = ART_INK, w = 2.2): string => '<path d="' + d + '" fill="none" stroke="' + colour + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"/>';
const artWord = (x: number, y: number, size: number, fill: string, words: string): string => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="' + size + '" fill="' + fill + '">' + words + '</text>';
const artGem = (x: number, y: number, r: number, fill = '#e4f6ff', facet = '#6fb8e6'): string => '<path d="M' + x + ' ' + (y - r) + 'L' + (x + r) + ' ' + (y - r * .25) + 'L' + x + ' ' + (y + r) + 'L' + (x - r) + ' ' + (y - r * .25) + 'Z" fill="' + fill + '" stroke="' + ART_INK + '" stroke-width="2.200" stroke-linejoin="round"/><path d="M' + (x - r) + ' ' + (y - r * .25) + 'H' + (x + r) + 'M' + (x - r * .45) + ' ' + (y - r * .25) + 'L' + x + ' ' + (y - r) + 'L' + (x + r * .45) + ' ' + (y - r * .25) + 'L' + x + ' ' + (y + r) + 'Z" fill="none" stroke="' + facet + '" stroke-width="1.200"/>';
const artPearl = (x: number, y: number, r: number): string => '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="#fbf2c9" stroke="' + ART_INK + '" stroke-width="2"/><circle cx="' + (x - r * .32).toFixed(1) + '" cy="' + (y - r * .35).toFixed(1) + '" r="' + r * .22 + '" fill="#fff"/>';
/* A necklace hangs along an arc, with its centre left free for a pendant. */
function artArc(n: number, draw: (x: number, y: number, i: number) => string): string {
  let s = '';
  for (let i = 0; i < n; i++) { const a = Math.PI * (.04 + .92 * i / (n - 1)); s += draw(200 + Math.cos(a) * 158, 8 + Math.sin(a) * 136, i); }
  return s;
}
const artChain = (col = '#e0b83c'): string => artArc(41, (x, y) => '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.600" fill="' + col + '" stroke="' + ART_INK + '" stroke-width=".800"/>');
function jewelArt(id: string): string {
  if (id === 'diamondpendant') return artChain() + artPath('M192 146h16v8h-16Z', '#e0b83c', 2) + artGem(200, 188, 38);
  if (id === 'tennisnecklace') return artArc(25, (x, y) => artGem(x, y, 10)) + artGem(200, 186, 26, '#d4f0ff');
  if (id === 'diamondchain') return artArc(21, (x, y, i) => '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="13" ry="9" fill="#eaf7ff" stroke="' + ART_INK + '" stroke-width="2.400" transform="rotate(' + (i * 8.7 - 87).toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="#8fd4ff"/>') + artPath('M152 158H248L262 186L200 232L138 186Z', '#eaf7ff') + artGem(200, 186, 24, '#bfe8ff') + artGem(166, 178, 9) + artGem(234, 178, 9);
  if (id === 'pearlstrand') return artArc(27, (x, y) => artPearl(x, y, 10));
  if (id === 'sapphirependant') return artArc(23, (x, y) => artPearl(x, y, 11)) + artPath('M190 150q10-10 20 0l-4 8h-12Z', '#c7ccd8', 2) + '<ellipse cx="200" cy="186" rx="30" ry="36" fill="#e0b83c" stroke="' + ART_INK + '" stroke-width="3"/><ellipse cx="200" cy="186" rx="21" ry="27" fill="#2f55c4" stroke="' + ART_INK + '" stroke-width="2"/><path d="M200 159V213M179 186H221M185 167L215 205M215 167L185 205" stroke="#7f9ff0" stroke-width="1.500"/><ellipse cx="200" cy="186" rx="10" ry="14" fill="#a9bcf5" stroke="' + ART_INK + '" stroke-width="1.500"/>';
  if (id === 'rubyheart') return artChain('#e0e4ee') + artPath('M200 234C150 198 150 160 176 156C188 154 196 162 200 172C204 162 212 154 224 156C250 160 250 198 200 234Z', '#d3122a') + artPath('M200 214C170 192 170 170 182 168C190 168 196 176 200 186C204 176 210 168 218 168C230 170 230 192 200 214Z', '#ff5a6e', 1.5) + '<ellipse cx="178" cy="172" rx="7" ry="4" fill="#fff" opacity=".8" transform="rotate(-30 178 172)"/>';
  if (id === 'tiffanyheart') return artArc(31, (x, y) => '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="5" ry="3.500" fill="#e8ebf2" stroke="' + ART_INK + '" stroke-width="1.200"/>') + artPath('M200 234C148 198 150 160 176 156C188 154 196 162 200 172C204 162 212 154 224 156C250 160 252 198 200 234Z', '#dfe3ec') + artLine('M168 178Q200 200 232 178', '#8f96a6', 1.5) + artWord(200, 192, 12, ART_INK, 'TIFFANY') + artWord(200, 205, 8, ART_INK, '& CO.');
  if (id === 'alhambra') { const clover = (x: number, y: number, r: number): string => '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"><path d="M0 ' + -r + 'Q' + r * .9 + ' ' + -r + ' ' + r * .62 + ' ' + -r * .62 + 'Q' + r + ' ' + -r * .9 + ' ' + r + ' 0Q' + r + ' ' + r * .9 + ' ' + r * .62 + ' ' + r * .62 + 'Q' + r * .9 + ' ' + r + ' 0 ' + r + 'Q' + -r * .9 + ' ' + r + ' ' + -r * .62 + ' ' + r * .62 + 'Q' + -r + ' ' + r * .9 + ' ' + -r + ' 0Q' + -r + ' ' + -r * .9 + ' ' + -r * .62 + ' ' + -r * .62 + 'Q' + -r * .9 + ' ' + -r + ' 0 ' + -r + 'Z" fill="#e0b83c" stroke="' + ART_INK + '" stroke-width="2"/><circle r="' + r * .62 + '" fill="#f6f4ee" stroke="#a8770c" stroke-width="1.500"/></g>'; return artChain() + [[.1, 0], [.3, 0], [.5, 0], [.7, 0], [.9, 0]].map(([k]) => { const a = Math.PI * (.04 + .92 * k); return clover(200 + Math.cos(a) * 158, 8 + Math.sin(a) * 136, 17); }).join(''); }
  if (id === 'tennisbracelet') { let s = ''; for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; s += artGem(200 + Math.cos(a) * 120, 118 + Math.sin(a) * 74, 13); } return '<ellipse cx="200" cy="118" rx="120" ry="74" fill="none" stroke="#c7ccd8" stroke-width="8"/>' + s; }
  if (id === 'cartierlove') { let s = '<ellipse cx="200" cy="124" rx="136" ry="84" fill="none" stroke="' + ART_INK + '" stroke-width="30"/><ellipse cx="200" cy="124" rx="136" ry="84" fill="none" stroke="#e0b83c" stroke-width="24"/><ellipse cx="200" cy="118" rx="136" ry="84" fill="none" stroke="#fff3b8" stroke-width="3"/>'; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + .3, x = 200 + Math.cos(a) * 136, y = 124 + Math.sin(a) * 84; s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6" fill="#fff3b8" stroke="' + ART_INK + '" stroke-width="1.500"/><path d="M' + (x - 3).toFixed(1) + ' ' + y.toFixed(1) + 'h6" stroke="' + ART_INK + '" stroke-width="1.500"/>'; } return s; }
  if (id === 'diamondring') return '<ellipse cx="200" cy="154" rx="72" ry="66" fill="none" stroke="' + ART_INK + '" stroke-width="22"/><ellipse cx="200" cy="154" rx="72" ry="66" fill="none" stroke="#e8ebf2" stroke-width="16"/>' + artPath('M176 92L188 66H212L224 92Z', '#c7ccd8', 2.5) + artGem(200, 50, 44, '#dff4ff');
  return watchArt(id);
}
/* Each watch: bracelet, case shape, bezel, dial, hands and the maker's name. */
function watchArt(id: string): string {
  type Shape = 'round' | 'oct' | 'tank' | 'tonneau';
  const W: Record<string, { metal: string; dial: string; bezel: string; word: string; shape: Shape; strap?: string; subs?: boolean; iced?: boolean; bolts?: boolean }> = {
    rolexsub: { metal: '#d7dbe4', dial: '#0f7a4f', bezel: '#0b5c3b', word: 'ROLEX', shape: 'round' },
    rolexdaydate: { metal: '#e0b83c', dial: '#f6e7a8', bezel: '#c9a227', word: 'ROLEX', shape: 'round' },
    rolexdaytona: { metal: '#d7dbe4', dial: '#14141c', bezel: '#2a2a34', word: 'ROLEX', shape: 'round', subs: true },
    rolexiced: { metal: '#eaf0f8', dial: '#d9e4f2', bezel: '#eaf7ff', word: 'ROLEX', shape: 'round', iced: true },
    aproyaloak: { metal: '#c7ccd8', dial: '#1f3a8a', bezel: '#9aa0ae', word: 'AP', shape: 'oct' },
    pateknautilus: { metal: '#e8a98a', dial: '#23405e', bezel: '#c98463', word: 'PATEK', shape: 'round' },
    cartiertank: { metal: '#e0b83c', dial: '#f8f4e6', bezel: '#c9a227', word: 'CARTIER', shape: 'tank', strap: '#2a1420' },
    omegaseamaster: { metal: '#d7dbe4', dial: '#1f4fa8', bezel: '#143573', word: 'OMEGA', shape: 'round' },
    hublotbigbang: { metal: '#34343e', dial: '#101016', bezel: '#55555f', word: 'HUBLOT', shape: 'round', strap: '#14141c', bolts: true },
    richardmille: { metal: '#ff1f8f', dial: '#101016', bezel: '#b80e63', word: 'R.MILLE', shape: 'tonneau', strap: '#ff4fa8', subs: true },
  };
  const w = W[id] || W.rolexsub, CX = 200, CY = 120, ink = w.dial === '#f6e7a8' || w.dial === '#f8f4e6' || w.dial === '#d9e4f2' ? ART_INK : '#fff6fb';
  let links = '';
  if (!w.strap) for (let i = 0; i < 4; i++) links += '<path d="M160 ' + (12 + i * 15) + 'h80M160 ' + (236 - i * 15) + 'h80" stroke="' + ART_INK + '" stroke-width="2"/>';
  const band = w.strap ? artPath('M160 4H240L234 76H166Z', w.strap) + artPath('M166 164H234L240 238H160Z', w.strap) + '<path d="M170 8V70M230 8V70M170 170V234M230 170V234" stroke="' + artShade(w.strap, .35) + '" stroke-width="1.500" stroke-dasharray="3 4"/>' : artPath('M156 4H244L238 76H162Z', w.metal) + artPath('M162 164H238L244 238H156Z', w.metal) + artLine('M186 4V76M214 4V76M186 164V238M214 164V238', artShade(w.metal, -.35), 2) + links;
  let ticks = '';
  const tickR = w.shape === 'tank' ? 34 : w.shape === 'tonneau' ? 38 : 44;
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ticks += artLine('M' + (CX + Math.cos(a) * tickR).toFixed(1) + ' ' + (CY + Math.sin(a) * tickR).toFixed(1) + 'L' + (CX + Math.cos(a) * (tickR + 7)).toFixed(1) + ' ' + (CY + Math.sin(a) * (tickR + 7)).toFixed(1), ink, i % 3 ? 2 : 3.6); }
  const subs = w.subs ? [[-22, 8], [22, 8], [0, 28]].map(([x, y]) => '<circle cx="' + (CX + x) + '" cy="' + (CY + y) + '" r="10" fill="' + artShade(w.dial, .22) + '" stroke="' + ink + '" stroke-width="1.500"/><path d="M' + (CX + x) + ' ' + (CY + y) + 'v-7" stroke="' + ink + '" stroke-width="1.500"/>').join('') : '';
  const hands = artLine('M' + CX + ' ' + CY + 'L' + (CX - 20) + ' ' + (CY - 22), ink, 4.5) + artLine('M' + CX + ' ' + CY + 'L' + (CX + 28) + ' ' + (CY - 24), ink, 3.2) + '<circle cx="' + CX + '" cy="' + CY + '" r="4" fill="' + w.metal + '" stroke="' + ART_INK + '" stroke-width="1.500"/>';
  const label = w.subs ? artWord(CX, CY - 20, 9, ink, w.word) : artWord(CX, CY + 25, 10, ink, w.word);
  const face = ticks + subs + hands + label;
  const crown = artPath('M272 112h9v16h-9Z', w.metal, 2);
  if (w.shape === 'oct') {
    const p = (r: number): string => { let s = ''; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; s += (i ? 'L' : 'M') + (CX + Math.cos(a) * r).toFixed(1) + ' ' + (CY + Math.sin(a) * r).toFixed(1); } return s + 'Z'; };
    let grid = ''; for (let i = -3; i <= 3; i++) grid += artLine('M' + (CX - 44) + ' ' + (CY + i * 12) + 'H' + (CX + 44) + 'M' + (CX + i * 12) + ' ' + (CY - 44) + 'V' + (CY + 44), artShade(w.dial, .2), 1);
    return band + artPath(p(72), w.metal) + artPath(p(58), w.dial, 2.4) + grid + [45, 135, 225, 315].map(d => { const a = d * Math.PI / 180; return '<circle cx="' + (CX + Math.cos(a) * 64).toFixed(1) + '" cy="' + (CY + Math.sin(a) * 64).toFixed(1) + '" r="3" fill="' + artShade(w.metal, -.4) + '"/>'; }).join('') + face + crown;
  }
  if (w.shape === 'tank') return band + '<rect x="146" y="60" width="108" height="120" rx="6" fill="' + w.metal + '" stroke="' + ART_INK + '" stroke-width="3"/><rect x="160" y="68" width="80" height="104" fill="' + w.dial + '" stroke="' + ART_INK + '" stroke-width="2"/>' + artLine('M164 72h72v96h-72Z', '#b9b4a2', 1) + hands + artWord(CX, CY + 24, 8, ink, w.word) + ['XII', 'III', 'VI', 'IX'].map((t, i) => artWord(CX + [0, 30, 0, -30][i], CY + [-36, 4, 46, 4][i], 10, ink, t)).join('') + artPath('M254 112h9v16h-9Z', '#2f55c4', 2);
  if (w.shape === 'tonneau') return band + artPath('M138 64Q200 40 262 64Q276 120 262 176Q200 200 138 176Q124 120 138 64Z', w.metal) + artPath('M150 74Q200 56 250 74Q262 120 250 166Q200 184 150 166Q138 120 150 74Z', w.dial, 2.2) + artLine('M152 100H248M152 140H248M180 64V176M220 64V176', '#4a4a56', 1.5) + face + [[-52, -46], [52, -46], [-52, 46], [52, 46]].map(([x, y]) => '<circle cx="' + (CX + x) + '" cy="' + (CY + y) + '" r="3.500" fill="#fff6fb" stroke="' + ART_INK + '" stroke-width="1"/>').join('');
  let extras = '';
  if (w.iced) for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; extras += artGem(CX + Math.cos(a) * 62, CY + Math.sin(a) * 62, 7); }
  if (w.bolts) for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .5; extras += '<circle cx="' + (CX + Math.cos(a) * 60).toFixed(1) + '" cy="' + (CY + Math.sin(a) * 60).toFixed(1) + '" r="4.500" fill="#c7ccd8" stroke="' + ART_INK + '" stroke-width="1.200"/><path d="M' + (CX + Math.cos(a) * 60 - 3).toFixed(1) + ' ' + (CY + Math.sin(a) * 60).toFixed(1) + 'h6" stroke="' + ART_INK + '" stroke-width="1.200"/>'; }
  return band + '<circle cx="' + CX + '" cy="' + CY + '" r="72" fill="' + w.metal + '" stroke="' + ART_INK + '" stroke-width="3"/><circle cx="' + CX + '" cy="' + CY + '" r="64" fill="' + w.bezel + '" stroke="' + ART_INK + '" stroke-width="2"/>' + extras + '<circle cx="' + CX + '" cy="' + CY + '" r="55" fill="' + w.dial + '" stroke="' + ART_INK + '" stroke-width="2.400"/>' + face + crown;
}
function shopArt(item: { id: string }): string {
  return '<svg viewBox="0 0 400 240" aria-hidden="true">' + jewelArt(item.id) + '</svg>';
}
