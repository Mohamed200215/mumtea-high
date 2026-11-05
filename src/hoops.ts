/* ---------- Slam Dunk Séance: three-pointers, dunks and one shot from half court in a packed arena ---------- */
GAME_ART.hoops = iconOf('<rect x="62" y="8" width="50" height="38" fill="#fff6fb" stroke="#14081a" stroke-width="4"/><rect x="78" y="18" width="20" height="16" fill="none" stroke="#ff1f8f" stroke-width="3"/><path d="M58 42L60 62L68 50L76 62L84 50L90 62L92 42" fill="none" stroke="#fff6fb" stroke-width="3"/><path d="M58 42L60 62L68 50L76 62L84 50L90 62L92 42" fill="none" stroke="#14081a" stroke-width="1"/><ellipse cx="75" cy="42" rx="19" ry="5" fill="none" stroke="#ff1f8f" stroke-width="5"/><circle cx="42" cy="82" r="30" fill="#f2761b" stroke="#14081a" stroke-width="4"/><path d="M12 82H72M42 52V112M21 61C32 72 32 92 21 103M63 61C52 72 52 92 63 103" fill="none" stroke="#14081a" stroke-width="3"/><path d="M28 78C28 72 34 70 37 74M47 74C50 70 56 72 56 78M40 86L42 90L44 86" fill="none" stroke="#14081a" stroke-width="3"/>');
const HOOP_KITS: Array<[string, string, string]> = [['Hot pink', '#ff1f8f', '#fff6fb'], ['Midnight', '#14101a', '#ff1f8f'], ['Purple', '#6a1f86', '#f4d35e'], ['Electric blue', '#19b7e8', '#14101a'], ['Slime', '#6fc22e', '#14101a'], ['Blood red', '#c0392b', '#f4d35e']];
const HOOP_SHOES: Array<[string, string]> = [['White', '#fff6fb'], ['Pink', '#ff1f8f'], ['Gold', '#f4d35e'], ['Black', '#14101a'], ['Teal', '#35dcc8']];
const HOOP_BALLS: Array<[string, string, string]> = [['classic', 'Classic', '#f2761b'], ['pink', 'Hot pink', '#ff4fa8'], ['skull', 'Skull ball', '#e9e4d6'], ['galaxy', 'Galaxy', '#4a2a8a']];
(function () {
  const W = 640, H = 360, ZOOM = 2, FLOOR = 306, RIM = { x: 548, y: 148, r: 21 }, BOARD = 580, G = .00062, INK_LINE = '#14081a';
  const THREES = [{ x: 150, money: false }, { x: 190, money: false }, { x: 118, money: false }, { x: 214, money: false }, { x: 160, money: true }], DUNKS = 3, HALF = 74, TALL = 118;
  const [cv, c] = makeCanvas('Slam Dunk Seance game area');
  cv.width = W * ZOOM; cv.height = H * ZOOM; c.scale(ZOOM, ZOOM);
  const saved = store.get<{ kit?: string; shoes?: string; ball?: string }>('hoopKit', {});
  const outfit = { kit: HOOP_KITS.some(k => k[0] === saved.kit) ? saved.kit as string : 'Hot pink', shoes: HOOP_SHOES.some(k => k[0] === saved.shoes) ? saved.shoes as string : 'White', ball: HOOP_BALLS.some(k => k[0] === saved.ball) ? saved.ball as string : 'classic' };
  const lockerRows = el('div', { cls: 'merrows' }), locker = el('div', { cls: 'merlocker wframe' }, el('h4', { text: 'Team locker' }), lockerRows);
  function drawLocker(): void {
    lockerRows.textContent = '';
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Jersey' }), ...HOOP_KITS.map(([name, col]) => { const b = el('button', { cls: 'wswatch', type: 'button', 'aria-label': name, title: name, 'data-hoop': 'kit:' + name, 'aria-pressed': outfit.kit === name, onclick() { wear('kit', name); } }); b.style.background = col; return b; })));
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Sneakers' }), ...HOOP_SHOES.map(([name, col]) => { const b = el('button', { cls: 'wswatch', type: 'button', 'aria-label': name + ' sneakers', title: name, 'aria-pressed': outfit.shoes === name, onclick() { wear('shoes', name); } }); b.style.background = col; return b; })));
    lockerRows.append(el('div', { cls: 'wrow' }, el('span', { text: 'Game ball' }), ...HOOP_BALLS.map(([id, name]) => el('button', { cls: 'wchip', type: 'button', 'aria-pressed': outfit.ball === id, onclick() { wear('ball', id); } }, name))));
  }
  function wear(key: 'kit' | 'shoes' | 'ball', value: string): void { outfit[key] = value; store.set('hoopKit', outfit); drawLocker(); if (mode === 'done') mode = 'idle'; dress(); kick(); }
  const p = makePanel('hoops', 'Slam Dunk Seance', 'Round 1: five threes. Round 2: three dunks. Round 3: one shot from half court. To shoot, press and hold to jump, and let go when the bar hits the green. To dunk, press in the pink take-off zone, hold in the air to spin, and let go before you reach the rim.', [cv], 'Tip off');
  p.root.append(locker);

  type Mode = 'idle' | 'intro' | 'card' | 'set' | 'jump' | 'fly' | 'run' | 'air' | 'slam' | 'after' | 'done';
  interface Bit { x: number; y: number; vx: number; vy: number; life: number; col: string; size: number; turn?: number }
  let mode: Mode = 'idle', paused = false, looping = false, visible = false, last = 0, clock = 0, modeT = 0, round = 1, shot = 0, score = 0, finalBest = 0, holding = false;
  let spinTo = 0, meter = 0, meterDir = 1, px = 150, py = FLOOR, jumpV = 0, spin = 0, spins = 0, dropped = false, takeoffGood = 0;
  let ball = { x: 0, y: 0, vx: 0, vy: 0, turn: 0, held: true, scored: false, touched: false, passed: false }, net = 0, bent = 0, glass = 1;
  let bits: Bit[] = [], shake = 0, flash = 0, cam = 1, camX = 320, camY = 180, slow = 1, cheer = 0, headline = '', sub = '', headCol = '#fff6fb', clockLeft = 0;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const tools = gameTools(p.root, togglePause);
  const running = () => mode !== 'idle' && mode !== 'done';
  const stat = () => { p.stat.textContent = (running() ? 'Score: ' + score + '  Round: ' + round + ' of 3  ' : '') + 'Best: ' + store.get<number>('hoopsBest', 0); tools.show(running(), paused); };
  const go = (m: Mode): void => { mode = m; modeT = 0; cv.dataset.mode = m; };

  /* ---------- the player and the crowd ---------- */
  const art: Record<string, HTMLCanvasElement> = {}, BOX = { x: -130, y: -60, w: 580, h: 790 }, heads: HTMLCanvasElement[] = [];
  let bakedKey = '', asked = false, arena: HTMLCanvasElement | null = null;
  const POSES_HOOP: Record<string, Pose> = {
    ready: { id: 'ready', name: '', armL: [50, 80], armR: [50, 80], handL: 'open', handR: 'open', legL: [8, -12], legR: [8, -12] },
    run: { id: 'run', name: '', armL: [55, 90], armR: [20, 70], handL: 'fist', handR: 'open', legL: [28, -38], legR: [-14, -24], lean: 5 },
    shoot: { id: 'shoot', name: '', armL: [140, 168], armR: [150, 172], handL: 'open', handR: 'open', legL: [4, -8], legR: [4, -8] },
    dunk: { id: 'dunk', name: '', armL: [168, 176], armR: [168, 176], handL: 'open', handR: 'open', legL: [26, -50], legR: [8, -30] },
    win: { id: 'win', name: '', armL: [118, 158], armR: [118, 158], handL: 'open', handR: 'open', tilt: 2 },
    sad: { id: 'sad', name: '', armL: [20, 30], armR: [20, 30], handL: 'relaxed', handR: 'relaxed', tilt: 10 },
  };
  const kit = () => HOOP_KITS.find(k => k[0] === outfit.kit) || HOOP_KITS[0];
  function dress(): void {
    const look = (!isAdmin() && currentStudent()?.look) || DOLLS.mumtea.look, [, top, trim] = kit(), shoes = (HOOP_SHOES.find(k => k[0] === outfit.shoes) || HOOP_SHOES[0])[1], key = JSON.stringify([look, outfit]);
    if (key === bakedKey && art.ready) return;
    bakedKey = key;
    const worn: Look = { ...look, top: 'jersey', topC: top, topP: 'solid', trim, bottom: 'shorts', bottomC: top, bottomP: 'solid', legs: 'knee', legsC: trim, shoes: 'sneaker', shoesC: shoes, hold: 'none', back: 'none', neck: 'none', pet: 'none', pose: 'relaxed' };
    Object.keys(POSES_HOOP).forEach(name => spriteFromSvg(drawGhoul(worn, { pose: POSES_HOOP[name], box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), 290, 395, a => { art[name] = a; kick(); }));
    if (asked) return;
    asked = true;
    schoolCrowd(12).forEach(person => spriteFromSvg(drawGhoul(person, { head: true }), 60, 60, a => { heads.push(a); arena = null; kick(); }));
  }
  function player(pose: string, x: number, feet: number, turn = 0): void {
    const a = art[pose] || art.ready;
    c.fillStyle = 'rgba(0,0,0,.32)'; const air = Math.max(0, FLOOR - feet); c.beginPath(); c.ellipse(x, FLOOR + 4, Math.max(10, 30 - air * .08), 6, 0, 0, 7); c.fill();
    if (!a) return;
    const s = TALL / 720;
    c.save(); c.translate(x, feet - TALL * .5); c.rotate(turn); c.drawImage(a, (BOX.x - 160) * s, (BOX.y - 360) * s, BOX.w * s, BOX.h * s); c.restore();
  }

  /* ---------- the arena, painted once ---------- */
  function buildArena(): void {
    const s = document.createElement('canvas'); s.width = W * ZOOM; s.height = H * ZOOM;
    const t = s.getContext('2d') as CanvasRenderingContext2D; t.scale(ZOOM, ZOOM);
    t.fillStyle = '#0a0416'; t.fillRect(0, 0, W, H);
    /* the rafters and the banners */
    t.fillStyle = '#16092a'; t.fillRect(0, 0, W, 34);
    t.strokeStyle = '#2c1140'; t.lineWidth = 2; t.beginPath(); for (let x = 0; x < W; x += 40) { t.moveTo(x, 0); t.lineTo(x + 20, 34); t.lineTo(x + 40, 0); } t.stroke();
    ['#ff1f8f', '#19b7e8', '#6a1f86', '#35dcc8'].forEach((col, i) => { const x = 40 + i * 42; t.fillStyle = col; t.beginPath(); t.moveTo(x, 0); t.lineTo(x + 28, 0); t.lineTo(x + 28, 40); t.lineTo(x + 14, 50); t.lineTo(x, 40); t.closePath(); t.fill(); t.strokeStyle = INK_LINE; t.lineWidth = 2; t.stroke(); });
    /* the stands */
    for (let row = 0; row < 11; row++) {
      const y = 36 + row * 19;
      t.fillStyle = row % 2 ? '#1d0d2e' : '#26123c'; t.fillRect(0, y, W, 19);
      for (let i = -1; i < 34; i++) {
        const hx = i * 20 + (row % 2 ? 10 : 0), a = heads[(i * 7 + row * 5 + 70) % Math.max(1, heads.length)];
        if (a) { t.globalAlpha = .42 + row * .05; t.drawImage(a, hx - 2, y - 3, 23, 23); t.globalAlpha = 1; } else { t.fillStyle = '#3a2350'; t.beginPath(); t.arc(hx + 10, y + 10, 7, 0, 7); t.fill(); }
      }
    }
    t.fillStyle = 'rgba(10,4,22,.6)'; t.fillRect(0, 34, W, 216);
    /* the courtside boards */
    t.fillStyle = '#14081a'; t.fillRect(0, 248, W, 26);
    for (let i = 0; i < 6; i++) { t.fillStyle = i % 2 ? '#ff1f8f' : '#2c1140'; t.fillRect(i * 112, 250, 110, 22); t.fillStyle = i % 2 ? '#14081a' : '#ff8cc8'; t.font = '14px ' + DISPLAY_FONT; t.textAlign = 'center'; t.fillText(i % 2 ? 'FANG CLASSIC' : 'MUMTEA HIGH', i * 112 + 55, 267); }
    /* the hardwood, plank by plank */
    t.fillStyle = '#b5752f'; t.fillRect(0, 274, W, H - 274);
    for (let row = 0; row < 7; row++) { const y = 274 + row * 13; t.fillStyle = row % 2 ? '#a8692a' : '#c07f37'; t.fillRect(0, y, W, 13); t.fillStyle = 'rgba(40,16,4,.35)'; t.fillRect(0, y, W, 1); for (let x = (row * 37) % 90; x < W; x += 90) t.fillRect(x, y, 1, 13); }
    /* the painted key and lines of a real court, seen from the side */
    t.fillStyle = '#ff1f8f'; t.beginPath(); t.moveTo(420, 276); t.lineTo(586, 276); t.lineTo(640, 358); t.lineTo(392, 358); t.closePath(); t.fill();
    t.strokeStyle = '#fff6fb'; t.lineWidth = 3; t.stroke();
    t.beginPath(); t.ellipse(408, 317, 26, 40, 0, Math.PI / 2, Math.PI * 1.5); t.stroke();
    t.beginPath(); t.moveTo(250, 276); t.quadraticCurveTo(216, 318, 250, 358); t.stroke();
    t.beginPath(); t.moveTo(HALF + 4, 274); t.lineTo(HALF - 14, 360); t.stroke();
    t.beginPath(); t.ellipse(HALF - 4, 317, 58, 30, 0, 0, 7); t.stroke();
    t.fillStyle = '#fff6fb'; t.beginPath(); t.ellipse(HALF - 4, 314, 22, 15, 0, 0, 7); t.fill(); t.fillStyle = INK_LINE; t.beginPath(); t.ellipse(HALF - 12, 312, 5, 6, 0, 0, 7); t.ellipse(HALF + 4, 312, 5, 6, 0, 0, 7); t.fill();
    t.strokeStyle = '#fff6fb'; t.beginPath(); t.moveTo(0, 276); t.lineTo(W, 276); t.stroke();
    /* the shine of the lights on the floor */
    t.fillStyle = 'rgba(255,240,200,.1)'; for (const x of [130, 330, 530]) { t.beginPath(); t.ellipse(x, 320, 74, 22, 0, 0, 7); t.fill(); }
    /* the hoop's stand */
    t.fillStyle = '#2c2436'; t.fillRect(600, 110, 14, 200); t.beginPath(); t.moveTo(588, 306); t.lineTo(628, 306); t.lineTo(632, 318); t.lineTo(584, 318); t.closePath(); t.fill();
    t.strokeStyle = '#2c2436'; t.lineWidth = 8; t.beginPath(); t.moveTo(604, 118); t.lineTo(BOARD + 4, 112); t.stroke();
    const v = t.createRadialGradient(W / 2, H / 2, H * .46, W / 2, H / 2, W * .68); v.addColorStop(0, 'rgba(6,0,14,0)'); v.addColorStop(1, 'rgba(6,0,14,.65)'); t.fillStyle = v; t.fillRect(0, 0, W, H);
    arena = s;
  }
  function beams(): void {
    c.save(); c.globalCompositeOperation = 'lighter';
    [[150, .8], [340, -1], [520, .9]].forEach(([sx, dir], i) => {
      const reach = sx + dir * 70 * Math.sin(clock / (1600 + i * 300) + i), g = c.createLinearGradient(0, 0, 0, 320);
      g.addColorStop(0, i === 1 ? 'rgba(255,90,180,.2)' : 'rgba(255,240,210,.18)'); g.addColorStop(1, 'rgba(255,240,210,.01)');
      c.fillStyle = g; c.beginPath(); c.moveTo(sx - 6, 0); c.lineTo(sx + 6, 0); c.lineTo(reach + 62, 320); c.lineTo(reach - 62, 320); c.closePath(); c.fill();
    });
    c.restore();
  }
  function hoopBack(): void {
    /* the glass backboard, unless a perfect dunk just shattered it */
    if (glass > 0) {
      c.fillStyle = 'rgba(210,240,255,.28)'; c.fillRect(BOARD - 3, 96, 7, 76); c.strokeStyle = '#fff6fb'; c.lineWidth = 2.5; c.strokeRect(BOARD - 3, 96, 7, 76);
    } else { c.strokeStyle = '#6a5a78'; c.lineWidth = 2; c.strokeRect(BOARD - 3, 96, 7, 76); }
    c.strokeStyle = '#d3346f'; c.lineWidth = 4; c.beginPath(); c.ellipse(RIM.x, RIM.y - bent, RIM.r, 5, 0, Math.PI, Math.PI * 2); c.stroke();
  }
  function hoopFront(): void {
    const y = RIM.y - bent, sway = Math.sin(clock / 60) * net * 5, drop = 30 + net * 10;
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 1.3; c.beginPath();
    for (let i = 0; i <= 6; i++) { const k = i / 6, top = RIM.x - RIM.r + k * RIM.r * 2, bot = RIM.x - RIM.r * .58 + k * RIM.r * 1.16 + sway; c.moveTo(top, y + 2); c.lineTo(bot, y + drop); if (i < 6) { c.moveTo(top, y + 2); c.lineTo(RIM.x - RIM.r * .8 + (k + 1 / 6) * RIM.r * 1.6 + sway * .5, y + drop * .55); } }
    c.stroke();
    c.strokeStyle = INK_LINE; c.lineWidth = 6; c.beginPath(); c.ellipse(RIM.x, y, RIM.r, 5, 0, 0, Math.PI); c.stroke();
    c.strokeStyle = '#ff1f8f'; c.lineWidth = 3.5; c.stroke();
    c.strokeStyle = '#ff1f8f'; c.lineWidth = 4; c.beginPath(); c.moveTo(RIM.x + RIM.r, y); c.lineTo(BOARD - 3, y - 2); c.stroke();
  }
  function drawBall(x: number, y: number, turn: number, r = 10.5): void {
    const [id, , col] = HOOP_BALLS.find(b => b[0] === outfit.ball) || HOOP_BALLS[0];
    c.save(); c.translate(x, y); c.rotate(turn);
    c.fillStyle = col; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.strokeStyle = INK_LINE; c.lineWidth = 1.8; c.stroke();
    c.lineWidth = 1.2; c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.moveTo(0, -r); c.lineTo(0, r); c.moveTo(-r * .66, -r * .7); c.quadraticCurveTo(-r * .2, 0, -r * .66, r * .7); c.moveTo(r * .66, -r * .7); c.quadraticCurveTo(r * .2, 0, r * .66, r * .7); c.stroke();
    if (id === 'skull') { c.fillStyle = INK_LINE; c.beginPath(); c.ellipse(-r * .34, -r * .15, r * .2, r * .24, 0, 0, 7); c.ellipse(r * .34, -r * .15, r * .2, r * .24, 0, 0, 7); c.fill(); }
    if (id === 'galaxy') { c.fillStyle = '#fff6fb'; for (const [a, b] of [[-.4, -.4], [.3, -.2], [-.1, .4], [.5, .4]]) c.fillRect(a * r, b * r, 1.6, 1.6); }
    c.restore();
  }

  /* ---------- rounds ---------- */
  function burst(n: number, x: number, y: number, cols: string[], force: number): void { for (let i = 0; i < (calm ? n / 3 : n); i++) { const a = Math.random() * 7, s = Math.random() * force; bits.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - force * .35, life: 900 + Math.random() * 800, col: pick(cols), size: 2 + Math.random() * 3, turn: Math.random() * 7 }); } }
  const cardFor = (): [string, string] => (round === 1 ? ['THREE-POINT CONTEST', 'Five shots. The last rack is the pink moneyball, worth 5.'] : round === 2 ? ['DUNK CONTEST', 'Press in the pink zone, hold to spin, let go before the rim.'] : ['THE BUZZER BEATER', 'One shot from half court, worth 15. The whole arena stands up.']);
  function nextUp(fresh: boolean): void {
    if (round === 1 && shot >= THREES.length) { round = 2; shot = 0; fresh = true; }
    if (round === 2 && shot >= DUNKS) { round = 3; shot = 0; fresh = true; }
    if (round === 3 && shot >= 1) { finish(); return; }
    cam = 1; slow = 1; net = 0; bent = 0; glass = 1; dropped = false; spin = 0; spins = 0; holding = false; meter = 0; meterDir = 1; takeoffGood = 0; headline = '';
    ball.held = true; ball.scored = false; ball.touched = false; ball.passed = false;
    px = round === 1 ? THREES[shot].x : round === 2 ? 40 : HALF; py = FLOOR;
    clockLeft = round === 3 ? 6000 : 0;
    go(fresh ? 'card' : round === 2 ? 'run' : 'set'); stat();
  }
  function shoot(): void {
    holding = false;
    /* the green band gets thinner for harder shots */
    const dist = RIM.x - px, band = round === 3 ? .06 : THREES[shot]?.money ? .08 : .11, off = meter - .72, clean = Math.abs(off) <= band;
    const t = 760 + dist * 1.05 , sx = px + 14, sy = py - TALL * .98;
    ball.x = sx; ball.y = sy; ball.held = false; ball.passed = false;
    /* The sum for a perfect arc into the middle of the rim, then the error from the timing bar. */
    const err = clean ? 0 : off * (round === 3 ? 1.1 : .75);
    const gx = RIM.x + (clean ? 0 : err * 90);
    ball.vx = (gx - sx) / t * (1 + err * .12); ball.vy = (RIM.y - 1 - sy - .5 * G * t * t) / t;
    ball.turn = 0; go('fly'); tone(420, .1); tone(640, .07);
    headCol = '#fff6fb';
    if (clean) { /* a clean release takes the shortest way in */ ball.touched = false; }
  }
  function ballStep(dt: number): void {
    const before = ball.y, n = Math.ceil(dt / 4), sub_ = dt / n;
    for (let i = 0; i < n; i++) {
      ball.vy += G * sub_; ball.x += ball.vx * sub_; ball.y += ball.vy * sub_; ball.turn += ball.vx * sub_ * .09;
      /* the two sides of the rim are solid */
      for (const side of [RIM.x - RIM.r, RIM.x + RIM.r]) {
        const dx = ball.x - side, dy = ball.y - RIM.y, d = Math.hypot(dx, dy);
        if (d < 10 && d > 0 && !ball.scored) {
          const nx = dx / d, ny = dy / d, along = ball.vx * nx + ball.vy * ny;
          if (along < 0) { ball.vx -= 1.55 * along * nx; ball.vy -= 1.55 * along * ny; ball.x = side + nx * 10.2; ball.y = RIM.y + ny * 10.2; if (!ball.touched) tone(310, .07); ball.touched = true; }
        }
      }
      if (ball.x > BOARD - 13 && ball.x < BOARD + 4 && ball.y > 96 && ball.y < 172 && ball.vx > 0 && glass > 0) { ball.x = BOARD - 13; ball.vx *= -.62; ball.touched = true; tone(210, .06); }
      if (ball.y > FLOOR - 4 && ball.vy > 0) { ball.y = FLOOR - 4; ball.vy *= -.62; ball.vx *= .8; if (Math.abs(ball.vy) > .1) tone(110, .04); }
    }
    if (!ball.passed && before <= RIM.y && ball.y > RIM.y && Math.abs(ball.x - RIM.x) < RIM.r - 4) { ball.passed = true; ball.scored = true; made(); }
  }
  function made(): void {
    const swish = !ball.touched, money = round === 1 && THREES[shot].money, base = round === 3 ? 15 : money ? 5 : 3, got = base + (swish ? 1 : 0);
    score += got; net = 1; cheer = 2300; shake = calm ? 0 : 3; flash = calm ? 0 : round === 3 ? 1 : .5;
    headline = round === 3 ? 'FROM DOWNTOWN!' : swish ? 'SWISH!' : 'BUCKETS!'; sub = '+' + got + (swish ? '  Nothing but net' : ''); headCol = money || round === 3 ? '#ff1f8f' : '#f4d35e';
    burst(round === 3 ? 110 : 40, RIM.x, RIM.y + 14, ['#ff1f8f', '#f4d35e', '#fff6fb', '#35dcc8'], 6);
    [659, 880].forEach((f, i) => setTimeout(() => tone(f, .12), i * 80)); stat();
    go('after');
  }
  function takeOff(): void {
    if (mode !== 'run' || dropped) return;
    const gap = RIM.x - 60 - px; /* the middle of the pink zone is 60 before the jump marker */
    const dist = Math.abs(RIM.x - px - 150);
    takeoffGood = dist < 18 ? 3 : dist < 44 ? 2 : dist < 80 ? 1 : 0;
    void gap; jumpV = -.317; spins = 0; spin = 0; spinTo = 0; holding = true; go('air'); tone(300, .1);
    cam = 1;
  }
  function slam(): void {
    const upright = !holding, reached = takeoffGood > 0;
    go('slam');
    if (!reached || !upright || dropped) {
      headline = 'CLANK!'; sub = !reached ? 'You took off too far away' : 'Let go of your spin before the rim'; headCol = '#fff6fb'; tone(130, .3); shake = calm ? 0 : 3;
      ball.held = false; ball.x = RIM.x - 24; ball.y = RIM.y - 12; ball.vx = -.22; ball.vy = -.18; net = .3;
      return;
    }
    const perfect = takeoffGood === 3 && spins >= 1, got = 4 + takeoffGood + spins * 3 + (perfect ? 2 : 0);
    score += got; net = 1; bent = 8; cheer = 2600; shake = calm ? 0 : 10; flash = calm ? 0 : 1;
    headline = perfect ? 'SHATTERED!' : spins >= 2 ? 'WINDMILL!' : spins ? 'THREE-SIXTY!' : 'SLAM!'; sub = '+' + got + '  ' + spins + (spins === 1 ? ' spin' : ' spins') + '  Take-off ' + takeoffGood + ' of 3'; headCol = '#ff1f8f';
    ball.held = false; ball.x = RIM.x; ball.y = RIM.y + 8; ball.vx = 0; ball.vy = .5; ball.scored = true;
    if (perfect) { glass = 0; for (let i = 0; i < (calm ? 20 : 70); i++) bits.push({ x: BOARD, y: 96 + Math.random() * 76, vx: -Math.random() * 7, vy: Math.random() * 5 - 3, life: 1400, col: 'rgba(210,240,255,.9)', size: 3 + Math.random() * 6, turn: Math.random() * 7 }); tone(1600, .3); tone(90, .5); }
    burst(60, RIM.x, RIM.y, ['#ff1f8f', '#f4d35e', '#fff6fb'], 7);
    [392, 523, 784].forEach((f, i) => setTimeout(() => tone(f, .14), i * 90)); stat();
  }
  function step(dt: number): void {
    clock += dt; modeT += dt;
    bits = bits.filter(b => { b.life -= dt; b.x += b.vx * dt * .06; b.y += b.vy * dt * .06; b.vy += dt * .012; return b.life > 0 && b.y < H + 10; });
    shake = Math.max(0, shake - dt * .02); flash = Math.max(0, flash - dt * .004); net = Math.max(0, net - dt * .0016); bent = Math.max(0, bent - dt * .03); cheer = Math.max(0, cheer - dt);
    glass = glass > 0 ? 1 : 0;
    if (mode === 'intro' && modeT > 2400) nextUp(true);
    if (mode === 'card' && modeT > 2000) go(round === 2 ? 'run' : 'set');
    if (mode === 'set' && round === 3) { clockLeft -= dt; if (clockLeft <= 0) { meter = .2; shoot(); } }
    if (mode === 'jump') {
      py = FLOOR - Math.sin(Math.min(1, modeT / 620) * Math.PI) * 46;
      meter += meterDir * dt * (round === 3 ? .0026 : .0019);
      if (meter >= 1) { meter = 1; meterDir = -1; } if (meter <= 0) { meter = 0; meterDir = 1; }
      if (modeT > 620) shoot();
    }
    if (mode === 'fly') {
      if (py < FLOOR) py = Math.min(FLOOR, py + dt * .18);
      const nearRim = Math.hypot(ball.x - RIM.x, ball.y - RIM.y) < 120;
      slow = nearRim && !calm ? (round === 3 ? .3 : .55) : 1;
      ballStep(dt * slow);
      const target = nearRim && !calm ? (round === 3 ? 1.7 : 1.3) : 1;
      cam += (target - cam) * Math.min(1, dt * .006); camX += (RIM.x - 40 - camX) * Math.min(1, dt * .006); camY += (RIM.y + 30 - camY) * Math.min(1, dt * .006);
      if (mode === 'fly' && (ball.y >= FLOOR - 6 && Math.abs(ball.vy) < .22 || modeT > 4200 || ball.x < -20 || ball.x > W + 30)) { headline = ball.touched ? 'IN AND OUT!' : 'AIRBALL!'; sub = 'Let go when the bar is in the green'; headCol = '#fff6fb'; tone(150, .25); go('after'); }
    }
    if (mode === 'after') {
      ballStep(dt);
      py = Math.min(FLOOR, py + dt * .3);
      cam += ((calm ? 1 : ball.scored ? 1.35 : 1) - cam) * Math.min(1, dt * .005);
      if (modeT > 1700) { shot++; nextUp(false); }
    }
    if (mode === 'run') {
      px += dt * .21;
      if (px > RIM.x - 30) { dropped = true; headline = 'TOO LATE!'; sub = 'Press in the pink take-off zone'; headCol = '#fff6fb'; go('slam'); ball.held = false; ball.x = px; ball.y = FLOOR - 40; ball.vx = -.1; ball.vy = -.1; }
    }
    if (mode === 'air') {
      px += dt * (RIM.x - 18 - px) * .0052;
      py += jumpV * dt; jumpV += dt * .000528;
      /* letting go rolls the spin round to the nearest full turn, so only holding on too long costs the dunk */
      if (holding) spin += dt * .02; else spin += (spinTo - spin) * Math.min(1, dt * .025);
      spins = Math.round((holding ? spin : spinTo) / (Math.PI * 2));
      /* she reaches the rim at the top of the jump */
      slow = 1;
      cam += ((calm ? 1 : 1.5) - cam) * Math.min(1, dt * .005); camX += (RIM.x - 50 - camX) * Math.min(1, dt * .006); camY += (RIM.y + 30 - camY) * Math.min(1, dt * .006);
      if (jumpV >= -.02) slam();
    }
    if (mode === 'slam') {
      py = Math.min(FLOOR, py + dt * (modeT < 300 ? .02 : .34));
      if (!ball.held) ballStep(dt);
      cam += ((calm ? 1 : headline === 'CLANK!' || headline === 'TOO LATE!' ? 1 : 1.75) - cam) * Math.min(1, dt * .006);
      if (modeT > 2200) { shot++; nextUp(false); }
    }
    if (mode !== 'fly' && mode !== 'after' && mode !== 'air' && mode !== 'slam') { cam += (1 - cam) * Math.min(1, dt * .006); camX += (320 - camX) * Math.min(1, dt * .006); camY += (180 - camY) * Math.min(1, dt * .006); }
    if (mode === 'set' || mode === 'run') { /* the ball bounces in the hand */ }
  }
  function paint(): void {
    if (!arena) buildArena();
    c.save();
    if (shake > 0) c.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
    const k = mode === 'intro' ? 1.6 - .6 * (1 - Math.pow(1 - Math.min(1, modeT / 2400), 3)) : cam, fx = mode === 'intro' ? 320 : camX, fy = mode === 'intro' ? 150 : camY;
    c.translate(fx, fy); c.scale(k, k); c.translate(-fx, -fy);
    c.drawImage(arena as HTMLCanvasElement, 0, 0, W, H);
    if (cheer > 0) for (let i = 0; i < 18; i++) { const a = heads[i % Math.max(1, heads.length)]; if (a) c.drawImage(a, i * 37, 222 - Math.abs(Math.sin(clock / 105 + i)) * 12, 30, 30); }
    beams();
    /* the pink take-off zone on the floor */
    if (mode === 'run') { c.save(); c.globalAlpha = .55 + Math.sin(clock / 120) * .25; c.fillStyle = '#ff1f8f'; c.fillRect(RIM.x - 230, FLOOR - 3, 160, 10); c.fillStyle = '#35dcc8'; c.fillRect(RIM.x - 168, FLOOR - 3, 36, 10); c.restore(); }
    hoopBack();
    const holdingBall = ball.held && mode !== 'done' && mode !== 'idle' && mode !== 'intro';
    if (!holdingBall && !ball.held && (ball.y < RIM.y || ball.x > RIM.x + RIM.r || ball.x < RIM.x - RIM.r)) drawBall(ball.x, ball.y, ball.turn);
    if (mode !== 'idle' && mode !== 'done' && mode !== 'intro') {
      const pose = mode === 'jump' || mode === 'fly' ? 'shoot' : mode === 'air' ? (spin > 0 ? 'dunk' : 'dunk') : mode === 'slam' ? (headline === 'CLANK!' || headline === 'TOO LATE!' ? 'sad' : 'dunk') : mode === 'run' ? 'run' : mode === 'after' && ball.scored ? 'win' : mode === 'after' ? 'sad' : 'ready';
      const bob = mode === 'run' ? Math.abs(Math.sin(clock / 60)) * 4 : 0, spinWide = mode === 'air' ? spin : 0;
      player(pose, px, py - bob, spinWide);
      if (holdingBall) {
        const by = mode === 'run' ? FLOOR - 14 - Math.abs(Math.sin(clock / 90)) * 46 : mode === 'set' ? FLOOR - 16 - Math.abs(Math.sin(clock / 170)) * 42 : py - TALL * .98;
        const bx = mode === 'air' ? px + Math.cos(spin - Math.PI / 2) * TALL * .6 : mode === 'run' ? px + 22 : px + 18;
        const byAir = mode === 'air' ? py - TALL * .5 + Math.sin(spin - Math.PI / 2) * TALL * .6 : by;
        drawBall(bx, byAir, clock * .004);
      }
    }
    hoopFront();
    if (!ball.held && !(ball.y < RIM.y || ball.x > RIM.x + RIM.r || ball.x < RIM.x - RIM.r)) drawBall(ball.x, ball.y, ball.turn);
    bits.forEach(b => { c.fillStyle = b.col; c.save(); c.translate(b.x, b.y); c.rotate(b.turn || 0); c.fillRect(-b.size / 2, -b.size / 3, b.size, b.size * .66); c.restore(); });
    c.restore();
    if (flash > 0) { c.fillStyle = 'rgba(255,255,255,' + flash * .4 + ')'; c.fillRect(0, 0, W, H); }
    overlay();
  }
  function overlay(): void {
    if (mode === 'idle' || mode === 'done') { title(); return; }
    /* the jumbotron */
    c.fillStyle = 'rgba(16,6,24,.9)'; c.fillRect(250, 6, 140, 46); c.strokeStyle = '#ff1f8f'; c.lineWidth = 2; c.strokeRect(250, 6, 140, 46);
    gameWrite(c, String(score), 320, 38, 26, '#f4d35e');
    c.font = '800 10px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#fff6fb'; c.fillText(['THREES', 'DUNKS', 'HALF COURT'][round - 1], 320, 48);
    if (mode === 'intro') { c.globalAlpha = Math.min(1, modeT / 500); gameWrite(c, 'SLAM DUNK SEANCE', W / 2, 170, 50, '#ff1f8f'); gameLine(c, 'The lights go down. The school is on its feet.', W / 2, 198, '#fff6fb', 15); c.globalAlpha = 1; return; }
    if (mode === 'card') { const [a, b] = cardFor(); c.fillStyle = 'rgba(16,6,24,.74)'; c.fillRect(0, 130, W, 84); gameWrite(c, a, W / 2, 176, 40, '#f4d35e'); gameLine(c, b, W / 2, 200, '#fff6fb', 14); return; }
    if (mode === 'set' || mode === 'jump') shotBar();
    if (round === 1 && (mode === 'set' || mode === 'jump')) gameLine(c, 'Rack ' + (shot + 1) + ' of ' + THREES.length + (THREES[shot].money ? '  MONEYBALL' : ''), W / 2, 72, THREES[shot].money ? '#ff8cc8' : '#fff6fb', 14);
    if (round === 3 && mode === 'set') gameWrite(c, String(Math.ceil(clockLeft / 1000)), W / 2, 96, 34, clockLeft < 3000 ? '#ff1f8f' : '#fff6fb');
    if (mode === 'run') gameLine(c, 'Dunk ' + (shot + 1) + ' of ' + DUNKS + '. Press in the pink zone. The teal is perfect.', W / 2, 346, '#fff6fb', 13);
    if (mode === 'air') { gameLine(c, holding ? 'Spinning. Let go before the rim' : 'Coming down', W / 2, 346, '#f4d35e', 13); gameWrite(c, spins + (spins === 1 ? ' SPIN' : ' SPINS'), 80, 80, 24, '#35dcc8'); }
    if ((mode === 'after' || mode === 'slam') && headline) { const big = headCol === '#fff6fb' ? 36 : 54, s = Math.min(1, modeT / 170); gameWrite(c, headline, W / 2 - 40, 104, big * (.6 + s * .4), headCol); gameLine(c, sub, W / 2 - 40, 128, '#f4d35e', 15); }
  }
  function shotBar(): void {
    const band = round === 3 ? .06 : THREES[shot]?.money ? .08 : .11, x = px - 54, y = FLOOR - 130, h = 110;
    c.fillStyle = 'rgba(16,6,24,.92)'; c.fillRect(x - 3, y - 3, 18, h + 6); c.strokeStyle = '#fff6fb'; c.lineWidth = 2; c.strokeRect(x - 3, y - 3, 18, h + 6);
    c.fillStyle = '#6a1f86'; c.fillRect(x, y, 12, h);
    c.fillStyle = '#35dcc8'; c.fillRect(x, y + h * (1 - .72 - band), 12, h * band * 2);
    c.fillStyle = '#fff6fb'; c.fillRect(x - 5, y + h * (1 - meter) - 2, 22, 4);
    if (mode === 'set') gameLine(c, 'Press and hold to jump, let go in the green', W / 2, 346, '#fff6fb', 13);
  }
  function title(): void {
    if (mode === 'done') {
      c.fillStyle = 'rgba(16,6,24,.74)'; c.fillRect(0, 0, W, H);
      if (art.win) { const s = .36; c.drawImage(art.win, 450 - BOX.w * s / 2 - 10, 62 - Math.abs(Math.sin(clock / 220)) * 8, BOX.w * s, BOX.h * s); }
      gameWrite(c, 'FINAL BUZZER', 230, 88, 42, '#ff1f8f'); gameWrite(c, String(score), 230, 158, 58, '#f4d35e');
      gameLine(c, score >= 50 ? 'Hall of Fame. They are retiring your jersey.' : score >= 30 ? 'A star of the Fang Classic.' : score >= 15 ? 'Good hands. One more practice.' : 'The ghosts blocked everything. Go again.', 230, 192, '#35dcc8', 14);
      gameLine(c, 'Best: ' + finalBest, 230, 218, '#f4d35e', 15);
      return;
    }
    c.fillStyle = 'rgba(16,6,24,.45)'; c.fillRect(0, 0, W, H);
    gameWrite(c, 'SLAM DUNK SEANCE', W / 2, 120, 50, '#ff1f8f');
    gameLine(c, 'Pick your jersey below, then press Tip off', W / 2, 150, '#fff6fb', 15);
  }
  function pauseCover(): void { c.fillStyle = 'rgba(10,2,16,.6)'; c.fillRect(0, 0, W, H); gameWrite(c, 'PAUSED', W / 2, H / 2, 50); gameLine(c, 'Tap the play icon, or press P, when you are ready', W / 2, H / 2 + 30, '#ffd3e8', 15); }
  function frame(now: number): void {
    looping = false;
    if (!cv.getClientRects().length) { if (running()) quit(); return; }
    if (paused) return;
    const dt = Math.min(40, now - last); last = now;
    step(dt); paint();
    if (running() || (visible && !calm && document.visibilityState === 'visible')) { looping = true; requestAnimationFrame(frame); }
  }
  function kick(): void { if (looping || paused || !cv.getClientRects().length) return; looping = true; last = performance.now(); requestAnimationFrame(frame); }
  function togglePause(): void { if (!running()) return; paused = !paused; holding = false; musicHold(paused); if (paused) { paint(); pauseCover(); } else kick(); stat(); }
  function finish(): void { go('done'); cam = 1; camX = 320; camY = 180; paused = false; finalBest = p.bestOf(score); award(Math.ceil(score / 5)); locker.hidden = false; p.go.textContent = 'Play again'; stat(); }
  function quit(): void { go('idle'); paused = false; holding = false; bits = []; cam = 1; locker.hidden = false; p.go.textContent = 'Tip off'; musicHold(false); stat(); }
  function press(): void {
    if (paused) return;
    if (mode === 'set') { meter = 0; meterDir = 1; holding = true; py = FLOOR; go('jump'); tone(260, .06); return; }
    if (mode === 'run') takeOff();
  }
  function release(): void {
    if (mode === 'jump') { shoot(); return; }
    if (mode === 'air' && holding) { holding = false; spinTo = Math.round(spin / (Math.PI * 2)) * Math.PI * 2; }
  }
  p.go.addEventListener('click', () => {
    dress(); paused = false; score = 0; round = 1; shot = 0; bits = []; glass = 1; headline = ''; cam = 1; camX = 320; camY = 180;
    locker.hidden = true; p.go.textContent = 'Restart'; p.go.blur(); musicHold(false); tone(880, .5); ball.held = true; go('intro'); stat(); kick();
  });
  cv.addEventListener('pointerdown', e => { press(); e.preventDefault(); });
  addEventListener('pointerup', release);
  addEventListener('keydown', e => {
    if (isPauseKey(e) && running()) { togglePause(); e.preventDefault(); return; }
    if (!running() || typing(e)) return;
    if (e.key === ' ') { e.preventDefault(); if (!e.repeat) press(); }
  });
  addEventListener('keyup', e => { if (e.key === ' ') release(); });
  stops.push(() => { if (running()) quit(); });
  new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) { dress(); kick(); } }).observe(cv);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') kick(); });
  drawLocker(); stat();
})();
