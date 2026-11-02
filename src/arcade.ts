/* ---------- arcade: six extra games plus shelf search, filters and favourites ---------- */
const DISPLAY_FONT = '"Shadow of the Deads", Impact, fantasy';
const NEW_GAMES: MenuRow[] = [
  ['riptide', 'Riptide Run', 'Arcade', 'Swim the flooded basement. Hold to rise, let go to sink.', '🌊'],
  ['hall', 'Hall Pass', 'Arcade', 'Hop Earl across the hallway without meeting a coffin cart.', '🐸'],
  ['casket', 'Casket Shot', 'Arcade', 'Pull back, aim, and sink skulls into the casket.', '⚰️'],
  ['tray', 'Tray Rush', 'Arcade', 'Load every order before the ghoul loses patience.', '🍱'],
  ['stack', 'Cheer Stack', 'Arcade', 'Drop each tier square. Whatever hangs over falls off.', '📣'],
  ['locker', 'Locker Post', 'Puzzle', 'Sort the mail, and watch out when the rule flips.', '📬'],
];
MENU.push(...NEW_GAMES);

/* ---------- shared game parts ---------- */
interface Panel { root: HTMLElement; go: HTMLElement; stat: HTMLElement; bestOf(score: number): number }
function makePanel(id: string, title: string, help: string, body: HTMLElement[], goText = 'Start'): Panel {
  const go = el('button', { cls: 'pill', type: 'button' }, goText);
  const stat = el('span', { role: 'status' });
  const root = el('div', { cls: 'panel gpanel', 'data-game': id, hidden: '' },
    el('h3', { text: title }), el('p', { text: help }), ...body, el('div', { cls: 'gamebar' }, go, stat));
  $('#player').append(root);
  const bestOf = (score: number): number => {
    const best = Math.max(store.get<number>(id + 'Best', 0), score);
    store.set(id + 'Best', best);
    renderMenu();
    return best;
  };
  return { root, go, stat, bestOf };
}
function makeCanvas(label: string): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const cv = el('canvas', { width: 480, height: 360, 'aria-label': label }) as HTMLCanvasElement;
  return [cv, cv.getContext('2d') as CanvasRenderingContext2D];
}
function banner(c: CanvasRenderingContext2D, big: string, small = ''): void {
  c.fillStyle = 'rgba(12,7,16,.72)'; c.fillRect(0, 120, 480, 120);
  c.fillStyle = '#fff6fb'; c.textAlign = 'center'; c.font = '32px ' + DISPLAY_FONT;
  c.fillText(big.toUpperCase(), 240, small ? 175 : 190);
  if (small) { c.font = '800 15px Nunito, sans-serif'; c.fillText(small, 240, 208); }
}
function drawEarl(c: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#fff6fb'; c.strokeStyle = '#000'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(-18, -10); c.lineTo(18, -10); c.quadraticCurveTo(17, 14, 0, 14); c.quadraticCurveTo(-17, 14, -18, -10); c.fill(); c.stroke();
  c.fillStyle = '#b80e63'; c.beginPath(); c.ellipse(0, -10, 18, 4, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#000'; c.beginPath(); c.arc(-6, 0, 3, 0, 7); c.arc(6, 0, 3, 0, 7); c.fill();
  c.restore();
}
const toCanvas = (cv: HTMLCanvasElement, e: PointerEvent): { x: number; y: number } => {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height };
};
const typing = (e: KeyboardEvent): boolean => (e.target as HTMLElement).tagName === 'INPUT';
const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

/* ---------- Riptide Run ---------- */
(function () {
  const [cv, c] = makeCanvas('Riptide Run game area');
  const p = makePanel('riptide', 'Riptide Run', 'Hold the screen, the space bar or the up arrow to rise. Let go to sink. Pearls are worth 5. Three stings and you surface.', [cv]);
  interface Thing { x: number; y: number; r: number; pearl: boolean; phase: number }
  let run = false, rise = false, y = 180, vy = 0, things: Thing[] = [], score = 0, lives = 3, safe = 0, last = 0, gap = 0, far = 0, shown = 0, hunt = false;
  const stat = () => { p.stat.textContent = (run ? 'Score: ' + Math.floor(score) + '  Lives: ' + lives + '  ' : '') + 'Best: ' + store.get('riptideBest', 0); };
  function scene(): void {
    const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#0b6f9c'); g.addColorStop(1, '#14081a');
    c.fillStyle = g; c.fillRect(0, 0, 480, 360);
    c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 2;
    for (let i = 0; i < 4; i++) { c.beginPath(); for (let x = 0; x <= 480; x += 24) c.lineTo(x, 50 + i * 85 + Math.sin((x + far * (1 + i * .3)) / 40) * 6); c.stroke(); }
  }
  function swimmer(): void {
    if (safe > 0 && Math.floor(safe / 100) % 2) return;
    c.save(); c.translate(90, y); c.rotate(Math.max(-.5, Math.min(.5, vy / 300)));
    c.strokeStyle = '#000'; c.lineWidth = 3; c.fillStyle = '#35dcc8';
    c.beginPath(); c.moveTo(-18, 0); c.lineTo(-38, -14); c.lineTo(-34, 0); c.lineTo(-38, 14); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#19b7e8'; c.beginPath(); c.ellipse(0, 0, 24, 15, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#ff1f8f'; c.beginPath(); c.moveTo(-6, -14); c.lineTo(4, -28); c.lineTo(10, -13); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(11, -4, 5, 0, 7); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(13, -4, 2.4, 0, 7); c.fill();
    c.restore();
  }
  function thing(t: Thing): void {
    if (t.pearl) {
      c.fillStyle = '#fff6fb'; c.strokeStyle = '#000'; c.lineWidth = 2; c.beginPath(); c.arc(t.x, t.y, t.r, 0, 7); c.fill(); c.stroke();
      return;
    }
    c.strokeStyle = '#ff1f8f'; c.lineWidth = 3;
    for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(t.x + i * 6, t.y); c.quadraticCurveTo(t.x + i * 6 + Math.sin(t.phase + i) * 6, t.y + 18, t.x + i * 6, t.y + 32); c.stroke(); }
    c.fillStyle = '#c77dff'; c.strokeStyle = '#000'; c.beginPath(); c.arc(t.x, t.y, t.r, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
  }
  function frame(now: number): void {
    if (!run) return;
    const dt = Math.min(40, now - last); last = now;
    const speed = .15 + score * .0004;
    vy += (rise ? -.75 : .55) * dt; vy = Math.max(-230, Math.min(230, vy));
    y += vy * dt / 1000;
    if (y < 18) { y = 18; vy = 0; }
    if (y > 342) { y = 342; vy = 0; }
    far += dt * speed; score += dt * .01; safe = Math.max(0, safe - dt); gap -= dt;
    if (gap <= 0) {
      gap = Math.max(420, 1000 - score * 2) * (.7 + Math.random() * .6);
      const pearl = Math.random() < .3;
      // every other jellyfish swims at the player's depth, so parking at the top or bottom doesn't work
      const hunting = !pearl && (hunt = !hunt);
      things.push({ x: 510, y: hunting ? Math.max(20, Math.min(320, y - 8)) : 30 + Math.random() * 290, r: pearl ? 9 : 17, pearl, phase: Math.random() * 6 });
    }
    scene();
    things = things.filter(t => {
      t.x -= dt * speed; t.phase += dt * .006;
      if (Math.hypot(t.x - 90, t.y + (t.pearl ? 0 : 8) - y) < t.r + 15) {
        if (t.pearl) { score += 5; tone(780, .08); return false; }
        if (safe <= 0) { lives--; safe = 1200; tone(150, .25); }
      }
      thing(t);
      return t.x > -40;
    });
    swimmer();
    if (lives <= 0) { finish(); return; }
    if (Math.floor(score) !== shown) { shown = Math.floor(score); stat(); }
    requestAnimationFrame(frame);
  }
  function finish(): void {
    run = false; rise = false;
    const s = Math.floor(score); p.bestOf(s); award(Math.ceil(s / 20)); stat();
    banner(c, 'Surfaced!', s + ' points'); p.go.textContent = 'Play again';
  }
  p.go.addEventListener('click', () => {
    run = true; y = 180; vy = 0; things = []; score = 0; lives = 3; safe = 0; gap = 300; shown = 0; last = performance.now();
    p.go.textContent = 'Restart'; p.go.blur(); stat(); requestAnimationFrame(frame);
  });
  cv.addEventListener('pointerdown', e => { rise = true; e.preventDefault(); });
  addEventListener('pointerup', () => { rise = false; });
  const isRise = (e: KeyboardEvent) => e.key === ' ' || e.key === 'ArrowUp';
  addEventListener('keydown', e => { if (run && isRise(e) && !typing(e)) { rise = true; e.preventDefault(); } });
  addEventListener('keyup', e => { if (isRise(e)) rise = false; });
  stops.push(() => { if (run) { run = false; rise = false; scene(); banner(c, 'Riptide Run'); } });
  scene(); banner(c, 'Riptide Run'); stat();
})();

/* ---------- Hall Pass ---------- */
(function () {
  const [cv, c] = makeCanvas('Hall Pass game area');
  const pad = el('div', { cls: 'gpad', 'aria-label': 'Hop controls' });
  const p = makePanel('hall', 'Hall Pass', 'Get Earl Ghoul to the top of the hall. Use the arrow keys, swipe the game, or use the pad on a phone.', [cv, pad]);
  const CELL = 40, COLS = 12, ROWS = 9;
  interface Cart { x: number; w: number }
  interface Lane { row: number; dir: number; speed: number; carts: Cart[] }
  let run = false, lanes: Lane[] = [], ex = 6, ey = 8, score = 0, lives = 3, level = 1, top = 8, last = 0;
  const stat = () => { p.stat.textContent = (run ? 'Score: ' + score + '  Lives: ' + lives + '  Hall: ' + level + '  ' : '') + 'Best: ' + store.get('hallBest', 0); };
  function buildLanes(): void {
    lanes = [];
    for (const row of [1, 2, 3, 5, 6, 7]) {
      const dir = row % 2 ? 1 : -1, w = 52 + (row % 3) * 14, n = 2 + (row % 2), step = 480 / n, carts: Cart[] = [];
      for (let i = 0; i < n; i++) carts.push({ x: i * step + Math.random() * 40, w });
      lanes.push({ row, dir, speed: (.045 + row * .006) * (1 + (level - 1) * .18), carts });
    }
  }
  function scene(): void {
    for (let r = 0; r < ROWS; r++) {
      c.fillStyle = r === 0 ? '#35dcc8' : r === 4 || r === 8 ? '#3a1250' : r % 2 ? '#181019' : '#14081a';
      c.fillRect(0, r * CELL, 480, CELL);
    }
    c.fillStyle = '#04202e'; c.font = '20px ' + DISPLAY_FONT; c.textAlign = 'center'; c.fillText('TEA THIS WAY', 240, 28);
    for (const l of lanes) for (const k of l.carts) {
      const y = l.row * CELL + 6;
      c.fillStyle = '#6a1f86'; c.strokeStyle = '#000'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(k.x + 10, y); c.lineTo(k.x + k.w - 10, y); c.lineTo(k.x + k.w, y + 14); c.lineTo(k.x + k.w - 12, y + 28); c.lineTo(k.x + 12, y + 28); c.lineTo(k.x, y + 14); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = '#f9e9a6'; c.lineWidth = 2; c.beginPath(); c.moveTo(k.x + k.w / 2, y + 6); c.lineTo(k.x + k.w / 2, y + 22); c.moveTo(k.x + k.w / 2 - 6, y + 12); c.lineTo(k.x + k.w / 2 + 6, y + 12); c.stroke();
    }
    drawEarl(c, ex * CELL, ey * CELL + 22, .9);
  }
  function hop(dx: number, dy: number): void {
    if (!run) return;
    ex = Math.max(1, Math.min(COLS - 1, ex + dx)); ey = Math.max(0, Math.min(ROWS - 1, ey + dy));
    tone(440, .05);
    if (ey < top) { score += 10 * (top - ey); top = ey; stat(); }
    if (ey === 0) { score += 50; level++; top = 8; ex = 6; ey = 8; buildLanes(); tone(880, .2); stat(); }
  }
  function frame(now: number): void {
    if (!run) return;
    const dt = Math.min(40, now - last); last = now;
    for (const l of lanes) for (const k of l.carts) {
      k.x += l.dir * l.speed * dt;
      if (l.dir > 0 && k.x > 480) k.x = -k.w;
      if (l.dir < 0 && k.x + k.w < 0) k.x = 480;
    }
    const lane = lanes.find(l => l.row === ey), px = ex * CELL;
    if (lane && lane.carts.some(k => px + 13 > k.x && px - 13 < k.x + k.w)) {
      lives--; tone(130, .3); ex = 6; ey = 8; top = 8; stat();
      if (lives <= 0) {
        run = false; p.bestOf(score); award(Math.ceil(score / 40)); stat();
        scene(); banner(c, 'Detention!', score + ' points'); p.go.textContent = 'Play again';
        return;
      }
    }
    scene();
    requestAnimationFrame(frame);
  }
  ([['up', '↑', 0, -1], ['left', '←', -1, 0], ['down', '↓', 0, 1], ['right', '→', 1, 0]] as Array<[string, string, number, number]>).forEach(([cls, label, dx, dy]) => {
    pad.append(el('button', { type: 'button', cls, 'aria-label': 'Hop ' + cls, onclick() { hop(dx, dy); } }, label));
  });
  addEventListener('keydown', e => {
    if (!run || typing(e)) return;
    const m: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    const d = m[e.key];
    if (d) { hop(d[0], d[1]); e.preventDefault(); }
  });
  let from: { x: number; y: number } | null = null;
  cv.addEventListener('pointerdown', e => { from = toCanvas(cv, e); });
  cv.addEventListener('pointerup', e => {
    if (!from) return;
    const to = toCanvas(cv, e), dx = to.x - from.x, dy = to.y - from.y; from = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) hop(0, -1);
    else if (Math.abs(dx) > Math.abs(dy)) hop(Math.sign(dx), 0);
    else hop(0, Math.sign(dy));
  });
  p.go.addEventListener('click', () => {
    run = true; score = 0; lives = 3; level = 1; ex = 6; ey = 8; top = 8; buildLanes(); last = performance.now();
    p.go.textContent = 'Restart'; p.go.blur(); stat(); requestAnimationFrame(frame);
  });
  stops.push(() => { if (run) { run = false; scene(); banner(c, 'Hall Pass'); } });
  buildLanes(); scene(); banner(c, 'Hall Pass'); stat();
})();

/* ---------- Casket Shot ---------- */
(function () {
  const [cv, c] = makeCanvas('Casket Shot game area');
  const p = makePanel('casket', 'Casket Shot', 'Drag back from the skull and let go, like a slingshot. On a keyboard, arrows aim and space shoots. Forty-five seconds.', [cv]);
  const HOME = { x: 70, y: 280 }, G = .00055;
  let run = false, left = 0, score = 0, streak = 0, last = 0, aim = { x: -.6, y: .65 }, power = .62;
  let ball: { x: number; y: number; vx: number; vy: number } | null = null, drag = false;
  let box = { x: 340, y: 210, w: 92, dir: 1 }, moving = false, note = '';
  const stat = () => { p.stat.textContent = (run ? 'Time: ' + Math.ceil(left / 1000) + '  Score: ' + score + '  ' : '') + 'Best: ' + store.get('casketBest', 0); };
  function skull(x: number, y: number): void {
    c.fillStyle = '#fff6fb'; c.strokeStyle = '#000'; c.lineWidth = 3;
    c.beginPath(); c.arc(x, y, 14, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#000'; c.beginPath(); c.arc(x - 5, y - 2, 3, 0, 7); c.arc(x + 5, y - 2, 3, 0, 7); c.fill();
  }
  function scene(): void {
    c.fillStyle = '#14081a'; c.fillRect(0, 0, 480, 360);
    c.fillStyle = '#3a1250'; c.fillRect(0, 310, 480, 50);
    c.fillStyle = '#6a1f86'; c.strokeStyle = '#000'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(box.x, box.y); c.lineTo(box.x + box.w, box.y); c.lineTo(box.x + box.w - 12, 310); c.lineTo(box.x + 12, 310); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#ff1f8f'; c.lineWidth = 6; c.beginPath(); c.moveTo(box.x - 4, box.y); c.lineTo(box.x + box.w + 4, box.y); c.stroke();
    const mx = box.x + box.w / 2;
    c.strokeStyle = '#f9e9a6'; c.lineWidth = 3; c.beginPath(); c.moveTo(mx, box.y + 22); c.lineTo(mx, box.y + 64); c.moveTo(mx - 12, box.y + 36); c.lineTo(mx + 12, box.y + 36); c.stroke();
    if (run && !ball) {
      c.fillStyle = 'rgba(255,246,251,.65)';
      let x = HOME.x, y = HOME.y, vx = -aim.x * power, vy = -aim.y * power;
      for (let i = 0; i < 18; i++) { for (let k = 0; k < 40; k++) { x += vx; y += vy; vy += G; } c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); }
    }
    const b = ball || HOME; skull(b.x, b.y);
    if (note) { c.fillStyle = '#8df04a'; c.textAlign = 'center'; c.font = '24px ' + DISPLAY_FONT; c.fillText(note, 240, 60); }
  }
  function shoot(): void {
    if (!run || ball) return;
    ball = { x: HOME.x, y: HOME.y, vx: -aim.x * power, vy: -aim.y * power }; tone(320, .08);
  }
  function step(dt: number): void {
    if (!ball) return;
    for (let i = 0; i < dt; i++) {
      const prevY = ball.y;
      ball.x += ball.vx; ball.y += ball.vy; ball.vy += G;
      const mouth = prevY < box.y && ball.y >= box.y;
      if (mouth && ball.x > box.x + 8 && ball.x < box.x + box.w - 8) {
        streak++;
        const pts = 2 + (streak > 2 ? 1 : 0) + (moving ? 1 : 0);
        score += pts; note = '+' + pts + (streak > 2 ? ' streak!' : ''); tone(700, .15);
        ball = null; box.x = 200 + Math.random() * 180; box.y = 170 + Math.random() * 70; moving = score >= 10;
        stat();
        return;
      }
      if (mouth && (Math.abs(ball.x - box.x) < 10 || Math.abs(ball.x - box.x - box.w) < 10)) { ball.vy = -ball.vy * .55; ball.vx *= .6; tone(240, .05); }
      if (ball.y > 322 || ball.x > 500 || ball.x < -20) { streak = 0; note = ''; ball = null; return; }
    }
  }
  function frame(now: number): void {
    if (!run) return;
    const dt = Math.min(40, now - last); last = now;
    const before = Math.ceil(left / 1000);
    left -= dt;
    if (moving) { box.x += box.dir * dt * .05; if (box.x < 190 || box.x > 380) box.dir *= -1; }
    step(dt); scene();
    if (Math.ceil(left / 1000) !== before) stat();
    if (left <= 0) {
      run = false; ball = null; p.bestOf(score); award(Math.ceil(score / 2)); stat();
      scene(); banner(c, 'Time!', score + ' points'); p.go.textContent = 'Play again';
      return;
    }
    requestAnimationFrame(frame);
  }
  function setAim(px: number, py: number): void {
    const dx = px - HOME.x, dy = py - HOME.y, d = Math.hypot(dx, dy) || 1;
    aim = { x: dx / d, y: dy / d }; power = Math.max(.2, Math.min(.85, d / 170));
  }
  cv.addEventListener('pointerdown', e => {
    if (!run || ball) return;
    drag = true; cv.setPointerCapture(e.pointerId); const q = toCanvas(cv, e); setAim(q.x, q.y);
  });
  cv.addEventListener('pointermove', e => { if (drag) { const q = toCanvas(cv, e); setAim(q.x, q.y); } });
  cv.addEventListener('pointerup', () => { if (drag) { drag = false; shoot(); } });
  addEventListener('keydown', e => {
    if (!run || typing(e)) return;
    if (e.key === ' ') { shoot(); e.preventDefault(); return; }
    const turn = e.key === 'ArrowUp' ? .07 : e.key === 'ArrowDown' ? -.07 : 0;
    if (turn) { const a = Math.atan2(aim.y, aim.x) + turn; aim = { x: Math.cos(a), y: Math.sin(a) }; e.preventDefault(); }
    if (e.key === 'ArrowRight') { power = Math.min(.85, power + .02); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { power = Math.max(.2, power - .02); e.preventDefault(); }
  });
  p.go.addEventListener('click', () => {
    run = true; left = 45000; score = 0; streak = 0; note = ''; ball = null; moving = false; box = { x: 340, y: 210, w: 92, dir: 1 }; last = performance.now();
    p.go.textContent = 'Restart'; p.go.blur(); stat(); requestAnimationFrame(frame);
  });
  stops.push(() => { if (run) { run = false; ball = null; scene(); banner(c, 'Casket Shot'); } });
  scene(); banner(c, 'Casket Shot'); stat();
})();

/* ---------- Tray Rush ---------- */
(function () {
  const FOOD: Array<[string, string]> = [['🍵', 'Tea'], ['💀', 'Skull candy'], ['🦇', 'Bat wings'], ['🧁', 'Grave cake'], ['🕸️', 'Web floss'], ['🍬', 'Gloss drop']];
  const face = el('div', { cls: 'gart', 'aria-hidden': 'true' });
  const want = el('div', { cls: 'orderwant' });
  const bar = el('i'), food = el('div', { cls: 'trayfood' });
  const card = el('div', { cls: 'ordercard' }, face, want);
  const p = makePanel('tray', 'Tray Rush', 'Tap what the ghoul ordered, in any order, or press keys 1 to 6. Wrong items cost you patience. Three ghouls storm out and you are done.', [card, el('div', { cls: 'traybar' }, bar), food]);
  let run = false, order: number[] = [], got: boolean[] = [], score = 0, walks = 3, patience = 0, full = 1, last = 0;
  const stat = () => { p.stat.textContent = (run ? 'Served: ' + score + '  Walkouts left: ' + walks + '  ' : '') + 'Best: ' + store.get('trayBest', 0); };
  function drawOrder(): void {
    want.textContent = '';
    want.style.fontSize = run ? '' : '15px';
    if (!run) { want.textContent = 'Press start when the lunch bell rings.'; return; }
    order.forEach((f, i) => want.append(el('span', { cls: got[i] ? 'done' : '', title: FOOD[f][1] }, FOOD[f][0])));
  }
  function nextOrder(): void {
    const n = Math.min(6, 2 + Math.floor(score / 3));
    order = Array.from({ length: n }, () => Math.floor(Math.random() * FOOD.length));
    got = order.map(() => false);
    full = patience = Math.max(3500, 8000 - score * 280) + n * 500;
    const guest = pick(loadRoster()); face.innerHTML = guest ? drawGhoul(guest.look, { head: true }) : doll(DOLLS.mumtea, { head: true });
    drawOrder();
  }
  function serve(f: number): void {
    if (!run) return;
    const i = order.findIndex((o, k) => o === f && !got[k]);
    if (i < 0) { patience -= 900; tone(150, .12); return; }
    got[i] = true; tone(560 + i * 70, .06);
    if (got.every(Boolean)) { score++; tone(880, .18); stat(); nextOrder(); } else drawOrder();
  }
  function frame(now: number): void {
    if (!run) return;
    patience -= now - last; last = now;
    bar.style.width = Math.max(0, patience / full * 100) + '%';
    if (patience <= 0) {
      walks--; tone(120, .3); stat();
      if (walks <= 0) {
        run = false; p.bestOf(score); award(score); stat(); drawOrder();
        want.textContent = 'Riot in the creepateria! You served ' + score + '.';
        p.go.textContent = 'Play again';
        return;
      }
      nextOrder();
    }
    requestAnimationFrame(frame);
  }
  FOOD.forEach(([icon, name], i) => food.append(el('button', { type: 'button', 'aria-label': name, onclick() { serve(i); } }, icon, el('small', { text: (i + 1) + ' ' + name }))));
  addEventListener('keydown', e => {
    if (!run || typing(e)) return;
    const n = Number(e.key);
    if (n >= 1 && n <= FOOD.length) serve(n - 1);
  });
  p.go.addEventListener('click', () => {
    run = true; score = 0; walks = 3; last = performance.now(); p.go.textContent = 'Restart'; nextOrder(); stat(); requestAnimationFrame(frame);
  });
  stops.push(() => { if (run) { run = false; drawOrder(); bar.style.width = '0'; } });
  drawOrder(); stat();
})();

/* ---------- Cheer Stack ---------- */
(function () {
  const [cv, c] = makeCanvas('Cheer Stack game area');
  const p = makePanel('stack', 'Cheer Stack', 'Tap, click or press space to drop each tier. Only the part that lands stays. Land one dead on and the tier grows back a little.', [cv]);
  const H = 26, COLORS = ['#ff1f8f', '#19b7e8', '#35dcc8', '#f9e9a6', '#8df04a', '#c77dff'];
  interface Tier { x: number; w: number }
  let run = false, tiers: Tier[] = [], mover: Tier = { x: 0, w: 220 }, dir = 1, score = 0, last = 0, cam = 0;
  const stat = () => { p.stat.textContent = (run ? 'Height: ' + score + '  ' : '') + 'Best: ' + store.get('stackBest', 0); };
  function bar(t: Tier, i: number): void {
    const y = 330 - (i + 1) * H + cam;
    c.fillStyle = COLORS[i % COLORS.length]; c.strokeStyle = '#000'; c.lineWidth = 3; c.fillRect(t.x, y, t.w, H); c.strokeRect(t.x, y, t.w, H);
  }
  function scene(): void {
    c.fillStyle = '#14081a'; c.fillRect(0, 0, 480, 360);
    c.fillStyle = '#3a1250'; c.fillRect(0, 330 + cam, 480, 60);
    tiers.forEach(bar);
    if (run) bar(mover, tiers.length);
  }
  function drop(): void {
    if (!run) return;
    const under = tiers[tiers.length - 1];
    const a = Math.max(mover.x, under.x), b = Math.min(mover.x + mover.w, under.x + under.w), w = b - a;
    if (w <= 0) {
      run = false; p.bestOf(score); award(Math.ceil(score / 2)); tone(110, .4); stat();
      scene(); banner(c, 'Tumble!', score + ' tiers'); p.go.textContent = 'Play again';
      return;
    }
    const perfect = Math.abs(mover.x - under.x) < 5;
    const placed: Tier = perfect ? { x: under.x, w: Math.min(220, under.w + 8) } : { x: a, w };
    tiers.push(placed); score++; tone(perfect ? 880 : 440 + score * 8, .1); stat();
    mover = { x: dir > 0 ? 0 : 480 - placed.w, w: placed.w };
  }
  function frame(now: number): void {
    if (!run) return;
    const dt = Math.min(40, now - last); last = now;
    mover.x += dir * dt * (.16 + score * .006);
    if ((mover.x + mover.w > 480 && dir > 0) || (mover.x < 0 && dir < 0)) dir *= -1;
    cam += (Math.max(0, (tiers.length - 7) * H) - cam) * Math.min(1, dt * .006);
    scene();
    requestAnimationFrame(frame);
  }
  cv.addEventListener('pointerdown', e => { e.preventDefault(); drop(); });
  addEventListener('keydown', e => { if (run && e.key === ' ' && !typing(e)) { drop(); e.preventDefault(); } });
  p.go.addEventListener('click', () => {
    run = true; score = 0; cam = 0; dir = 1; tiers = [{ x: 130, w: 220 }]; mover = { x: 0, w: 220 }; last = performance.now();
    p.go.textContent = 'Restart'; p.go.blur(); stat(); requestAnimationFrame(frame);
  });
  stops.push(() => { if (run) { run = false; scene(); banner(c, 'Cheer Stack'); } });
  tiers = [{ x: 130, w: 220 }]; scene(); banner(c, 'Cheer Stack'); stat();
})();

/* ---------- Locker Post ---------- */
(function () {
  const BOXES: Array<[string, string, string]> = [['Pink', '#ff1f8f', '#d3006f'], ['Blue', '#19b7e8', '#0b6f9c'], ['Green', '#8df04a', '#2f8f00'], ['Gold', '#f4d35e', '#9a7a00']];
  const rule = el('p', { cls: 'lockerrule' });
  const letter = el('div', { cls: 'letter' });
  const lockers = el('div', { cls: 'lockers' });
  const p = makePanel('locker', 'Locker Post', 'Each letter says one colour in another colour. Sort it by the rule shown, which flips every five letters. Tap a locker, or press 1 to 4. Forty seconds.', [rule, letter, lockers]);
  let run = false, word = 0, ink = 0, byInk = false, score = 0, combo = 0, count = 0, left = 0, last = 0;
  const stat = () => { p.stat.textContent = (run ? 'Time: ' + Math.ceil(left / 1000) + '  Score: ' + score + '  Combo: ' + combo + '  ' : '') + 'Best: ' + store.get('lockerBest', 0); };
  function next(): void {
    if (count && count % 5 === 0) { byInk = !byInk; tone(300, .15); }
    word = Math.floor(Math.random() * 4);
    do { ink = Math.floor(Math.random() * 4); } while (ink === word);
    rule.textContent = byInk ? 'Rule: go by the INK colour' : 'Rule: go by what the WORD says';
    letter.textContent = BOXES[word][0];
    letter.style.color = BOXES[ink][2];
  }
  function send(i: number): void {
    if (!run) return;
    count++;
    if (i === (byInk ? ink : word)) { combo++; score += 1 + Math.floor(combo / 5); tone(600 + combo * 20, .07); }
    else { combo = 0; left -= 2000; tone(140, .2); }
    stat(); next();
  }
  function frame(now: number): void {
    if (!run) return;
    const before = Math.ceil(left / 1000);
    left -= now - last; last = now;
    if (Math.ceil(left / 1000) !== before) stat();
    if (left <= 0) {
      run = false; p.bestOf(score); award(Math.ceil(score / 3)); stat();
      rule.textContent = 'The bell rang.'; letter.textContent = score + ' points'; letter.style.color = '#2a1420';
      p.go.textContent = 'Play again';
      return;
    }
    requestAnimationFrame(frame);
  }
  BOXES.forEach(([name, colour], i) => {
    const b = el('button', { type: 'button', onclick() { send(i); } }, (i + 1) + ' ' + name);
    b.style.background = colour; lockers.append(b);
  });
  addEventListener('keydown', e => {
    if (!run || typing(e)) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 4) send(n - 1);
  });
  p.go.addEventListener('click', () => {
    run = true; score = 0; combo = 0; count = 0; byInk = false; left = 40000; last = performance.now();
    p.go.textContent = 'Restart'; next(); stat(); requestAnimationFrame(frame);
  });
  stops.push(() => { if (run) { run = false; rule.textContent = ''; letter.textContent = 'Locker Post'; letter.style.color = '#2a1420'; } });
  letter.textContent = 'Locker Post'; letter.style.color = '#2a1420'; stat();
})();

/* ---------- shelf: search, filters, favourites ---------- */
const BEST_KEYS: Record<string, string> = { spill: 'spillBest', riot: 'riotBest', hearse: 'hearseBest', dance: 'danceBest', riptide: 'riptideBest', hall: 'hallBest', casket: 'casketBest', tray: 'trayBest', stack: 'stackBest', locker: 'lockerBest' };
let shelfGenre = 'All', shelfQuery = '', currentGame = 'closet';
const favourites = (): string[] => store.get<string[]>('favs', []);
const titleOf = (id: string): string => (MENU.find(g => g[0] === id) || MENU[0])[1];
const playerTitle = el('span');
const favBtn = el('button', { cls: 'chip', type: 'button', onclick() { toggleFav(currentGame); } });

function toggleFav(id: string): void {
  const f = favourites();
  store.set('favs', f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  renderMenu(); syncPlayerBar();
}
function renderMenu(): void {
  const s = $('#shelf'); s.textContent = '';
  const q = shelfQuery.toLowerCase(), favs = favourites();
  const rows = MENU.filter(g => (shelfGenre === 'All' || g[2] === shelfGenre || (shelfGenre === 'Favourites' && favs.includes(g[0]))) && (g[1] + ' ' + g[3]).toLowerCase().includes(q));
  if (!rows.length) {
    s.append(el('p', { cls: 'gempty', text: shelfGenre === 'Favourites' && !q ? 'No favourites yet. Tap the star on any game.' : 'No game matches that.' }));
    return;
  }
  rows.forEach(g => {
    const b = el('button', { cls: 'gcard', type: 'button', 'data-game': g[0], 'aria-pressed': g[0] === currentGame, onclick() { openGame(g[0], true); } });
    const art = el('div', { cls: 'gart', 'aria-hidden': 'true' }); art.textContent = g[4];
    const best = BEST_KEYS[g[0]] ? store.get<number>(BEST_KEYS[g[0]], 0) : 0;
    const body = el('div', { cls: 'gbody' }, el('strong', { text: g[1] }), el('small', { text: g[3] }));
    if (best) body.append(el('span', { cls: 'gbest', text: 'Best: ' + best }));
    body.append(el('em', { text: g[2] }));
    b.append(art, body);
    const on = favs.includes(g[0]);
    const star = el('button', { cls: 'gfav', type: 'button', 'aria-pressed': on, 'aria-label': (on ? 'Remove ' + g[1] + ' from' : 'Add ' + g[1] + ' to') + ' favourites', onclick() { toggleFav(g[0]); } }, on ? '★' : '☆');
    s.append(el('div', { cls: 'gcell' }, b, star));
  });
}
function syncPlayerBar(): void {
  playerTitle.textContent = 'Now playing: ' + titleOf(currentGame);
  const on = favourites().includes(currentGame);
  favBtn.textContent = on ? '★ Favourite' : '☆ Favourite';
  favBtn.setAttribute('aria-pressed', String(on));
}
function arcadeOpened(id: string): void {
  currentGame = id; store.set('lastGame', id); syncPlayerBar();
  if (id === 'closet') mountStudio($('#closetHome'));
}
(function () {
  const chips = el('div', { cls: 'chips', role: 'group', 'aria-label': 'Filter games' });
  ['All', ...Array.from(new Set(MENU.map(g => g[2]))), 'Favourites'].forEach(name => {
    const chip = el('button', { cls: 'chip', type: 'button', 'aria-pressed': name === 'All', onclick() {
      shelfGenre = name; $$('.chip', chips).forEach(k => k.setAttribute('aria-pressed', String(k === chip))); renderMenu();
    } }, name);
    chips.append(chip);
  });
  const search = el('input', { type: 'search', placeholder: 'Search ' + MENU.length + ' games', 'aria-label': 'Search games' }) as HTMLInputElement;
  search.addEventListener('input', () => { shelfQuery = search.value.trim(); renderMenu(); });
  const drawSound = () => { const m = store.get('mute', false); sound.textContent = m ? 'Sound off' : 'Sound on'; sound.setAttribute('aria-pressed', String(!m)); };
  const sound = el('button', { cls: 'chip', type: 'button', onclick() { store.set('mute', !store.get('mute', false)); drawSound(); } });
  drawSound();
  const random = el('button', { cls: 'chip', type: 'button', onclick() { openGame(pick(MENU)[0], true); } }, 'Random game');
  $('#shelf').before(el('div', { cls: 'arcadebar' }, search, chips, random, sound));

  const player = $('#player');
  const tools = el('div', {}, favBtn, el('button', { cls: 'chip', type: 'button', onclick() { $('.arcadebar').scrollIntoView({ block: 'start' }); } }, 'All games'));
  if (player.requestFullscreen) {
    const full = el('button', { cls: 'chip', type: 'button', onclick() {
      if (document.fullscreenElement) document.exitFullscreen(); else player.requestFullscreen().catch(() => {});
    } }, 'Full screen');
    document.addEventListener('fullscreenchange', () => { full.textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen'; });
    tools.append(full);
  }
  player.prepend(el('div', { cls: 'playerbar' }, playerTitle, tools));
  const last = store.get<string>('lastGame', 'closet');
  if (MENU.some(g => g[0] === last)) currentGame = last;
  syncPlayerBar();
})();
