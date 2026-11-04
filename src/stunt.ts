/* ---------- Casket Shot: a stunt show. Fire yourself from the coffin cannon and land in a pot of hot tea ---------- */
interface StuntOutfit { suit: string; helmet: string; cape: string; trail: string }
const STUNT_SUITS: Array<[string, string, string]> = [['Hot pink', '#ff1f8f', '#fff6fb'], ['Electric blue', '#19b7e8', '#f4d35e'], ['Purple', '#6a1f86', '#ff8cc8'], ['Slime', '#6fc22e', '#14101a'], ['Flame', '#ff6a1a', '#f4d35e'], ['Midnight', '#14101a', '#ff1f8f'], ['Silver', '#c6ccd8', '#ff1f8f']];
const STUNT_ROWS: Array<[keyof StuntOutfit, string, Array<[string, string]>]> = [
  ['helmet', 'On your head', [['stunthelmet', 'Crash helmet'], ['stuntstar', 'Star helmet'], ['goggles', 'Just goggles'], ['none', 'Nothing']]],
  ['cape', 'Cape', [['cape', 'Long cape'], ['short', 'Short cape'], ['none', 'No cape']]],
  ['trail', 'Flying trail', [['stars', 'Stars'], ['hearts', 'Hearts'], ['flames', 'Flames'], ['bubbles', 'Bubbles']]],
];
(function () {
  const W = 640, H = 360, ZOOM = 2, INK_LINE = '#14081a', FLOOR = 322, CAN = { x: 66, y: 296 }, G = 520, SHOT_CLOCK = 15000;
  const [cv, c] = makeCanvas('Casket Shot game area');
  cv.width = W * ZOOM; cv.height = H * ZOOM; c.scale(ZOOM, ZOOM);

  /* ---------- the stunt locker ---------- */
  const saved = store.get<Partial<StuntOutfit>>('stunt', {});
  const outfit: StuntOutfit = { suit: 'Hot pink', helmet: 'stunthelmet', cape: 'cape', trail: 'stars' };
  STUNT_ROWS.forEach(([key, , items]) => { const v = saved[key]; if (items.some(i => i[0] === v)) outfit[key] = v as string; });
  if (STUNT_SUITS.some(s => s[0] === saved.suit)) outfit.suit = saved.suit as string;
  const lockerRows = el('div', { cls: 'merrows' });
  const locker = el('div', { cls: 'merlocker wframe' }, el('h4', { text: 'Stunt locker' }), lockerRows);
  function drawLocker(): void {
    lockerRows.textContent = '';
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Stunt suit' }), ...STUNT_SUITS.map(([name, col]) => {
      const b = el('button', { cls: 'wswatch', type: 'button', 'aria-label': name, title: name, 'data-stunt': 'suit:' + name, 'aria-pressed': outfit.suit === name, onclick() { wear('suit', name); } });
      b.style.background = col;
      return b;
    })));
    STUNT_ROWS.forEach(([key, label, items]) => lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: label }), ...items.map(([id, name]) =>
      el('button', { cls: 'wchip', type: 'button', 'data-stunt': key + ':' + id, 'aria-pressed': outfit[key] === id, onclick() { wear(key, id); } }, name)))));
  }
  function wear(key: keyof StuntOutfit, value: string): void {
    outfit[key] = value; store.set('stunt', outfit); drawLocker();
    if (mode === 'done') mode = 'idle';
    dress(); kick();
  }
  const p = makePanel('casket', 'Casket Shot', 'You are the stunt act. Fire yourself from the coffin cannon and land in the pot of hot tea. Move your mouse or finger to aim, then press and hold to build power and let go to fire. On a keyboard, the arrows aim and the space bar fires. Miss and you lose a life, and you get three. Each round has a 15 second shot clock.', [cv], 'Start the show');
  p.root.append(locker);

  /* ---------- state ---------- */
  type Mode = 'idle' | 'round' | 'aim' | 'fly' | 'splash' | 'miss' | 'done';
  interface Bit { x: number; y: number; vx: number; vy: number; life: number; max: number; col: string; size: number; shape?: string; turn?: number }
  let mode: Mode = 'idle', paused = false, looping = false, visible = false, last = 0, clock = 0, modeT = 0, round = 1, score = 0, lives = 3, finalBest = 0;
  let angle = .75, charging = false, power = 0, powerDir = 1, shotLeft = SHOT_CLOCK, keys: Record<string, boolean> = {};
  let fx = 0, fy = 0, vx = 0, vy = 0, spin = 0, trailGap = 0, bits: Bit[] = [], shake = 0, flash = 0, flashCol = '255,255,255', zoom = 1, bull = false, note = '', noteT = 0, cheerT = 0;
  let pot = { x: 400, base: 400, drift: 0, scale: 1, phase: 0 };
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const tools = gameTools(p.root, togglePause);
  const running = () => mode !== 'idle' && mode !== 'done';
  const stat = () => { p.stat.textContent = (running() ? 'Score: ' + score + '  Lives: ' + lives + '  Round: ' + round + '  ' : '') + 'Best: ' + displayBest('casket'); tools.show(running(), paused); };
  const suit = () => STUNT_SUITS.find(s => s[0] === outfit.suit) || STUNT_SUITS[0];
  const inked = (w = 2.5) => { c.strokeStyle = INK_LINE; c.lineWidth = w; c.lineJoin = 'round'; c.stroke(); };

  /* ---------- the big top, painted once ---------- */
  let tent: HTMLCanvasElement | null = null, vignette: HTMLCanvasElement;
  function buildTent(): void {
    if (tent) return;
    const sheet = (paint: (t: CanvasRenderingContext2D) => void) => { const s = document.createElement('canvas'); s.width = W * ZOOM; s.height = H * ZOOM; const t = s.getContext('2d') as CanvasRenderingContext2D; t.scale(ZOOM, ZOOM); paint(t); return s; };
    tent = sheet(t => {
      t.fillStyle = '#1c0a28'; t.fillRect(0, 0, W, H);
      /* stripes running up to the centre of the tent */
      for (let i = -9; i <= 9; i++) {
        t.fillStyle = i % 2 ? '#7a0f4e' : '#2c1038';
        t.beginPath(); t.moveTo(W / 2 + i * 8, -30); t.lineTo(W / 2 + (i + 1) * 8, -30); t.lineTo(W / 2 + (i + 1) * 96, 250); t.lineTo(W / 2 + i * 96, 250); t.closePath(); t.fill();
      }
      /* scalloped trim */
      t.fillStyle = '#f7dc6f'; t.fillRect(0, 44, 0, 0);
      for (let x = -10; x < W + 20; x += 40) { t.fillStyle = (x / 40) % 2 ? '#ff1f8f' : '#fff6fb'; t.beginPath(); t.arc(x + 20, 10, 20, 0, Math.PI); t.closePath(); t.fill(); t.strokeStyle = INK_LINE; t.lineWidth = 2; t.stroke(); }
      /* the back wall of seats, dark enough to sit behind everything */
      t.fillStyle = '#16081f'; t.fillRect(0, 214, W, 40);
      for (let row = 0; row < 2; row++) for (let i = 0; i < 28; i++) {
        const hx = i * 24 + (row ? 12 : 0), hy = 226 + row * 16;
        t.fillStyle = row ? '#2c1a3a' : '#22132e'; t.beginPath(); t.arc(hx, hy, 8, 0, 7); t.fill(); t.fillRect(hx - 9, hy + 5, 18, 16);
        if (i % 5 === 2) { t.beginPath(); t.moveTo(hx - 7, hy - 5); t.lineTo(hx - 10, hy - 14); t.lineTo(hx - 2, hy - 8); t.moveTo(hx + 7, hy - 5); t.lineTo(hx + 10, hy - 14); t.lineTo(hx + 2, hy - 8); t.fill(); }
      }
      /* ring floor */
      t.fillStyle = '#8a5a2b'; t.fillRect(0, 254, W, H - 254);
      for (let i = 0; i < 16; i++) { t.fillStyle = i % 2 ? '#7a4d23' : '#955f2e'; t.fillRect(i * 40, 254, 40, H - 254); }
      t.fillStyle = 'rgba(20,6,20,.35)'; t.fillRect(0, 254, W, 14);
      t.fillStyle = '#ff1f8f'; t.fillRect(0, 334, W, 26);
      t.fillStyle = '#fff6fb'; for (let x = 0; x < W; x += 34) t.fillRect(x, 334, 17, 26);
      t.strokeStyle = INK_LINE; t.lineWidth = 3; t.beginPath(); t.moveTo(0, 334); t.lineTo(W, 334); t.stroke();
    });
    vignette = sheet(t => { const g = t.createRadialGradient(W / 2, H / 2, H * .46, W / 2, H / 2, W * .66); g.addColorStop(0, 'rgba(8,0,16,0)'); g.addColorStop(1, 'rgba(8,0,16,.75)'); t.fillStyle = g; t.fillRect(0, 0, W, H); });
  }
  function spotlights(): void {
    c.save(); c.globalCompositeOperation = 'lighter';
    [[120, 1], [320, -1], [520, 1]].forEach(([sx, dir], i) => {
      const reach = sx + dir * 90 * Math.sin(clock / (1500 + i * 400) + i), g = c.createLinearGradient(0, 0, 0, 320);
      g.addColorStop(0, 'rgba(255,240,200,.2)'); g.addColorStop(1, 'rgba(255,240,200,.02)');
      c.fillStyle = g; c.beginPath(); c.moveTo(sx - 6, 0); c.lineTo(sx + 6, 0); c.lineTo(reach + 60, 322); c.lineTo(reach - 60, 322); c.closePath(); c.fill();
    });
    c.restore();
    for (let i = 0; i < 17; i++) {
      const lx = i * 40 + 6, ly = 34 + Math.sin(i / 16 * Math.PI) * 26, on = Math.sin(clock / 300 + i) > -.3;
      c.fillStyle = on ? '#fff3b0' : '#7a6a30'; c.beginPath(); c.arc(lx, ly, 3, 0, 7); c.fill();
    }
  }
  function crowd(): void {
    const glad = mode === 'splash' ? 1 : 0;
    for (let i = 0; i < 13; i++) {
      const hx = 24 + i * 50, hop = glad ? Math.abs(Math.sin(clock / 120 + i)) * 12 : Math.sin(clock / 700 + i) * 1.5, hy = 352 - hop;
      c.fillStyle = '#0c0512';
      c.beginPath(); c.arc(hx, hy - 8, 15, 0, 7); c.fill(); c.fillRect(hx - 19, hy + 2, 38, 18);
      if (i % 4 === 1) { c.beginPath(); c.moveTo(hx - 12, hy - 18); c.lineTo(hx - 15, hy - 32); c.lineTo(hx - 3, hy - 22); c.moveTo(hx + 12, hy - 18); c.lineTo(hx + 15, hy - 32); c.lineTo(hx + 3, hy - 22); c.fill(); }
      if (glad) { c.strokeStyle = '#0c0512'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx - 16, hy + 6); c.lineTo(hx - 22, hy - 22); c.moveTo(hx + 16, hy + 6); c.lineTo(hx + 22, hy - 22); c.stroke(); }
    }
  }

  /* ---------- the stunt act ---------- */
  const BOX = { x: -130, y: -60, w: 580, h: 790 }, BAKE = .5, SIZE = .17;
  const SPRITES: Record<string, Pose> = {
    fly: { id: 'fly', name: '', armL: [168, 176], armR: [168, 176], handL: 'open', handR: 'open', legL: [2, 0], legR: [2, 0] },
    tuck: { id: 'tuck', name: '', armL: [80, -60], armR: [80, -60], handL: 'fist', handR: 'fist', legL: [24, -60], legR: [24, -60] },
    cheer: { id: 'cheer', name: '', armL: [118, 158], armR: [118, 158], handL: 'open', handR: 'open', tilt: 2 },
    sad: { id: 'sad', name: '', armL: [20, 30], armR: [20, 30], handL: 'relaxed', handR: 'relaxed', tilt: 12 },
  };
  const art: Record<string, HTMLCanvasElement> = {};
  let bakedKey = '', bakeTurn = 0, petArt: HTMLCanvasElement | null = null;
  function picture(text: string, w: number, h: number, ready: (a: HTMLCanvasElement) => void): void {
    const holder = document.createElement('div'); holder.innerHTML = text;
    const svg = holder.querySelector('svg') as SVGSVGElement; svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h));
    const img = new Image();
    img.onload = () => { const a = document.createElement('canvas'); a.width = w; a.height = h; a.getContext('2d')?.drawImage(img, 0, 0, w, h); ready(a); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  }
  function dress(done?: () => void): void {
    const look = (!isAdmin() && currentStudent()?.look) || DOLLS.mumtea.look, [, col, trim] = suit(), key = JSON.stringify([look, outfit]);
    if (key === bakedKey && art.fly) { done?.(); return; }
    bakedKey = key;
    const worn: Look = { ...look, top: 'biker', topC: col, topP: 'solid', trim, bottom: 'skinny', bottomC: col, bottomP: 'solid', legs: 'bare', shoes: 'combat', shoesC: '#14101a', hold: 'none', back: outfit.cape, headwear: outfit.helmet === 'goggles' ? 'none' : outfit.helmet, eyewear: outfit.helmet === 'goggles' ? 'goggles' : look.eyewear };
    const turn = ++bakeTurn, names = Object.keys(SPRITES);
    const next = (i: number): void => {
      if (turn !== bakeTurn || i >= names.length) return;
      picture(drawGhoul(worn, { pose: SPRITES[names[i]], box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), Math.round(BOX.w * BAKE), Math.round(BOX.h * BAKE), a => {
        if (turn !== bakeTurn) return;
        art[names[i]] = a;
        if (i === 0) done?.();
        kick(); next(i + 1);
      });
    };
    petArt = null;
    if (look.pet && look.pet !== 'none') picture(drawGhoul(look, { only: ['pet'], box: '245 590 120 120' }), 180, 180, a => { if (turn === bakeTurn) { petArt = a; kick(); } });
    next(0);
  }
  /* The centre of the picture sits at the waist. */
  function stuntman(pose: string, x: number, y: number, turn: number, size = 1): void {
    const a = art[pose] || art.fly;
    if (!a) return;
    const s = SIZE * size;
    c.save(); c.translate(x, y); c.rotate(turn);
    c.drawImage(a, (BOX.x - 160) * s, (BOX.y - 360) * s, BOX.w * s, BOX.h * s);
    c.restore();
  }

  /* ---------- the coffin cannon ---------- */
  function cannon(): void {
    c.fillStyle = 'rgba(20,4,20,.35)'; c.beginPath(); c.ellipse(CAN.x, 322, 62, 8, 0, 0, 7); c.fill();
    const inside = mode === 'aim' || mode === 'round';
    c.save(); c.translate(CAN.x, CAN.y); c.rotate(-angle);
    const kick2 = mode === 'fly' ? Math.max(0, 12 - modeT * .04) : 0;
    c.translate(-kick2, 0);
    if (inside) stuntman('fly', 58, 0, Math.PI / 2, .9);
    /* a coffin laid along the barrel, pink and studded */
    c.beginPath(); c.moveTo(-34, -13); c.lineTo(-14, -25); c.lineTo(44, -19); c.lineTo(72, -16); c.lineTo(72, 16); c.lineTo(44, 19); c.lineTo(-14, 25); c.lineTo(-34, 13); c.closePath();
    const g = c.createLinearGradient(0, -25, 0, 25); g.addColorStop(0, '#ff5aae'); g.addColorStop(.5, '#ff1f8f'); g.addColorStop(1, '#a50a68'); c.fillStyle = g; c.fill(); inked(3);
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(-12, -17); c.lineTo(40, -12); c.stroke();
    c.fillStyle = '#f7dc6f'; for (const [sx, sy] of [[-16, -12], [-16, 12], [18, -12], [18, 12], [44, -10], [44, 10]]) { c.beginPath(); c.arc(sx, sy, 2.6, 0, 7); c.fill(); }
    c.fillStyle = '#14081a'; c.beginPath(); c.ellipse(72, 0, 5, 16, 0, 0, 7); c.fill(); inked(2);
    c.restore();
    /* wheels */
    c.fillStyle = '#6a1f86'; c.beginPath(); c.arc(CAN.x - 8, 304, 19, 0, 7); c.fill(); inked(3);
    c.strokeStyle = '#f7dc6f'; c.lineWidth = 2.5; c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + clock / 3000; c.moveTo(CAN.x - 8, 304); c.lineTo(CAN.x - 8 + Math.cos(a) * 16, 304 + Math.sin(a) * 16); } c.stroke();
    c.fillStyle = '#f7dc6f'; c.beginPath(); c.arc(CAN.x - 8, 304, 4, 0, 7); c.fill();
    if (petArt) c.drawImage(petArt, CAN.x - 66, 268 + Math.sin(clock / 400) * 2, 46, 46);
  }

  /* ---------- the pot of hot tea ---------- */
  const POT_SCALE = .25;
  const mouth = () => ({ x: pot.x, y: FLOOR - (612 - 256) * POT_SCALE * pot.scale, r: 112 * POT_SCALE * pot.scale + 6 });
  function potShape(): Path2D { return new Path2D('M32 272C50 258 80 248 96 254C120 270 136 350 165 352C178 352 190 328 205 310C215 300 232 290 240 280V256C300 280 430 280 490 256V290C510 300 525 312 535 320C570 305 610 280 640 283C680 295 705 350 700 400C695 460 640 520 540 540C520 552 505 565 498 570C500 590 480 600 440 612C380 628 300 625 270 612C235 600 225 585 232 570C205 555 190 535 172 515C130 490 95 450 88 405C80 360 85 320 72 295C60 285 40 285 32 272ZM560 365C575 400 575 460 565 495C620 490 665 450 672 405C675 370 660 325 630 315C600 320 570 350 560 365Z'); }
  function potFrame(): void { const s = POT_SCALE * pot.scale; c.translate(pot.x, FLOOR); c.scale(s, s); c.translate(-365, -612); }
  function potBack(): void {
    c.save(); c.fillStyle = 'rgba(20,4,20,.3)'; c.beginPath(); c.ellipse(pot.x, FLOOR + 3, 96 * pot.scale, 8, 0, 0, 7); c.fill(); c.restore();
    c.save(); potFrame();
    c.beginPath(); c.ellipse(365, 256, 126, 26, 0, 0, 7); c.fillStyle = '#a50a68'; c.fill(); c.strokeStyle = INK_LINE; c.lineWidth = 8; c.stroke();
    c.beginPath(); c.ellipse(365, 260, 110, 18, 0, 0, 7); c.fillStyle = '#b5651d'; c.fill();
    c.strokeStyle = 'rgba(255,214,150,.8)'; c.lineWidth = 5; c.beginPath(); c.ellipse(365 + Math.sin(clock / 300) * 6, 260, 78, 10, 0, .2, 2.6); c.stroke();
    c.restore();
  }
  function potFront(): void {
    c.save(); potFrame();
    const g = c.createLinearGradient(100, 250, 650, 620); g.addColorStop(0, '#ff5fb4'); g.addColorStop(.5, '#e0108f'); g.addColorStop(1, '#a50a68');
    const shape = potShape();
    c.fillStyle = g; c.fill(shape, 'evenodd'); c.strokeStyle = INK_LINE; c.lineWidth = 9; c.lineJoin = 'round'; c.stroke(shape);
    c.fillStyle = 'rgba(255,255,255,.42)'; c.beginPath(); c.ellipse(270, 400, 42, 92, .35, 0, 7); c.fill();
    c.strokeStyle = '#fff6fb'; c.lineWidth = 7; c.lineCap = 'round'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(236 + i * 33, 322 + Math.abs(i - 4) * -3, 13, 0, Math.PI); c.stroke(); }
    c.restore();
    /* steam */
    const m = mouth();
    c.save(); c.lineCap = 'round'; c.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const t = (clock / 2300 + i / 4) % 1, sx = m.x - m.r * .7 + i * m.r * .46, sy = m.y - 6 - t * 44;
      c.strokeStyle = 'rgba(255,245,250,' + .6 * Math.sin(t * Math.PI) + ')';
      c.beginPath(); c.moveTo(sx, sy); c.bezierCurveTo(sx - 10, sy - 12, sx + 10, sy - 20, sx, sy - 32); c.stroke();
    }
    c.restore();
  }

  /* ---------- flying bits ---------- */
  function burst(x: number, y: number, cols: string[], n: number, power2: number, up = false, shape = ''): void {
    for (let i = 0; i < n; i++) {
      const a = up ? -Math.PI * Math.random() : Math.random() * 7, v = power2 * (.35 + Math.random());
      bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 500 + Math.random() * 500, col: cols[i % cols.length], size: 1.6 + Math.random() * 2.6, shape, turn: Math.random() * 6 });
    }
  }
  function drawBit(b: Bit): void {
    c.globalAlpha = 1 - b.life / b.max; c.fillStyle = b.col;
    if (b.shape === 'paper') { c.save(); c.translate(b.x, b.y); c.rotate((b.turn || 0) + b.life / 90); c.fillRect(-b.size, -b.size * 1.6, b.size * 2, b.size * 3.2); c.restore(); }
    else if (b.shape === 'star') { c.save(); c.translate(b.x, b.y); c.rotate(b.life / 120); c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? b.size : b.size * 2.2, a = i * Math.PI / 5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore(); }
    else if (b.shape === 'heart') { c.save(); c.translate(b.x, b.y); c.scale(b.size * .22, b.size * .22); c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-14, -2, -8, -12, 0, -5); c.bezierCurveTo(8, -12, 14, -2, 0, 8); c.fill(); c.restore(); }
    else if (b.shape === 'ring') { c.strokeStyle = b.col; c.lineWidth = 1.4; c.beginPath(); c.arc(b.x, b.y, b.size * 1.5, 0, 7); c.stroke(); }
    else { c.beginPath(); c.arc(b.x, b.y, b.size, 0, 7); c.fill(); }
    c.globalAlpha = 1;
  }
  function dropTrail(): void {
    const k = outfit.trail;
    if (k === 'stars') bits.push({ x: fx, y: fy, vx: (Math.random() - .5) * .05, vy: .03, life: 0, max: 700, col: Math.random() < .5 ? '#f7dc6f' : '#fff6fb', size: 2.2, shape: 'star' });
    if (k === 'hearts') bits.push({ x: fx, y: fy, vx: (Math.random() - .5) * .05, vy: -.02, life: 0, max: 800, col: Math.random() < .5 ? '#ff1f8f' : '#ff8cc8', size: 4, shape: 'heart' });
    if (k === 'flames') for (let i = 0; i < 2; i++) bits.push({ x: fx - vx * .02, y: fy - vy * .02, vx: -vx * .0006 + (Math.random() - .5) * .05, vy: -vy * .0006 + (Math.random() - .5) * .05, life: 0, max: 420, col: ['#ff6a1a', '#f7dc6f', '#ff2f2f'][i + (Math.random() < .5 ? 0 : 1)], size: 3.5 });
    if (k === 'bubbles') bits.push({ x: fx, y: fy, vx: (Math.random() - .5) * .04, vy: -.05, life: 0, max: 900, col: '#dffcff', size: 2.5, shape: 'ring' });
  }

  /* ---------- rounds ---------- */
  function newRound(first = false): void {
    const far = Math.min(1, (round - 1) / 8);
    pot.scale = Math.max(.72, 1 - far * .3);
    pot.base = 300 + Math.random() * (250 - 40 * (1 - far));
    pot.drift = round > 3 ? Math.min(70, (round - 3) * 14) : 0;
    pot.x = pot.base; pot.phase = Math.random() * 6;
    shotLeft = SHOT_CLOCK; charging = false; power = 0; powerDir = 1;
    mode = 'round'; modeT = first ? -700 : 0; stat();
  }
  function fire(): void {
    if (mode !== 'aim') return;
    const speed = 240 + power * 540, end = 70;
    fx = CAN.x + Math.cos(angle) * end; fy = CAN.y - Math.sin(angle) * end;
    vx = Math.cos(angle) * speed; vy = -Math.sin(angle) * speed; spin = 0;
    charging = false; mode = 'fly'; modeT = 0; note = ''; flashCol = '255,240,200';
    if (!calm) { flash = .5; shake = 8; }
    tone(90, .4); tone(140, .2);
    burst(fx, fy, ['#fff', '#d8d0dc', '#ffcc66', '#8a8390'], 26, .22);
  }
  function miss(reason: string): void {
    lives--; mode = 'miss'; modeT = 0; note = reason; noteT = 0; flashCol = '120,20,120';
    if (!calm) { shake = 7; flash = .35; }
    tone(150, .3); stat();
  }
  function step(dt: number): void {
    clock += dt; modeT += dt; noteT += dt;
    shake = Math.max(0, shake - dt * .022); flash = Math.max(0, flash - dt * .003);
    pot.phase += dt * .0014;
    if (pot.drift) pot.x = pot.base + Math.sin(pot.phase) * pot.drift;
    pot.x = Math.max(250, Math.min(W - 60, pot.x));
    if (mode === 'round' && modeT >= 1300) { mode = 'aim'; modeT = 0; stat(); }
    if (mode === 'aim') {
      shotLeft -= dt;
      if (keys.ArrowLeft || keys.ArrowDown) angle -= dt * .0011;
      if (keys.ArrowRight || keys.ArrowUp) angle += dt * .0011;
      angle = Math.max(.2, Math.min(1.45, angle));
      if (charging) { power += powerDir * dt * .0011; if (power >= 1) { power = 1; powerDir = -1; } if (power <= 0) { power = 0; powerDir = 1; } }
      if (shotLeft <= 0) miss('Too slow! The crowd is booing.');
    }
    if (mode === 'fly') {
      const prevY = fy;
      vy += G * dt / 1000; fx += vx * dt / 1000; fy += vy * dt / 1000; spin += dt * .012;
      trailGap -= dt; if (trailGap <= 0) { trailGap = 40; dropTrail(); }
      const m = mouth();
      if (vy > 0 && prevY <= m.y && fy >= m.y) {
        const off = Math.abs(fx - m.x);
        if (off <= m.r) {
          bull = off < m.r * .34; const gain = bull ? 3 : 1;
          score += gain; mode = 'splash'; modeT = 0; note = bull ? 'BULLSEYE! +3' : 'SPLASH! +1'; noteT = 0; cheerT = 0;
          tone(330, .15); tone(660, .2); tone(990, .25);
          burst(m.x, m.y, ['#b5651d', '#d98a3d', '#ffd9a8', '#fff6fb'], 60, .34, true);
          burst(m.x, m.y - 30, ['#ff1f8f', '#f7dc6f', '#35dcc8', '#c77dff', '#fff6fb'], 46, .3, true, 'paper');
          if (!calm) shake = 5;
          stat(); fx = m.x; fy = m.y + 40;
        } else if (off < m.r + 60) { vx = -vx * .4; vy = -vy * .3; fy = m.y - 1; tone(200, .1); burst(fx, fy, ['#fff'], 8, .15); }
      }
      if (mode === 'fly') {
        if (fy >= FLOOR - 4) { burst(fx, FLOOR, ['#c9a06a', '#8a5a2b', '#fff'], 22, .2, true); miss('Face first. Ouch!'); }
        else if (fx > W + 70 || fx < -70) miss('Out of the ring!');
      }
    }
    if (mode === 'splash') {
      if (modeT > 2400) { round++; newRound(); }
    }
    if (mode === 'miss' && modeT > 1500) {
      if (lives <= 0) finish(); else newRound();
    }
    if (mode === 'idle' || mode === 'done') { /* the show waits */ }
    const target = mode === 'fly' ? 1.14 : mode === 'splash' ? 1.28 : 1;
    zoom += (target - zoom) * Math.min(1, dt * .003);
    bits = bits.filter(b => { b.life += dt; b.x += b.vx * dt; b.y += b.vy * dt; if (b.shape !== 'ring') b.vy += .00045 * dt; else b.vy -= .00001 * dt; return b.life < b.max && b.y < 360; });
  }
  function paint(): void {
    buildTent();
    c.save();
    if (shake > 0) c.translate(Math.sin(clock * .09) * shake * .6, Math.cos(clock * .11) * shake * .6);
    if (zoom > 1.002) {
      const fox = mode === 'splash' ? pot.x : mode === 'fly' ? fx : W / 2, foy = mode === 'splash' ? mouth().y : mode === 'fly' ? fy : H / 2;
      c.translate(W / 2, H / 2); c.scale(zoom, zoom); c.translate(-Math.max(W / 2 / zoom, Math.min(W - W / 2 / zoom, fox)), -Math.max(H / 2 / zoom, Math.min(H - H / 2 / zoom, foy)));
    }
    c.drawImage(tent as HTMLCanvasElement, 0, 0, W, H);
    spotlights();
    potBack();
    if (mode === 'splash') {
      /* up they pop with their hands in the air */
      const rise = Math.min(1, modeT / 420), m = mouth(), bob = Math.sin(modeT / 180) * 3;
      stuntman('cheer', m.x, m.y + 60 - rise * 54 + bob * rise, 0, 1.15);
    }
    potFront();
    cannon();
    if (mode === 'aim') {
      const speed = 240 + (charging ? power : .55) * 540, ox = CAN.x + Math.cos(angle) * 74, oy = CAN.y - Math.sin(angle) * 74;
      for (let i = 1; i <= 8; i++) { const t = i * .055, dx = ox + Math.cos(angle) * speed * t, dy = oy - Math.sin(angle) * speed * t + G * t * t / 2; c.fillStyle = 'rgba(255,246,251,' + (.9 - i * .09) + ')'; c.beginPath(); c.arc(dx, dy, 3.2 - i * .2, 0, 7); c.fill(); }
    }
    if (mode === 'fly') {
      const pose = modeT > 700 ? 'tuck' : 'fly', heading = Math.atan2(vy, vx) + Math.PI / 2;
      stuntman(pose, fx, fy, pose === 'tuck' ? spin : heading);
    }
    if (mode === 'miss' && note.startsWith('Face')) stuntman('sad', fx, FLOOR - 40, Math.PI * .85);
    if (mode === 'idle') { stuntman('cheer', W / 2 + 20, 252, 0, 1.2); }
    bits.forEach(drawBit);
    crowd();
    c.restore();
    c.drawImage(vignette, 0, 0, W, H);
    if (flash > 0) { c.fillStyle = 'rgba(' + flashCol + ',' + flash + ')'; c.fillRect(0, 0, W, H); }
    if (running() && mode !== 'round') hud();
    if (mode === 'round') {
      const a = Math.min(1, (modeT + 700) / 300) * Math.min(1, (1300 - modeT) / 300);
      c.fillStyle = '#080308'; c.fillRect(0, 0, W, 26 * a); c.fillRect(0, H - 26 * a, W, 26 * a);
      c.globalAlpha = Math.max(0, a); write('ROUND ' + round, W / 2, 110, 54, '#ff7ab8'); c.globalAlpha = 1;
    }
    if (mode === 'splash' || mode === 'miss') { c.globalAlpha = Math.min(1, noteT / 150); write(note.toUpperCase(), W / 2, 62, mode === 'splash' ? 40 : 30, mode === 'splash' ? '#fff3b0' : '#ff8cc8'); c.globalAlpha = 1; }
    if (mode === 'idle') {
      write('CASKET SHOT', W / 2, 96, 50, '#ff7ab8');
      write('SUIT UP BELOW, THEN START THE SHOW', W / 2, 128, 16, '#fff6fb');
    }
    if (mode === 'done') {
      c.fillStyle = 'rgba(10,2,16,.66)'; c.fillRect(0, 0, W, H);
      write('SHOW OVER!', W / 2, 150, 54, '#ff7ab8');
      write(score + (score === 1 ? ' POINT' : ' POINTS') + ', ROUND ' + round, W / 2, 192, 24, '#fff6fb');
      c.font = '800 15px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffd3e8'; c.fillText('Best: ' + finalBest + '. Change your stunt suit below or go again.', W / 2, 222);
    }
  }
  function write(text: string, x: number, y: number, size: number, fill: string, align: CanvasTextAlign = 'center'): void {
    c.font = size + 'px ' + DISPLAY_FONT; c.textAlign = align; c.lineJoin = 'round';
    c.strokeStyle = INK_LINE; c.lineWidth = Math.max(3, size * .2); c.strokeText(text, x, y);
    c.fillStyle = fill; c.fillText(text, x, y);
  }
  function hud(): void {
    write('SCORE', 16, 58, 12, '#7fe8ff', 'left');
    write(String(score), 16, 84, 26, '#fff6fb', 'left');
    for (let i = 0; i < 3; i++) {
      c.save(); c.translate(W - 28 - i * 28, 56); c.fillStyle = i < lives ? '#ff1f8f' : 'rgba(20,8,26,.6)';
      c.beginPath(); c.moveTo(0, 10); c.bezierCurveTo(-16, -1, -9, -13, 0, -5); c.bezierCurveTo(9, -13, 16, -1, 0, 10); c.closePath(); c.fill(); c.strokeStyle = INK_LINE; c.lineWidth = 2; c.stroke(); c.restore();
    }
    if (mode === 'aim') {
      /* power */
      c.fillStyle = '#14081a'; c.fillRect(16, 96, 16, 120); c.strokeStyle = '#fff6fb'; c.lineWidth = 2; c.strokeRect(16, 96, 16, 120);
      const g = c.createLinearGradient(0, 216, 0, 96); g.addColorStop(0, '#35dcc8'); g.addColorStop(.6, '#f7dc6f'); g.addColorStop(1, '#ff1f8f'); c.fillStyle = g; c.fillRect(18, 214 - 116 * power, 12, 116 * power);
      /* shot clock */
      const secs = Math.ceil(shotLeft / 1000), hurry = secs <= 5;
      write(String(secs), W - 30, 96, hurry ? 26 : 20, hurry ? '#ff8cc8' : '#fff6fb', 'center');
      if (!charging) { c.font = '800 13px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#fff6fb'; c.fillText('Press and hold for power, then let go', W / 2, 330); }
    }
  }
  function pauseCover(): void {
    c.fillStyle = 'rgba(10,2,16,.6)'; c.fillRect(0, 0, W, H);
    write('PAUSED', W / 2, H / 2, 50, '#fff6fb');
    c.font = '800 15px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffd3e8'; c.fillText('Tap the play icon, or press P, when you are ready', W / 2, H / 2 + 30);
  }
  function frame(now: number): void {
    looping = false;
    if (!cv.getClientRects().length) { if (running()) quit(); return; }
    if (paused) return;
    const dt = Math.min(40, now - last); last = now;
    step(dt); paint();
    if (running() || (visible && !calm && document.visibilityState === 'visible')) { looping = true; requestAnimationFrame(frame); }
  }
  function kick(): void {
    if (looping || paused || !cv.getClientRects().length) return;
    looping = true; last = performance.now(); requestAnimationFrame(frame);
  }
  function togglePause(): void {
    if (!running()) return;
    paused = !paused;
    charging = false;
    musicHold(paused);
    if (paused) { paint(); pauseCover(); } else kick();
    stat();
  }
  function finish(): void {
    mode = 'done'; modeT = 0; paused = false; finalBest = p.bestOf(score);
    award(Math.ceil(score / 2)); submitScore('casket', score);
    locker.hidden = false; p.go.textContent = 'Go again'; stat();
  }
  function quit(): void { mode = 'idle'; paused = false; charging = false; bits = []; keys = {}; locker.hidden = false; p.go.textContent = 'Start the show'; musicHold(false); stat(); }
  p.go.addEventListener('click', () => {
    dress(() => {
      paused = false; score = 0; lives = 3; round = 1; bits = []; note = ''; zoom = 1; shake = 0; flash = 0;
      locker.hidden = true; p.go.textContent = 'Restart'; p.go.blur(); musicHold(false); tone(220, .3);
      newRound(true); kick();
    });
  });
  const aimAt = (e: PointerEvent): void => {
    if (mode !== 'aim' || paused) return;
    const r = cv.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width * W, my = (e.clientY - r.top) / r.height * H;
    angle = Math.max(.2, Math.min(1.45, Math.atan2(CAN.y - my, Math.max(8, mx - CAN.x))));
  };
  cv.addEventListener('pointermove', aimAt);
  cv.addEventListener('pointerdown', e => { aimAt(e); if (mode === 'aim' && !paused) { charging = true; power = 0; powerDir = 1; e.preventDefault(); } });
  addEventListener('pointerup', () => { if (charging) fire(); });
  addEventListener('keydown', e => {
    if (isPauseKey(e) && running()) { togglePause(); e.preventDefault(); return; }
    if (!running() || typing(e)) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { keys[e.key] = true; e.preventDefault(); }
    if (e.key === ' ') { e.preventDefault(); if (mode === 'aim' && !charging && !paused) { charging = true; power = 0; powerDir = 1; } }
  });
  addEventListener('keyup', e => { keys[e.key] = false; if (e.key === ' ' && charging) fire(); });
  stops.push(() => { if (running()) quit(); });
  new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) { dress(); kick(); } }).observe(cv);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') kick(); });
  drawLocker(); stat();
})();
