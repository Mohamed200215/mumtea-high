/* ---------- Spill Proof: sit in your teacup at a midnight tea party and catch sugar skulls ---------- */
(function () {
  const W = 640, H = 540, TOP = 180, ZOOM = 2, INK_LINE = '#1c0a1c';
  const cv = $<HTMLCanvasElement>('#spill'), c = cv.getContext('2d') as CanvasRenderingContext2D;
  cv.width = W * ZOOM; cv.height = H * ZOOM; c.scale(ZOOM, ZOOM);
  const go = $('#spillGo'), status = $('#spillStat');
  const tools = gameTools($('.gpanel[data-game="spill"]'), togglePause);
  type Mode = 'idle' | 'pour' | 'play' | 'cold' | 'done';
  interface Drop { x: number; y: number; bat: boolean; spin: number; phase: number }
  interface Bit { x: number; y: number; vx: number; vy: number; life: number; max: number; col: string; size: number }
  interface Pop { x: number; y: number; text: string; life: number }
  let mode: Mode = 'idle', x = W / 2, aimX = W / 2, vx = 0, tilt = 0, items: Drop[] = [], score = 0, lives = 3, modeT = 0, clock = 0, last = 0, keys: Record<string, boolean> = {};
  let paused = false, bits: Bit[] = [], pops: Pop[] = [], flash = 0, shake = 0, cheer = 0, ouch = 0, slosh = 0, looping = false, visible = false, finalBest = 0;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const POUR = 5000, COLD = 1500, CUP_Y = 232;
  const active = () => mode === 'pour' || mode === 'play' || mode === 'cold';
  const stat = () => { tools.show(active(), paused); status.textContent = (mode === 'play' || mode === 'pour' ? 'Score: ' + score + '  Lives: ' + lives + '  ' : '') + 'Best: ' + displayBest('spill'); };
  const ease = (t: number) => { const k = Math.min(1, Math.max(0, t)); return k * k * (3 - 2 * k); };
  const round = (p: CanvasRenderingContext2D, rx: number, ry: number, w: number, h: number, r: number) => { p.beginPath(); p.moveTo(rx + r, ry); p.arcTo(rx + w, ry, rx + w, ry + h, r); p.arcTo(rx + w, ry + h, rx, ry + h, r); p.arcTo(rx, ry + h, rx, ry, r); p.arcTo(rx, ry, rx + w, ry, r); p.closePath(); };
  const inked = (p: CanvasRenderingContext2D, w = 2.5) => { p.strokeStyle = INK_LINE; p.lineWidth = w; p.lineJoin = 'round'; p.stroke(); };

  /* ---------- the room, painted once ---------- */
  let room: HTMLCanvasElement | null = null, vignette: HTMLCanvasElement;
  function buildRoom(): void {
    if (room) return;
    const sheet = (w: number, h: number, paint: (p: CanvasRenderingContext2D) => void) => { const s = document.createElement('canvas'); s.width = w * ZOOM; s.height = h * ZOOM; const p = s.getContext('2d') as CanvasRenderingContext2D; p.scale(ZOOM, ZOOM); paint(p); return s; };
    room = sheet(W + 60, H, p => {
      p.translate(0, TOP);
      p.fillStyle = '#2b0f35'; p.fillRect(0, -TOP, W + 60, H);
      /* damask wallpaper */
      for (let row = -4; row < 8; row++) for (let col = 0; col < 13; col++) {
        const dx = col * 56 + (row % 2 ? 28 : 0), dy = row * 44 + 6;
        p.fillStyle = '#3a1548'; p.beginPath(); p.moveTo(dx, dy - 18); p.bezierCurveTo(dx + 16, dy - 4, dx + 12, dy + 12, dx, dy + 20); p.bezierCurveTo(dx - 12, dy + 12, dx - 16, dy - 4, dx, dy - 18); p.fill();
        p.fillStyle = '#2b0f35'; p.beginPath(); p.ellipse(dx, dy + 2, 4, 7, 0, 0, 7); p.fill();
      }
      /* two tall windows and a big moon */
      for (const wx of [120, 500]) {
        const arch = () => { p.beginPath(); p.moveTo(wx - 52, 196); p.lineTo(wx - 52, 70); p.quadraticCurveTo(wx - 52, 24, wx, 10); p.quadraticCurveTo(wx + 52, 24, wx + 52, 70); p.lineTo(wx + 52, 196); p.closePath(); };
        arch(); const g = p.createLinearGradient(0, 10, 0, 196); g.addColorStop(0, '#0f1a4d'); g.addColorStop(1, '#5a2a8c'); p.fillStyle = g; p.fill();
        p.save(); arch(); p.clip();
        p.fillStyle = '#fff'; [[-30, 44], [24, 34], [34, 92], [-18, 120], [10, 66], [-36, 92]].forEach(([sx, sy]) => { p.beginPath(); p.arc(wx + sx, sy, 1.3, 0, 7); p.fill(); });
        if (wx === 500) { const mg = p.createRadialGradient(wx - 8, 62, 4, wx - 8, 62, 62); mg.addColorStop(0, 'rgba(255,245,210,.8)'); mg.addColorStop(1, 'rgba(255,245,210,0)'); p.fillStyle = mg; p.fillRect(wx - 70, 0, 140, 130); p.fillStyle = '#fff4cc'; p.beginPath(); p.arc(wx - 8, 62, 26, 0, 7); p.fill(); p.fillStyle = 'rgba(214,190,140,.5)'; p.beginPath(); p.arc(wx - 16, 54, 5, 0, 7); p.arc(wx + 2, 72, 7, 0, 7); p.fill(); }
        p.restore();
        arch(); p.strokeStyle = '#ff5aae'; p.lineWidth = 5; p.stroke(); arch(); inked(p, 1.5);
        /* curtains */
        for (const dir of [-1, 1]) { p.beginPath(); p.moveTo(wx + dir * 66, 2); p.lineTo(wx + dir * 26, 2); p.quadraticCurveTo(wx + dir * 34, 110, wx + dir * 60, 150); p.quadraticCurveTo(wx + dir * 56, 180, wx + dir * 66, 204); p.closePath(); p.fillStyle = '#b80e63'; p.fill(); inked(p, 2); p.strokeStyle = 'rgba(40,0,30,.4)'; p.lineWidth = 2; p.beginPath(); p.moveTo(wx + dir * 44, 6); p.quadraticCurveTo(wx + dir * 46, 90, wx + dir * 62, 146); p.stroke(); p.fillStyle = '#f7dc6f'; p.fillRect(wx + (dir > 0 ? 44 : -68), 146, 24, 5); }
      }
      /* wall trim, then the table with a lace edge */
      p.fillStyle = '#1c0a24'; p.fillRect(0, 206, W + 60, 8);
      p.fillStyle = '#ff5aae'; p.fillRect(0, 214, W + 60, 2);
      p.fillStyle = '#ffd3e8'; p.fillRect(0, 306, W + 60, 54);
      p.fillStyle = '#ffbcdb'; p.fillRect(0, 306, W + 60, 8);
      p.fillStyle = '#fff6fb'; for (let lx = -6; lx < W + 60; lx += 22) { p.beginPath(); p.arc(lx, 346, 11, 0, Math.PI); p.fill(); }
      p.fillStyle = '#fff6fb'; p.fillRect(0, 338, W + 60, 8);
      p.fillStyle = '#ff8cc8'; for (let lx = 0; lx < W + 60; lx += 22) { p.beginPath(); p.arc(lx - 6, 349, 2.4, 0, 7); p.fill(); }
      p.fillStyle = 'rgba(180,20,100,.14)'; for (let lx = 0; lx < W + 60; lx += 34) { p.beginPath(); p.arc(lx, 322, 3, 0, 7); p.fill(); }
      p.fillStyle = 'rgba(10,0,20,.34)'; p.fillRect(0, 216, W + 60, 90);
    });
    vignette = sheet(W, H, p => { const g = p.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, W * .68); g.addColorStop(0, 'rgba(14,0,20,0)'); g.addColorStop(1, 'rgba(14,0,20,.7)'); p.fillStyle = g; p.fillRect(0, 0, W, H); });
  }
  function chandelier(): void {
    const sway = Math.sin(clock / 1600) * .035;
    c.save(); c.translate(W / 2, -60); c.rotate(sway);
    c.strokeStyle = '#120618'; c.lineWidth = 3; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(0, -TOP); c.lineTo(0, 40); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#d4a017'; c.beginPath(); c.ellipse(0, 46, 62, 7, 0, 0, 7); c.fill(); inked(c, 2);
    c.fillStyle = '#f7dc6f'; c.beginPath(); c.arc(0, 46, 9, 0, 7); c.fill(); inked(c, 2);
    for (const cx of [-52, -26, 0, 26, 52]) {
      c.fillStyle = '#fff6fb'; c.fillRect(cx - 3, 28, 6, 14); c.strokeStyle = INK_LINE; c.lineWidth = 1.2; c.strokeRect(cx - 3, 28, 6, 14);
      const f = Math.sin(clock / 90 + cx) * 1.2;
      const g = c.createRadialGradient(cx, 22, 1, cx, 22, 26); g.addColorStop(0, 'rgba(255,220,130,.75)'); g.addColorStop(1, 'rgba(255,220,130,0)'); c.fillStyle = g; c.fillRect(cx - 26, -4, 52, 52);
      c.fillStyle = '#ffd95e'; c.beginPath(); c.moveTo(cx - 3, 27); c.quadraticCurveTo(cx + f, 14 - f, cx + 3, 27); c.fill();
    }
    c.restore();
  }
  function moonlight(): void {
    c.save(); c.globalCompositeOperation = 'lighter';
    const beam = (bx: number, a: number) => { const g = c.createLinearGradient(0, 20, 0, 306); g.addColorStop(0, 'rgba(190,200,255,' + a + ')'); g.addColorStop(1, 'rgba(190,200,255,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(bx - 40, 30); c.lineTo(bx + 40, 30); c.lineTo(bx - 20, 306); c.lineTo(bx - 130, 306); c.closePath(); c.fill(); };
    beam(500, .11 + .03 * Math.sin(clock / 1800)); beam(120, .05);
    c.restore();
    for (let i = 0; i < 26; i++) {
      const dx = ((i * 83 + clock * .006 * (1 + i % 3)) % W), dy = (i * 47 + Math.sin(clock / 1400 + i) * 8) % 470 - TOP;
      c.fillStyle = 'rgba(255,235,245,' + (.12 + (i % 4) * .08) + ')'; c.beginPath(); c.arc(dx, dy, 1 + (i % 3) * .5, 0, 7); c.fill();
    }
  }

  /* ---------- the character, sitting in the cup ---------- */
  const BOX = { x: -130, y: -70, w: 580, h: 480 }, BAKE = .8, SIT = .27, WAIST = 330;
  const SIT_LAYERS: Layer[] = ['wings', 'hairBack', 'torso', 'bottom', 'top', 'neck', 'arms', 'sleeves', 'head', 'face', 'mark', 'monster', 'hairFront', 'eyewear', 'headwear', 'armsFront'];
  const SIT_POSES: Record<string, Pose> = {
    rest: { id: 'rest', name: '', armL: [62, 30], armR: [62, 30], handL: 'relaxed', handR: 'relaxed', tilt: 3 },
    lay: { id: 'lay', name: '', armL: [150, 175], armR: [58, 30], handL: 'relaxed', handR: 'relaxed', tilt: 24 },
    catch: { id: 'catch', name: '', armL: [112, 160], armR: [112, 160], handL: 'open', handR: 'open' },
    cheer: { id: 'cheer', name: '', armL: [150, 172], armR: [150, 172], handL: 'fist', handR: 'fist', tilt: -4 },
    ouch: { id: 'ouch', name: '', armL: [150, 28], armR: [150, 28], handL: 'open', handR: 'open', tilt: 9 },
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
    const look = (!isAdmin() && currentStudent()?.look) || DOLLS.mumtea.look, key = JSON.stringify(look);
    if (key === bakedKey && art.rest) { done?.(); return; }
    bakedKey = key;
    const turn = ++bakeTurn, names = Object.keys(SIT_POSES), worn: Look = { ...look, hold: 'none', back: 'none' };
    const next = (i: number): void => {
      if (turn !== bakeTurn || i >= names.length) return;
      picture(drawGhoul(worn, { only: SIT_LAYERS, pose: SIT_POSES[names[i]], shaded: true, detail: true, box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') }), Math.round(BOX.w * BAKE), Math.round(BOX.h * BAKE), a => {
        if (turn !== bakeTurn) return;
        art[names[i]] = a;
        if (i === 0) done?.();
        kick(); next(i + 1);
      });
    };
    petArt = null;
    if (look.pet && look.pet !== 'none') picture(drawGhoul(look, { only: ['pet'], box: '245 590 120 120' }), 200, 200, a => { if (turn === bakeTurn) { petArt = a; kick(); } });
    next(0);
  }
  function sitter(pose: string, turn = 0, up = 0): void {
    const a = art[pose] || art.rest;
    if (!a) return;
    c.save(); c.translate(0, up); c.rotate(turn);
    c.drawImage(a, (BOX.x - 160) * SIT, (BOX.y - WAIST) * SIT, BOX.w * SIT, BOX.h * SIT);
    c.restore();
  }

  /* ---------- the teacup and teapot, after the reference shapes ---------- */
  function cupBack(level: number, cold: boolean): void {
    /* saucer */
    c.fillStyle = 'rgba(120,10,70,.28)'; c.beginPath(); c.ellipse(0, 86, 94, 13, 0, 0, 7); c.fill();
    c.fillStyle = '#ff9ccb'; c.beginPath(); c.ellipse(0, 76, 88, 14, 0, 0, 7); c.fill(); inked(c);
    c.strokeStyle = '#fff6fb'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 74, 70, 9.5, 0, 0, 7); c.stroke();
    /* handle */
    c.lineCap = 'round'; c.strokeStyle = INK_LINE; c.lineWidth = 13; c.beginPath(); c.moveTo(54, 10); c.bezierCurveTo(92, 2, 92, 42, 46, 44); c.stroke();
    c.strokeStyle = '#ff7ab8'; c.lineWidth = 8; c.stroke();
    /* inside the cup and the tea */
    c.fillStyle = '#c23f86'; c.beginPath(); c.ellipse(0, 0, 60, 14, 0, 0, 7); c.fill(); inked(c);
    if (level > 0) {
      const ty = (1 - level) * 11, rx = 34 + 22 * level, ry = 5 + 7 * level, wob = Math.sin(clock / 240) * slosh;
      c.save(); c.beginPath(); c.ellipse(0, 0, 58, 12.5, 0, 0, 7); c.clip();
      c.fillStyle = cold ? '#8f9fb8' : '#b5651d'; c.beginPath(); c.ellipse(wob, ty, rx, ry, wob * .012, 0, 7); c.fill();
      c.strokeStyle = cold ? 'rgba(240,250,255,.8)' : 'rgba(255,214,150,.75)'; c.lineWidth = 2; c.beginPath(); c.ellipse(wob, ty, rx * .78, ry * .6, wob * .012, .2, 2.6); c.stroke();
      c.restore();
    }
  }
  function cupFront(): void {
    const body = () => { c.beginPath(); c.moveTo(-60, 0); c.quadraticCurveTo(0, 26, 60, 0); c.bezierCurveTo(58, 34, 40, 56, 24, 62); c.lineTo(28, 72); c.lineTo(-28, 72); c.lineTo(-24, 62); c.bezierCurveTo(-40, 56, -58, 34, -60, 0); c.closePath(); };
    const g = c.createLinearGradient(-60, 0, 60, 0); g.addColorStop(0, '#ffa3d0'); g.addColorStop(.45, '#ff7ab8'); g.addColorStop(1, '#e6559c');
    body(); c.fillStyle = g; c.fill(); inked(c);
    /* lace along the rim, swirling down to a point */
    c.save(); body(); c.clip();
    c.strokeStyle = '#fff6fb'; c.lineWidth = 1.6; c.lineCap = 'round';
    for (let i = -6; i <= 6; i++) {
      const lx = i * 9.4, ly = 8 + (1 - (i * i) / 36) * 12.5, big = Math.abs(i) < 2;
      c.beginPath(); c.arc(lx, ly, big ? 5.5 : 4.2, -1, 4.6); c.stroke();
      c.beginPath(); c.arc(lx, ly + 1, 1.5, 0, 7); c.stroke();
    }
    c.beginPath(); c.moveTo(-60, 2); c.quadraticCurveTo(0, 27, 60, 2); c.stroke();
    c.fillStyle = '#fff6fb'; for (const [dx, dy, r] of [[0, 33, 3.6], [-6, 30, 2.4], [6, 30, 2.4], [0, 39, 2.2]] as Array<[number, number, number]>) { c.beginPath(); c.arc(dx, dy, r, 0, 7); c.fill(); }
    /* the shine that makes it glossy */
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.moveTo(-50, 14); c.quadraticCurveTo(-48, 34, -30, 50); c.quadraticCurveTo(-42, 32, -41, 16); c.closePath(); c.fill();
    c.restore();
    c.strokeStyle = '#ffe1f0'; c.lineWidth = 2; c.beginPath(); c.moveTo(-60, 0); c.quadraticCurveTo(0, 26, 60, 0); c.stroke();
    c.strokeStyle = INK_LINE; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-61, 2); c.quadraticCurveTo(0, 28, 61, 2); c.stroke();
  }
  function steam(cx: number, cy: number, amount: number): void {
    c.save(); c.lineCap = 'round'; c.lineWidth = 3.5;
    for (let i = 0; i < 3; i++) {
      const t = (clock / 2600 + i / 3) % 1;
      c.strokeStyle = 'rgba(255,245,250,' + (amount * .6 * Math.sin(t * Math.PI)) + ')';
      const sx = cx - 34 + i * 34, sy = cy - 8 - t * 26;
      c.beginPath(); c.moveTo(sx, sy); c.bezierCurveTo(sx - 9, sy - 10, sx + 9, sy - 16, sx, sy - 26); c.stroke();
    }
    c.restore();
  }
  const POT_SCALE = .3, POT_CX = 365, POT_CY = 400;
  function teapot(px: number, py: number, turn: number): { x: number; y: number } {
    c.save(); c.translate(px, py); c.rotate(turn); c.scale(POT_SCALE, POT_SCALE); c.translate(-POT_CX, -POT_CY);
    const shape = new Path2D('M32 272C50 258 80 248 96 254C120 270 136 350 165 352C178 352 190 328 205 310C215 300 232 290 234 288V262C260 240 310 235 330 230C328 205 345 197 365 197C385 197 402 205 400 230C430 232 480 245 495 265V290C510 300 525 312 535 320C570 305 610 280 640 283C680 295 705 350 700 400C695 460 640 520 540 540C520 552 505 565 498 570C500 590 480 600 440 612C380 628 300 625 270 612C235 600 225 585 232 570C205 555 190 535 172 515C130 490 95 450 88 405C80 360 85 320 72 295C60 285 40 285 32 272ZM560 365C575 400 575 460 565 495C620 490 665 450 672 405C675 370 660 325 630 315C600 320 570 350 560 365Z');
    const g = c.createLinearGradient(100, 200, 650, 620); g.addColorStop(0, '#ff5fb4'); g.addColorStop(.5, '#e0108f'); g.addColorStop(1, '#a50a68');
    c.fillStyle = g; c.fill(shape, 'evenodd');
    c.strokeStyle = INK_LINE; c.lineWidth = 9; c.lineJoin = 'round'; c.stroke(shape);
    c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(280, 380, 44, 96, .35, 0, 7); c.fill();
    c.strokeStyle = '#fff6fb'; c.lineWidth = 7; c.lineCap = 'round';
    for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(236 + i * 33, 300 + Math.abs(i - 4) * -5 + 12, 13, 0, Math.PI); c.stroke(); }
    c.restore();
    const a = Math.cos(turn), b = Math.sin(turn), dx = (32 - POT_CX) * POT_SCALE, dy = (272 - POT_CY) * POT_SCALE;
    return { x: px + dx * a - dy * b, y: py + dx * b + dy * a };
  }

  /* ---------- what falls ---------- */
  function sugarSkull(d: Drop): void {
    const g0 = c.createRadialGradient(d.x, d.y, 2, d.x, d.y, 30); g0.addColorStop(0, 'rgba(255,190,225,.5)'); g0.addColorStop(1, 'rgba(255,190,225,0)'); c.fillStyle = g0; c.fillRect(d.x - 30, d.y - 30, 60, 60);
    c.save(); c.translate(d.x, d.y); c.rotate(Math.sin(d.phase) * .22); c.scale(.72, .72);
    const g = c.createLinearGradient(-20, -24, 20, 28); g.addColorStop(0, '#fff'); g.addColorStop(1, '#ffc2e0');
    c.beginPath(); c.moveTo(-11, 14); c.lineTo(-11, 24); c.quadraticCurveTo(0, 28, 11, 24); c.lineTo(11, 14); c.bezierCurveTo(26, 8, 28, -6, 25, -12); c.bezierCurveTo(20, -32, -20, -32, -25, -12); c.bezierCurveTo(-28, -6, -26, 8, -11, 14); c.closePath(); c.fillStyle = g; c.fill(); inked(c, 3);
    c.fillStyle = '#1c0a1c'; c.beginPath(); c.ellipse(-10, -3, 7, 8, .15, 0, 7); c.ellipse(10, -3, 7, 8, -.15, 0, 7); c.fill();
    c.fillStyle = '#ff1f8f'; for (const ex of [-10, 10]) { c.beginPath(); c.arc(ex, -3, 2.6, 0, 7); c.fill(); }
    c.fillStyle = '#1c0a1c'; c.beginPath(); c.moveTo(0, 5); c.lineTo(-3, 10); c.lineTo(3, 10); c.fill();
    c.strokeStyle = '#1c0a1c'; c.lineWidth = 1.6; c.beginPath(); for (const tx of [-5, 0, 5]) { c.moveTo(tx, 16); c.lineTo(tx, 24); } c.stroke();
    for (let i = 0; i < 5; i++) { c.save(); c.translate(0, -19); c.rotate(i * Math.PI * .4); c.fillStyle = '#ff5aae'; c.beginPath(); c.ellipse(0, -3.6, 2.4, 3.6, 0, 0, 7); c.fill(); c.restore(); }
    c.fillStyle = '#f7dc6f'; c.beginPath(); c.arc(0, -19, 1.8, 0, 7); c.fill();
    c.fillStyle = '#35dcc8'; for (const [sx, sy] of [[-18, 6], [18, 6], [-17, -14], [17, -14]]) { c.beginPath(); c.arc(sx, sy, 1.8, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.ellipse(-13, -18, 5, 2.4, -.7, 0, 7); c.fill();
    c.restore();
  }
  function bat(d: Drop): void {
    const flap = Math.sin(d.phase * 2.6);
    c.save(); c.translate(d.x, d.y); c.rotate(Math.sin(d.phase) * .14);
    c.fillStyle = 'rgba(255,40,90,.16)'; c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fill();
    for (const dir of [-1, 1]) {
      c.save(); c.scale(dir, 1); c.rotate(flap * .42);
      c.beginPath(); c.moveTo(5, -4); c.quadraticCurveTo(18, -18, 32, -10); c.quadraticCurveTo(26, -3, 27, 6); c.quadraticCurveTo(20, 0, 17, 9); c.quadraticCurveTo(11, 3, 5, 8); c.closePath();
      const g = c.createLinearGradient(0, -14, 0, 10); g.addColorStop(0, '#6a2a9c'); g.addColorStop(1, '#2c0f46'); c.fillStyle = g; c.fill(); inked(c, 2);
      c.restore();
    }
    c.beginPath(); c.moveTo(-8, -6); c.lineTo(-9, -16); c.lineTo(-3, -11); c.lineTo(3, -11); c.lineTo(9, -16); c.lineTo(8, -6); c.closePath(); c.fillStyle = '#2c0f46'; c.fill(); inked(c, 2);
    c.fillStyle = '#3d1a5e'; c.beginPath(); c.arc(0, -2, 10, 0, 7); c.fill(); inked(c, 2);
    c.fillStyle = '#ff2f6d'; c.beginPath(); c.arc(-4, -4, 2.5, 0, 7); c.arc(4, -4, 2.5, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-4, 2); c.lineTo(-2.5, 7); c.lineTo(-1, 2); c.moveTo(1, 2); c.lineTo(2.5, 7); c.lineTo(4, 2); c.fill();
    c.restore();
  }
  function burst(bx: number, by: number, cols: string[], n: number, power: number): void {
    for (let i = 0; i < n; i++) { const a = -Math.PI * Math.random(), v = power * (.4 + Math.random()); bits.push({ x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 450 + Math.random() * 350, col: cols[i % cols.length], size: 1.5 + Math.random() * 2.4 }); }
  }

  /* ---------- writing, in glossy pink ---------- */
  function write(text: string, wx: number, wy: number, size: number, fill: string, align: CanvasTextAlign = 'center'): void {
    c.font = size + 'px "Breath of the House", Impact, fantasy'; c.textAlign = align; c.lineJoin = 'round';
    c.strokeStyle = INK_LINE; c.lineWidth = Math.max(3, size * .2); c.strokeText(text, wx, wy);
    c.fillStyle = fill; c.fillText(text, wx, wy);
  }
  function glossy(gx: number, gy: number, w: number, h: number): void {
    round(c, gx, gy, w, h, h / 2.4);
    const g = c.createLinearGradient(0, gy, 0, gy + h); g.addColorStop(0, '#ff9ccb'); g.addColorStop(1, '#e6339a'); c.fillStyle = g; c.fill();
    c.strokeStyle = '#a50a68'; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.55)'; round(c, gx + 6, gy + 3, w - 12, h * .28, h * .14); c.fill();
  }
  function flourish(fx: number, fy: number, size: number, flip: number): void {
    c.save(); c.translate(fx, fy); c.scale(size, size * flip);
    c.strokeStyle = '#ffb3d9'; c.lineCap = 'round'; c.lineWidth = 3;
    for (const dir of [-1, 1]) { c.save(); c.scale(dir, 1); c.beginPath(); c.moveTo(4, 6); c.bezierCurveTo(24, -8, 46, 12, 62, 2); c.bezierCurveTo(78, -6, 92, 0, 96, 8); c.bezierCurveTo(98, 16, 86, 16, 86, 9); c.moveTo(14, 2); c.bezierCurveTo(16, -10, 32, -10, 30, 0); c.bezierCurveTo(28, 6, 22, 4, 23, 0); c.stroke(); c.restore(); }
    c.fillStyle = '#ff7ab8'; c.beginPath(); c.moveTo(0, 11); c.bezierCurveTo(-9, 3, -6, -4, 0, -1); c.bezierCurveTo(6, -4, 9, 3, 0, 11); c.fill();
    c.restore();
  }
  function hud(): void {
    glossy(14, 12, 112, 38);
    write(String(score), 70, 41, 24, '#fff6fb');
    for (let i = 0; i < 3; i++) {
      c.save(); c.translate(W - 34 - i * 34, 30); c.scale(.3, .3);
      c.globalAlpha = i < lives ? 1 : .28;
      c.strokeStyle = INK_LINE; c.lineWidth = 11; c.lineCap = 'round'; c.beginPath(); c.moveTo(38, -10); c.bezierCurveTo(68, -16, 68, 20, 30, 20); c.stroke(); c.strokeStyle = '#ff7ab8'; c.lineWidth = 6; c.stroke();
      c.beginPath(); c.moveTo(-44, -20); c.lineTo(44, -20); c.bezierCurveTo(44, 16, 22, 36, 0, 36); c.bezierCurveTo(-22, 36, -44, 16, -44, -20); c.closePath(); c.fillStyle = '#ff9ccb'; c.fill(); inked(c, 7);
      c.beginPath(); c.ellipse(0, -20, 44, 9, 0, 0, 7); c.fillStyle = i < lives ? '#b5651d' : '#3a2a3a'; c.fill(); inked(c, 6);
      c.restore();
    }
  }
  function bars(size: number): void { if (size > 0) { c.fillStyle = '#080308'; c.fillRect(0, 0, W, size); c.fillRect(0, H - size, W, size); } }

  /* ---------- one frame ---------- */
  function step(dt: number): void {
    modeT += dt; clock += dt;
    flash = Math.max(0, flash - dt * .003); shake = Math.max(0, shake - dt * .024); cheer = Math.max(0, cheer - dt); ouch = Math.max(0, ouch - dt);
    if (mode === 'pour') {
      x += (W / 2 - x) * Math.min(1, dt * .01); aimX = x; slosh = modeT > 1100 && modeT < 3400 ? 4 : 1.2;
      if (modeT > 1100 && modeT < 3200 && Math.random() < dt * .03) burst(W / 2 + (Math.random() - .5) * 24, CUP_Y + 2, ['#d98a3d', '#ffd9a8', '#fff6fb'], 1, .13);
      if (modeT >= POUR) { mode = 'play'; modeT = 0; stat(); }
    }
    if (mode === 'play') {
      if (keys.ArrowLeft) aimX -= dt * .62;
      if (keys.ArrowRight) aimX += dt * .62;
      aimX = Math.max(70, Math.min(W - 92, aimX));
      const was = x; x += (aimX - x) * Math.min(1, dt * .022); vx = (x - was) / Math.max(dt, 1);
      tilt += (Math.max(-.2, Math.min(.2, vx * .22)) - tilt) * Math.min(1, dt * .012);
      slosh += (Math.min(9, Math.abs(vx) * 14 + .8) - slosh) * Math.min(1, dt * .006);
      const speed = .11 + score * .0035;
      if (Math.random() < dt * (.0016 + score * .00004)) items.push({ x: 26 + Math.random() * (W - 52), y: -24 - TOP, bat: Math.random() < .28 + Math.min(.22, score * .004), spin: 0, phase: Math.random() * 6 });
      items = items.filter(d => {
        d.y += dt * speed; d.phase += dt * .006;
        const far = Math.abs(d.x - x);
        if (d.bat && d.y > CUP_Y - 96 && d.y < CUP_Y + 12 && far < 42) {
          lives--; ouch = 650; stat(); tone(150, .25);
          if (!calm) { shake = 9; flash = .5; }
          burst(d.x, d.y, ['#6a2a9c', '#ff2f6d', '#fff'], 18, .17);
          return false;
        }
        if (!d.bat && d.y > CUP_Y - 22 && d.y < CUP_Y + 16 && far < 62) {
          score++; cheer = 420; slosh = 9; stat(); tone(780, .08);
          burst(d.x, CUP_Y, ['#b5651d', '#ffd9a8', '#fff6fb', '#ff8cc8'], 16, .16);
          pops.push({ x: d.x, y: CUP_Y - 30, text: '+1', life: 0 });
          return false;
        }
        return d.y < 334;
      });
      if (lives <= 0) finish();
    }
    if (mode === 'cold') {
      items.forEach(d => { d.phase += dt * .004; d.y += dt * .03; });
      slosh *= .96;
      if (modeT >= COLD) { mode = 'done'; modeT = 0; items = []; stat(); }
    }
    if (mode === 'idle' || mode === 'done') { x += (W / 2 - x) * Math.min(1, dt * .004); tilt *= .9; aimX = x; slosh = 1; }
    bits = bits.filter(b => { b.life += dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vy += .0005 * dt; return b.life < b.max; });
    pops = pops.filter(p => { p.life += dt; p.y -= dt * .04; return p.life < 800; });
  }
  function paint(): void {
    buildRoom();
    c.save();
    c.translate(0, TOP);
    let zoom = 1, fx = W / 2, fy = CUP_Y;
    if (mode === 'pour') zoom = 1 + .62 * (1 - ease((modeT - 3500) / 1200));
    if (shake > 0) { zoom = Math.max(zoom, 1.04); c.translate(Math.sin(clock * .09) * shake * .6, Math.cos(clock * .11) * shake * .6); }
    if (zoom !== 1) { c.translate(fx, fy); c.scale(zoom, zoom); c.translate(-fx, -fy); }
    c.drawImage(room as HTMLCanvasElement, -30 - (x - W / 2) * .05, -TOP, W + 60, H);
    moonlight();
    chandelier();
    items.forEach(d => (d.bat ? bat(d) : sugarSkull(d)));
    /* the cup and whoever is sitting in it */
    const pourT = mode === 'pour' ? modeT : 9999;
    const level = mode === 'pour' ? ease((modeT - 1100) / 2200) : 1;
    let lean = 0, pose = cheer > 0 ? 'cheer' : ouch > 0 ? 'ouch' : mode === 'play' ? 'catch' : 'rest', up = -4;
    if (mode === 'pour') {
      const sit = ease((modeT - 3700) / 900);
      lean = -1.15 * (1 - sit); pose = sit < .5 ? 'lay' : 'rest';
      up = 22 - level * 20 - sit * 6 + Math.sin(clock / 420) * 1.6;
    }
    if (mode === 'cold' || mode === 'done') { pose = 'ouch'; lean = .16; }
    c.save(); c.translate(x, CUP_Y); c.rotate(tilt);
    cupBack(level, mode === 'cold' || mode === 'done');
    sitter(pose, lean, up);
    cupFront();
    if (petArt) {
      const bob = Math.sin(clock / 500) * 2;
      c.drawImage(petArt, 76, 22 + bob, 40, 40);
    }
    c.restore();
    if (level > .4 && mode !== 'cold' && mode !== 'done') steam(x, CUP_Y - 8, level);
    if (mode === 'pour') {
      const come = ease(pourT / 900), go2 = ease((pourT - 3200) / 700);
      const px = W / 2 + 118 + (1 - come) * 180 + go2 * 220, py = 86 - (1 - come) * 170 - go2 * 90;
      const turn = -(.62 * ease((pourT - 500) / 600)) + .62 * go2;
      const spout = teapot(px, py, turn);
      if (pourT > 1000 && pourT < 3400) {
        const fade = Math.min(1, (pourT - 1000) / 120, (3400 - pourT) / 120), wob = Math.sin(clock / 60) * 2, endY = CUP_Y + (1 - level) * 8;
        c.lineCap = 'round';
        c.strokeStyle = 'rgba(70,30,6,' + fade + ')'; c.lineWidth = 9 * fade; c.beginPath(); c.moveTo(spout.x, spout.y); c.quadraticCurveTo(spout.x - 26, spout.y + 26, W / 2 + wob, endY); c.stroke();
        c.strokeStyle = 'rgba(190,110,40,' + fade + ')'; c.lineWidth = 6 * fade; c.stroke();
        c.strokeStyle = 'rgba(255,214,150,' + fade * .8 + ')'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(spout.x - 1, spout.y); c.quadraticCurveTo(spout.x - 27, spout.y + 26, W / 2 + wob - 1, endY); c.stroke();
      }
    }
    bits.forEach(b => { c.globalAlpha = 1 - b.life / b.max; c.fillStyle = b.col; c.beginPath(); c.arc(b.x, b.y, b.size, 0, 7); c.fill(); }); c.globalAlpha = 1;
    pops.forEach(p => { c.globalAlpha = 1 - p.life / 800; write(p.text, p.x, p.y, 22, '#fff3b0'); }); c.globalAlpha = 1;
    c.restore();
    c.drawImage(vignette, 0, 0, W, H);
    if (flash > 0) { c.fillStyle = 'rgba(90,20,160,' + flash + ')'; c.fillRect(0, 0, W, H); }
    if (mode === 'play') hud();
    if (mode === 'pour') {
      bars(30 * (1 - ease((modeT - 3900) / 900)));
      c.globalAlpha = Math.max(0, Math.min(1, modeT / 300, (POUR - modeT) / 500));
      if (modeT < 3400) { flourish(W / 2, 60, 1, 1); write('TEA TIME', W / 2, 108, 44, '#ff7ab8'); }
      else write('CATCH THE SUGAR SKULLS', W / 2, 150, 32, '#fff6fb');
      c.font = '800 12px Nunito, sans-serif'; c.textAlign = 'right'; c.fillStyle = '#ffd3e8'; c.fillText('Tap to skip', W - 14, H - 11);
      c.globalAlpha = 1;
    }
    if (mode === 'idle') {
      flourish(W / 2, 90, 1, 1);
      write('SPILL PROOF', W / 2, 150, 54, '#ff7ab8');
      flourish(W / 2, 170, 1, -1);
    }
    if (mode === 'done') {
      c.fillStyle = 'rgba(16,4,24,.6)'; c.fillRect(0, 0, W, H);
      flourish(W / 2, 150, 1, 1);
      write('COLD TEA!', W / 2, 212, 58, '#ff7ab8');
      write(score + (score === 1 ? ' SKULL' : ' SKULLS'), W / 2, 254, 26, '#fff6fb');
      c.font = '800 15px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffd3e8'; c.fillText('Best: ' + finalBest, W / 2, 282);
      flourish(W / 2, 300, 1, -1);
    }
  }
  function frame(now: number): void {
    looping = false;
    if (!cv.getClientRects().length) { if (active()) quit(); return; }
    if (paused) return;
    const dt = Math.min(40, now - last); last = now;
    step(dt); paint();
    if (active() || (visible && !calm && document.visibilityState === 'visible')) { looping = true; requestAnimationFrame(frame); }
  }
  function kick(): void {
    if (looping || paused || !cv.getClientRects().length) return;
    looping = true; last = performance.now(); requestAnimationFrame(frame);
  }
  function togglePause(): void {
    if (!active()) return;
    paused = !paused; keys = {};
    musicHold(paused);
    if (paused) {
      paint();
      c.fillStyle = 'rgba(16,4,24,.62)'; c.fillRect(0, 0, W, H);
      write('PAUSED', W / 2, H / 2, 54, '#fff6fb');
      c.font = '800 15px Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffd3e8'; c.fillText('Tap the play icon, or press P, when you are ready', W / 2, H / 2 + 32);
    } else kick();
    stat();
  }
  function finish(): void {
    mode = 'cold'; modeT = 0; flash = 0;
    if (score > store.get<number>('spillBest', 0)) store.set('spillBest', score);
    finalBest = store.get<number>('spillBest', 0);
    award(Math.ceil(score / 2)); submitScore('spill', score); stat();
    go.textContent = 'Play again'; tone(220, .4);
  }
  function quit(): void { paused = false; musicHold(false); mode = 'idle'; items = []; bits = []; pops = []; keys = {}; go.textContent = 'Start'; stat(); }
  go.addEventListener('click', () => {
    dress(() => {
      paused = false; musicHold(false); items = []; bits = []; pops = []; score = 0; lives = 3; x = W / 2; aimX = x; tilt = 0; cheer = 0; ouch = 0; flash = 0; shake = 0;
      mode = 'pour'; modeT = 0; go.textContent = 'Restart'; go.blur(); stat(); tone(330, .3); kick();
    });
  });
  const aim = (e: PointerEvent): void => { const r = cv.getBoundingClientRect(); aimX = (e.clientX - r.left) / r.width * W; };
  cv.addEventListener('pointermove', aim);
  cv.addEventListener('pointerdown', e => { aim(e); if (mode === 'pour' && modeT < 3700) modeT = 3700; });
  addEventListener('keydown', e => { if (isPauseKey(e) && active()) { togglePause(); e.preventDefault(); } });
  addEventListener('keydown', e => { if (!paused && mode === 'play' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { keys[e.key] = true; e.preventDefault(); } });
  addEventListener('keyup', e => { keys[e.key] = false; });
  stops.push(() => { if (active()) quit(); });
  new IntersectionObserver(entries => {
    visible = entries.some(e => e.isIntersecting);
    if (visible) { dress(); kick(); }
  }).observe(cv);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') kick(); });
  stat();
})();
