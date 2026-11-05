/* ---------- Graveyard Cup: penalties and free kicks under the floodlights ---------- */
/* Shared by the newer games: turn a ghoul drawing into a picture a canvas can use. */
function spriteFromSvg(text: string, w: number, h: number, ready: (a: HTMLCanvasElement) => void): void {
  const holder = document.createElement('div'); holder.innerHTML = text;
  const svg = holder.querySelector('svg') as SVGSVGElement; svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h));
  const img = new Image();
  img.onload = () => { const a = document.createElement('canvas'); a.width = w; a.height = h; a.getContext('2d')?.drawImage(img, 0, 0, w, h); ready(a); };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
}
function gameWrite(c: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, col = '#fff6fb', align: CanvasTextAlign = 'center'): void {
  c.font = size + 'px ' + DISPLAY_FONT; c.textAlign = align; c.lineJoin = 'round';
  c.strokeStyle = '#14081a'; c.lineWidth = Math.max(4, size * .16); c.strokeText(text, x, y);
  c.fillStyle = col; c.fillText(text, x, y);
}
function gameLine(c: CanvasRenderingContext2D, text: string, x: number, y: number, col = '#fff6fb', size = 13): void {
  c.font = '800 ' + size + 'px Nunito, sans-serif'; c.textAlign = 'center'; c.lineJoin = 'round';
  c.strokeStyle = 'rgba(16,6,24,.85)'; c.lineWidth = 4; c.strokeText(text, x, y);
  c.fillStyle = col; c.fillText(text, x, y);
}
const KICK_KITS: Array<[string, string, string]> = [['Hot pink', '#ff1f8f', '#14101a'], ['Graveyard black', '#14101a', '#ff1f8f'], ['Royal purple', '#6a1f86', '#f4d35e'], ['Electric blue', '#19b7e8', '#fff6fb'], ['Teal', '#0f766e', '#f4d35e'], ['Blood red', '#c0392b', '#fff6fb'], ['Bone white', '#fff6fb', '#6a1f86']];
const KICK_BOOTS: Array<[string, string]> = [['Pink', '#ff1f8f'], ['Gold', '#f4d35e'], ['Black', '#14101a'], ['Slime', '#8df04a'], ['White', '#fff6fb']];
const KICK_BALLS: Array<[string, string]> = [['classic', 'Classic'], ['skull', 'Skull ball'], ['pumpkin', 'Pumpkin'], ['moon', 'Moon ball']];
(function () {
  const W = 640, H = 360, ZOOM = 2, SHOTS = 10, PENS = 5, INK_LINE = '#14081a';
  const [cv, c] = makeCanvas('Graveyard Cup game area');
  cv.width = W * ZOOM; cv.height = H * ZOOM; c.scale(ZOOM, ZOOM);
  const saved = store.get<{ kit?: string; boots?: string; ball?: string }>('kickKit', {});
  const outfit = { kit: KICK_KITS.some(k => k[0] === saved.kit) ? saved.kit as string : 'Hot pink', boots: KICK_BOOTS.some(k => k[0] === saved.boots) ? saved.boots as string : 'Gold', ball: KICK_BALLS.some(k => k[0] === saved.ball) ? saved.ball as string : 'skull' };
  const lockerRows = el('div', { cls: 'merrows' }), locker = el('div', { cls: 'merlocker wframe' }, el('h4', { text: 'Kit room' }), lockerRows);
  function drawLocker(): void {
    lockerRows.textContent = '';
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Kit' }), ...KICK_KITS.map(([name, col]) => { const b = el('button', { cls: 'wswatch', type: 'button', 'aria-label': name, title: name, 'data-kick': 'kit:' + name, 'aria-pressed': outfit.kit === name, onclick() { wear('kit', name); } }); b.style.background = col; return b; })));
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Boots' }), ...KICK_BOOTS.map(([name, col]) => { const b = el('button', { cls: 'wswatch', type: 'button', 'aria-label': name + ' boots', title: name, 'aria-pressed': outfit.boots === name, onclick() { wear('boots', name); } }); b.style.background = col; return b; })));
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Match ball' }), ...KICK_BALLS.map(([id, name]) => el('button', { cls: 'wchip', type: 'button', 'aria-pressed': outfit.ball === id, onclick() { wear('ball', id); } }, name))));
  }
  function wear(key: 'kit' | 'boots' | 'ball', value: string): void { outfit[key] = value; store.set('kickKit', outfit); drawLocker(); if (mode === 'done') mode = 'idle'; dress(); kick(); }
  const p = makePanel('kick', 'Graveyard Cup', 'Five penalties, then five free kicks round a wall. Move your mouse or finger to aim. Press and hold for power, and let go in the green. On free kicks, slide sideways while holding to bend the ball. Top corners score double.', [cv], 'Kick off');
  p.root.append(locker);

  type Mode = 'idle' | 'intro' | 'card' | 'aim' | 'runup' | 'flight' | 'result' | 'done';
  interface Bit { x: number; y: number; vx: number; vy: number; life: number; col: string; size: number }
  let mode: Mode = 'idle', paused = false, looping = false, visible = false, last = 0, clock = 0, modeT = 0, shotNo = 0, score = 0, goals = 0, finalBest = 0, keys: Record<string, boolean> = {};
  let aimX = 320, aimY = 130, charging = false, power = 0, powerDir = 1, curl = 0, pressX = 0, pointerX = 320;
  let goal = { x: 320, base: 176, w: 250, h: 92 }, wallAt: { x: number; y: number; w: number } | null = null, wallJump = 0;
  let ball = { sx: 320, sy: 322, tx: 320, ty: 130, arc: 30, bend: 0, t: 0, dur: 620, x: 320, y: 322, r: 11, spin: 0, gone: 0, vx: 0, vy: 0 };
  let keeper = { x: 320, rot: 0, lift: 0, dive: 0, to: 0 }, outcome = '', headline = '', sub = '', gained = 0, bits: Bit[] = [], shake = 0, flash = 0, bulge = 0, cam = 1, slow = 1, cheer = 0, runX = 244;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const tools = gameTools(p.root, togglePause);
  const running = () => mode !== 'idle' && mode !== 'done';
  const stat = () => { p.stat.textContent = (running() ? 'Score: ' + score + '  Goals: ' + goals + '  Shot: ' + Math.min(SHOTS, shotNo + 1) + ' of ' + SHOTS + '  ' : '') + 'Best: ' + displayBest('kick'); tools.show(running(), paused); };
  const go = (m: Mode): void => { mode = m; modeT = 0; };
  const isPen = () => shotNo < PENS;

  /* ---------- the players ---------- */
  const art: Record<string, HTMLCanvasElement> = {}, BOX = { x: -130, y: -60, w: 580, h: 790 };
  const heads: HTMLCanvasElement[] = [], wallArt: HTMLCanvasElement[] = [];
  let bakedKey = '', asked = false, scene: HTMLCanvasElement | null = null;
  const KEEP_READY: Pose = { id: 'keep', name: '', armL: [62, 40], armR: [62, 40], handL: 'open', handR: 'open', legL: [12, -18], legR: [12, -18] };
  const KEEP_DIVE: Pose = { id: 'dive', name: '', armL: [165, 172], armR: [165, 172], handL: 'open', handR: 'open', legL: [4, 0], legR: [12, -14] };
  const WALL: Pose = { id: 'wall', name: '', armL: [14, 60], armR: [14, 60], handL: 'fist', handR: 'fist', legL: [2, 0], legR: [2, 0] };
  const WIN: Pose = { id: 'win', name: '', armL: [118, 158], armR: [118, 158], handL: 'open', handR: 'open', tilt: 2 };
  const kit = () => KICK_KITS.find(k => k[0] === outfit.kit) || KICK_KITS[0];
  const bootCol = () => (KICK_BOOTS.find(k => k[0] === outfit.boots) || KICK_BOOTS[0])[1];
  const footie = (look: Look, top: string, trim: string, shoes: string): Look => ({ ...look, top: 'jersey', topC: top, topP: 'solid', trim, bottom: 'shorts', bottomC: top, bottomP: 'solid', legs: 'knee', legsC: trim, shoes: 'sneaker', shoesC: shoes, hold: 'none', back: 'none', neck: 'none', pet: 'none', pose: 'relaxed' });
  function dress(): void {
    const look = (!isAdmin() && currentStudent()?.look) || DOLLS.mumtea.look, [, top, trim] = kit(), key = JSON.stringify([look, outfit]);
    if (key === bakedKey && art.back) return;
    bakedKey = key;
    const worn = footie(look, top, trim, bootCol());
    spriteFromSvg(drawGhoulBack(worn), 240, 210, a => { art.back = a; kick(); });
    spriteFromSvg(drawGhoul(worn, { pose: WIN, box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), 290, 395, a => { art.win = a; kick(); });
    if (asked) return;
    asked = true;
    const gk = footie(randomLook(), '#2f8f4e', '#f4d35e', '#14101a');
    spriteFromSvg(drawGhoul(gk, { pose: KEEP_READY, box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), 290, 395, a => { art.keep = a; kick(); });
    spriteFromSvg(drawGhoul(gk, { pose: KEEP_DIVE, box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), 290, 395, a => { art.dive = a; kick(); });
    schoolCrowd(4).forEach(person => spriteFromSvg(drawGhoul(footie(person, '#6a1f86', '#fff6fb', '#14101a'), { pose: WALL, box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), 174, 237, a => { wallArt.push(a); kick(); }));
    schoolCrowd(12).forEach(person => spriteFromSvg(drawGhoul(person, { head: true }), 60, 60, a => { heads.push(a); scene = null; kick(); }));
  }
  const sprite = (a: HTMLCanvasElement | undefined, x: number, feet: number, tall: number, rot = 0): void => {
    if (!a) return;
    const s = tall / 720;
    c.save(); c.translate(x, feet - tall * .5); c.rotate(rot);
    c.drawImage(a, (BOX.x - 160) * s, (BOX.y - 360) * s, BOX.w * s, BOX.h * s);
    c.restore();
  };

  /* ---------- the stadium, painted fresh for each shot's angle ---------- */
  function buildScene(): void {
    const s = document.createElement('canvas'); s.width = W * ZOOM; s.height = H * ZOOM;
    const t = s.getContext('2d') as CanvasRenderingContext2D; t.scale(ZOOM, ZOOM);
    const { x, base, w } = goal, grass = base - 14;
    t.fillStyle = '#0a0416'; t.fillRect(0, 0, W, H);
    t.fillStyle = '#efe6c8'; t.beginPath(); t.arc(68, 22, 12, 0, 7); t.fill(); t.fillStyle = '#0a0416'; t.beginPath(); t.arc(73, 19, 10, 0, 7); t.fill();
    /* the stand: tier on tier of real school faces */
    for (let row = 0; row < 7; row++) {
      const y = 18 + row * 18;
      t.fillStyle = row % 2 ? '#1d0d2e' : '#25123a'; t.fillRect(0, y, W, 18);
      for (let i = -1; i < 34; i++) {
        const hx = i * 20 + (row % 2 ? 10 : 0), a = heads[(i * 5 + row * 7 + 60) % Math.max(1, heads.length)];
        if (a) { t.globalAlpha = .55 + row * .06; t.drawImage(a, hx - 2, y - 3, 22, 22); t.globalAlpha = 1; } else { t.fillStyle = '#3a2350'; t.beginPath(); t.arc(hx + 9, y + 9, 7, 0, 7); t.fill(); }
      }
    }
    t.fillStyle = 'rgba(10,4,22,.58)'; t.fillRect(0, 16, W, 130);
    /* advertising boards */
    t.fillStyle = '#14081a'; t.fillRect(0, grass - 16, W, 18);
    t.textAlign = 'center';
    for (let i = 0; i < 7; i++) { t.fillStyle = i % 2 ? '#ff1f8f' : '#2c1140'; t.fillRect(i * 96 - 12, grass - 15, 94, 15); t.fillStyle = i % 2 ? '#14081a' : '#ff8cc8'; t.font = '12px ' + DISPLAY_FONT; t.fillText(i % 2 ? 'MUMTEA HIGH' : 'GRAVEYARD CUP', i * 96 + 35, grass - 3); }
    /* the mown pitch */
    t.fillStyle = '#0d4f28'; t.fillRect(0, grass, W, H - grass);
    const vp = { x, y: grass - 70 };
    for (let i = -12; i < 12; i += 2) {
      t.fillStyle = '#126534'; t.beginPath();
      const at = (k: number, y: number) => vp.x + (k * 62) * (y - vp.y) / (H - vp.y);
      t.moveTo(at(i, grass), grass); t.lineTo(at(i + 1, grass), grass); t.lineTo(at(i + 1, H), H); t.lineTo(at(i, H), H); t.closePath(); t.fill();
    }
    /* the white lines: goal line, six-yard box, penalty box and the spot */
    t.strokeStyle = 'rgba(255,255,255,.88)'; t.lineWidth = 2; t.lineJoin = 'round';
    t.beginPath(); t.moveTo(0, base); t.lineTo(W, base); t.stroke();
    const box = (half: number, nearHalf: number, near: number) => { t.beginPath(); t.moveTo(x - half, base); t.lineTo(x - nearHalf, near); t.lineTo(x + nearHalf, near); t.lineTo(x + half, base); t.stroke(); };
    box(w * .78, w * .96, base + 22); box(w * 1.7, w * 2.5, base + 76);
    if (isPen()) { t.fillStyle = '#fff'; t.beginPath(); t.ellipse(ball.sx, ball.sy + 8, 7, 3, 0, 0, 7); t.fill(); }
    t.beginPath(); t.ellipse(x, base + 76, w * .52, 19, 0, 0, Math.PI); t.stroke();
    t.fillStyle = 'rgba(0,0,0,.28)'; t.fillRect(0, grass, W, 8);
    const v = t.createRadialGradient(W / 2, H / 2, H * .44, W / 2, H / 2, W * .68); v.addColorStop(0, 'rgba(6,0,14,0)'); v.addColorStop(1, 'rgba(6,0,14,.7)'); t.fillStyle = v; t.fillRect(0, 0, W, H);
    scene = s;
  }
  function floodlights(): void {
    const lit = mode === 'intro' ? Math.floor(modeT / 380) : 4;
    [[34, 8], [226, 2], [414, 2], [606, 8]].forEach(([lx, ly], i) => {
      c.fillStyle = '#2a1a38'; c.fillRect(lx - 16, ly, 32, 10);
      if (i >= lit) return;
      c.fillStyle = '#fff8d8'; for (let k = 0; k < 4; k++) c.fillRect(lx - 14 + k * 7, ly + 2, 5, 6);
      c.save(); c.globalCompositeOperation = 'lighter';
      const g = c.createLinearGradient(0, ly, 0, 320); g.addColorStop(0, 'rgba(255,245,210,.2)'); g.addColorStop(1, 'rgba(255,245,210,.01)');
      c.fillStyle = g; c.beginPath(); c.moveTo(lx - 12, ly + 8); c.lineTo(lx + 12, ly + 8); c.lineTo(320 + (lx - 320) * .45 + 90, 340); c.lineTo(320 + (lx - 320) * .45 - 90, 340); c.closePath(); c.fill();
      c.restore();
    });
  }
  function goalFrame(): void {
    const { x, base, w, h } = goal, l = x - w / 2, r = x + w / 2, top = base - h, depth = 15;
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.moveTo(l, base); c.lineTo(l + depth, base - depth * .5); c.lineTo(r - depth, base - depth * .5); c.lineTo(r, base); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,180,220,.6)'; c.lineWidth = 1; c.beginPath();
    const bx = ball.tx, by = ball.ty, swell = bulge * 12;
    const pull = (nx: number, ny: number): [number, number] => { const d = Math.hypot(nx - bx, ny - by), k = Math.max(0, 1 - d / 70) * swell; return [nx + (nx - bx) * k * .04, ny - k * .35]; };
    for (let i = 0; i <= 18; i++) { const nx = l + i / 18 * w; for (let j = 0; j <= 8; j++) { const [ax, ay] = pull(nx, top + 5 + j / 8 * (h - 8)); if (!j) c.moveTo(ax, ay); else c.lineTo(ax, ay); } }
    for (let j = 0; j <= 8; j++) { const ny = top + 5 + j / 8 * (h - 8); for (let i = 0; i <= 18; i++) { const [ax, ay] = pull(l + i / 18 * w, ny); if (!i) c.moveTo(ax, ay); else c.lineTo(ax, ay); } }
    c.stroke();
    c.lineCap = 'round'; c.strokeStyle = INK_LINE; c.lineWidth = 7; c.beginPath(); c.moveTo(l, base); c.lineTo(l, top); c.lineTo(r, top); c.lineTo(r, base); c.stroke();
    c.strokeStyle = '#fff6fb'; c.lineWidth = 4; c.stroke();
  }
  function wallPeople(front: boolean): void {
    if (!wallAt || !wallArt.length) return;
    if (front !== ball.t < .55) return;
    const jump = wallJump > 0 ? Math.sin(Math.min(1, wallJump) * Math.PI) * 18 : 0;
    for (let i = 0; i < 4; i++) sprite(wallArt[i % wallArt.length], wallAt.x - wallAt.w * .375 + i * wallAt.w * .25, wallAt.y - jump + (i % 2), 66);
  }
  function drawKeeper(): void {
    const tall = goal.h * .98, diving = keeper.dive > 0;
    const y = goal.base - keeper.lift + (mode === 'aim' ? Math.sin(clock / 240) * 1.2 : 0);
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(keeper.x, goal.base + 2, 18, 4, 0, 0, 7); c.fill();
    sprite(diving ? art.dive : art.keep, keeper.x, y, tall, keeper.rot);
  }
  function drawBall(x: number, y: number, r: number, spin: number): void {
    const kind = outfit.ball;
    c.save(); c.translate(x, y); c.rotate(spin);
    c.fillStyle = kind === 'pumpkin' ? '#ff8c1a' : kind === 'moon' ? '#e4dcc6' : '#fff6fb';
    c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.strokeStyle = INK_LINE; c.lineWidth = Math.max(1, r * .16); c.stroke();
    c.fillStyle = INK_LINE; c.strokeStyle = INK_LINE; c.lineWidth = Math.max(.8, r * .1);
    if (kind === 'classic') {
      c.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * .4; c.lineTo(Math.cos(a) * r * .42, Math.sin(a) * r * .42); } c.closePath(); c.fill();
      c.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * .4; c.moveTo(Math.cos(a) * r * .42, Math.sin(a) * r * .42); c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.stroke();
    } else if (kind === 'skull') {
      c.beginPath(); c.ellipse(-r * .34, -r * .1, r * .24, r * .3, 0, 0, 7); c.ellipse(r * .34, -r * .1, r * .24, r * .3, 0, 0, 7); c.fill();
      c.beginPath(); c.moveTo(0, r * .22); c.lineTo(-r * .12, r * .42); c.lineTo(r * .12, r * .42); c.fill();
      c.beginPath(); c.moveTo(-r * .3, r * .66); c.lineTo(r * .3, r * .66); c.stroke();
    } else if (kind === 'pumpkin') {
      c.beginPath(); c.moveTo(-r * .55, -r * .35); c.lineTo(-r * .2, -r * .05); c.lineTo(-r * .55, r * .05); c.moveTo(r * .55, -r * .35); c.lineTo(r * .2, -r * .05); c.lineTo(r * .55, r * .05); c.fill();
      c.beginPath(); c.arc(0, r * .15, r * .55, .25, Math.PI - .25); c.closePath(); c.fill();
    } else {
      c.fillStyle = '#b8ae96'; for (const [a, b, q] of [[-.4, -.3, .24], [.4, .1, .2], [-.15, .5, .16], [.3, -.55, .12]]) { c.beginPath(); c.arc(a * r, b * r, q * r, 0, 7); c.fill(); }
    }
    c.restore();
  }
  /* The kicker from behind: the same head and hair as the character, on a body that can run and strike. */
  function kicker(x: number, feet: number, swing: number, step: number): void {
    const [, top, trim] = kit(), skin = ((!isAdmin() && currentStudent()?.look) || DOLLS.mumtea.look).skin;
    const limb = (x1: number, y1: number, x2: number, y2: number, col: string, wide: number): void => { c.lineCap = 'round'; c.strokeStyle = INK_LINE; c.lineWidth = wide + 3; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.strokeStyle = col; c.lineWidth = wide; c.stroke(); };
    c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x, feet + 2, 30, 7, 0, 0, 7); c.fill();
    const stride = Math.sin(step) * 10, hip = feet - 36;
    /* standing leg, then the striking leg */
    limb(x - 8, hip, x - 10 - stride * .4, feet - 4, skin, 9); limb(x - 10 - stride * .4, feet - 20, x - 10 - stride * .4, feet - 4, trim, 10);
    limb(x - 10 - stride * .4, feet - 2, x - 12 - stride * .4, feet, bootCol(), 11);
    const footX = x + 10 + stride * .4 + swing * 22, footY = feet - 4 - swing * 34;
    limb(x + 8, hip, footX, footY, skin, 9); limb((x + 8 + footX) / 2, (hip + footY) / 2, footX, footY, trim, 10); limb(footX, footY, footX + 2, footY + 2, bootCol(), 11);
    c.fillStyle = top; c.fillRect(x - 20, feet - 54, 40, 21); c.strokeStyle = INK_LINE; c.lineWidth = 2.5; c.strokeRect(x - 20, feet - 54, 40, 21);
    limb(x - 18, feet - 84, x - 28 - stride * .5, feet - 54 - swing * 16, skin, 7); limb(x + 18, feet - 84, x + 28 + stride * .5, feet - 58 + swing * 10, skin, 7);
    c.fillStyle = top; c.beginPath(); c.moveTo(x - 23, feet - 84); c.lineTo(x + 23, feet - 84); c.lineTo(x + 20, feet - 50); c.lineTo(x - 20, feet - 50); c.closePath(); c.fill(); c.strokeStyle = INK_LINE; c.lineWidth = 2.5; c.stroke();
    if (art.back) c.drawImage(art.back, x - 49, feet - 152, 98, 86);
    c.font = '20px ' + DISPLAY_FONT; c.textAlign = 'center'; c.fillStyle = trim; c.fillText('13', x, feet - 54);
  }

  /* ---------- a shot from start to finish ---------- */
  function setUp(): void {
    if (isPen()) { goal = { x: 320, base: 176, w: 250, h: 92 }; ball.sx = 320; ball.sy = 322; wallAt = null; }
    else {
      const side = shotNo % 2 ? 1 : -1;
      goal = { x: 320 + side * (46 + (shotNo - PENS) * 10), base: 166, w: 190, h: 72 };
      ball.sx = 320; ball.sy = 322;
      /* the wall covers the near half of the goal */
      const mid = .5;
      wallAt = { x: ball.sx + (goal.x - side * goal.w * .22 - ball.sx) * mid, y: ball.sy + (goal.base - ball.sy) * mid + 8, w: 104 };
    }
    ball.x = ball.sx; ball.y = ball.sy; ball.r = 11; ball.t = 0; ball.gone = 0; ball.spin = 0;
    aimX = goal.x + (Math.random() - .5) * 30; aimY = goal.base - goal.h * .45;
    keeper = { x: goal.x, rot: 0, lift: 0, dive: 0, to: goal.x };
    power = 0; charging = false; curl = 0; bulge = 0; cam = 1; slow = 1; wallJump = 0; outcome = ''; runX = 244; scene = null;
  }
  function strike(): void {
    charging = false;
    const miss = Math.abs(power - .68), wild = miss > .12 ? (miss - .12) * goal.w * 1.5 : 0, over = power > .88 ? (power - .88) * 340 : 0, short = power < .4;
    ball.tx = aimX + (Math.random() - .5) * wild * 2; ball.ty = aimY + (Math.random() - .5) * wild - over + (short ? (goal.base - aimY) * .9 : 0);
    ball.bend = curl * 62; ball.dur = 760 - power * 280; ball.arc = isPen() ? 14 + power * 22 : 34 + power * 62;
    go('runup'); tone(160, .08);
  }
  function launch(): void {
    go('flight'); ball.t = 0; shake = calm ? 0 : 3; tone(120, .12); tone(90, .08);
    if (wallAt) wallJump = .001;
    /* the keeper picks a side before the ball arrives, and reads the shot better as the match goes on */
    const read = Math.random() < .3 + shotNo * .03, stay = Math.random() < .14;
    const side = read ? Math.sign(ball.tx - goal.x) || 1 : Math.random() < .5 ? -1 : 1;
    keeper.to = stay ? goal.x : goal.x + side * goal.w * .3;
  }
  function burst(n: number, x: number, y: number, cols: string[], force: number): void { for (let i = 0; i < (calm ? n / 3 : n); i++) { const a = Math.random() * 7, s = Math.random() * force; bits.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - force * .4, life: 900 + Math.random() * 700, col: pick(cols), size: 2 + Math.random() * 3 }); } }
  function settle(what: string): void {
    outcome = what; gained = 0; go('result');
    const { x, w, h, base } = goal, top = base - h, ax = Math.abs(ball.x - x) / (w / 2), high = (base - ball.y) / h;
    if (what === 'goal') {
      const corner = ax > .62 && high > .52, sweet = Math.abs(power - .68) <= .12, round = !!wallAt;
      gained = 10 + (corner ? 10 : 0) + (sweet ? 5 : 0) + (round ? 5 : 0); score += gained; goals++;
      headline = corner ? 'TOP CORNER!' : 'GOAL!'; sub = '+' + gained + (corner ? '  Top corner bonus' : sweet ? '  Sweet strike' : '') + (round && !corner ? '  Beat the wall' : '');
      bulge = 1; flash = calm ? 0 : 1; shake = calm ? 0 : 7; cheer = 2400; burst(90, ball.x, ball.y, ['#ff1f8f', '#fff6fb', '#35dcc8', '#f4d35e'], 7);
      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, .14), i * 90));
    } else {
      const words: Record<string, [string, string]> = { saved: ['SAVED!', 'The keeper read it'], post: ['OFF THE WOODWORK!', 'So close'], wall: ['HIT THE WALL!', 'Bend it or lift it'], over: ['OVER THE BAR!', 'Too much power'], wide: ['WIDE!', 'Keep it inside the posts'], short: ['NOT ENOUGH!', 'Hold on a little longer'] };
      [headline, sub] = words[what]; tone(150, .3); shake = calm ? 0 : what === 'post' ? 5 : 2;
      ball.vx = (ball.x - x) * .012 + (Math.random() - .5) * 2; ball.vy = what === 'post' || what === 'saved' ? -2.5 : -1;
    }
    void top; stat();
  }
  function judge(): void {
    const { x, base, w, h } = goal, l = x - w / 2, r = x + w / 2, top = base - h, bx = ball.x, by = ball.y;
    if (power < .34) { settle('short'); return; }
    if (Math.abs(bx - l) < 4 || Math.abs(bx - r) < 4 || (Math.abs(by - top) < 4 && bx > l && bx < r)) { settle('post'); return; }
    if (by < top) { settle('over'); return; }
    if (bx < l || bx > r) { settle('wide'); return; }
    /* The keeper only stops what is inside their reach: top corners stay out of it. */
    const reachX = w * .2, tall = h * .78;
    if (Math.abs(bx - keeper.x) < reachX && base - by < tall) { settle('saved'); return; }
    settle('goal');
  }

  /* ---------- updating ---------- */
  function step(dt: number): void {
    clock += dt; modeT += dt;
    bits = bits.filter(b => { b.life -= dt; b.x += b.vx * dt * .06; b.y += b.vy * dt * .06; b.vy += dt * .012; return b.life > 0; });
    shake = Math.max(0, shake - dt * .02); flash = Math.max(0, flash - dt * .004); bulge = Math.max(0, bulge - dt * .0014); cheer = Math.max(0, cheer - dt);
    if (mode === 'intro' && modeT > 2200) go('card');
    if (mode === 'card' && modeT > (shotNo === 0 || shotNo === PENS ? 1500 : 500)) go('aim');
    if (mode === 'aim') {
      if (keys.ArrowLeft) aimX -= dt * .22; if (keys.ArrowRight) aimX += dt * .22; if (keys.ArrowUp) aimY -= dt * .16; if (keys.ArrowDown) aimY += dt * .16;
      aimX = Math.max(goal.x - goal.w * .62, Math.min(goal.x + goal.w * .62, aimX)); aimY = Math.max(goal.base - goal.h * 1.25, Math.min(goal.base - 4, aimY));
      if (charging) {
        power += powerDir * dt * .00125;
        if (power >= 1) { power = 1; powerDir = -1; } if (power <= 0) { power = 0; powerDir = 1; }
        if (wallAt) { if (keys.ArrowLeft) curl -= dt * .002; if (keys.ArrowRight) curl += dt * .002; curl = Math.max(-1, Math.min(1, curl)); }
      }
    }
    if (mode === 'runup') { runX += dt * .085; if (modeT > 560) launch(); }
    if (mode === 'flight' || mode === 'result') {
      keeper.x += (keeper.to - keeper.x) * Math.min(1, dt * .009);
      const sideways = keeper.to - goal.x;
      if (mode === 'flight' && modeT > 120 && Math.abs(sideways) > 1) { keeper.dive = 1; keeper.rot += ((sideways > 0 ? 1.15 : -1.15) - keeper.rot) * Math.min(1, dt * .012); keeper.lift += ((ball.y < goal.base - goal.h * .5 ? goal.h * .32 : goal.h * .08) - keeper.lift) * Math.min(1, dt * .012); }
      if (wallJump > 0) wallJump += dt * .0024;
    }
    if (mode === 'flight') {
      /* time slows as the ball reaches the goal */
      slow = ball.t > .68 && !calm ? .38 : 1;
      ball.t = Math.min(1, ball.t + dt * slow / ball.dur);
      const e = 1 - Math.pow(1 - ball.t, 1.5), bow = Math.sin(e * Math.PI);
      ball.x = ball.sx + (ball.tx - ball.sx) * e + ball.bend * bow; ball.y = ball.sy + (ball.ty - ball.sy) * e - ball.arc * bow;
      ball.r = 11 - 7.2 * e; ball.spin += dt * (.012 + Math.abs(curl) * .02);
      cam += ((calm ? 1 : 1 + ball.t * .42) - cam) * Math.min(1, dt * .006);
      if (wallAt && e > .46 && e < .54) { const up = wallJump > 0 ? Math.sin(Math.min(1, wallJump) * Math.PI) * 18 : 0; if (Math.abs(ball.x - wallAt.x) < wallAt.w / 2 && ball.y > wallAt.y - 66 - up) { ball.vx = (ball.x - wallAt.x) * .03; ball.vy = -2; ball.tx = ball.x; ball.ty = ball.y; settle('wall'); return; } }
      if (ball.t >= 1) judge();
    }
    if (mode === 'result') {
      cam += ((calm ? 1 : outcome === 'goal' ? 1.5 : 1.2) - cam) * Math.min(1, dt * .004);
      if (outcome !== 'goal') { ball.x += ball.vx * dt * .05; ball.y += ball.vy * dt * .05; ball.vy += dt * .008; ball.spin += dt * .01; }
      if (modeT > (outcome === 'goal' ? 2300 : 1600)) { shotNo++; if (shotNo >= SHOTS) finish(); else { setUp(); go('card'); } stat(); }
    }
  }

  /* ---------- painting ---------- */
  function paint(): void {
    if (!scene) buildScene();
    c.save();
    if (shake > 0) c.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
    const focusX = mode === 'flight' || mode === 'result' ? ball.x + (goal.x - ball.x) * .4 : 320, focusY = mode === 'flight' || mode === 'result' ? goal.base - goal.h * .5 : 180;
    c.translate(focusX, focusY); c.scale(cam, cam); c.translate(-focusX, -focusY);
    if (mode === 'intro') { const k = Math.min(1, modeT / 2200), z = 1.5 - .5 * (1 - Math.pow(1 - k, 3)); c.translate(320, 120); c.scale(z, z); c.translate(-320, -120); }
    c.drawImage(scene as HTMLCanvasElement, 0, 0, W, H);
    floodlights();
    if (cheer > 0) for (let i = 0; i < 16; i++) { const a = heads[i % Math.max(1, heads.length)]; if (a) c.drawImage(a, i * 42, goal.base - 56 - Math.abs(Math.sin(clock / 110 + i)) * 12, 28, 28); }
    if (wallAt && ball.t >= .55) { /* the ball has passed the wall, so the wall is drawn before it */ }
    goalFrame(); drawKeeper();
    if (mode === 'flight' && ball.t >= .55) wallPeople(false);
    if (ball.t >= .55 || mode === 'result') drawBallShadow();
    const showBall = !(mode === 'done' || mode === 'idle' || mode === 'intro');
    if (showBall && (ball.t >= .55 || mode === 'result')) drawBall(ball.x, ball.y, ball.r, ball.spin);
    if (mode !== 'flight' || ball.t < .55) wallPeople(true);
    if (mode === 'result') wallPeople(false);
    if (showBall && ball.t < .55 && mode !== 'result') { drawBallShadow(); drawBall(ball.x, ball.y, ball.r, ball.spin); }
    if (mode !== 'idle' && mode !== 'done' && mode !== 'intro') {
      const swing = mode === 'runup' ? Math.max(0, (modeT - 400) / 160) : mode === 'flight' ? Math.max(0, 1 - modeT / 600) : 0;
      kicker(runX, 346, Math.min(1, swing), mode === 'runup' ? modeT * .022 : 0);
    }
    bits.forEach(b => { c.fillStyle = b.col; c.fillRect(b.x, b.y, b.size, b.size * .7); });
    c.restore();
    if (flash > 0) { c.fillStyle = 'rgba(255,255,255,' + flash * .35 + ')'; c.fillRect(0, 0, W, H); }
    overlay();
  }
  function drawBallShadow(): void { const g = ball.sy + (goal.base + 3 - ball.sy) * (1 - Math.pow(1 - ball.t, 1.5)); c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(ball.x, Math.max(g, ball.y), ball.r * 1.1, ball.r * .35, 0, 0, 7); c.fill(); }
  function overlay(): void {
    if (mode === 'idle' || mode === 'done') { title(); return; }
    /* the scoreboard */
    c.fillStyle = 'rgba(16,6,24,.88)'; c.fillRect(8, 8, 150, 42); c.strokeStyle = '#ff1f8f'; c.lineWidth = 2; c.strokeRect(8, 8, 150, 42);
    gameWrite(c, String(score), 34, 39, 24, '#f4d35e');
    c.font = '800 11px Nunito, sans-serif'; c.textAlign = 'left'; c.fillStyle = '#fff6fb'; c.fillText(isPen() ? 'PENALTIES' : 'FREE KICKS', 62, 24);
    for (let i = 0; i < SHOTS; i++) { c.fillStyle = i < shotNo ? '#35dcc8' : i === shotNo ? '#ff1f8f' : '#4a3a58'; c.beginPath(); c.arc(66 + i * 9, 37, 3.5, 0, 7); c.fill(); }
    if (mode === 'intro') { const a = Math.min(1, modeT / 500); c.globalAlpha = a; gameWrite(c, 'GRAVEYARD CUP', W / 2, 170, 54, '#ff1f8f'); gameLine(c, 'Under the floodlights. The whole school is watching.', W / 2, 198, '#fff6fb', 15); c.globalAlpha = 1; return; }
    if (mode === 'card' && (shotNo === 0 || shotNo === PENS)) { const a = Math.min(1, modeT / 250); c.fillStyle = 'rgba(16,6,24,' + a * .7 + ')'; c.fillRect(0, 130, W, 80); gameWrite(c, shotNo ? 'FREE KICKS' : 'PENALTIES', W / 2, 180, 44, '#f4d35e'); gameLine(c, shotNo ? 'Lift it over the wall, or bend it round.' : 'Just you, the ball and the keeper.', W / 2, 202, '#fff6fb', 14); return; }
    if (mode === 'aim') aimer();
    if (mode === 'result') { const s = Math.min(1, modeT / 180), big = outcome === 'goal' ? 62 : 38; gameWrite(c, headline, W / 2, 112, big * (.6 + s * .4), outcome === 'goal' ? '#ff1f8f' : '#fff6fb'); gameLine(c, sub, W / 2, 136, '#f4d35e', 15); }
  }
  function aimer(): void {
    const wob = Math.sin(clock / 170) * 1.6;
    /* the curve the ball will take */
    if (wallAt && charging) {
      c.fillStyle = 'rgba(255,255,255,.8)';
      for (let i = 1; i < 10; i++) { const e = i / 10, bow = Math.sin(e * Math.PI); c.beginPath(); c.arc(ball.sx + (aimX - ball.sx) * e + curl * 62 * bow, ball.sy + (aimY - ball.sy) * e - (34 + power * 62) * bow, 2, 0, 7); c.fill(); }
    }
    c.strokeStyle = '#ff1f8f'; c.lineWidth = 2.5; c.beginPath(); c.arc(aimX + wob, aimY, 9, 0, 7); c.moveTo(aimX + wob - 14, aimY); c.lineTo(aimX + wob + 14, aimY); c.moveTo(aimX + wob, aimY - 14); c.lineTo(aimX + wob, aimY + 14); c.stroke();
    const mx = W - 34, my = 150, mh = 150;
    c.fillStyle = 'rgba(16,6,24,.9)'; c.fillRect(mx - 10, my - 4, 26, mh + 8); c.strokeStyle = '#fff6fb'; c.lineWidth = 2; c.strokeRect(mx - 10, my - 4, 26, mh + 8);
    c.fillStyle = '#ff1f8f'; c.fillRect(mx - 6, my, 18, mh); c.fillStyle = '#6a1f86'; c.fillRect(mx - 6, my + mh * .6, 18, mh * .4);
    c.fillStyle = '#35dcc8'; c.fillRect(mx - 6, my + mh * (1 - .8), 18, mh * .24);
    c.fillStyle = '#fff6fb'; c.fillRect(mx - 9, my + mh * (1 - power) - 2, 24, 4);
    if (!charging) gameLine(c, wallAt ? 'Aim, then hold for power. Slide sideways while holding to bend it.' : 'Aim, then press and hold for power. Let go in the green.', W / 2, 348, '#fff6fb', 13);
    else if (wallAt) gameLine(c, curl ? (curl < 0 ? 'Bending left' : 'Bending right') : 'Slide to bend it', W / 2, 348, '#f4d35e', 13);
  }
  function title(): void {
    if (mode === 'done') {
      c.fillStyle = 'rgba(16,6,24,.74)'; c.fillRect(0, 0, W, H);
      if (art.win) { const s = .36; c.drawImage(art.win, 450 - BOX.w * s / 2 - 10, 62 - Math.abs(Math.sin(clock / 240)) * 8, BOX.w * s, BOX.h * s); }
      gameWrite(c, 'FULL TIME', 230, 88, 48, '#ff1f8f');
      gameWrite(c, String(score), 230, 158, 58, '#f4d35e');
      gameLine(c, goals + ' goals from ' + SHOTS + ' shots', 230, 188, '#fff6fb', 16);
      gameLine(c, goals >= 9 ? 'Golden Boot. The school will talk about this forever.' : goals >= 6 ? 'A proper match winner.' : goals >= 3 ? 'The keeper had a good night. Go again.' : 'The training ground is calling you.', 230, 214, '#35dcc8', 14);
      gameLine(c, 'Best: ' + finalBest, 230, 240, '#f4d35e', 15);
      return;
    }
    c.fillStyle = 'rgba(16,6,24,.45)'; c.fillRect(0, 0, W, H);
    gameWrite(c, 'GRAVEYARD CUP', W / 2, 120, 56, '#ff1f8f');
    gameLine(c, 'Pick your kit below, then press Kick off', W / 2, 150, '#fff6fb', 15);
  }
  function pauseCover(): void { c.fillStyle = 'rgba(10,2,16,.6)'; c.fillRect(0, 0, W, H); gameWrite(c, 'PAUSED', W / 2, H / 2, 50); gameLine(c, 'Tap the play icon, or press P, when you are ready', W / 2, H / 2 + 30, '#ffd3e8', 15); }

  /* ---------- the loop and controls ---------- */
  function frame(now: number): void {
    looping = false;
    if (!cv.getClientRects().length) { if (running()) quit(); return; }
    if (paused) return;
    const dt = Math.min(40, now - last); last = now;
    step(dt); paint();
    if (running() || (visible && !calm && document.visibilityState === 'visible')) { looping = true; requestAnimationFrame(frame); }
  }
  function kick(): void { if (looping || paused || !cv.getClientRects().length) return; looping = true; last = performance.now(); requestAnimationFrame(frame); }
  function togglePause(): void { if (!running()) return; paused = !paused; charging = false; musicHold(paused); if (paused) { paint(); pauseCover(); } else kick(); stat(); }
  function finish(): void { go('done'); paused = false; finalBest = p.bestOf(score); award(Math.ceil(score / 10)); if (score > 0) submitScore('kick', score); gameOverSound(); locker.hidden = false; p.go.textContent = 'Play again'; stat(); }
  function quit(): void { go('idle'); paused = false; charging = false; bits = []; keys = {}; locker.hidden = false; p.go.textContent = 'Kick off'; musicHold(false); stat(); }
  p.go.addEventListener('click', () => {
    gameOverStop(); countRound('kick');
    dress(); paused = false; score = 0; goals = 0; shotNo = 0; bits = []; setUp();
    locker.hidden = true; p.go.textContent = 'Restart'; p.go.blur(); musicHold(false); tone(880, .4); go('intro'); stat(); kick();
  });
  const aimAt = (e: PointerEvent): void => {
    const r = cv.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width * W, my = (e.clientY - r.top) / r.height * H;
    pointerX = mx;
    if (mode !== 'aim' || paused) return;
    if (charging) { if (wallAt) curl = Math.max(-1, Math.min(1, (mx - pressX) / 70)); return; }
    aimX = Math.max(goal.x - goal.w * .62, Math.min(goal.x + goal.w * .62, mx)); aimY = Math.max(goal.base - goal.h * 1.25, Math.min(goal.base - 4, my));
  };
  cv.addEventListener('pointermove', aimAt);
  cv.addEventListener('pointerdown', e => { aimAt(e); if (mode === 'aim' && !paused) { charging = true; power = 0; powerDir = 1; curl = 0; pressX = pointerX; e.preventDefault(); } });
  addEventListener('pointerup', () => { if (charging && mode === 'aim') strike(); });
  addEventListener('keydown', e => {
    if (isPauseKey(e) && running()) { togglePause(); e.preventDefault(); return; }
    if (!running() || typing(e)) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { keys[e.key] = true; e.preventDefault(); }
    if (e.key === ' ') { e.preventDefault(); if (mode === 'aim' && !charging && !paused) { charging = true; power = 0; powerDir = 1; curl = 0; } }
  });
  addEventListener('keyup', e => { keys[e.key] = false; if (e.key === ' ' && charging && mode === 'aim') strike(); });
  stops.push(() => { if (running()) quit(); });
  new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) { dress(); kick(); } }).observe(cv);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') kick(); });
  drawLocker(); setUp(); stat();
})();
