/* ---------- My Polaroids: every saved picture becomes a Polaroid, pegged to a sagging string ---------- */
/* owner: the account it belongs to, or nothing for a guest on this device. remoteId: its copy on the account, once uploaded. */
interface PinnedShot { id: number; blob: Blob; caption: string; at: number; owner?: string | null; remoteId?: string; url?: string }
const PIN_DB = 'mumteaGallery', PIN_STORE = 'polaroids', PIN_BUCKET = 'polaroids';

/* The pictures are too big for the site's usual storage, so they live in the browser's picture-sized one. */
function pinOpen(): Promise<IDBDatabase> {
  return new Promise((done, fail) => {
    const ask = indexedDB.open(PIN_DB, 1);
    ask.onupgradeneeded = () => { ask.result.createObjectStore(PIN_STORE, { keyPath: 'id', autoIncrement: true }); };
    ask.onsuccess = () => done(ask.result);
    ask.onerror = () => fail(ask.error);
  });
}
async function pinDo<T>(mode: IDBTransactionMode, act: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await pinOpen();
  try {
    return await new Promise<T>((done, fail) => {
      const tx = db.transaction(PIN_STORE, mode), ask = act(tx.objectStore(PIN_STORE));
      tx.oncomplete = () => done(ask.result);
      tx.onerror = tx.onabort = () => fail(tx.error);
    });
  } finally { db.close(); }
}

/* Every Polaroid in the school looks the same: the FangCam's print and everything in the gallery. */
const PIN_CRESTS = ['crestHijab', 'crestBow'].map(name => { const img = new Image(); img.src = STICKER_ART[name]; return img; });
const pinCrestsReady = (): Promise<unknown> => Promise.all(PIN_CRESTS.map(img => img.decode().catch(() => {})));
function schoolPolaroid(square: HTMLCanvasElement, caption: string, at: number): HTMLCanvasElement {
  const cv = el('canvas', { width: POLA_W, height: POLA_H }) as HTMLCanvasElement, c = cv.getContext('2d') as CanvasRenderingContext2D;
  c.fillStyle = '#ffe3f1'; c.fillRect(0, 0, POLA_W, POLA_H);
  c.drawImage(square, POLA_X, POLA_Y, POLA_S, POLA_S);
  c.strokeStyle = '#000'; c.lineWidth = 5; c.strokeRect(POLA_X, POLA_Y, POLA_S, POLA_S);
  const CHECK = 16;
  for (let x = 0; x * CHECK < POLA_W; x++) for (let y = 0; y < 2; y++) { c.fillStyle = (x + y) % 2 ? '#ff1f8f' : '#000'; c.fillRect(x * CHECK, POLA_H - (y + 1) * CHECK, CHECK, CHECK); }
  PIN_CRESTS.forEach((img, i) => {
    const h = 124, w = h * (img.naturalWidth / img.naturalHeight || 1), x = i ? POLA_W - 42 - w : 42;
    c.save(); c.translate(x + w / 2, 650); c.rotate(i ? .1 : -.1); c.drawImage(img, -w / 2, -h / 2, w, h); c.restore();
  });
  const words = caption.length > 34 ? caption.slice(0, 33).trimEnd() + '…' : caption;
  c.fillStyle = '#1a0d14'; c.textAlign = 'center';
  c.font = '38px ' + DISPLAY_FONT; c.fillText('MUMTEA HIGH', POLA_W / 2, words ? 628 : 642, 310);
  c.font = '800 19px Nunito, sans-serif';
  if (words) c.fillText(words, POLA_W / 2, 662, 310);
  c.font = '700 16px Nunito, sans-serif'; c.fillText(new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }), POLA_W / 2, words ? 694 : 676, 310);
  c.strokeStyle = '#000'; c.lineWidth = 6; c.strokeRect(3, 3, POLA_W - 6, POLA_H - 6);
  return cv;
}
async function pinPolaroid(square: HTMLCanvasElement, caption: string, at: number): Promise<Blob> {
  await pinCrestsReady();
  const blob = await new Promise<Blob | null>(done => schoolPolaroid(square, caption, at).toBlob(done, 'image/jpeg', .92));
  if (!blob) throw new Error('no picture');
  return blob;
}

/* Phones open their own save and share sheet. Everything else downloads the file. */
async function keepFile(blob: Blob, name: string, title: string): Promise<'shared' | 'cancelled' | 'downloaded'> {
  const file = new File([blob], name, { type: blob.type });
  if (matchMedia('(pointer:coarse)').matches && navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title }); return 'shared'; } catch (err) { if ((err as DOMException).name === 'AbortError') return 'cancelled'; }
  }
  const url = URL.createObjectURL(blob), link = el('a', { href: url, download: name }) as HTMLAnchorElement;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return 'downloaded';
}

/* The string's sums: a spring for the line, a swing for each print. */
const lineClamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
const lineY = (x: number, w: number, y0: number, sag: number): number => { const t = lineClamp(x / w, 0, 1); return y0 + 4 * sag * t * (1 - t); };
const lineNear = (off: number, gap: number, n: number): number => lineClamp(Math.round(off / gap), 0, Math.max(0, n - 1));
function lineSpring(x: number, v: number, target: number, dt: number): [number, number] {
  const k = 70, nv = v + (k * (target - x) - 2 * Math.sqrt(k) * v) * dt;
  return [x + nv * dt, nv];
}
function lineSwing(a: number, w: number, speed: number, dt: number, gain: number): [number, number] {
  const nw = w + (-38 * a - 4.2 * w + speed * .0034 * gain) * dt;
  return [lineClamp(a + nw * dt, -.6, .6), nw];
}

function makeGallery(): { root: HTMLElement; add(square: HTMLCanvasElement, caption: string): Promise<void> } {
  const SAG = 40, Y0 = 26;
  let shots: PinnedShot[] = [], cards: HTMLElement[] = [], active = 0, cw = 280, gap = 302, width = 0;
  let off = 0, vel = 0, target = 0, swingA: number[] = [], swingW: number[] = [], raf = 0, prev = 0, seen = false;
  let drag: { x: number; off: number; lx: number; lt: number; v: number; moved: boolean } | null = null;
  const line = el('div', { cls: 'plstring', 'aria-hidden': 'true' });
  line.innerHTML = '<svg width="100%" height="100%"><path fill="none" stroke="#ff1f8f" stroke-width="3" stroke-linecap="round"/></svg>';
  const path = line.querySelector('path') as SVGPathElement;
  const stage = el('div', { cls: 'plroot', role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'My Polaroids', tabindex: '0' }, line);
  const count = el('span', { cls: 'plcount', 'aria-hidden': 'true' }), title = el('strong', { cls: 'pltitle' }), said = el('p', { cls: 'polanote', role: 'status' });
  const prevBtn = el('button', { cls: 'plarrow', type: 'button', 'aria-label': 'Previous Polaroid', onclick() { step(-1); } }, '◀');
  const nextBtn = el('button', { cls: 'plarrow', type: 'button', 'aria-label': 'Next Polaroid', onclick() { step(1); } }, '▶');
  const keep = el('button', { cls: 'pill', type: 'button', onclick() { keepActive(); } }, 'Save to my device');
  const drop = el('button', { cls: 'pill ghost', type: 'button', onclick() { dropActive(); } }, 'Remove');
  const bar = el('div', { cls: 'plbar' }, el('div', { cls: 'plcap' }, title, count), el('div', { cls: 'placts' }, prevBtn, nextBtn, keep, drop));
  const help = el('p', { cls: 'plhelp' });
  const empty = el('p', { cls: 'plempty', text: 'Nothing on the line yet. Take a picture and press Save to gallery.' });
  const root = el('section', { cls: 'plgallery', 'aria-label': 'My Polaroids' },
    el('h4', { text: 'My Polaroids' }), help, empty, stage, bar, said);
  const calm = (): boolean => matchMedia('(prefers-reduced-motion:reduce)').matches;
  const go = (i: number): void => { target = lineClamp(i, 0, Math.max(0, shots.length - 1)) * gap; };
  const step = (dir: number): void => go(active + dir);

  function showActive(): void {
    const s = shots[active];
    empty.hidden = !!shots.length; stage.hidden = bar.hidden = !shots.length;
    cards.forEach((card, i) => { card.dataset.on = i === active ? '1' : '0'; if (i === active) card.removeAttribute('aria-hidden'); else card.setAttribute('aria-hidden', 'true'); });
    if (!s) return;
    title.textContent = s.caption || new Date(s.at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    count.textContent = (active + 1) + ' of ' + shots.length;
    drop.textContent = 'Remove'; drop.dataset.sure = '';
    (prevBtn as HTMLButtonElement).disabled = active === 0;
    (nextBtn as HTMLButtonElement).disabled = active === shots.length - 1;
  }
  function build(): void {
    cards.forEach(card => card.remove());
    cards = shots.map((s, i) => {
      if (!s.url) s.url = URL.createObjectURL(s.blob);
      const card = el('div', { cls: 'plcard', 'data-i': i }, el('img', { cls: 'plprint', src: s.url, alt: s.caption ? 'Polaroid: ' + s.caption : 'Polaroid from ' + new Date(s.at).toLocaleDateString(), width: POLA_W, height: POLA_H, draggable: 'false' }), el('i', { cls: 'plpeg', 'aria-hidden': 'true' }));
      stage.append(card);
      return card;
    });
    swingA = shots.map(() => 0); swingW = shots.map(() => 0);
    active = lineClamp(active, 0, Math.max(0, shots.length - 1));
    showActive(); measure(); wake();
  }
  function measure(): void {
    const w = stage.clientWidth;
    if (!w) return;
    width = w; cw = Math.round(Math.min(300, w * .66)); gap = cw * 1.08;
    stage.style.setProperty('--pl-cw', cw + 'px'); stage.style.height = Math.round(cw * POLA_H / POLA_W + Y0 + SAG + 34) + 'px';
    off = target = active * gap;
  }
  function frame(now: number): void {
    raf = 0;
    if (!seen || !shots.length) return;
    const dt = Math.min(.033, (now - prev) / 1000); prev = now;
    if (!width) measure();
    let speed: number;
    if (drag && drag.moved) speed = drag.v * 1000;
    else { const before = off; [off, vel] = lineSpring(off, vel, target, dt); speed = -(off - before) / Math.max(dt, .001); }
    const gain = calm() ? 0 : 1, near = lineNear(off, gap, shots.length);
    cards.forEach((card, i) => {
      const x = width / 2 + i * gap - off;
      if (x < -cw * 1.5 || x > width + cw * 1.5) { card.style.visibility = 'hidden'; return; }
      card.style.visibility = 'visible';
      let [a, w] = lineSwing(swingA[i], swingW[i], speed, dt, gain);
      if (gain) a += Math.sin(now / 1300 + i * 1.7) * .0009;
      swingA[i] = a; swingW[i] = w;
      card.style.transform = 'translate(' + (x - cw / 2).toFixed(1) + 'px,' + (lineY(x, width, Y0, SAG) - 6).toFixed(1) + 'px) rotate(' + a.toFixed(4) + 'rad)';
      card.style.zIndex = String(i === near ? shots.length + 1 : shots.length - Math.abs(i - near));
    });
    path.setAttribute('d', 'M0 ' + Y0 + ' Q' + width / 2 + ' ' + (Y0 + 2 * SAG) + ' ' + width + ' ' + Y0);
    if (near !== active) { active = near; showActive(); }
    raf = requestAnimationFrame(frame);
  }
  function wake(): void { if (!raf && seen && shots.length) { prev = performance.now(); raf = requestAnimationFrame(frame); } }

  new ResizeObserver(() => { if (stage.clientWidth !== width) measure(); wake(); }).observe(stage);
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; wake(); }).observe(stage);
  stage.addEventListener('pointerdown', e => { drag = { x: e.clientX, off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false }; });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; stage.dataset.drag = '1'; stage.setPointerCapture(e.pointerId); }
    if (!drag.moved) return;
    drag.v = .7 * ((e.clientX - drag.lx) / Math.max(1, e.timeStamp - drag.lt)) + .3 * drag.v;
    drag.lx = e.clientX; drag.lt = e.timeStamp;
    const most = (shots.length - 1) * gap;
    let to = drag.off - dx;
    if (to < 0) to *= .35;
    if (to > most) to = most + (to - most) * .35;
    off = to;
  });
  const letGo = (e: PointerEvent): void => {
    const d = drag; drag = null;
    if (!d) return;
    if (d.moved) { stage.dataset.drag = ''; vel = -d.v * 1000; go(lineNear(off - d.v * 180, gap, shots.length)); return; }
    const card = (e.target as HTMLElement).closest('[data-i]');
    if (card) go(Number(card.getAttribute('data-i')));
  };
  stage.addEventListener('pointerup', letGo); stage.addEventListener('pointercancel', letGo);
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); else return;
    e.preventDefault();
  });

  async function keepActive(): Promise<void> {
    const s = shots[active];
    if (!s) return;
    const name = 'mumtea-polaroid-' + new Date(s.at).toISOString().slice(0, 10) + '-' + s.id + '.jpg';
    said.textContent = 'Getting your Polaroid...';
    try {
      const how = await keepFile(s.blob, name, 'My Mumtea High Polaroid');
      said.textContent = how === 'cancelled' ? '' : how === 'shared' ? 'Your Polaroid is ready.' : 'Saved. Look for ' + name + ' in your downloads or photos.';
    } catch { said.textContent = 'That picture would not save. Please try again.'; }
  }
  async function dropActive(): Promise<void> {
    const s = shots[active];
    if (!s) return;
    if (drop.dataset.sure !== '1') { drop.dataset.sure = '1'; drop.textContent = 'Press again to remove'; return; }
    try {
      if (s.remoteId && canSync()) {
        const path = signedInId() + '/' + s.remoteId + '.jpg', gone = await sb.storage.from(PIN_BUCKET).remove([path]);
        if (gone.error) throw gone.error;
        const row = await sb.from('gallery_polaroids').delete().eq('id', s.remoteId);
        if (row.error) throw row.error;
      }
      await pinDo('readwrite', st => st.delete(s.id));
      if (s.url) URL.revokeObjectURL(s.url);
      shots.splice(active, 1); said.textContent = 'Removed from your gallery.';
      build();
    } catch { said.textContent = 'That Polaroid would not come off the line. Please try again.'; }
  }
  /* Whose gallery this is: an account, Ms. Fangtastic on her code (kept on this device), or a guest. */
  const ownerNow = (): string | null => (isAdmin() ? 'fang' : signedInId() || null);
  const canSync = (): boolean => backendReady && !isAdmin() && !!signedInId();
  const clean = (s: PinnedShot): PinnedShot => { const { url, ...rest } = s; void url; return rest; };
  const allLocal = (): Promise<PinnedShot[]> => pinDo<PinnedShot[]>('readonly', st => st.getAll() as IDBRequest<PinnedShot[]>);
  function showHelp(): void { help.textContent = 'Every picture you save hangs here as a Polaroid. Drag the line or use the arrows. ' + (canSync() ? 'They are private to your account, and follow you to any device you log in on.' : 'They stay on this device. Log in to keep them on your account, on every device.'); }
  async function loadShots(): Promise<void> {
    const me = ownerNow(), keep = shots;
    const mine = (await allLocal()).filter(s => (s.owner ?? null) === me).sort((a, b) => b.at - a.at);
    keep.forEach(s => { if (s.url) URL.revokeObjectURL(s.url); });
    shots = mine; active = Math.min(active, Math.max(0, shots.length - 1)); build();
  }
  let syncing = false, syncAgain = false;
  /* Local pictures go up, pictures from other devices come down, and anything removed elsewhere goes here too. */
  async function sync(): Promise<void> {
    if (!canSync()) return;
    if (syncing) { syncAgain = true; return; }
    syncing = true;
    const me = signedInId() as string;
    try {
      const everything = await allLocal();
      for (const s of everything) if ((s.owner ?? null) === null) { s.owner = me; await pinDo('readwrite', st => st.put(s)); }
      const { data, error } = await sb.from('gallery_polaroids').select('id, caption, taken_at');
      if (error) return;
      const rows = data as Array<{ id: string; caption: string; taken_at: string }>, ids = new Set(rows.map(r => r.id));
      const local = everything.filter(s => s.owner === me), known = new Set(local.map(s => s.remoteId));
      for (const s of local) {
        if (s.remoteId && !ids.has(s.remoteId)) { await pinDo('readwrite', st => st.delete(s.id)); continue; }
        if (s.remoteId) continue;
        const made = await sb.from('gallery_polaroids').insert({ caption: s.caption.slice(0, 200), taken_at: new Date(s.at).toISOString() }).select('id').single();
        if (made.error) continue;
        const up = await sb.storage.from(PIN_BUCKET).upload(me + '/' + made.data.id + '.jpg', s.blob, { contentType: 'image/jpeg' });
        if (up.error) { await sb.from('gallery_polaroids').delete().eq('id', made.data.id); continue; }
        s.remoteId = made.data.id; known.add(s.remoteId); await pinDo('readwrite', st => st.put(s));
      }
      for (const r of rows) {
        if (known.has(r.id)) continue;
        const down = await sb.storage.from(PIN_BUCKET).download(me + '/' + r.id + '.jpg');
        if (down.error || !down.data) continue;
        const record = { blob: down.data as Blob, caption: r.caption, at: new Date(r.taken_at).getTime(), owner: me, remoteId: r.id };
        await pinDo('readwrite', st => st.add(record));
      }
      if (signedInId() === me) await loadShots();
    } catch { /* offline: the pictures stay here and try again next time */ } finally {
      syncing = false;
      if (syncAgain) { syncAgain = false; sync(); }
    }
  }
  let seenOwner: string | null | undefined;
  function watchOwner(): void {
    const me = ownerNow();
    if (me === seenOwner) return;
    seenOwner = me; showHelp();
    loadShots().then(sync).catch(() => { build(); said.textContent = 'This browser cannot keep a gallery. A private window is the usual reason.'; });
  }
  window.setInterval(watchOwner, 2500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  window.setTimeout(watchOwner, 0);
  showActive();
  return {
    root,
    async add(square, caption) {
      const at = Date.now(), blob = await pinPolaroid(square, caption, at), record: Omit<PinnedShot, 'id'> = { blob, caption, at, owner: ownerNow() };
      const id = await pinDo('readwrite', st => st.add(record)) as number;
      shots.unshift({ id, ...record });
      active = 0; build(); sync();
    },
  };
}
