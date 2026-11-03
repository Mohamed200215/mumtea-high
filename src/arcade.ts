/* ---------- arcade: extra games plus shelf search, filters and favourites ---------- */
const DISPLAY_FONT = '"Breath of the House", Impact, fantasy';
const NEW_GAMES: MenuRow[] = [
  ['riptide', 'Riptide Run', 'Arcade', 'Swim the flooded basement. Hold to rise, let go to sink.', '🌊'],
  ['casket', 'Casket Shot', 'Arcade', 'Pull back, aim, and sink skulls into the casket.', '⚰️'],
  ['booth', 'Say Fangs', 'Camera', 'Take a picture with your camera, pick a filter, and get a Polaroid.', '📸'],
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
  const stat = () => { p.stat.textContent = (run ? 'Score: ' + Math.floor(score) + '  Lives: ' + lives + '  ' : '') + 'Best: ' + displayBest('riptide'); };
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
    const s = Math.floor(score); p.bestOf(s); award(Math.ceil(s / 20)); stat(); submitScore('riptide', s);
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

/* ---------- Casket Shot ---------- */
(function () {
  const [cv, c] = makeCanvas('Casket Shot game area');
  const p = makePanel('casket', 'Casket Shot', 'Drag back from the skull and let go, like a slingshot. On a keyboard, arrows aim and space shoots. Forty-five seconds.', [cv]);
  const HOME = { x: 70, y: 280 }, G = .00055;
  let run = false, left = 0, score = 0, streak = 0, last = 0, aim = { x: -.6, y: .65 }, power = .62;
  let ball: { x: number; y: number; vx: number; vy: number } | null = null, drag = false;
  let box = { x: 340, y: 210, w: 92, dir: 1 }, moving = false, note = '';
  const stat = () => { p.stat.textContent = (run ? 'Time: ' + Math.ceil(left / 1000) + '  Score: ' + score + '  ' : '') + 'Best: ' + displayBest('casket'); };
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
      run = false; ball = null; p.bestOf(score); award(Math.ceil(score / 2)); stat(); submitScore('casket', score);
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

/* ---------- shelf: search, filters, favourites ---------- */
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
    const best = SCORED_GAMES.includes(g[0]) ? displayBest(g[0]) : 0;
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
  if (SCORED_GAMES.includes(id)) { scoreTab = id; renderScores(); }
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
