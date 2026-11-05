/* ---------- the Bone Boutique's product pictures: thick outlines, flat colour and real detail ---------- */
const ART_INK = '#14101a';
const artShade = (hex: string, amount: number): string => {
  const n = parseInt(hex.slice(1), 16), part = (v: number): number => Math.max(0, Math.min(255, Math.round(v + (amount > 0 ? (255 - v) * amount : v * amount))));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => part(v).toString(16).padStart(2, '0')).join('');
};
const artPath = (d: string, fill: string, w = 3): string => '<path d="' + d + '" fill="' + fill + '" stroke="' + ART_INK + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"/>';
const artLine = (d: string, colour = ART_INK, w = 2.2): string => '<path d="' + d + '" fill="none" stroke="' + colour + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"/>';
const artWord = (x: number, y: number, size: number, fill: string, words: string, extra = ''): string => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="' + size + '" fill="' + fill + '" ' + extra + '>' + words + '</text>';

/* ---------- cars, three-quarters from the front. Height and length change by kind, the grille by maker ---------- */
function artWheel(x: number, y: number, r: number, rim: string): string {
  let spokes = '';
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, b = a + .22; spokes += '<path d="M' + x + ' ' + y + 'L' + (x + Math.cos(a) * r * .62).toFixed(1) + ' ' + (y + Math.sin(a) * r * .72).toFixed(1) + 'L' + (x + Math.cos(b) * r * .62).toFixed(1) + ' ' + (y + Math.sin(b) * r * .72).toFixed(1) + 'Z" fill="' + rim + '" stroke="' + ART_INK + '" stroke-width="1"/>'; }
  return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r * .86 + '" ry="' + r + '" fill="#08060c" stroke="' + ART_INK + '" stroke-width="3"/><ellipse cx="' + x + '" cy="' + y + '" rx="' + r * .66 + '" ry="' + r * .76 + '" fill="#2c2a36"/>' + spokes + '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r * .15 + '" ry="' + r * .18 + '" fill="' + artShade(rim, -.3) + '" stroke="' + ART_INK + '" stroke-width="1.500"/>';
}
function carGrille(id: string, x: number, y: number, w: number, h: number, colour: string): string {
  const chrome = '#c7ccd8', bars = (n: number, across: boolean, c: string): string => { let s = ''; for (let i = 1; i < n; i++) s += across ? artLine('M' + x + ' ' + (y + h * i / n) + 'H' + (x + w), c, 1.6) : artLine('M' + (x + w * i / n) + ' ' + y + 'V' + (y + h), c, 1.6); return s; };
  const box = (fill: string): string => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + fill + '" stroke="' + ART_INK + '" stroke-width="2.500"/>';
  if (id === 'bmwm4') return artPath('M' + x + ' ' + (y + 4) + 'Q' + x + ' ' + y + ' ' + (x + 6) + ' ' + y + 'H' + (x + w * .44) + 'V' + (y + h) + 'H' + (x + 6) + 'Q' + x + ' ' + (y + h) + ' ' + x + ' ' + (y + h - 4) + 'Z', '#1a1a22', 2.5) + artPath('M' + (x + w) + ' ' + (y + 4) + 'Q' + (x + w) + ' ' + y + ' ' + (x + w - 6) + ' ' + y + 'H' + (x + w * .56) + 'V' + (y + h) + 'H' + (x + w - 6) + 'Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w) + ' ' + (y + h - 4) + 'Z', '#1a1a22', 2.5);
  if (id === 'rollsroyce') return box('#e7e9f0') + bars(9, false, '#7c8090') + artLine('M' + x + ' ' + y + 'H' + (x + w), ART_INK, 3);
  if (id === 'bentley') { let s = box('#16161e'); for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) s += '<path d="M' + (x + 5 + i * w / 6.200) + ' ' + (y + 3 + j * h / 3.100) + 'l4 4-4 4-4-4Z" fill="' + chrome + '"/>'; return s; }
  if (id === 'gwagon') return box(colour) + bars(3, true, ART_INK) + bars(5, false, artShade(colour, .4));
  if (id === 'audir8') return artPath('M' + (x + 8) + ' ' + y + 'H' + (x + w - 8) + 'L' + (x + w) + ' ' + (y + h * .5) + 'L' + (x + w - 14) + ' ' + (y + h) + 'H' + (x + 14) + 'L' + x + ' ' + (y + h * .5) + 'Z', '#101016', 2.5) + bars(6, true, '#4a4a56');
  if (id === 'lamborghini') return artPath('M' + x + ' ' + (y + h * .3) + 'L' + (x + w * .3) + ' ' + (y + h) + 'H' + (x + w * .7) + 'L' + (x + w) + ' ' + (y + h * .3) + 'L' + (x + w * .7) + ' ' + y + 'H' + (x + w * .3) + 'Z', '#0c0c12', 2.5) + artLine('M' + (x + w * .3) + ' ' + y + 'L' + (x + w * .5) + ' ' + (y + h) + 'L' + (x + w * .7) + ' ' + y, '#4a4a56', 1.6);
  if (id === 'ferrari') return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" fill="#0c0c12" stroke="' + ART_INK + '" stroke-width="2.500"/>' + bars(7, false, '#4a4a56');
  if (id === 'porsche911') return '<rect x="' + x + '" y="' + (y + h * .35) + '" width="' + w + '" height="' + h * .5 + '" rx="5" fill="#0c0c12" stroke="' + ART_INK + '" stroke-width="2.500"/>' + artLine('M' + (x + 4) + ' ' + (y + h * .6) + 'H' + (x + w - 4), '#4a4a56', 1.6);
  return box('#22222c') + bars(5, true, '#6a6e7c');
}
function carArt(item: { id: string; base: string; mark: string }): string {
  const [kind, colour] = item.base.split(':');
  const tall = kind === 'suv' ? 1 : kind === 'limo' ? .78 : kind === 'sedan' ? .62 : .42;
  const ground = 208, belt = 118 - tall * 26, roof = belt - 22 - tall * 48, rimCol = kind === 'sport' ? '#d7dbe4' : '#b9becc';
  const dark = artShade(colour, -.32), darker = artShade(colour, -.55), light = artShade(colour, .18), glass = '#39505f', glassLight = '#5c7787';
  const noseX = kind === 'sport' ? 392 : 384, hoodBack = kind === 'sport' ? 214 : 238, hoodTop = belt - (kind === 'sport' ? 4 : 10);
  const faceTop = belt + (kind === 'sport' ? 12 : 8);
  let s = '<ellipse cx="205" cy="' + (ground + 12) + '" rx="192" ry="13" fill="#000" opacity=".28"/>';
  s += artWheel(82, ground - 28, 34, rimCol);
  /* the long side of the car */
  s += artPath('M18 ' + (ground - 26) + 'L16 ' + (belt + 26) + 'Q16 ' + (belt + 6) + ' 34 ' + (belt + 2) + 'L' + hoodBack + ' ' + (belt - 2) + 'L274 ' + faceTop + 'V' + (ground - 12) + 'L232 ' + (ground - 18) + 'Q228 ' + (ground - 66) + ' 196 ' + (ground - 66) + 'Q176 ' + (ground - 66) + ' 170 ' + (ground - 24) + 'L124 ' + (ground - 26) + 'Q118 ' + (ground - 66) + ' 82 ' + (ground - 66) + 'Q50 ' + (ground - 66) + ' 44 ' + (ground - 28) + 'Z', dark);
  s += artLine('M22 ' + (belt + 26) + 'L268 ' + (belt + 30), darker, 2.5) + artLine('M132 ' + (belt + 2) + 'L136 ' + (ground - 28) + 'M204 ' + belt + 'L204 ' + (ground - 66), ART_INK, 2.2);
  s += artPath('M126 ' + (ground - 24) + 'L170 ' + (ground - 22) + 'L168 ' + (ground - 14) + 'L124 ' + (ground - 16) + 'Z', darker, 2);
  s += artPath('M150 ' + (belt + 12) + 'h14v5h-14Z', artShade(colour, .4), 1.5) + artPath('M214 ' + (belt + 12) + 'h14v5h-14Z', artShade(colour, .4), 1.5);
  /* the windows and roof */
  s += artPath('M40 ' + (belt + 2) + 'L66 ' + (roof + 12) + 'Q74 ' + roof + ' 92 ' + roof + 'L' + (hoodBack - 2) + ' ' + (roof - 2) + 'Q' + (hoodBack + 16) + ' ' + (roof - 2) + ' ' + (hoodBack + 26) + ' ' + (roof + 8) + 'L' + (hoodBack + 60) + ' ' + (hoodTop - 2) + 'L' + hoodBack + ' ' + (belt - 2) + 'Z', '#1b1a26');
  s += artPath('M58 ' + belt + 'L74 ' + (roof + 14) + 'Q80 ' + (roof + 8) + ' 92 ' + (roof + 8) + 'L124 ' + (roof + 6) + 'L124 ' + belt + 'Z', glass, 2) + artPath('M132 ' + belt + 'L132 ' + (roof + 6) + 'L' + (hoodBack - 28) + ' ' + (roof + 4) + 'L' + (hoodBack - 18) + ' ' + (belt - 1) + 'Z', glass, 2);
  s += artPath('M' + (hoodBack - 12) + ' ' + (roof + 4) + 'L' + (hoodBack + 22) + ' ' + (roof + 6) + 'L' + (hoodBack + 52) + ' ' + (hoodTop - 4) + 'L' + (hoodBack + 4) + ' ' + (belt - 4) + 'Z', glassLight, 2);
  s += artLine('M' + (hoodBack + 2) + ' ' + (roof + 12) + 'L' + (hoodBack + 14) + ' ' + (hoodTop - 12), '#a8c4d2', 3);
  /* the front and bonnet */
  s += artPath('M274 ' + faceTop + 'L' + (noseX - 8) + ' ' + (faceTop + 6) + 'Q' + (noseX + 4) + ' ' + (faceTop + 12) + ' ' + (noseX + 4) + ' ' + (faceTop + 30) + 'L' + (noseX + 6) + ' ' + (ground - 24) + 'Q' + (noseX + 4) + ' ' + (ground - 8) + ' ' + (noseX - 16) + ' ' + (ground - 6) + 'L274 ' + (ground - 6) + 'Z', colour);
  s += artPath('M' + hoodBack + ' ' + (belt - 2) + 'L' + (hoodBack + 60) + ' ' + (hoodTop - 2) + 'Q' + (noseX - 40) + ' ' + (hoodTop + 2) + ' ' + (noseX - 8) + ' ' + (faceTop + 6) + 'L274 ' + faceTop + 'Z', light);
  s += artLine('M' + (hoodBack + 30) + ' ' + (hoodTop + 6) + 'L' + (noseX - 54) + ' ' + (faceTop + 2), artShade(colour, .45), 2);
  /* lights, grille and bumper */
  const mid = (274 + noseX) / 2 + 2, faceH = ground - 6 - faceTop, gw = kind === 'sport' ? 58 : 66, gh = faceH * (kind === 'sport' ? .36 : .34), gy = faceTop + faceH * (kind === 'sport' ? .36 : .2);
  s += artPath('M278 ' + (faceTop + 7) + 'L' + (mid - 22) + ' ' + (faceTop + 9) + 'L' + (mid - 26) + ' ' + (faceTop + 22) + 'Q290 ' + (faceTop + 24) + ' 278 ' + (faceTop + 16) + 'Z', '#e9fbff', 2.2) + '<circle cx="' + (mid - 36) + '" cy="' + (faceTop + 15) + '" r="4.500" fill="#fff6c2" stroke="' + ART_INK + '" stroke-width="1.500"/>';
  s += artPath('M' + (mid + 24) + ' ' + (faceTop + 10) + 'L' + (noseX - 2) + ' ' + (faceTop + 13) + 'L' + (noseX) + ' ' + (faceTop + 24) + 'Q' + (mid + 40) + ' ' + (faceTop + 26) + ' ' + (mid + 28) + ' ' + (faceTop + 23) + 'Z', '#e9fbff', 2.2) + '<circle cx="' + (noseX - 10) + '" cy="' + (faceTop + 18) + '" r="3.500" fill="#fff6c2" stroke="' + ART_INK + '" stroke-width="1.500"/>';
  s += carGrille(item.id, mid - gw / 2, gy, gw, gh, colour);
  const lowY = gy + gh + faceH * .08;
  s += artPath('M284 ' + lowY + 'H' + (noseX - 6) + 'L' + (noseX - 10) + ' ' + (lowY + faceH * .14) + 'H288Z', darker, 2.2) + artLine('M292 ' + (lowY + faceH * .07) + 'H' + (noseX - 16), '#55525f', 1.6);
  s += '<rect x="' + (mid - 26) + '" y="' + (ground - 24) + '" width="52" height="13" rx="2" fill="#fff6c2" stroke="' + ART_INK + '" stroke-width="1.500"/>' + artWord(mid, ground - 14, item.mark.length > 8 ? 6 : 8, ART_INK, item.mark);
  s += artPath('M' + (hoodBack + 44) + ' ' + (hoodTop - 12) + 'L' + (hoodBack + 58) + ' ' + (hoodTop - 16) + 'Q' + (hoodBack + 66) + ' ' + (hoodTop - 14) + ' ' + (hoodBack + 62) + ' ' + (hoodTop - 6) + 'L' + (hoodBack + 48) + ' ' + (hoodTop - 4) + 'Z', darker, 2);
  if (kind === 'sport') s += artPath('M16 ' + (belt + 6) + 'L4 ' + (belt - 2) + 'L38 ' + (belt - 6) + 'L46 ' + (belt + 2) + 'Z', darker, 2.2);
  if (item.id === 'rollsroyce') s += artPath('M' + mid + ' ' + (faceTop - 9) + 'l-5 9h10Z', '#e7e9f0', 1.8);
  s += artWheel(202, ground - 24, 38, rimCol);
  return s;
}
/* ---------- hats, each with a white sticker edge ---------- */
function hatArt(item: { id: string; base: string; mark: string }): string {
  const look: Record<string, [string, string, string]> = { nikecap: ['#14141c', '#ff5a1f', '#fff6fb'], nikebeanie: ['#c0392b', '#7e1f15', '#fff6fb'], pumacap: ['#1f4fa8', '#143573', '#fff6fb'], pumabucket: ['#f4d35e', '#b89a2a', '#14101a'], pradabucket: ['#14141c', '#3a3a46', '#e4e4ec'], pradaberet: ['#ff4fa8', '#b01d6e', '#14101a'] };
  const [col, dark, word] = look[item.id] || look.nikecap;
  const edge = (d: string): string => '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="16" stroke-linejoin="round"/>';
  if (item.base === 'cap') {
    const crown = 'M112 164C100 92 152 40 226 40C306 40 356 96 358 176Q240 148 112 164Z', brim = 'M112 162Q240 142 358 174C366 196 330 206 290 196Q200 172 124 214C86 236 28 240 34 208C40 184 84 170 112 162Z';
    return edge(crown) + edge(brim) + artPath(crown, col) + artPath(brim, dark) + artLine('M226 40C186 70 170 112 170 156M226 40C262 72 282 118 284 164', artShade(col, .28)) + artLine('M58 208C96 192 160 164 236 164', artShade(dark, .3)) + '<ellipse cx="226" cy="38" rx="14" ry="7" fill="' + dark + '" stroke="' + ART_INK + '" stroke-width="2.500"/>' + ['168,76', '250,64', '316,104'].map(p => { const [x, y] = p.split(','); return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="' + artShade(col, -.3) + '" stroke="' + artShade(col, .4) + '" stroke-width="1.500"/>'; }).join('') + artWord(174, 128, 36, word, item.mark, 'transform="rotate(-6 174 128)"');
  }
  if (item.base === 'beanie') {
    const body = 'M86 170C80 78 140 34 210 34C282 34 336 80 332 170Z', cuff = 'M72 164Q210 136 346 164L352 222Q210 196 66 222Z';
    let ribs = ''; for (let i = 1; i < 12; i++) ribs += artLine('M' + (70 + i * 23) + ' ' + (150 - Math.sin(i / 12 * Math.PI) * 6) + 'L' + (64 + i * 24) + ' ' + (212 - Math.sin(i / 12 * Math.PI) * 14), dark, 2);
    return edge(body) + edge(cuff) + artPath(body, col) + artLine('M120 150C126 96 150 66 182 50M180 148C184 100 192 70 206 40M250 148C246 100 236 70 224 42M302 152C296 104 276 72 248 50', dark, 2.4) + artPath(cuff, artShade(col, .1)) + ribs + '<rect x="150" y="164" width="118" height="30" rx="3" fill="#14101a"/>' + artWord(209, 186, 20, '#fff6fb', item.mark);
  }
  if (item.base === 'beret') {
    const body = 'M50 138C46 76 136 34 228 38C322 42 382 92 368 144C356 186 250 200 170 192C100 186 54 176 50 138Z', band = 'M122 182Q210 212 298 180L300 208Q210 240 120 210Z';
    return edge(body) + edge(band) + artPath(body, col) + artLine('M90 112C130 70 210 52 280 68M72 146C140 170 270 172 348 130', dark, 2.4) + '<path d="M214 38l6-20" stroke="' + ART_INK + '" stroke-width="7" stroke-linecap="round"/>' + artPath(band, dark) + artLine('M126 194Q210 222 296 192', artShade(col, .4), 2) + '<path d="M180 118h60l-30 28Z" fill="#14101a"/>' + artWord(210, 130, 12, '#fff6fb', item.mark);
  }
  const crown = 'M124 136C116 70 146 36 212 36C278 36 306 70 298 136Z', brim = 'M124 130Q212 106 298 130L366 206Q212 158 56 206Z';
  return edge(crown) + edge(brim) + artPath(crown, col) + artLine('M130 122Q212 100 292 122M212 36V108M158 52C148 74 144 98 146 116M266 52C276 74 280 98 278 116', dark, 2.2) + artPath(brim, dark) + artLine('M108 174Q212 140 316 174M84 188Q212 148 340 188', artShade(col, .3), 1.8) + (item.mark === 'PRADA' ? '<path d="M156 72h112l-56 52Z" fill="#14101a" stroke="#e4e4ec" stroke-width="2.500"/>' + artWord(212, 92, 16, '#e4e4ec', item.mark) : artWord(212, 104, 28, word, item.mark));
}
/* ---------- shoes, a pair with laces, stitching and thick soles ---------- */
function shoeOne(c: { upper: string; toe: string; sole: string; panel: string; lace: string; low: boolean; chunky: boolean; word: string; stripes: boolean; mesh: boolean }): string {
  /* A side-on sneaker: toe on the left, heel on the right. Low shoes have a lower collar, chunky ones a deeper sole. */
  const top = c.low ? 58 : 34, base = c.chunky ? 138 : 148, depth = c.chunky ? 40 : 26;
  const upper = 'M22 ' + base + 'C20 ' + (base - 24) + ' 38 ' + (base - 38) + ' 70 ' + (base - 46) + 'L116 ' + (top + 28) + 'Q126 ' + (top + 20) + ' 138 ' + (top + 18) + 'L186 ' + top + 'Q206 ' + (top - 8) + ' 228 ' + top + 'Q252 ' + (top + 14) + ' 256 ' + base + 'Z';
  let s = artPath(upper, c.upper);
  if (c.mesh) for (let i = 0; i < 9; i++) s += artLine('M' + (96 + i * 16) + ' ' + (base - 2) + 'L' + (112 + i * 14) + ' ' + (base - 44), artShade(c.upper, -.14), 1.3);
  /* the toe cap and its stitching */
  s += artPath('M22 ' + base + 'C20 ' + (base - 24) + ' 38 ' + (base - 38) + ' 70 ' + (base - 46) + 'C88 ' + (base - 32) + ' 96 ' + (base - 16) + ' 96 ' + base + 'Z', c.toe, 2.6);
  s += '<path d="M72 ' + (base - 38) + 'C84 ' + (base - 26) + ' 88 ' + (base - 14) + ' 88 ' + (base - 3) + '" fill="none" stroke="' + artShade(c.toe, -.3) + '" stroke-width="1.500" stroke-dasharray="2 4"/>' + artLine('M38 ' + (base - 26) + 'Q50 ' + (base - 34) + ' 62 ' + (base - 38), artShade(c.toe, .5), 3);
  /* the brand's sweep along the side */
  if (c.stripes) s += artPath('M104 ' + (base - 2) + 'C136 ' + (base - 10) + ' 172 ' + (base - 28) + ' 214 ' + (base - 62) + 'L222 ' + (base - 46) + 'C190 ' + (base - 16) + ' 158 ' + (base - 2) + ' 134 ' + (base - 1) + 'Z', c.panel, 2.2);
  /* the heel */
  s += artPath('M214 ' + base + 'Q226 ' + (top + 40) + ' 214 ' + (top - 3) + 'Q222 ' + (top - 3) + ' 228 ' + top + 'Q252 ' + (top + 14) + ' 256 ' + base + 'Z', c.panel, 2.4);
  s += artLine('M224 ' + (top + 18) + 'Q236 ' + (top + 28) + ' 240 ' + (base - 12), artShade(c.panel, .4), 2.4);
  /* the opening, tongue and lace panel */
  s += artPath('M140 ' + (top + 14) + 'Q148 ' + (top - 16) + ' 176 ' + (top - 18) + 'Q186 ' + (top - 16) + ' 188 ' + (top - 2) + 'L150 ' + (top + 20) + 'Z', artShade(c.upper, -.1), 2.2);
  s += artPath('M186 ' + (top + 1) + 'Q206 ' + (top - 12) + ' 226 ' + (top - 1) + 'Q210 ' + (top + 12) + ' 192 ' + (top + 10) + 'Z', '#2c2436', 2.2);
  s += artPath('M78 ' + (base - 50) + 'L136 ' + (top + 18) + 'L186 ' + (top + 2) + 'L196 ' + (top + 14) + 'L132 ' + (top + 40) + 'L98 ' + (base - 34) + 'Z', artShade(c.upper, -.06), 2.2);
  for (let i = 0; i < 5; i++) {
    const k = i / 4, x = 92 + k * 88, y = base - 50 + k * (top + 8 - base + 50), lace = 'M' + x + ' ' + (y + 12) + 'L' + (x + 13) + ' ' + (y - 6);
    s += artLine(lace, ART_INK, 7.5) + artLine(lace, c.lace, 4.5);
  }
  s += artWord(170, base - 8, 13, contrastInk(c.upper), c.word);
  /* the sole */
  const sole = 'M14 ' + (base + depth - 8) + 'Q10 ' + base + ' 22 ' + (base - 2) + 'H256Q270 ' + base + ' 268 ' + (base + depth - 8) + 'Q266 ' + (base + depth) + ' 254 ' + (base + depth) + 'H28Q16 ' + (base + depth) + ' 14 ' + (base + depth - 8) + 'Z';
  s += artPath(sole, c.sole) + artLine('M20 ' + (base + 7) + 'H262', artShade(c.sole, -.22), 2);
  if (c.chunky) s += artPath('M86 ' + (base + 16) + 'Q130 ' + (base + 8) + ' 174 ' + (base + 16) + 'Q212 ' + (base + 26) + ' 256 ' + (base + 14) + 'V' + (base + 32) + 'H86Z', c.panel, 2) + artLine('M30 ' + (base + 30) + 'H250', artShade(c.sole, -.3), 1.6);
  else s += '<path d="M24 ' + (base + 17) + 'H258" stroke="' + artShade(c.sole, -.3) + '" stroke-width="1.500" stroke-dasharray="3 5"/>';
  return s;
}
const contrastInk = (hex: string): string => { const n = parseInt(hex.slice(1), 16); return (n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11 > 150 ? ART_INK : '#fff6fb'; };
function shoeArt(item: { id: string; mark: string }): string {
  const looks: Record<string, Parameters<typeof shoeOne>[0]> = {
    nikeaf1: { upper: '#f6f6f2', toe: '#ffffff', sole: '#fff6e0', panel: '#e6e6e0', lace: '#ffffff', low: false, chunky: false, word: item.mark, stripes: true, mesh: false },
    nikedunk: { upper: '#fff6fb', toe: '#ff1f8f', sole: '#f4efe6', panel: '#ff1f8f', lace: '#ffffff', low: false, chunky: false, word: item.mark, stripes: true, mesh: false },
    pumasuede: { upper: '#c0392b', toe: '#a52f23', sole: '#f4efe6', panel: '#f4efe6', lace: '#ffffff', low: true, chunky: false, word: item.mark, stripes: true, mesh: false },
    pumaspeedcat: { upper: '#14141c', toe: '#26262f', sole: '#c0392b', panel: '#c0392b', lace: '#e4e4ec', low: true, chunky: false, word: item.mark, stripes: true, mesh: false },
    asicskayano: { upper: '#c7d3e0', toe: '#8fa3b8', sole: '#fff6fb', panel: '#1f3a8a', lace: '#ffffff', low: true, chunky: true, word: item.mark, stripes: true, mesh: true },
    asicsnyc: { upper: '#e9e4d6', toe: '#b8ae96', sole: '#f6f0ff', panel: '#35dcc8', lace: '#fff6fb', low: true, chunky: true, word: item.mark, stripes: true, mesh: true },
  };
  const look = looks[item.id] || looks.nikeaf1, one = shoeOne(look);
  return '<ellipse cx="190" cy="226" rx="180" ry="10" fill="#000" opacity=".2"/><g transform="translate(116 2) scale(.9)">' + one + '</g><g transform="translate(0 28) scale(1)">' + one + '</g>';
}
/* ---------- jewellery and watches ---------- */
const artGem = (x: number, y: number, r: number, fill = '#e4f6ff'): string => '<path d="M' + x + ' ' + (y - r) + 'L' + (x + r) + ' ' + (y - r * .25) + 'L' + x + ' ' + (y + r) + 'L' + (x - r) + ' ' + (y - r * .25) + 'Z" fill="' + fill + '" stroke="' + ART_INK + '" stroke-width="2.200" stroke-linejoin="round"/><path d="M' + (x - r) + ' ' + (y - r * .25) + 'H' + (x + r) + 'M' + (x - r * .45) + ' ' + (y - r * .25) + 'L' + x + ' ' + (y - r) + 'L' + (x + r * .45) + ' ' + (y - r * .25) + 'L' + x + ' ' + (y + r) + 'Z" fill="none" stroke="#6fb8e6" stroke-width="1.200"/>';
function jewelArt(item: { id: string; name: string; mark: string }): string {
  const arc = (n: number, draw: (x: number, y: number, i: number) => string): string => { let s = ''; for (let i = 0; i < n; i++) { const a = Math.PI * (.04 + .92 * i / (n - 1)); s += draw(200 + Math.cos(a) * 158, 8 + Math.sin(a) * 136, i); } return s; };
  if (item.id === 'diamondpendant') return arc(41, (x, y) => '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.600" fill="#e0b83c" stroke="' + ART_INK + '" stroke-width=".800"/>') + artPath('M192 146h16v8h-16Z', '#e0b83c', 2) + artGem(200, 188, 38);
  if (item.id === 'tennisnecklace') return arc(25, (x, y) => artGem(x, y, 10)) + '<path d="M170 34l6-14 6 14 14 6-14 6-6 14-6-14-14-6Z" fill="#fff" opacity=".0"/>' + artGem(200, 186, 26, '#d4f0ff');
  if (item.id === 'diamondchain') return arc(21, (x, y, i) => '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="13" ry="9" fill="#eaf7ff" stroke="' + ART_INK + '" stroke-width="2.400" transform="rotate(' + (i * 8.700 - 87).toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="#8fd4ff"/>') + artPath('M152 158H248L262 186L200 232L138 186Z', '#eaf7ff') + artGem(200, 186, 24, '#bfe8ff') + artGem(166, 178, 9) + artGem(234, 178, 9);
  if (item.id === 'tennisbracelet') { let s = ''; for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; s += artGem(200 + Math.cos(a) * 120, 118 + Math.sin(a) * 74, 13); } return '<ellipse cx="200" cy="118" rx="120" ry="74" fill="none" stroke="#c7ccd8" stroke-width="8"/>' + s; }
  const W: Record<string, [string, string, string, string, boolean]> = { rolexsub: ['#d7dbe4', '#0f7a4f', '#0b5c3b', 'ROLEX', false], rolexdaydate: ['#e0b83c', '#f6e7a8', '#c9a227', 'ROLEX', false], aproyaloak: ['#c7ccd8', '#1f3a8a', '#9aa0ae', 'AP', true], pateknautilus: ['#e8a98a', '#23405e', '#c98463', 'PATEK', false] };
  const [metal, dial, bezel, word, oct] = W[item.id] || W.rolexsub, dialText = dial === '#f6e7a8' ? ART_INK : '#fff6fb';
  let links = '';
  for (let i = 0; i < 4; i++) { const y = 12 + i * 15; links += '<path d="M160 ' + y + 'h80" stroke="' + ART_INK + '" stroke-width="2"/>' + '<path d="M160 ' + (236 - i * 15) + 'h80" stroke="' + ART_INK + '" stroke-width="2"/>'; }
  const band = artPath('M156 4H244L238 76H162Z', metal) + artPath('M162 164H238L244 238H156Z', metal) + artLine('M186 4V76M214 4V76M186 164V238M214 164V238', artShade(metal, -.35), 2) + links;
  const CX = 200, CY = 120;
  let ticks = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ticks += artLine('M' + (CX + Math.cos(a) * 42).toFixed(1) + ' ' + (CY + Math.sin(a) * 42).toFixed(1) + 'L' + (CX + Math.cos(a) * 50).toFixed(1) + ' ' + (CY + Math.sin(a) * 50).toFixed(1), dialText, i % 3 ? 2.2 : 4); }
  const hands = artLine('M' + CX + ' ' + CY + 'L' + (CX - 22) + ' ' + (CY - 24), dialText, 4.5) + artLine('M' + CX + ' ' + CY + 'L' + (CX + 32) + ' ' + (CY - 26), dialText, 3.2) + '<circle cx="' + CX + '" cy="' + CY + '" r="4" fill="' + metal + '" stroke="' + ART_INK + '" stroke-width="1.500"/>';
  const label = artWord(CX, CY + 26, 11, dialText, word) + artWord(CX, CY - 34, 7, dialText, 'SWISS MADE');
  if (oct) { const p = (r: number): string => { let s = ''; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; s += (i ? 'L' : 'M') + (CX + Math.cos(a) * r).toFixed(1) + ' ' + (CY + Math.sin(a) * r).toFixed(1); } return s + 'Z'; }; let grid = ''; for (let i = -3; i <= 3; i++) grid += artLine('M' + (CX - 44) + ' ' + (CY + i * 12) + 'H' + (CX + 44) + 'M' + (CX + i * 12) + ' ' + (CY - 44) + 'V' + (CY + 44), artShade(dial, .2), 1); return band + artPath(p(72), metal) + artPath(p(58), dial, 2.4) + grid + ['45', '135', '225', '315'].map(d => { const a = Number(d) * Math.PI / 180; return '<circle cx="' + (CX + Math.cos(a) * 64).toFixed(1) + '" cy="' + (CY + Math.sin(a) * 64).toFixed(1) + '" r="3" fill="' + artShade(metal, -.4) + '"/>'; }).join('') + ticks + hands + label; }
  return band + '<circle cx="' + CX + '" cy="' + CY + '" r="72" fill="' + metal + '" stroke="' + ART_INK + '" stroke-width="3"/><circle cx="' + CX + '" cy="' + CY + '" r="64" fill="' + bezel + '" stroke="' + ART_INK + '" stroke-width="2"/><circle cx="' + CX + '" cy="' + CY + '" r="55" fill="' + dial + '" stroke="' + ART_INK + '" stroke-width="2.400"/>' + ticks + hands + label + artPath('M272 112h9v16h-9Z', metal, 2);
}
function shopArt(item: { id: string; slot: string; base: string; name: string; mark: string }): string {
  const inner = item.slot === 'car' ? carArt(item) : item.slot === 'headwear' ? hatArt(item) : item.slot === 'shoes' ? shoeArt(item) : jewelArt(item);
  return '<svg viewBox="0 0 400 240" aria-hidden="true">' + inner + '</svg>';
}
