/* ---------- the opening: bats swarm the logo, a web shoots onto it, and the school fades in ---------- */
(function () {
  const box = document.getElementById('intro');
  document.body.append(themeToggle());
  if (!box) { themeForSite(); return; }
  clearTimeout((window as unknown as { introSafety: number }).introSafety);
  const cv = box.querySelector('canvas') as HTMLCanvasElement, c = cv.getContext('2d') as CanvasRenderingContext2D;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const LOGO_IN = .4, SCATTER = 4, SHOOT = 4.3, LAND = 4.62, WEB_DONE = 5.5, LEAVE = calm ? 1.8 : 6.2;
  const logo = new Image(); logo.src = $<HTMLImageElement>('.crest').src;
  const ease = (t: number): number => { const k = Math.min(1, Math.max(0, t)); return 1 - (1 - k) * (1 - k) * (1 - k); };
  let W = 0, H = 0, unit = 0, clock = 0, last = 0, raf = 0, ended = false;

  /* The bat sprites: a horned silhouette with eight wing positions. */
  const SPRITE_W = 340, SPRITE_H = 260;
  const flaps = Array.from({ length: 8 }, (_, i) => {
    const art = document.createElement('canvas'); art.width = SPRITE_W; art.height = SPRITE_H;
    const g = art.getContext('2d') as CanvasRenderingContext2D, tip = -48 + Math.sin(i / 8 * Math.PI * 2) * 66;
    g.translate(SPRITE_W / 2, SPRITE_H / 2);
    g.beginPath();
    for (const s of [-1, 1]) {
      const j1 = [s * 106, tip * .58 + 24], j2 = [s * 62, tip * .28 + 28], j3 = [s * 16, 20];
      g.moveTo(s * 14, -16);
      g.quadraticCurveTo(s * 72, tip * .55 - 42, s * 156, tip);
      g.quadraticCurveTo(s * 124, tip * .78 + 2, j1[0], j1[1]);
      g.quadraticCurveTo(s * 84, tip * .4 + 6, j2[0], j2[1]);
      g.quadraticCurveTo(s * 38, tip * .14 + 6, j3[0], j3[1]);
      g.closePath();
    }
    g.moveTo(24, 2); g.ellipse(0, 2, 24, 33, 0, 0, 7);
    for (const s of [-1, 1]) {
      g.moveTo(s * 21, -16); g.quadraticCurveTo(s * 25, -36, s * 25, -56); g.quadraticCurveTo(s * 14, -40, s * 3, -30); g.closePath();
      g.moveTo(s * 15, 28); g.lineTo(s * 21, 44); g.lineTo(s * 6, 33); g.closePath();
    }
    g.moveTo(-5, 33); g.lineTo(0, 44); g.lineTo(5, 33); g.closePath();
    g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,31,143,.7)'; g.lineWidth = 5; g.stroke();
    g.fillStyle = '#060208'; g.fill();
    return art;
  });
  const drawBat = (x: number, y: number, wide: number, turn: number, flap: number, alpha = 1): void => {
    c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(turn);
    c.drawImage(flaps[((flap % 8) + 8) % 8], -wide / 2, -wide * SPRITE_H / SPRITE_W / 2, wide, wide * SPRITE_H / SPRITE_W);
    c.restore();
  };

  /* The swarm circles the logo, in front of it for half of each lap and behind it for the rest. */
  const small = innerWidth < 640, swarm = Array.from({ length: calm ? 0 : small ? 30 : 54 }, (_, i) => ({
    at: Math.random() * Math.PI * 2, speed: (.8 + Math.random() * 1.1) * (i % 5 ? 1 : -1), reach: .5 + Math.random() * .75, flat: .55 + Math.random() * .4,
    size: .05 + Math.random() * Math.random() * .17, flap: 4 + Math.random() * 5, wobble: Math.random() * 7, late: Math.random() * .9, from: Math.random() * Math.PI * 2,
    trail: [] as Array<[number, number, number]>,
  }));
  const heroes = calm ? [] : [{ at: .55, dur: 1.15, y: .3, dir: 1 }, { at: 2, dur: 1.3, y: .72, dir: -1 }, { at: 3.15, dur: 1.05, y: .45, dir: 1 }];

  /* The web, spun from the middle like a real one: uneven spokes joined by rings that sag inward. */
  const SPOKES = 11, RINGS = [.13, .25, .38, .53, .69, .86];
  const spokes = Array.from({ length: SPOKES }, (_, i) => ({ a: (i + (Math.random() - .5) * .42) / SPOKES * Math.PI * 2, far: .96 + Math.random() * .3 }));
  const point = (i: number, r: number, cx: number, cy: number, big: number): [number, number] => { const s = spokes[i % SPOKES]; return [cx + Math.cos(s.a) * big * r, cy + Math.sin(s.a) * big * r]; };
  const silk = (draw: () => void, width: number): void => {
    c.lineCap = c.lineJoin = 'round'; c.beginPath(); draw();
    c.strokeStyle = 'rgba(6,2,8,.6)'; c.lineWidth = width + 2.5; c.stroke();
    c.strokeStyle = '#fff6fb'; c.lineWidth = width; c.stroke();
  };
  function drawWeb(t: number, cx: number, cy: number, big: number): void {
    const width = Math.max(1.6, unit * .0034), shots: Array<[number, number]> = [[0, 0], [W, H * .12], [W * .86, H], [W * .06, H]];
    const shot = calm ? 1 : ease((t - SHOOT) / (LAND - SHOOT));
    if (t < SHOOT && !calm) return;
    /* the strands fly in from the corners and stay as the web's anchors */
    shots.forEach(([x, y]) => {
      silk(() => { c.moveTo(x, y); c.lineTo(x + (cx - x) * shot, y + (cy - y) * shot); }, width * .8);
      if (shot < 1) { c.fillStyle = '#fff6fb'; c.beginPath(); c.arc(x + (cx - x) * shot, y + (cy - y) * shot, width * 2.6, 0, 7); c.fill(); }
    });
    const grow = calm ? 1 : ease((t - LAND) / .24);
    if (grow <= 0) return;
    silk(() => { spokes.forEach(s => { c.moveTo(cx, cy); c.lineTo(cx + Math.cos(s.a) * big * s.far * grow, cy + Math.sin(s.a) * big * s.far * grow); }); }, width);
    RINGS.forEach((r, n) => {
      const start = LAND + .16 + n * .11, done = calm ? SPOKES : Math.floor(Math.min(1, Math.max(0, (t - start) / .16)) * SPOKES);
      if (!done) return;
      silk(() => {
        for (let i = 0; i < done; i++) {
          const a = point(i, r, cx, cy, big), b = point(i + 1, r, cx, cy, big), mid = point(i, r * .84, cx, cy, big), next = point(i + 1, r * .84, cx, cy, big);
          c.moveTo(a[0], a[1]); c.quadraticCurveTo((mid[0] + next[0]) / 2, (mid[1] + next[1]) / 2, b[0], b[1]);
        }
      }, width);
    });
  }

  function fit(): void {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = box!.clientWidth; H = box!.clientHeight; unit = Math.min(W, H);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame(now: number): void {
    clock += Math.min(.25, (now - last) / 1000); last = now;
    const t = clock;
    c.clearRect(0, 0, W, H);
    /* the jolt when the web lands */
    const hit = calm ? 0 : Math.max(0, t - LAND), jolt = hit > 0 && hit < .5 ? Math.sin(hit * 46) * (1 - hit * 2) * unit * .012 : 0;
    const cx = W / 2 + jolt, cy = H / 2 + jolt * .6, size = Math.min(unit * .62, 500), big = size * .86;

    type Sprite = () => void;
    const back: Sprite[] = [], front: Sprite[] = [];
    swarm.forEach(b => {
      const a = b.at + t * b.speed, depth = Math.sin(a), come = ease((t - b.late * .5) / 1.1), far = unit * .9 + Math.max(W, H) * .4;
      const out = Math.max(0, t - SCATTER - b.late * .22), blast = out * out * unit * 3.4;
      const ox = cx + Math.cos(a) * size * b.reach * 1.05, oy = cy + depth * size * b.reach * b.flat + Math.sin(t * 2.6 + b.wobble) * unit * .02;
      const dx = ox - cx, dy = oy - cy, run = Math.hypot(dx, dy) || 1;
      const x = cx + Math.cos(b.from) * far + (ox - cx - Math.cos(b.from) * far) * come + dx / run * blast, y = cy + Math.sin(b.from) * far + (oy - cy - Math.sin(b.from) * far) * come + dy / run * blast;
      const wide = unit * b.size * (1 + depth * .3) * 1.5, flap = Math.floor(t * b.flap * 8 + b.wobble);
      const turn = Math.max(-.5, Math.min(.5, Math.cos(a) * b.speed * -.16));
      const trail = b.trail.slice();
      b.trail.unshift([x, y, flap]); if (b.trail.length > 3) b.trail.pop();
      (depth > 0 ? front : back).push(() => {
        trail.forEach((p, n) => drawBat(p[0], p[1], wide, turn, p[2], .2 - n * .055));
        drawBat(x, y, wide, turn, flap);
      });
    });
    back.forEach(draw => draw());
    const show = calm ? 1 : ease((t - LOGO_IN) / .9);
    if (logo.complete && logo.naturalWidth && show > 0) {
      const s = size * (.84 + show * .16);
      c.save(); c.globalAlpha = show; c.drawImage(logo, cx - s / 2, cy - s / 2 * logo.naturalHeight / logo.naturalWidth, s, s * logo.naturalHeight / logo.naturalWidth); c.restore();
    }
    front.forEach(draw => draw());
    heroes.forEach(h => {
      const k = (t - h.at) / h.dur;
      if (k < 0 || k > 1) return;
      const wide = Math.max(W * .9, unit * 1.5), x = h.dir > 0 ? -wide * .6 + (W + wide * 1.2) * k : W + wide * .6 - (W + wide * 1.2) * k, y = H * h.y + Math.sin(k * Math.PI) * unit * .1;
      for (let n = 3; n > 0; n--) drawBat(x - h.dir * n * wide * .05, y, wide, h.dir * .1, Math.floor(t * 44) - n, .16);
      drawBat(x, y, wide, h.dir * .1, Math.floor(t * 44));
    });
    drawWeb(calm ? WEB_DONE : t, cx, cy, big);
    if (t >= LEAVE) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }
  function finish(): void {
    if (ended) return;
    ended = true;
    cancelAnimationFrame(raf);
    removeEventListener('resize', fit); removeEventListener('keydown', onKey);
    box!.classList.add('fade');
    themeForSite();
    const gone = (): void => { box!.remove(); document.documentElement.classList.remove('introon'); };
    box!.addEventListener('transitionend', gone, { once: true });
    window.setTimeout(gone, 1800);
    document.documentElement.classList.remove('introon');
  }
  const onKey = (e: KeyboardEvent): void => { if (!begun) return; if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); } };
  fit();
  addEventListener('resize', fit); addEventListener('keydown', onKey);
  /* The intro starts with the song if the browser allows it. If not, one tap on Enter unlocks the sound. */
  const enterBox = box.querySelector('.introgate') as HTMLElement, enter = box.querySelector('.introenter') as HTMLButtonElement, crest = box.querySelector('.introgate img') as HTMLImageElement;
  crest.src = logo.src;
  let begun = false;
  function begin(): void {
    if (begun) return;
    begun = true;
    enterBox.hidden = true; box!.classList.add('running');
    box!.addEventListener('click', finish);
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  if (!musicAllowed()) begin();
  else {
    const wait = window.setTimeout(() => { if (!begun) { themeSong.pause(); themeInIntro = false; enterBox.hidden = false; enter.focus(); } }, 1500);
    themeForIntro().then(() => { clearTimeout(wait); if (enterBox.hidden) begin(); else themeSong.pause(); }, () => { clearTimeout(wait); themeInIntro = false; enterBox.hidden = false; enter.focus(); });
    enter.addEventListener('click', e => { e.stopPropagation(); clearTimeout(wait); themeForIntro().catch(() => { themeInIntro = false; }); begin(); });
  }
})();
/* A small switch for the theme song, on every page. */
function themeToggle(): HTMLElement {
  const btn = el('button', { cls: 'themetoggle', type: 'button', onclick() { store.set('musicOn', !store.get<boolean>('musicOn', true)); document.dispatchEvent(new Event('soundchange')); } });
  /* On a phone only the note shows, so it covers less of the page. */
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 17.500V5l10-2v12" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.500" cy="17.500" r="2.800" fill="currentColor"/><circle cx="16.500" cy="15.500" r="2.800" fill="currentColor"/><path class="themeoff" d="M3 3l18 18" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/></svg>';
  const word = el('span'); btn.append(word);
  const draw = (): void => { const on = store.get<boolean>('musicOn', true); word.textContent = on ? 'Music on' : 'Music off'; btn.setAttribute('aria-pressed', String(on)); };
  draw(); document.addEventListener('soundchange', draw);
  return btn;
}
