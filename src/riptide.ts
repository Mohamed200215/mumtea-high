/* ---------- Riptide Run: a mermaid swim through the flooded basement ---------- */
interface MerOutfit { tail: string; colour: string; fin: string; top: string; hair: string; neck: string }
const MER_COLOURS: Array<[string, string, string]> = [
  ['Lagoon', '#35dcc8', '#7fd6ff'], ['Aqua', '#19b7e8', '#8df0d8'], ['Hot pink', '#ff1f8f', '#ffc2e0'], ['Violet', '#8a2be2', '#ff8cc8'],
  ['Gold', '#f4c23e', '#ff8c1a'], ['Coral', '#ff7a66', '#ffd1a8'], ['Midnight', '#2c2436', '#35dcc8'], ['Pearl', '#dcecff', '#f7b8cf'],
];
const MER_ROWS: Array<[keyof MerOutfit, string, Array<[string, string]>]> = [
  ['tail', 'Tail', [['scales', 'Scales'], ['net', 'Pearl net'], ['silk', 'Silk ribbons'], ['bone', 'Bone']]],
  ['fin', 'Fin', [['fan', 'Fan'], ['fork', 'Swallow'], ['shred', 'Shredded']]],
  ['top', 'Top', [['scale', 'Scale top'], ['shell', 'Shell top'], ['net', 'Pearl net'], ['own', 'My own top']]],
  ['hair', 'In your hair', [['shell', 'Gold shell'], ['flower', 'Sea flower'], ['star', 'Starfish'], ['none', 'Nothing']]],
  ['neck', 'Necklace', [['coral', 'Coral'], ['pearls', 'Pearls'], ['own', 'My own']]],
];
/* One corner of the game's frame: vines, curls, leaves and flowers growing along both edges from the corner. */
function merCorner(): string {
  const DEEP = '#159aa3', MID = '#27bfc4', AQUA = '#5fe6ea', PALE = '#b9f2f2';
  const flower = (x: number, y: number, r: number, turn = 0) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + turn + ') scale(' + r / 20 + ')">' + [0, 72, 144, 216, 288].map(a => '<path transform="rotate(' + a + ')" d="M0 -3C-13 -7 -13 -21 -4 -23Q0 -20 4 -23C13 -21 13 -7 0 -3Z" fill="' + AQUA + '" stroke="#e8ffff" stroke-width="1"/>').join('') + '<circle r="4.500" fill="#eafffe"/>' + [0, 72, 144, 216, 288].map(a => '<path transform="rotate(' + a + ')" d="M0 -3V-8" stroke="' + DEEP + '" stroke-width="1.400" stroke-linecap="round"/>').join('') + '</g>';
  const leaf = (x: number, y: number, turn: number, s = 1) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + turn + ') scale(' + s + ')"><path d="M0 0C14 -15 42 -18 66 0C42 16 14 15 0 0Z" fill="' + DEEP + '"/><path d="M4 0C22 -2 42 -2 60 0M20 -1L30 -9M30 -1L42 -8M20 0L30 7M30 0L42 7" fill="none" stroke="#c9fbfa" stroke-width="1.300" stroke-linecap="round"/></g>';
  const line = (d: string, w: number, c = MID) => '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const dot = (x: number, y: number, r = 2.6, c = DEEP) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>';
  const half = line('M92 40A44 44 0 1 1 150 86', 2.6, PALE) + line('M118 56A20 20 0 0 1 132 74', 1.5, PALE)
    + '<path d="M20 30C66 14 112 40 170 24C208 13 244 16 284 3C248 25 208 28 172 36C112 50 66 28 22 40Z" fill="' + DEEP + '"/>'
    + line('M40 34C50 62 86 66 96 46C102 30 80 22 74 36', 4, DEEP) + dot(74, 36, 4)
    + line('M110 38C122 16 152 14 156 30C158 42 140 44 138 32', 3.2, MID) + dot(138, 32, 3.2, MID)
    + leaf(150, 36, 26, .9) + leaf(226, 21, -28, .72)
    + line('M196 24C208 44 236 46 240 32C242 22 226 20 224 31', 2.8, DEEP) + dot(224, 31, 2.8)
    + line('M112 40C118 54 118 64 112 74', 2, MID) + dot(112, 76, 2.2) + line('M178 30C186 44 188 54 184 66', 2, MID) + dot(184, 68, 2.2)
    + flower(262, 36, 20, 12) + flower(92, 86, 11, 30)
    + dot(288, 6, 2.4, MID);
  const twin = '<g transform="matrix(0 1 1 0 0 0)">' + half + '</g>';
  return '<svg viewBox="0 0 300 300" aria-hidden="true">' + half + twin
    + line('M18 18C48 22 66 44 62 64C58 80 38 78 38 62C38 52 50 50 52 58', 5, DEEP) + dot(52, 58, 4.4)
    + line('M18 18C24 40 18 70 8 92M18 18C40 24 70 18 92 8', 3, MID)
    + flower(24, 24, 22, 8) + flower(82, 28, 8, 0) + flower(28, 84, 8, 20) + '</svg>';
}
(function () {
  const W = 640, H = 360, ZOOM = 2;
  const [cv, c] = makeCanvas('Riptide Run game area');
  cv.width = W * ZOOM; cv.height = H * ZOOM; c.scale(ZOOM, ZOOM);

  /* ---------- the locker ---------- */
  const saved = store.get<Partial<MerOutfit>>('mermaid', {});
  const outfit: MerOutfit = { tail: 'scales', colour: 'Lagoon', fin: 'fan', top: 'net', hair: 'shell', neck: 'coral' };
  MER_ROWS.forEach(([key, , items]) => { const v = saved[key]; if (items.some(i => i[0] === v)) outfit[key] = v as string; });
  if (MER_COLOURS.some(m => m[0] === saved.colour)) outfit.colour = saved.colour as string;
  const lockerRows = el('div', { cls: 'merrows' });
  const locker = el('div', { cls: 'merlocker wframe' }, el('h4', { text: 'Mermaid locker' }), lockerRows);
  function drawLocker(): void {
    lockerRows.textContent = '';
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Tail colour' }), ...MER_COLOURS.map(([name, a]) => {
      const b = el('button', { cls: 'wswatch', type: 'button', 'aria-label': name, title: name, 'data-mer': 'colour:' + name, 'aria-pressed': outfit.colour === name, onclick() { wear('colour', name); } });
      b.style.background = a;
      return b;
    })));
    MER_ROWS.forEach(([key, label, items]) => lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: label }), ...items.map(([id, name]) =>
      el('button', { cls: 'wchip', type: 'button', 'data-mer': key + ':' + id, 'aria-pressed': outfit[key] === id, onclick() { wear(key, id); } }, name)))));
  }
  function wear(key: keyof MerOutfit, value: string): void {
    outfit[key] = value; store.set('mermaid', outfit); drawLocker();
    if (mode === 'done') mode = 'idle';
    dress(); kick();
  }
  const p = makePanel('riptide', 'Riptide Run', 'Pick your mermaid outfit, then dive in. You swim as the ghoul you made, or as Ms. Fangtastic until you have one. Hold the screen, the space bar or the up arrow to rise. Let go to sink. Pearls are worth 5. Three hits and you surface.', [el('div', { cls: 'merframe' }, cv, ...['tl', 'tr', 'bl', 'br'].map(at => { const corner = el('div', { cls: 'mercorner ' + at }); corner.innerHTML = merCorner(); return corner; }), el('img', { cls: 'mercrest', src: GAME_ART.riptide, alt: '' }))], 'Dive in');
  p.root.append(locker);

  /* ---------- game state ---------- */
  type Mode = 'idle' | 'intro' | 'play' | 'outro' | 'done';
  type Kind = 'jelly' | 'piranha' | 'urchin' | 'pearl';
  interface Thing { x: number; y: number; r: number; kind: Kind; phase: number; pace: number }
  interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; col: string; size: number }
  interface Float { x: number; y: number; text: string; life: number }
  let mode: Mode = 'idle', rise = false, y = 180, vy = 0, swimX = 170, things: Thing[] = [], score = 0, lives = 3, safe = 0, last = 0, gap = 0, far = 0, shown = 0, hunt = false;
  let clock = 0, stroke = 0, tailT = 0, modeT = 0, shake = 0, flash = 0, slow = 0, petX = 0, petY = 0, looping = false, visible = false, sparks: Spark[] = [], floats: Float[] = [], bubbles: Spark[] = [], bubbleGap = 0, finalBest = 0;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const INTRO = 2300, OUTRO = 1800;
  const active = () => mode === 'intro' || mode === 'play' || mode === 'outro';
  const stat = () => { p.stat.textContent = (mode === 'play' || mode === 'intro' ? 'Score: ' + Math.floor(score) + '  Lives: ' + lives + '  ' : '') + 'Best: ' + displayBest('riptide'); };
  const colours = () => MER_COLOURS.find(m => m[0] === outfit.colour) || MER_COLOURS[0];

  /* ---------- the world, painted once and slid past ---------- */
  function sheet(w: number, h: number, paint: (x: CanvasRenderingContext2D) => void): HTMLCanvasElement {
    const s = document.createElement('canvas'); s.width = w * ZOOM; s.height = h * ZOOM;
    const x = s.getContext('2d') as CanvasRenderingContext2D; x.scale(ZOOM, ZOOM); paint(x);
    return s;
  }
  const dice = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const INK_LINE = '#120a1c';
  function outline(x: CanvasRenderingContext2D, w = 2): void { x.strokeStyle = INK_LINE; x.lineWidth = w; x.lineJoin = 'round'; x.stroke(); }
  function archPath(x: CanvasRenderingContext2D, ax: number, floor: number, half: number, top: number): void {
    x.moveTo(ax - half, floor); x.lineTo(ax - half, top + half * 1.2);
    x.quadraticCurveTo(ax - half, top + half * .3, ax, top); x.quadraticCurveTo(ax + half, top + half * .3, ax + half, top + half * 1.2); x.lineTo(ax + half, floor); x.closePath();
  }
  function lockers(x: CanvasRenderingContext2D, lx: number, ly: number, n: number): void {
    const cols = ['#ff1f8f', '#35dcc8', '#8a2be2'];
    for (let i = 0; i < n; i++) {
      x.fillStyle = cols[i % 3]; x.beginPath(); x.rect(lx + i * 25, ly, 25, 88); x.fill(); outline(x);
      x.fillStyle = 'rgba(0,0,0,.28)'; for (let v = 0; v < 3; v++) x.fillRect(lx + i * 25 + 6, ly + 9 + v * 6, 13, 2.5);
      x.fillStyle = '#f4d35e'; x.beginPath(); x.arc(lx + i * 25 + 20, ly + 48, 2.4, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(lx + i * 25 + 3, ly + 3, 3, 80);
    }
  }
  function coffin(x: CanvasRenderingContext2D, cx: number, cy: number, tilt: number): void {
    x.save(); x.translate(cx, cy); x.rotate(tilt);
    x.fillStyle = '#d40f72'; x.beginPath(); x.moveTo(-14, -36); x.lineTo(14, -36); x.lineTo(26, -10); x.lineTo(16, 42); x.lineTo(-16, 42); x.lineTo(-26, -10); x.closePath(); x.fill(); outline(x, 2.4);
    x.strokeStyle = '#ff8cc8'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-10, -30); x.lineTo(10, -30); x.lineTo(20, -9); x.lineTo(12, 36); x.lineTo(-12, 36); x.lineTo(-20, -9); x.closePath(); x.stroke();
    x.restore();
  }
  function teacup(x: CanvasRenderingContext2D, cx: number, cy: number): void {
    x.save(); x.translate(cx, cy); x.rotate(-.18);
    x.fillStyle = '#fff6fb'; x.beginPath(); x.ellipse(0, 26, 48, 9, 0, 0, 7); x.fill(); outline(x, 2.4);
    x.beginPath(); x.moveTo(-34, -20); x.quadraticCurveTo(-30, 22, 0, 24); x.quadraticCurveTo(30, 22, 34, -20); x.closePath(); x.fill(); outline(x, 2.4);
    x.beginPath(); x.arc(38, -4, 11, -1.4, 1.5); x.lineWidth = 8; x.strokeStyle = INK_LINE; x.stroke(); x.lineWidth = 4; x.strokeStyle = '#fff6fb'; x.stroke();
    x.fillStyle = '#ff1f8f'; x.beginPath(); x.ellipse(0, -20, 34, 7, 0, 0, 7); x.fill(); outline(x, 2);
    x.strokeStyle = '#ff1f8f'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(-28, -2); x.quadraticCurveTo(0, 10, 28, -2); x.stroke();
    x.restore();
  }
  function tomb(x: CanvasRenderingContext2D, cx: number, cy: number, tilt: number): void {
    x.save(); x.translate(cx, cy); x.rotate(tilt);
    x.fillStyle = '#7f8aa3'; x.beginPath(); x.moveTo(-20, 34); x.lineTo(-20, -10); x.quadraticCurveTo(-20, -32, 0, -32); x.quadraticCurveTo(20, -32, 20, -10); x.lineTo(20, 34); x.closePath(); x.fill(); outline(x, 2.4);
    x.fillStyle = INK_LINE; x.font = '14px ' + DISPLAY_FONT; x.textAlign = 'center'; x.fillText('RIP', 0, -4);
    x.restore();
  }
  function coralTuft(x: CanvasRenderingContext2D, cx: number, cy: number, s: number, col: string, r: () => number): void {
    const branch = (bx: number, by: number, a: number, len: number, depth: number): void => {
      const ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
      x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx + Math.cos(a + .4) * len * .5, by + Math.sin(a + .4) * len * .5, ex, ey);
      x.lineWidth = depth * 2.6 * s + 1.5; x.stroke();
      if (depth > 0) { branch(ex, ey, a - .45 - r() * .3, len * .72, depth - 1); branch(ex, ey, a + .45 + r() * .3, len * .72, depth - 1); }
    };
    x.lineCap = 'round'; x.strokeStyle = col;
    branch(cx, cy, -Math.PI / 2 + (r() - .5) * .4, 20 * s, 3);
  }
  let deep: HTMLCanvasElement, farLayer: HTMLCanvasElement, midLayer: HTMLCanvasElement, nearLayer: HTMLCanvasElement, vignette: HTMLCanvasElement, jellyGlow: HTMLCanvasElement, pearlGlow: HTMLCanvasElement, built = false;
  const glow = (r: number, col: string) => sheet(r * 2, r * 2, x => { const g = x.createRadialGradient(r, r, 0, r, r, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, r * 2, r * 2); });
  function buildWorld(): void {
    if (built) return;
    built = true;
    deep = sheet(W, H, x => {
      const g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#5ce5d8'); g.addColorStop(.16, '#1ba6b8'); g.addColorStop(.48, '#0c4e7c'); g.addColorStop(.78, '#1d1a58'); g.addColorStop(1, '#180a2c');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      const b = x.createRadialGradient(430, -30, 10, 430, -30, 340); b.addColorStop(0, 'rgba(235,255,245,.72)'); b.addColorStop(1, 'rgba(235,255,245,0)');
      x.fillStyle = b; x.fillRect(0, 0, W, H);
    });
    farLayer = sheet(640, H, x => {
      x.fillStyle = 'rgba(9,48,92,.62)';
      x.beginPath(); x.rect(0, 0, 640, H);
      for (let i = 0; i < 4; i++) archPath(x, 80 + i * 160, 332, 54, 52);
      x.fill('evenodd');
      x.fillStyle = 'rgba(120,235,235,.13)';
      x.beginPath(); for (let i = 0; i < 4; i++) { archPath(x, 58 + i * 160, 190, 13, 96); archPath(x, 102 + i * 160, 190, 13, 96); } x.fill();
    });
    const r = dice(7321);
    midLayer = sheet(960, H, x => {
      const floor = (fx: number) => 322 + Math.sin(fx * Math.PI * 2 / 960 * 3) * 6 + Math.sin(fx * Math.PI * 2 / 960 * 7) * 3;
      /* hanging school sign, chains and all */
      x.strokeStyle = '#17364f'; x.lineWidth = 2.5; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(190, 0); x.lineTo(182, 44); x.moveTo(330, 0); x.lineTo(336, 52); x.stroke(); x.setLineDash([]);
      x.save(); x.translate(260, 56); x.rotate(.04);
      x.fillStyle = '#2b1442'; x.beginPath(); x.rect(-82, -16, 164, 34); x.fill(); outline(x, 3);
      x.strokeStyle = '#ff8cc8'; x.lineWidth = 1.5; x.strokeRect(-77, -11, 154, 24);
      x.fillStyle = '#ff5aae'; x.font = '19px ' + DISPLAY_FONT; x.textAlign = 'center'; x.fillText('MUMTEA HIGH', 0, 8);
      x.restore();
      lockers(x, 60, 236, 4);
      coffin(x, 300, 282, .42);
      teacup(x, 455, 276);
      tomb(x, 610, 288, -.12); tomb(x, 662, 296, .16);
      /* a toppled pillar */
      x.save(); x.translate(790, 296); x.rotate(-.1);
      x.fillStyle = '#5f6c8c'; x.beginPath(); x.rect(-68, -15, 136, 30); x.fill(); outline(x, 2.4);
      x.strokeStyle = 'rgba(18,10,28,.5)'; x.lineWidth = 1.5; for (let i = -48; i < 60; i += 20) { x.beginPath(); x.moveTo(i, -14); x.lineTo(i, 14); x.stroke(); }
      x.fillStyle = '#7f8aa3'; x.beginPath(); x.rect(-78, -21, 14, 42); x.fill(); outline(x, 2.4);
      x.restore();
      /* sand */
      const g = x.createLinearGradient(0, 300, 0, H); g.addColorStop(0, '#3b3a78'); g.addColorStop(1, '#1a0e33');
      x.fillStyle = g; x.beginPath(); x.moveTo(0, H); for (let fx = 0; fx <= 960; fx += 8) x.lineTo(fx, floor(fx)); x.lineTo(960, H); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(255,190,235,.3)'; x.lineWidth = 1.5; x.beginPath(); for (let fx = 0; fx <= 960; fx += 8) x.lineTo(fx, floor(fx)); x.stroke();
      ([[24, '#ff5aae'], [190, '#ff8c5a'], [392, '#c77dff'], [540, '#ff5aae'], [720, '#ff8c5a'], [900, '#c77dff']] as Array<[number, string]>).forEach(([fx, col]) => coralTuft(x, fx, floor(fx) + 3, .7 + r() * .4, col, r));
      x.fillStyle = 'rgba(255,246,251,.5)'; for (let i = 0; i < 60; i++) { const fx = r() * 960; x.beginPath(); x.arc(fx, floor(fx) + 8 + r() * 26, .6 + r(), 0, 7); x.fill(); }
      /* water sits between us and all of it */
      x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(14,60,110,.3)'; x.fillRect(0, 0, 960, H); x.globalCompositeOperation = 'source-over';
    });
    nearLayer = sheet(800, H, x => {
      const rock = (fx: number) => 346 + Math.sin(fx * Math.PI * 2 / 800 * 2) * 5 + Math.sin(fx * Math.PI * 2 / 800 * 5) * 4;
      x.fillStyle = '#0c0618'; x.beginPath(); x.moveTo(0, H); for (let fx = 0; fx <= 800; fx += 6) x.lineTo(fx, rock(fx)); x.lineTo(800, H); x.closePath(); x.fill();
    });
    vignette = sheet(W, H, x => { const g = x.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .66); g.addColorStop(0, 'rgba(8,3,24,0)'); g.addColorStop(1, 'rgba(8,3,24,.72)'); x.fillStyle = g; x.fillRect(0, 0, W, H); });
    jellyGlow = glow(44, 'rgba(255,90,190,.55)');
    pearlGlow = glow(30, 'rgba(255,250,210,.85)');
  }
  const MOTES = Array.from({ length: 46 }, (_, i) => ({ x: (i * 71) % W, y: (i * 137) % H, z: .25 + ((i * 31) % 10) / 10, r: .6 + ((i * 17) % 10) / 6 }));
  const KELP = [90, 300, 520, 760, 900].map((x, i) => ({ x, h: 62 + (i * 37) % 52, phase: i * 1.7 }));
  function slide(layer: HTMLCanvasElement, speed: number, tile: number): void {
    const off = -((far * speed) % tile);
    c.drawImage(layer, off, 0, tile, H); c.drawImage(layer, off + tile, 0, tile, H);
  }
  function rays(): void {
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const sway = Math.sin(clock / 2600 + i * 1.8), bx = 110 + i * 92 + sway * 16, wide = 22 + (i % 3) * 14;
      const g = c.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, 'rgba(205,255,245,' + (.17 + .05 * Math.sin(clock / 1500 + i)) + ')'); g.addColorStop(1, 'rgba(205,255,245,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(bx + 90, 0); c.lineTo(bx + 90 + wide, 0); c.lineTo(bx - 50 + wide * 2.2, 310); c.lineTo(bx - 70, 310); c.closePath(); c.fill();
    }
    c.restore();
    c.strokeStyle = 'rgba(245,255,250,.55)'; c.lineWidth = 2;
    for (let row = 0; row < 2; row++) { c.beginPath(); for (let x = 0; x <= W; x += 16) c.lineTo(x, 7 + row * 8 + Math.sin(x / 34 + clock / 700 + row * 2) * 2.6); c.stroke(); }
  }
  function school(): void {
    c.fillStyle = 'rgba(8,36,84,.7)';
    const base = W + 80 - ((clock * .014 + far * .1) % (W + 240));
    for (let i = 0; i < 11; i++) {
      const fx = base + (i * 37) % 120, fy = 118 + (i * 53) % 74 + Math.sin(clock / 700 + i) * 3;
      c.beginPath(); c.moveTo(fx, fy); c.quadraticCurveTo(fx + 8, fy - 5, fx + 15, fy); c.lineTo(fx + 21, fy - 4); c.lineTo(fx + 20, fy + 4); c.lineTo(fx + 15, fy); c.quadraticCurveTo(fx + 8, fy + 5, fx, fy); c.fill();
    }
  }
  function motes(): void {
    for (const m of MOTES) {
      const mx = ((m.x - far * m.z * .9 - clock * .006 * m.z) % W + W) % W, my = m.y + Math.sin(clock / 1700 + m.x) * 6;
      c.fillStyle = 'rgba(225,255,250,' + (.1 + m.z * .22) + ')'; c.beginPath(); c.arc(mx, my, m.r * m.z, 0, 7); c.fill();
    }
  }
  function kelp(): void {
    c.lineCap = 'round';
    for (const k of KELP) {
      const kx = ((k.x - far * 1.45) % (W + 200) + W + 200) % (W + 200) - 100;
      c.strokeStyle = '#07241f'; c.fillStyle = '#07241f'; c.lineWidth = 4; c.beginPath();
      const at = (t: number) => [kx + Math.sin(clock / 900 + k.phase + t * 2.6) * 10 * t, H - t * k.h];
      for (let t = 0; t <= 1.001; t += .1) { const [sx, sy] = at(t); if (t === 0) c.moveTo(sx, sy); else c.lineTo(sx, sy); }
      c.stroke();
      for (let t = .15; t < 1; t += .17) { const [sx, sy] = at(t), dir = Math.round(t * 6) % 2 ? 1 : -1; c.beginPath(); c.ellipse(sx + dir * 8, sy - 3, 9, 3.4, dir * -.6, 0, 7); c.fill(); }
    }
  }

  /* ---------- the mermaid: a stroke of arm pictures on top of a tail that bends every frame ---------- */
  const SWIM_TILT = -50, MER_SCALE = .3, HIP_Y = 350, TAIL_LONG = 124, BOX = { x: -130, y: -70, w: 580, h: 480 }, BAKE = .92, STROKES = 10;
  let frames: HTMLCanvasElement[] = [], hairArt: HTMLCanvasElement | null = null, petArt: HTMLCanvasElement | null = null, bakedKey = '', bakeTurn = 0;
  const armAt = (turn: number): [number, number] => {
    const th = ((turn % 1) + 1) % 1;
    if (th < .55) { const t = th / .55, up = 172 - 150 * t; return [up, up - Math.sin(t * Math.PI) * 16]; }
    const t = (th - .55) / .45, up = 22 + 150 * t;
    return [up, up + Math.sin(t * Math.PI) * 66];
  };
  const MER_LAYERS: Layer[] = ['wings', 'torso', 'top', 'neck', 'arms', 'sleeves', 'hold', 'head', 'face', 'mark', 'monster', 'hairFront', 'eyewear', 'headwear', 'armsFront'];
  function picture(svgText: string, width: number, height: number, ready: (art: HTMLCanvasElement | null) => void): void {
    const holder = document.createElement('div'); holder.innerHTML = svgText;
    const svg = holder.querySelector('svg') as SVGSVGElement;
    svg.setAttribute('width', String(width)); svg.setAttribute('height', String(height));
    const img = new Image();
    img.onload = () => { const art = document.createElement('canvas'); art.width = width; art.height = height; art.getContext('2d')?.drawImage(img, 0, 0, width, height); ready(art); };
    img.onerror = () => ready(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  }
  function dress(done?: () => void): void {
    const look = (!isAdmin() && currentStudent()?.look) || DOLLS.mumtea.look, [, base, sheen] = colours(), key = JSON.stringify([look, outfit]);
    if (key === bakedKey && frames.length) { done?.(); return; }
    bakedKey = key;
    const turn = ++bakeTurn, own = outfit.top === 'own';
    const worn: Look = { ...look, hold: 'none', back: 'none', top: own ? look.top : 'mer' + outfit.top, topC: own ? look.topC : base, topP: own ? look.topP : 'solid', trim: own ? look.trim : sheen, headwear: outfit.hair === 'none' ? 'none' : 'mer' + outfit.hair, neck: outfit.neck === 'own' ? look.neck : outfit.neck === 'coral' ? 'mercoral' : 'pearls' };
    const fresh: HTMLCanvasElement[] = [];
    const next = (i: number): void => {
      if (turn !== bakeTurn || i >= STROKES) return;
      const swim: Pose = { id: 'swim', name: '', armL: armAt(i / STROKES), armR: armAt(i / STROKES + .5), tilt: SWIM_TILT, handL: 'open', handR: 'open' };
      const text = drawGhoul(worn, { only: MER_LAYERS, pose: swim, shaded: true, detail: true, box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' '), merBelt: base });
      picture(text, Math.round(BOX.w * BAKE), Math.round(BOX.h * BAKE), art => {
        if (turn !== bakeTurn) return;
        if (art) fresh.push(art);
        if (i === 0) { frames = fresh; done?.(); }
        kick();
        next(i + 1);
      });
    };
    const flowing: Pose = { id: 'swim', name: '', armL: [20, 20], armR: [20, 20], tilt: SWIM_TILT };
    picture(drawGhoul(worn, { only: ['hairBack'], pose: flowing, stream: true, box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), Math.round(BOX.w * BAKE), Math.round(BOX.h * BAKE), art => { if (turn === bakeTurn) { hairArt = art; kick(); } });
    petArt = null;
    if (look.pet && look.pet !== 'none') picture(drawGhoul(look, { only: ['pet'], box: '245 590 120 120' }), 240, 240, art => { if (turn === bakeTurn) { petArt = art; kick(); } });
    next(0);
  }
  function tail(amp: number): void {
    const [, base, sheen] = colours(), N = 16, pts: Array<{ x: number; y: number; nx: number; ny: number; hw: number }> = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N, wave = (k: number) => amp * Math.pow(k, 1.35) * Math.sin(tailT - k * 4.4);
      const ax = 8 - TAIL_LONG * s, ay = wave(s), bx = 8 - TAIL_LONG * (s + .01), by = wave(s + .01), dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
      const hw = s < .2 ? 6.5 + 7 * Math.sin(s / .2 * Math.PI / 2) : 3 + 10.5 * Math.pow(1 - (s - .2) / .8, 1.15);
      pts.push({ x: ax, y: ay, nx: -dy / len, ny: dx / len, hw });
    }
    const end = pts[N], endAngle = Math.atan2(end.y - pts[N - 1].y, end.x - pts[N - 1].x);
    const edge = (side: number) => pts.map(q => [q.x + q.nx * q.hw * side, q.y + q.ny * q.hw * side]);
    const up = edge(1), down = edge(-1);
    const finFill = c.createLinearGradient(0, 0, 58, 0); finFill.addColorStop(0, base); finFill.addColorStop(.55, sheen); finFill.addColorStop(1, shade(base, -.24));
    /* silk ribbons stream out from behind the tail */
    if (outfit.tail === 'silk') {
      for (const side of [1, -1]) for (let r = 0; r < 3; r++) {
        const from = 3 + r * 3;
        c.beginPath();
        for (let i = from; i <= N; i++) { const q = pts[i]; c.lineTo(q.x + q.nx * q.hw * side, q.y + q.ny * q.hw * side); }
        for (let i = N; i >= from; i--) { const q = pts[i], s = (i - from) / (N - from), out = q.hw + s * (15 + r * 7) + Math.sin(tailT * 1.3 + i * .7 + r) * 4 * s; c.lineTo(q.x + q.nx * out * side - s * 14, q.y + q.ny * out * side); }
        c.closePath(); c.fillStyle = r % 2 ? sheen : base; c.globalAlpha = .82; c.fill(); c.globalAlpha = 1; c.strokeStyle = INK_LINE; c.lineWidth = 1.2; c.stroke();
      }
    }
    /* little fins at the knee */
    for (const side of [1, -1]) {
      const q = pts[8], fx = q.x + q.nx * q.hw * side, fy = q.y + q.ny * q.hw * side, flap = Math.sin(tailT + side) * 3;
      c.fillStyle = sheen; c.beginPath(); c.moveTo(fx + 12, fy); c.quadraticCurveTo(fx + 4, fy + side * (16 + flap), fx - 16, fy + side * (20 + flap)); c.quadraticCurveTo(fx - 7, fy + side * 7, fx - 14, fy); c.closePath(); c.fill(); outline(c, 1.8);
    }
    /* the fin */
    c.save(); c.translate(end.x, end.y); c.rotate(endAngle + Math.sin(tailT - 4.4) * .2);
    c.fillStyle = finFill; c.lineJoin = 'round';
    if (outfit.fin === 'shred') {
      for (let i = -3; i <= 3; i++) {
        const a = i * .3 + Math.sin(tailT * 1.4 + i) * .07, long = 46 + (3 - Math.abs(i)) * 7;
        c.save(); c.rotate(a); c.beginPath(); c.moveTo(0, -3); c.quadraticCurveTo(long * .5, -8, long, Math.sin(tailT + i) * 3); c.quadraticCurveTo(long * .5, 7, 0, 3); c.closePath(); c.fill(); outline(c, 1.7); c.restore();
      }
    } else {
      const reach = outfit.fin === 'fork' ? 64 : 44, wide = outfit.fin === 'fork' ? 30 : 42, notch = outfit.fin === 'fork' ? 20 : 26;
      c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(10, -9, reach * .7, -wide * .8, reach, -wide); c.quadraticCurveTo(reach * .86, -wide * .3, notch, 0); c.quadraticCurveTo(reach * .86, wide * .3, reach, wide); c.bezierCurveTo(reach * .7, wide * .8, 10, 9, 0, 0); c.closePath(); c.fill(); outline(c, 2);
      c.strokeStyle = 'rgba(18,10,28,.42)'; c.lineWidth = 1.2; c.beginPath();
      for (const k of [-.75, -.42, -.14, .14, .42, .75]) { c.moveTo(5, k * 3); c.lineTo(reach * .74, k * wide * .92); }
      c.stroke();
    }
    c.restore();
    /* the tail itself */
    const trace = () => { c.beginPath(); up.forEach(([ax, ay], i) => (i ? c.lineTo(ax, ay) : c.moveTo(ax, ay))); for (let i = N; i >= 0; i--) c.lineTo(down[i][0], down[i][1]); c.closePath(); };
    const bone = outfit.tail === 'bone';
    const fill = c.createLinearGradient(8, 0, -TAIL_LONG, 0);
    if (bone) { fill.addColorStop(0, shade(base, -.6)); fill.addColorStop(1, '#0d0816'); }
    else { fill.addColorStop(0, shade(base, .18)); fill.addColorStop(.35, sheen); fill.addColorStop(.62, base); fill.addColorStop(1, shade(base, -.3)); }
    trace(); c.fillStyle = fill; c.fill();
    c.save(); trace(); c.clip();
    if (outfit.tail === 'silk') {
      c.strokeStyle = 'rgba(18,10,28,.32)'; c.lineWidth = 1.1; c.beginPath();
      for (const k of [-.6, -.2, .2, .6]) pts.forEach((q, i) => { const px = q.x + q.nx * q.hw * k, py = q.y + q.ny * q.hw * k; if (i) c.lineTo(px, py); else c.moveTo(px, py); });
      c.stroke();
    }
    if (outfit.tail === 'scales') {
      c.strokeStyle = 'rgba(18,10,28,.42)'; c.lineWidth = 1; c.beginPath();
      for (let i = 0; i < N; i++) for (let j = -3; j <= 3; j++) {
        const q = pts[i], off = (j + (i % 2 ? .5 : 0)) * 5.6, sx = q.x + q.nx * off, sy = q.y + q.ny * off;
        if (Math.abs(off) > q.hw + 3) continue;
        const a = Math.atan2(-q.nx, q.ny);
        c.moveTo(sx + Math.cos(a) * 3.7, sy + Math.sin(a) * 3.7); c.arc(sx, sy, 3.7, a, a + Math.PI);
      }
      c.stroke();
    }
    if (outfit.tail === 'net') {
      const at = (i: number, k: number) => { const q = pts[Math.min(N, Math.max(0, i))]; return [q.x + q.nx * q.hw * k, q.y + q.ny * q.hw * k]; };
      c.strokeStyle = 'rgba(255,250,240,.82)'; c.lineWidth = 1; c.beginPath();
      for (let i = -2; i < N; i += 2) { const a = at(i, -1), b = at(i + 3, 1), a2 = at(i, 1), b2 = at(i + 3, -1); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); }
      c.stroke();
      c.fillStyle = '#fff'; c.beginPath();
      for (let i = 0; i < N; i += 2) { const a = at(i + 1, 0); c.moveTo(a[0] + 1.7, a[1]); c.arc(a[0], a[1], 1.7, 0, 7); }
      c.fill();
    }
    if (bone) {
      c.strokeStyle = '#fff6e6'; c.lineCap = 'round'; c.lineWidth = 1.7; c.beginPath();
      for (let i = 1; i < N; i++) { const q = pts[i], wide = q.hw * .78; c.moveTo(q.x + q.nx * wide - 3.5, q.y + q.ny * wide); c.lineTo(q.x, q.y); c.lineTo(q.x - q.nx * wide - 3.5, q.y - q.ny * wide); }
      c.stroke();
      c.lineWidth = 3; c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y))); c.stroke();
    }
    /* a sheen along the top, a shadow along the belly */
    c.lineCap = 'round';
    c.strokeStyle = 'rgba(255,255,255,.38)'; c.lineWidth = 3; c.beginPath(); pts.forEach((q, i) => { const px = q.x + q.nx * q.hw * .48, py = q.y + q.ny * q.hw * .48; if (i) c.lineTo(px, py); else c.moveTo(px, py); }); c.stroke();
    c.strokeStyle = 'rgba(16,5,40,.3)'; c.lineWidth = 5; c.beginPath(); pts.forEach((q, i) => { const px = q.x - q.nx * q.hw, py = q.y - q.ny * q.hw; if (i) c.lineTo(px, py); else c.moveTo(px, py); }); c.stroke();
    c.restore();
    trace(); outline(c, 2.2);
  }
  function mermaid(x: number, at: number, angle: number, size: number): void {
    c.save(); c.translate(x, at); c.rotate(angle); c.scale(size, size);
    if (hairArt) {
      /* the hair goes under the tail, swaying from the head */
      c.save(); c.rotate(Math.PI / 2);
      const hx = (95 - 160) * MER_SCALE, hy = (140 - HIP_Y) * MER_SCALE;
      c.translate(hx, hy); c.rotate(Math.sin(clock / 620) * .07); c.translate(-hx, -hy);
      c.drawImage(hairArt, (BOX.x - 160) * MER_SCALE, (BOX.y - HIP_Y) * MER_SCALE, BOX.w * MER_SCALE, BOX.h * MER_SCALE);
      c.restore();
    }
    tail(mode === 'play' && rise ? 25 : 19);
    const s = frames.length ? frames[Math.floor(((stroke % 1) + 1) % 1 * frames.length)] : null;
    if (s) {
      c.rotate(Math.PI / 2);
      c.drawImage(s, (BOX.x - 160) * MER_SCALE, (BOX.y - HIP_Y) * MER_SCALE, BOX.w * MER_SCALE, BOX.h * MER_SCALE);
    } else {
      c.fillStyle = '#f4cfae'; c.beginPath(); c.arc(70, 0, 22, 0, 7); c.fill(); outline(c, 2.2);
    }
    c.restore();
  }
  function pet(x: number, at: number, size: number): void {
    if (!petArt) return;
    const bob = Math.sin(clock / 520) * 3 * size, r = 25 * size;
    c.drawImage(petArt, x - r * .92, at + bob - r * .92, r * 1.84, r * 1.84);
    const g = c.createRadialGradient(x - r * .3, at + bob - r * .35, r * .1, x, at + bob, r);
    g.addColorStop(0, 'rgba(255,255,255,.2)'); g.addColorStop(.75, 'rgba(180,240,255,.06)'); g.addColorStop(1, 'rgba(200,245,255,.38)');
    c.fillStyle = g; c.beginPath(); c.arc(x, at + bob, r, 0, 7); c.fill();
    c.strokeStyle = 'rgba(245,255,255,.82)'; c.lineWidth = 1.6; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath(); c.arc(x, at + bob, r * .72, 3.6, 4.3); c.stroke();
  }

  /* ---------- the things down there ---------- */
  function jelly(t: Thing): void {
    const pulse = Math.sin(t.phase), wide = t.r * (1.12 + pulse * .12), tall = t.r * (1 - pulse * .1);
    c.drawImage(jellyGlow, t.x - 44, t.y - 34, 88, 88);
    c.lineCap = 'round';
    for (let i = -3; i <= 3; i++) {
      const sx = t.x + i * wide * .28;
      c.strokeStyle = i % 2 ? 'rgba(255,140,220,.9)' : 'rgba(199,125,255,.95)'; c.lineWidth = i % 2 ? 2 : 3.2;
      c.beginPath(); c.moveTo(sx, t.y + 2);
      for (let k = 1; k <= 4; k++) c.lineTo(sx + Math.sin(t.phase * 1.2 + i + k * 1.1) * (2 + k * 1.3), t.y + 2 + k * (8 - Math.abs(i) * .5));
      c.stroke();
    }
    const g = c.createRadialGradient(t.x - wide * .3, t.y - tall * .5, 1, t.x, t.y, wide * 1.3); g.addColorStop(0, '#ffe3f6'); g.addColorStop(.45, '#ff7ad0'); g.addColorStop(1, '#8a2be2');
    c.fillStyle = g; c.beginPath(); c.moveTo(t.x - wide, t.y + 3); c.bezierCurveTo(t.x - wide, t.y - tall * 1.35, t.x + wide, t.y - tall * 1.35, t.x + wide, t.y + 3);
    for (let i = 3; i >= -3; i--) c.quadraticCurveTo(t.x + (i - .5) * wide * .29, t.y + 9, t.x + (i - 1) * wide * .29, t.y + 3);
    c.closePath(); c.fill(); outline(c, 2);
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; c.beginPath(); c.arc(t.x - 3, t.y - 3, wide * .68, 3.5, 4.5); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(t.x - 6, t.y - 3, 3.6, 0, 7); c.arc(t.x + 6, t.y - 3, 3.6, 0, 7); c.fill();
    c.fillStyle = INK_LINE; c.beginPath(); c.arc(t.x - 7, t.y - 2.5, 1.9, 0, 7); c.arc(t.x + 5, t.y - 2.5, 1.9, 0, 7); c.fill();
    c.strokeStyle = INK_LINE; c.lineWidth = 1.8; c.beginPath(); c.moveTo(t.x - 10, t.y - 8); c.lineTo(t.x - 3, t.y - 6); c.moveTo(t.x + 10, t.y - 8); c.lineTo(t.x + 3, t.y - 6); c.stroke();
  }
  function piranha(t: Thing): void {
    const wag = Math.sin(t.phase * 2.2) * .28;
    c.save(); c.translate(t.x, t.y);
    c.save(); c.translate(16, 0); c.rotate(wag);
    c.fillStyle = '#e8e0d0'; c.beginPath(); c.moveTo(0, 0); c.lineTo(20, -14); c.lineTo(15, 0); c.lineTo(20, 14); c.closePath(); c.fill(); outline(c, 2);
    c.restore();
    c.strokeStyle = INK_LINE; c.lineWidth = 5; c.beginPath(); c.moveTo(-6, 0); c.lineTo(18, 0); c.stroke();
    c.strokeStyle = '#efe7d6'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(-6, 0); c.lineTo(18, 0); c.stroke();
    c.lineCap = 'round'; c.beginPath();
    for (const rib of [0, 6, 12]) { c.moveTo(rib, 0); c.lineTo(rib + 4, -11 + rib * .4); c.moveTo(rib, 0); c.lineTo(rib + 4, 11 - rib * .4); }
    c.strokeStyle = INK_LINE; c.lineWidth = 4.4; c.stroke(); c.strokeStyle = '#efe7d6'; c.lineWidth = 2.2; c.stroke();
    c.fillStyle = '#efe7d6'; c.beginPath(); c.moveTo(-3, -13); c.quadraticCurveTo(-24, -15, -25, -2); c.lineTo(-10, 1); c.lineTo(-24, 5); c.quadraticCurveTo(-20, 14, -3, 12); c.closePath(); c.fill(); outline(c, 2);
    c.fillStyle = '#fff'; c.beginPath();
    for (const tx of [-22, -17, -12]) { c.moveTo(tx, -1); c.lineTo(tx + 2, 4); c.lineTo(tx + 4, 0); }
    c.fill(); outline(c, 1);
    c.fillStyle = INK_LINE; c.beginPath(); c.arc(-12, -6, 5, 0, 7); c.fill();
    c.fillStyle = '#ff2f6d'; c.beginPath(); c.arc(-12.5, -6, 2.5, 0, 7); c.fill();
    c.restore();
  }
  function urchin(t: Thing): void {
    c.save(); c.translate(t.x, t.y); c.rotate(t.phase * .22);
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2, len = t.r + (i % 2 ? 11 : 7);
      c.strokeStyle = INK_LINE; c.lineWidth = 3.4; c.lineCap = 'round'; c.beginPath(); c.moveTo(Math.cos(a) * t.r * .7, Math.sin(a) * t.r * .7); c.lineTo(Math.cos(a) * len, Math.sin(a) * len); c.stroke();
      c.strokeStyle = i % 2 ? '#ff5aae' : '#c77dff'; c.lineWidth = 1.7; c.beginPath(); c.moveTo(Math.cos(a) * t.r * .85, Math.sin(a) * t.r * .85); c.lineTo(Math.cos(a) * len, Math.sin(a) * len); c.stroke();
    }
    c.restore();
    const g = c.createRadialGradient(t.x - 4, t.y - 5, 1, t.x, t.y, t.r); g.addColorStop(0, '#7a3aa8'); g.addColorStop(1, '#23113a');
    c.fillStyle = g; c.beginPath(); c.arc(t.x, t.y, t.r, 0, 7); c.fill(); outline(c, 2);
    c.fillStyle = '#ffdf5e'; c.beginPath(); c.arc(t.x - 5, t.y - 1, 3, 0, 7); c.arc(t.x + 5, t.y - 1, 3, 0, 7); c.fill();
    c.fillStyle = INK_LINE; c.beginPath(); c.arc(t.x - 5, t.y - 1, 1.5, 0, 7); c.arc(t.x + 5, t.y - 1, 1.5, 0, 7); c.fill();
  }
  function pearl(t: Thing): void {
    const bob = Math.sin(t.phase * .7) * 3, py = t.y + bob;
    c.drawImage(pearlGlow, t.x - 30, py - 32, 60, 60);
    c.fillStyle = '#ff8cc8'; c.beginPath(); c.moveTo(t.x - 18, py + 3); c.quadraticCurveTo(t.x, py - 6, t.x + 18, py + 3); c.quadraticCurveTo(t.x + 16, py + 18, t.x, py + 19); c.quadraticCurveTo(t.x - 16, py + 18, t.x - 18, py + 3); c.closePath(); c.fill(); outline(c, 2);
    c.strokeStyle = '#d40f72'; c.lineWidth = 1.2; c.beginPath(); for (const k of [-10, -4, 4, 10]) { c.moveTo(t.x + k, py + 4); c.lineTo(t.x + k * .4, py + 17); } c.stroke();
    const g = c.createRadialGradient(t.x - 3, py - 7, 1, t.x, py - 4, t.r); g.addColorStop(0, '#fff'); g.addColorStop(.7, '#f6ecff'); g.addColorStop(1, '#c9b4ff');
    c.fillStyle = g; c.beginPath(); c.arc(t.x, py - 4, t.r, 0, 7); c.fill(); outline(c, 1.8);
    c.fillStyle = 'rgba(255,255,255,' + (.5 + .5 * Math.sin(t.phase * 2)) + ')'; c.beginPath(); c.arc(t.x + 9, py - 13, 2, 0, 7); c.arc(t.x - 12, py - 9, 1.3, 0, 7); c.fill();
  }
  const DRAW: Record<Kind, (t: Thing) => void> = { jelly, piranha, urchin, pearl };
  function burst(x: number, at: number, cols: string[], n: number, power: number): void {
    for (let i = 0; i < n; i++) { const a = Math.random() * 7, v = power * (.4 + Math.random()); sparks.push({ x, y: at, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 380 + Math.random() * 320, col: pick(cols), size: 1.4 + Math.random() * 2.2 }); }
  }

  /* ---------- on-screen writing ---------- */
  function write(text: string, x: number, at: number, size: number, fill: string, align: CanvasTextAlign = 'left'): void {
    c.font = size + 'px ' + DISPLAY_FONT; c.textAlign = align; c.lineJoin = 'round';
    c.strokeStyle = INK_LINE; c.lineWidth = Math.max(3, size * .2); c.strokeText(text, x, at);
    c.fillStyle = fill; c.fillText(text, x, at);
  }
  function hud(): void {
    write('SCORE', 46, 34, 12, '#7fe8ff');
    write(String(Math.floor(score)), 46, 62, 28, '#fff6fb');
    for (let i = 0; i < 3; i++) {
      const full = i < lives;
      c.save(); c.translate(W - 60 - i * 28, 36);
      c.fillStyle = full ? '#ff1f8f' : 'rgba(18,10,28,.55)';
      c.beginPath(); c.moveTo(0, 10); c.bezierCurveTo(-16, -1, -9, -13, 0, -5); c.bezierCurveTo(9, -13, 16, -1, 0, 10); c.closePath(); c.fill(); outline(c, 2);
      if (full) { c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(-5, -4, 2, 0, 7); c.fill(); }
      c.restore();
    }
  }
  function bars(size: number): void {
    if (size <= 0) return;
    c.fillStyle = '#05020c'; c.fillRect(0, 0, W, size); c.fillRect(0, H - size, W, size);
  }
  function card(big: string, line: string, small: string): void {
    c.fillStyle = 'rgba(8,3,24,.62)'; c.fillRect(0, 0, W, H);
    write(big.toUpperCase(), W / 2, 158, 54, '#ff5aae', 'center');
    write(line.toUpperCase(), W / 2, 198, 26, '#fff6fb', 'center');
    c.font = '800 15px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#7fe8ff'; c.fillText(small, W / 2, 228);
  }

  /* ---------- one frame ---------- */
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const SPOTS: Array<[number, number]> = [[-104, 0], [-62, 0], [-20, 0], [22, 0], [56, -8], [76, -20]];
  const currentAngle = () => (mode === 'play' ? Math.max(-.3, Math.min(.3, vy / 520)) : 0) + Math.sin(clock / 700) * .025;
  function touching(t: Thing, angle: number): boolean {
    const hy = t.y + (t.kind === 'jelly' ? 6 : 0);
    return SPOTS.some(([d, off]) => Math.hypot(t.x - (swimX + Math.cos(angle) * d - Math.sin(angle) * off), hy - (y + Math.sin(angle) * d + Math.cos(angle) * off)) < t.r + (d < -40 ? 5 : 9));
  }
  function step(dt: number): void {
    modeT += dt; clock += dt;
    const pushing = mode === 'play' && rise;
    stroke += dt * (pushing ? .00125 : .00082); tailT += dt * (pushing ? .012 : .0078);
    shake = Math.max(0, shake - dt * .022); flash = Math.max(0, flash - dt * .0028); slow = Math.max(0, slow - dt);
    if (mode === 'idle' || mode === 'done') far += dt * .022;
    if (mode === 'intro') {
      swimX = -170 + 340 * ease(modeT / 1500); far += dt * .15;
      y = 180 + Math.sin(modeT / 420) * 7;
      if (modeT >= INTRO) { mode = 'play'; modeT = 0; }
    }
    if (mode === 'play') {
      const world = slow > 0 ? dt * .35 : dt, speed = .17 + score * .00044;
      vy += (rise ? -.75 : .55) * dt; vy = Math.max(-230, Math.min(230, vy));
      y += vy * dt / 1000;
      if (y < 56) { y = 56; vy = 0; }
      if (y > 310) { y = 310; vy = 0; }
      far += world * speed; score += world * .01; safe = Math.max(0, safe - dt); gap -= world;
      if (gap <= 0) {
        gap = Math.max(420, 1000 - score * 2) * (.7 + Math.random() * .6);
        const isPearl = Math.random() < .3;
        // every other hazard swims at the player's depth, so parking at the top or bottom doesn't work
        const hunting = !isPearl && (hunt = !hunt);
        const kind: Kind = isPearl ? 'pearl' : hunting ? 'jelly' : pick<Kind>(['jelly', 'piranha', 'urchin']);
        things.push({ x: W + 40, y: hunting ? Math.max(40, Math.min(312, y)) : 44 + Math.random() * 268, r: isPearl ? 9 : kind === 'urchin' ? 13 : kind === 'piranha' ? 14 : 17, kind, phase: Math.random() * 6, pace: kind === 'piranha' ? 1.4 : 1 });
      }
      const angle = currentAngle();
      things = things.filter(t => {
        t.x -= world * speed * t.pace; t.phase += world * .006;
        if (touching(t, angle)) {
          if (t.kind === 'pearl') {
            score += 5; tone(780, .08); tone(1170, .1);
            burst(t.x, t.y - 4, ['#fff', '#fff3b0', '#7fe8ff', '#ff8cc8'], 16, .12);
            floats.push({ x: t.x, y: t.y - 16, text: '+5', life: 0 });
            return false;
          }
          if (safe <= 0) {
            lives--; safe = 1400; slow = 240; tone(150, .25); stat();
            if (!calm) { shake = 10; flash = .55; }
            burst(swimX + 40, y, ['#ff1f8f', '#fff', '#c77dff'], 22, .17);
          }
        }
        return t.x > -60;
      });
      if (lives <= 0) { finish(); return; }
      if (Math.floor(score) !== shown) { shown = Math.floor(score); stat(); }
    }
    if (mode === 'outro') {
      const world = dt * .3;
      far += world * .2;
      things.forEach(t => { t.x -= world * .2 * t.pace; t.phase += world * .006; });
      y -= dt * (.05 + modeT * .00022);
      if (modeT >= OUTRO) { mode = 'done'; modeT = 0; things = []; locker.hidden = false; stat(); }
    }
    const idle = mode === 'idle' || mode === 'done';
    bubbleGap -= dt;
    if (bubbleGap <= 0) {
      bubbleGap = 90 + Math.random() * 120;
      const size = idle ? 1.55 : 1;
      bubbles.push({ x: (idle ? 322 : swimX) + (Math.random() < .5 ? 60 + Math.random() * 40 : -120 - Math.random() * 30) * size, y: (idle ? 176 : y) + (Math.random() - .5) * 24, vx: -.02 - Math.random() * .04, vy: -.03 - Math.random() * .04, life: 0, max: 1500 + Math.random() * 1200, col: '', size: 1.2 + Math.random() * 3 });
    }
    bubbles = bubbles.filter(b => { b.life += dt; b.x += b.vx * dt + Math.sin(b.life / 160) * .25; b.y += b.vy * dt; return b.life < b.max; });
    sparks = sparks.filter(s => { s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += .00012 * dt; return s.life < s.max; });
    floats = floats.filter(f => { f.life += dt; f.y -= dt * .03; return f.life < 800; });
    petY += (Math.min(H - 42, y + 50) - petY) * Math.min(1, dt * .005);
    petX = swimX + 44 + Math.sin(clock / 900) * 8;
  }
  function paint(): void {
    buildWorld();
    c.save();
    let zoom = 1, fx = W / 2, fy = H / 2;
    if (mode === 'intro') { zoom = 1 + .34 * (1 - ease((modeT - 500) / 1500)); fx = Math.max(170, swimX); fy = y; }
    if (shake > 0) { zoom = Math.max(zoom, 1.04); c.translate(Math.sin(clock * .09) * shake * .6, Math.cos(clock * .11) * shake * .6); }
    if (zoom !== 1) { c.translate(fx, fy); c.scale(zoom, zoom); c.translate(-fx, -fy); }
    c.drawImage(deep, 0, 0, W, H);
    slide(farLayer, .12, 640);
    school();
    rays();
    slide(midLayer, .5, 960);
    things.forEach(t => DRAW[t.kind](t));
    if (mode === 'idle' || mode === 'done') {
      pet(486, 262, 1.55);
      mermaid(322, 176, Math.sin(clock / 700) * .025 - .03, 1.55);
    } else {
      if (mode !== 'outro') pet(petX, petY, 1);
      if (!(safe > 0 && Math.floor(safe / 110) % 2)) mermaid(swimX, y, currentAngle(), 1);
    }
    bubbles.forEach(b => { c.strokeStyle = 'rgba(240,255,255,' + (.75 * (1 - b.life / b.max)) + ')'; c.lineWidth = 1; c.beginPath(); c.arc(b.x, b.y, b.size, 0, 7); c.stroke(); });
    sparks.forEach(s => { c.fillStyle = s.col; c.globalAlpha = 1 - s.life / s.max; c.beginPath(); c.arc(s.x, s.y, s.size, 0, 7); c.fill(); }); c.globalAlpha = 1;
    floats.forEach(f => { c.globalAlpha = 1 - f.life / 800; write(f.text, f.x, f.y, 20, '#fff3b0', 'center'); }); c.globalAlpha = 1;
    motes();
    slide(nearLayer, 1.45, 800);
    kelp();
    c.restore();
    c.drawImage(vignette, 0, 0, W, H);
    if (flash > 0) { c.fillStyle = 'rgba(255,31,143,' + flash + ')'; c.fillRect(0, 0, W, H); }
    if (mode === 'play') hud();
    if (mode === 'intro') {
      bars(30 * (1 - ease((modeT - 1500) / 800)));
      c.globalAlpha = Math.max(0, Math.min(1, modeT / 400, (INTRO - modeT) / 400));
      write('RIPTIDE RUN', W / 2, 74, 42, '#ff5aae', 'center');
      c.font = '800 15px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#fff6fb'; c.fillText('Hold to rise. Let go to sink.', W / 2, 322);
      c.globalAlpha = 1;
    }
    if (mode === 'outro') {
      const t = modeT / OUTRO;
      c.fillStyle = 'rgba(235,255,250,' + Math.max(0, (t - .35) / .65) * .92 + ')'; c.fillRect(0, 0, W, H);
      bars(30 * ease(t * 1.6));
      if (t > .25) { c.globalAlpha = Math.min(1, (t - .25) * 3); write('SURFACING', W / 2, H / 2 + 8, 34, '#ff1f8f', 'center'); c.globalAlpha = 1; }
    }
    if (mode === 'idle') {
      write('DRESS YOUR MERMAID, THEN DIVE IN', W / 2, 338, 15, '#fff6fb', 'center');
    }
    if (mode === 'done') card('Surfaced!', Math.floor(score) + ' points', 'Best: ' + finalBest + '. Change your outfit below or dive again.');
  }
  function frame(now: number): void {
    looping = false;
    if (!cv.getClientRects().length) { if (active()) quit(); return; }
    const dt = Math.min(40, now - last); last = now;
    step(dt); paint();
    if (active() || (visible && !calm && document.visibilityState === 'visible')) { looping = true; requestAnimationFrame(frame); }
  }
  function kick(): void {
    if (looping || !cv.getClientRects().length) return;
    looping = true; last = performance.now(); requestAnimationFrame(frame);
  }
  function finish(): void {
    mode = 'outro'; modeT = 0; rise = false;
    const s = Math.floor(score); finalBest = p.bestOf(s); award(Math.ceil(s / 20)); stat(); submitScore('riptide', s);
    p.go.textContent = 'Dive again';
  }
  function quit(): void {
    mode = 'idle'; rise = false; things = []; sparks = []; floats = []; locker.hidden = false; p.go.textContent = 'Dive in'; stat();
  }
  p.go.addEventListener('click', () => {
    dress(() => {
      mode = 'intro'; modeT = 0; swimX = -170; y = 180; vy = 0; things = []; sparks = []; floats = []; score = 0; lives = 3; safe = 0; gap = 300; shown = 0; shake = 0; flash = 0; slow = 0; petY = 230;
      locker.hidden = true; p.go.textContent = 'Restart'; p.go.blur(); stat(); tone(220, .4); kick();
    });
  });
  cv.addEventListener('pointerdown', e => { rise = true; e.preventDefault(); });
  addEventListener('pointerup', () => { rise = false; });
  const isRise = (e: KeyboardEvent) => e.key === ' ' || e.key === 'ArrowUp';
  addEventListener('keydown', e => { if ((mode === 'intro' || mode === 'play') && isRise(e) && !typing(e)) { rise = true; e.preventDefault(); } });
  addEventListener('keyup', e => { if (isRise(e)) rise = false; });
  stops.push(() => { if (active()) quit(); });
  new IntersectionObserver(entries => {
    visible = entries.some(e => e.isIntersecting);
    if (visible) { dress(); kick(); }
  }).observe(cv);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') kick(); });
  drawLocker(); stat();
})();
