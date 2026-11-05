/* ---------- Say Fangs: take a picture on your choice of device, get what that device makes, choose to post it ---------- */
type CamOp = [name: 'brightness' | 'contrast' | 'saturate' | 'sepia' | 'hue', amount: number];
/* A sticker sits around the edge of the picture: art, across and down as parts of the picture, width as a part of its shorter side, then its tilt. */
type CamSticker = [art: string, x: number, y: number, size: number, tilt: number];
interface CamFilter { name: string; group: string; ops: CamOp[]; tint?: [colour: string, blend: GlobalCompositeOperation, alpha: number]; vignette?: number; stickers?: CamSticker[] }
const COLOUR = 'Colour filters', PICTURES = 'Picture filters';
const CAM_FILTERS: CamFilter[] = [
  { name: 'No filter', group: COLOUR, ops: [] },
  { name: 'Graveyard', group: COLOUR, ops: [['saturate', 0], ['contrast', 1.25]], vignette: .55 },
  { name: 'Old Bone', group: COLOUR, ops: [['sepia', .75], ['contrast', 1.05], ['brightness', 1.05]], vignette: .3 },
  { name: 'Blood Moon', group: COLOUR, ops: [['saturate', 1.4], ['contrast', 1.1]], tint: ['#ff1f8f', 'soft-light', .55], vignette: .45 },
  { name: 'Bubblegum', group: COLOUR, ops: [['brightness', 1.08], ['saturate', 1.25]], tint: ['#ff7ac0', 'soft-light', .6] },
  { name: 'Moonlit', group: COLOUR, ops: [['saturate', .55], ['brightness', .95]], tint: ['#2f62ff', 'soft-light', .6], vignette: .35 },
  { name: 'Toxic Slime', group: COLOUR, ops: [['hue', 70], ['saturate', 1.4]], tint: ['#8df04a', 'soft-light', .3] },
  { name: 'Ghostly', group: COLOUR, ops: [['brightness', 1.2], ['contrast', .8], ['saturate', .45]], tint: ['#d8fff8', 'screen', .18] },
  { name: 'Midnight Plum', group: COLOUR, ops: [['contrast', 1.15], ['brightness', .85]], tint: ['#6a1f86', 'soft-light', .8], vignette: .5 },
  { name: 'Tea Stain', group: COLOUR, ops: [['sepia', .35], ['saturate', 1.2]], tint: ['#c9812f', 'soft-light', .5] },
  { name: 'Queen of the World', group: PICTURES, ops: [['brightness', 1.05], ['saturate', 1.1]], tint: ['#ff7ac0', 'soft-light', .3], stickers: [['crown', .19, .15, .34, -14], ['star', .74, .13, .48, 6], ['star', .26, .88, .44, -8], ['world', .83, .8, .34, 0]] },
  { name: 'Skull Crew', group: PICTURES, ops: [['brightness', 1.03], ['saturate', 1.1]], stickers: [['crestHijab', .185, .2, .3, -8], ['crestBow', .825, .175, .28, 8], ['crestFlame', .175, .825, .28, 7], ['crestKitty', .825, .83, .28, -7]] },
  { name: 'Gulp', group: PICTURES, ops: [['contrast', 1.05], ['saturate', 1.1]], stickers: [['gulpDop', .18, .17, .3, -8], ['gulpNi', .82, .17, .3, 8], ['gulpLol', .18, .83, .3, 8], ['gulpTn', .82, .83, .3, -8]] },
  { name: 'Money', group: PICTURES, ops: [['saturate', 1.15], ['contrast', 1.05]], tint: ['#f4d35e', 'soft-light', .22], stickers: [['moneyCoin', .17, .17, .28, -8], ['moneyBow', .83, .16, .31, 7], ['moneyGold', .17, .8, .26, 6], ['moneyFan', .83, .78, .25, -7]] },
];
const POLA_W = 640, POLA_H = 780, POLA_X = 72, POLA_Y = 72, POLA_S = 496, MAX_PHOTO = 380000;
const POST_CARD = '#181019';
const POLA_BLURB = 'Snapped at the Say Fangs photo booth.';

const camCss = (f: CamFilter): string => f.ops.map(([n, v]) => (n === 'hue' ? 'hue-rotate(' + v + 'deg)' : n + '(' + v + ')')).join(' ') || 'none';
/* The same sums the browser uses for its picture filters, so the Polaroid matches the screen in every browser. */
function camMatrix([n, v]: CamOp): number[] {
  if (n === 'saturate') return [.213 + .787 * v, .715 - .715 * v, .072 - .072 * v, .213 - .213 * v, .715 + .285 * v, .072 - .072 * v, .213 - .213 * v, .715 - .715 * v, .072 + .928 * v];
  if (n === 'sepia') { const k = 1 - v; return [.393 + .607 * k, .769 - .769 * k, .189 - .189 * k, .349 - .349 * k, .686 + .314 * k, .168 - .168 * k, .272 - .272 * k, .534 - .534 * k, .131 + .869 * k]; }
  const a = v * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
  return [.213 + cs * .787 - sn * .213, .715 - cs * .715 - sn * .715, .072 - cs * .072 + sn * .928, .213 - cs * .213 + sn * .143, .715 + cs * .285 + sn * .14, .072 - cs * .072 - sn * .283, .213 - cs * .213 - sn * .787, .715 - cs * .715 + sn * .715, .072 + cs * .928 + sn * .072];
}
function camShade(c: CanvasRenderingContext2D, w: number, h: number, f: CamFilter): void {
  const img = c.getImageData(0, 0, w, h), d = img.data;
  f.ops.forEach(op => {
    if (op[0] === 'brightness' || op[0] === 'contrast') {
      const mul = op[1], add = op[0] === 'contrast' ? 127.5 * (1 - mul) : 0;
      for (let i = 0; i < d.length; i += 4) { d[i] = d[i] * mul + add; d[i + 1] = d[i + 1] * mul + add; d[i + 2] = d[i + 2] * mul + add; }
      return;
    }
    const m = camMatrix(op);
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      d[i] = m[0] * r + m[1] * g + m[2] * b; d[i + 1] = m[3] * r + m[4] * g + m[5] * b; d[i + 2] = m[6] * r + m[7] * g + m[8] * b;
    }
  });
  c.putImageData(img, 0, 0);
  if (f.tint) { c.save(); c.globalCompositeOperation = f.tint[1]; c.globalAlpha = f.tint[2]; c.fillStyle = f.tint[0]; c.fillRect(0, 0, w, h); c.restore(); }
  if (f.vignette) {
    const size = Math.max(w, h), g = c.createRadialGradient(w / 2, h / 2, size * .318, w / 2, h / 2, size * .707);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + f.vignette + ')');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
}

const stickerDown = (d: CamDevice, y: number): number => (d.clear ? d.clear[0] + y * (d.clear[1] - d.clear[0]) : y);
async function camStickers(c: CanvasRenderingContext2D, pw: number, ph: number, f: CamFilter, d: CamDevice): Promise<void> {
  const art = (f.stickers || []).map(st => { const img = new Image(); img.src = STICKER_ART[st[0]]; return img; });
  await Promise.all(art.map(img => img.decode().catch(() => {})));
  (f.stickers || []).forEach((st, i) => {
    const w = st[3] * Math.min(pw, ph) * (d.clear ? d.clear[2] : 1), h = w * (art[i].naturalHeight / art[i].naturalWidth || 1);
    c.save(); c.translate(st[1] * pw, stickerDown(d, st[2]) * ph); c.rotate(st[4] * Math.PI / 180); c.drawImage(art[i], -w / 2, -h / 2, w, h); c.restore();
  });
}

/* Posts are stored as JPEGs, which cannot be see-through, so a posted picture sits on the colour of the post card behind it. */
function polaroidData(shot: HTMLCanvasElement): string {
  const cv = document.createElement('canvas'); cv.width = shot.width; cv.height = shot.height;
  const c = cv.getContext('2d') as CanvasRenderingContext2D;
  c.fillStyle = POST_CARD; c.fillRect(0, 0, cv.width, cv.height); c.drawImage(shot, 0, 0);
  for (let q = .86; q > .4; q -= .08) { const url = cv.toDataURL('image/jpeg', q); if (url.length <= MAX_PHOTO) return url; }
  return cv.toDataURL('image/jpeg', .4);
}

/* ---------- Polaroids on the timeline: fetched only when a post comes near the screen ---------- */
let photoIds = new Set<string>();
const photoCache = new Map<string, string>();
const photoWatch = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    photoWatch!.unobserve(entry.target);
    showPostPhoto(entry.target as HTMLImageElement);
  });
}, { rootMargin: '600px' }) : null;
async function showPostPhoto(img: HTMLImageElement): Promise<void> {
  const id = img.dataset.post as string;
  if (!photoCache.has(id)) {
    const { data, error } = await sb.from('post_photos').select('photo').eq('post_id', id).maybeSingle();
    if (error || !data) return;
    photoCache.set(id, data.photo);
  }
  img.src = photoCache.get(id) as string;
}
function postPhoto(post: TeaPost): HTMLElement {
  const img = el('img', { cls: 'postpola', alt: 'Photo posted by ' + authorName(post), 'data-post': post.id, width: POLA_W, height: POLA_H }) as HTMLImageElement;
  /* Not every device makes a Polaroid shape: the post takes the shape of its picture once it arrives. */
  img.addEventListener('load', () => { img.style.aspectRatio = img.naturalWidth + '/' + img.naturalHeight; });
  if (photoCache.has(post.id)) img.src = photoCache.get(post.id) as string;
  else if (photoWatch) photoWatch.observe(img);
  else showPostPhoto(img);
  return img;
}

/* ---------- the camera ---------- */
(function () {
  const video = el('video', { cls: 'camlive', autoplay: '', muted: '', playsinline: '', 'aria-label': 'What your camera can see' }) as HTMLVideoElement;
  video.muted = true;
  const tint = el('div', { cls: 'camtint' }), vig = el('div', { cls: 'camvig' }), stickerLayer = el('div', { cls: 'camstickers', 'aria-hidden': 'true' });
  const count = el('div', { cls: 'camcount', 'aria-live': 'assertive' }), flash = el('div', { cls: 'camflash' });
  const wake = el('button', { cls: 'pill camwake', type: 'button' }, 'Turn on camera');
  const screen = el('div', { cls: 'camscreen' }, video, el('div', { cls: 'camsquare' }, tint, vig, stickerLayer), el('div', { cls: 'camside camside-l' }), el('div', { cls: 'camside camside-r' }), count, flash, wake);
  const filterName = el('strong', { cls: 'camfilter' });
  const dial = el('button', { cls: 'camdial', type: 'button' }, el('span', { cls: 'camdialmark' }));
  const timerBtn = el('button', { cls: 'camround', type: 'button', 'aria-pressed': 'false' }, 'Timer');
  const flipBtn = el('button', { cls: 'camround', type: 'button', 'aria-pressed': 'true' }, 'Mirror');
  const shutter = el('button', { cls: 'camshutter', type: 'button', disabled: '', 'aria-label': 'Take the picture' });
  const pad = (cls: string, label: string, mark: string, act: () => void): HTMLElement => el('button', { cls: 'campad ' + cls, type: 'button', 'aria-label': label, onclick: act }, mark);
  const chips = el('div', { cls: 'camchips' });
  const camera = el('div', { cls: 'fangcam' },
    el('div', { cls: 'camtop' },
      el('div', { cls: 'camfinder', 'aria-hidden': 'true' }), el('div', { cls: 'camlights', 'aria-hidden': 'true' }, el('i'), el('i')),
      el('div', { cls: 'cambrand', 'aria-hidden': 'true' }, el('span', { text: 'FG-13' }), el('b', { text: 'Super Scream Shot' })),
      el('div', { cls: 'camzoom' }, el('button', { type: 'button', 'aria-label': 'Zoom out', onclick() { setZoom(zoom - .25); } }, 'W'), el('button', { type: 'button', 'aria-label': 'Zoom in', onclick() { setZoom(zoom + .25); } }, 'T'))),
    el('div', { cls: 'cammain' },
      el('div', { cls: 'cambezel' }, screen, el('div', { cls: 'camname', 'aria-hidden': 'true', text: 'FANGCAM' })),
      el('div', { cls: 'camcontrols' }, dial, filterName, el('div', { cls: 'camrow' }, timerBtn, flipBtn),
        el('div', { cls: 'camring' },
          pad('up', 'Zoom in', '▲', () => setZoom(zoom + .25)), pad('left', 'Previous filter', '◀', () => setFilter(filterAt - 1)),
          shutter, pad('right', 'Next filter', '▶', () => setFilter(filterAt + 1)), pad('down', 'Zoom out', '▼', () => setZoom(zoom - .25))))));
  const printSlot = el('div', { cls: 'polaslot' });
  const cammain = camera.querySelector('.cammain') as HTMLElement, bezel = camera.querySelector('.cambezel') as HTMLElement, controls = camera.querySelector('.camcontrols') as HTMLElement;
  const devBody = el('canvas', { cls: 'devbody', 'aria-hidden': 'true' }) as HTMLCanvasElement;
  const devStage = el('div', { cls: 'devstage' }, devBody), devSide = el('div', { cls: 'devside' }), devWrap = el('div', { cls: 'devwrap', hidden: '' }, devStage, devSide);
  const devPick = el('div', { cls: 'devpick', role: 'group', 'aria-label': 'Pick a device to shoot on' }), devHint = el('p', { cls: 'devhint' });
  const p = makePanel('booth', 'Say Fangs', 'Pick a device, turn on your camera, choose a filter, then press the pink button. Nothing is kept or shared unless you choose to: post it to everyone, save it to your device, or hang it in your private gallery.', [devPick, devHint, chips, camera, devWrap, printSlot], 'Turn on camera');
  gameTools(p.root);
  const gallery = makeGallery();
  p.root.append(gallery.root);

  let device = camDevice(store.get<string>('camDevice', 'fangcam')), stream: MediaStream | null = null, asking = 0, filterAt = 0, zoom = 1, mirror = true, useTimer = false, countdown = 0;
  const live = (): boolean => !!stream;
  const drawSwitch = (): void => {
    p.go.textContent = live() ? 'Turn off camera' : 'Turn on camera';
    wake.hidden = live();
    if (live()) shutter.removeAttribute('disabled'); else shutter.setAttribute('disabled', '');
  };
  const aim = (): void => { video.style.transform = 'scale(' + (mirror ? -zoom : zoom) + ',' + zoom + ')'; };
  function setZoom(z: number): void { zoom = Math.min(3, Math.max(1, z)); aim(); }
  function setFilter(i: number): void {
    filterAt = (i + CAM_FILTERS.length) % CAM_FILTERS.length;
    const f = CAM_FILTERS[filterAt];
    video.style.filter = camCss(f);
    tint.style.background = f.tint ? f.tint[0] : 'none'; tint.style.opacity = f.tint ? String(f.tint[2]) : '0'; tint.style.mixBlendMode = f.tint ? f.tint[1] : 'normal';
    vig.style.background = f.vignette ? 'radial-gradient(circle,transparent 45%,rgba(0,0,0,' + f.vignette + ') 100%)' : 'none';
    stickerLayer.textContent = '';
    (f.stickers || []).forEach((st, n) => stickerLayer.append(el('img', { cls: 'camsticker', src: STICKER_ART[st[0]], alt: '', style: 'left:' + st[1] * 100 + '%;top:' + stickerDown(device, st[2]) * 100 + '%;width:' + st[3] * 100 * Math.min(1, device.polaroid ? 1 : device.sh / device.sw) * (device.clear ? device.clear[2] : 1) + '%;--tilt:' + st[4] + 'deg;animation-delay:' + n * 70 + 'ms' })));
    filterName.textContent = f.name;
    dial.setAttribute('aria-label', 'Filter: ' + f.name + '. Press for the next one.');
    dial.style.setProperty('--turn', filterAt * 360 / CAM_FILTERS.length + 'deg');
    $$('button', chips).forEach((b, n) => b.setAttribute('aria-pressed', String(n === filterAt)));
  }
  [COLOUR, PICTURES].forEach(group => {
    const row = el('div', { cls: 'chips', role: 'group', 'aria-label': group });
    CAM_FILTERS.forEach((f, i) => { if (f.group === group) row.append(el('button', { cls: 'chip', type: 'button', onclick() { setFilter(i); } }, f.name)); });
    chips.append(el('p', { cls: 'camgroup', text: group }), row);
  });

  const shotWords = (caption: string): ShotWords => ({ caption, name: isAdmin() ? DOLLS.mumtea.name : currentStudent()?.name || 'Mystery ghoul', date: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) });
  /* The one screen moves between devices, so the camera keeps running as you switch. */
  function setDevice(id: string): void {
    device = camDevice(id); store.set('camDevice', device.id);
    const d = device;
    devHint.textContent = d.hint;
    $$('button', devPick).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.device === d.id)));
    printSlot.textContent = '';
    if (d.polaroid) {
      camera.hidden = false; devWrap.hidden = true;
      screen.classList.remove('indevice'); screen.removeAttribute('style');
      bezel.prepend(screen); cammain.append(controls);
    } else {
      camera.hidden = true; devWrap.hidden = false;
      const art = drawDeviceShot(d, null, shotWords(''));
      devBody.width = art.width; devBody.height = art.height; devBody.getContext('2d')?.drawImage(art, 0, 0);
      devStage.style.setProperty('--ratio', String(d.w / d.h));
      screen.classList.add('indevice');
      screen.style.left = d.sx / d.w * 100 + '%'; screen.style.top = d.sy / d.h * 100 + '%'; screen.style.width = d.sw / d.w * 100 + '%'; screen.style.height = d.sh / d.h * 100 + '%';
      screen.style.borderRadius = d.sr / d.sw * 100 + '% / ' + d.sr / d.sh * 100 + '%';
      devStage.append(screen); devSide.append(controls);
    }
    setFilter(filterAt);
    if (stream) video.play().catch(() => {});
  }
  document.fonts.load('800 20px Nunito').catch(() => []).then(() => {
    CAM_DEVICES.forEach(d => {
      const pic = el('canvas', { cls: 'devthumb', width: Math.round(d.w / d.h >= 1 ? 120 : 120 * d.w / d.h), height: Math.round(d.w / d.h >= 1 ? 120 * d.h / d.w : 120), 'aria-hidden': 'true' }) as HTMLCanvasElement;
      pic.getContext('2d')?.drawImage(drawDeviceShot(d, null, shotWords('')), 0, 0, pic.width, pic.height);
      devPick.append(el('button', { cls: 'devtile', type: 'button', 'data-device': d.id, 'aria-pressed': d === device, onclick() { setDevice(d.id); } }, el('span', { cls: 'devpic' }, pic), el('small', { text: d.name })));
    });
    setDevice(device.id);
  });

  function stopCamera(): void {
    asking++;
    if (countdown) { clearInterval(countdown); countdown = 0; count.textContent = ''; }
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null; video.srcObject = null; drawSwitch();
  }
  stops.push(stopCamera);
  async function startCamera(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { p.stat.textContent = 'This browser cannot use a camera on this page.'; return; }
    const ticket = ++asking;
    p.stat.textContent = 'Asking your browser for the camera...';
    try {
      const got = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' }, audio: false });
      if (ticket !== asking) { got.getTracks().forEach(t => t.stop()); return; }
      stream = got; video.srcObject = got; await video.play().catch(() => {});
      p.stat.textContent = '';
    } catch (e) {
      if (ticket !== asking) return;
      const name = (e as DOMException).name;
      p.stat.textContent = name === 'NotAllowedError' ? 'The camera is blocked. Allow it from the icon in your address bar, then try again.'
        : name === 'NotFoundError' ? 'No camera was found on this device.'
        : name === 'NotReadableError' ? 'Another app is using your camera. Close it and try again.'
        : 'The camera would not start. Try again.';
    }
    drawSwitch();
  }
  const toggle = (): void => { if (live()) stopCamera(); else startCamera(); };
  p.go.addEventListener('click', toggle); wake.addEventListener('click', toggle);
  dial.addEventListener('click', () => setFilter(filterAt + 1));
  timerBtn.addEventListener('click', () => { useTimer = !useTimer; timerBtn.setAttribute('aria-pressed', String(useTimer)); });
  flipBtn.addEventListener('click', () => { mirror = !mirror; flipBtn.setAttribute('aria-pressed', String(mirror)); aim(); });

  function take(): void {
    if (!live() || countdown) return;
    if (!useTimer) { snap(); return; }
    let left = 3; count.textContent = String(left);
    countdown = window.setInterval(() => {
      left--;
      if (left > 0) { count.textContent = String(left); tone(660, .06); return; }
      clearInterval(countdown); countdown = 0; count.textContent = ''; snap();
    }, 1000);
  }
  shutter.addEventListener('click', take);

  async function snap(): Promise<void> {
    const vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh) { p.stat.textContent = 'The camera is still waking up. Try again in a moment.'; return; }
    tone(1200, .05);
    flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
    const d = device, wide = d.polaroid ? 1 : d.sw / d.sh;
    /* The polaroid is the middle square of the 4:3 screen. Every other device crops to the shape of its own screen. */
    const side = 3 / Math.max(4 / vw, 3 / vh) / zoom;
    const cropW = d.polaroid ? side : (vw / vh > wide ? vh * wide : vw) / zoom, cropH = d.polaroid ? side : (vw / vh > wide ? vh : vw / wide) / zoom;
    const pw = d.polaroid ? POLA_S : Math.round(d.sw * d.s * 1.2), ph = d.polaroid ? POLA_S : Math.round(d.sh * d.s * 1.2);
    const f = CAM_FILTERS[filterAt];
    const paint = (w: number, h: number, sw: number, sh: number): HTMLCanvasElement => {
      const cv = el('canvas', { width: w, height: h }) as HTMLCanvasElement, c = cv.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
      if (mirror) { c.translate(w, 0); c.scale(-1, 1); }
      c.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, w, h);
      c.setTransform(1, 0, 0, 1, 0, 0);
      camShade(c, w, h, f);
      return cv;
    };
    const photo = paint(pw, ph, cropW, cropH);
    /* The gallery always gets a square of the same moment, so a wide or tall device still makes a whole Polaroid. */
    const square = d.polaroid ? photo : paint(POLA_S, POLA_S, side, side);
    await camStickers(photo.getContext('2d') as CanvasRenderingContext2D, pw, ph, f, d);
    if (square !== photo) await camStickers(square.getContext('2d') as CanvasRenderingContext2D, POLA_S, POLA_S, f, camDevice('fangcam'));
    await document.fonts.load('38px "Breath of the House"').catch(() => []);
    await pinCrestsReady();
    showPrint(d, photo, square);
  }

  function showPrint(d: CamDevice, photo: HTMLCanvasElement, square: HTMLCanvasElement): void {
    const takenAt = Date.now(), made = (words: string): HTMLCanvasElement => (d.polaroid ? schoolPolaroid(photo, words, takenAt) : drawDeviceShot(d, photo, shotWords(words)));
    let shot = made(''), url = shot.toDataURL('image/png');
    const full = d.polaroid ? { w: POLA_W, h: POLA_H } : { w: Math.round(d.w * d.s), h: Math.round(d.h * d.s) };
    const img = el('img', { src: url, alt: 'Your ' + d.noun, width: full.w, height: full.h }) as HTMLImageElement;
    const print = el('div', { cls: 'polaprint' + (d.polaroid || d.develop ? '' : ' devshow') }, img);
    if (d.polaroid || d.develop) {
      const paper = el('div', { cls: 'poladevelop', 'aria-hidden': 'true' });
      if (d.develop) { paper.style.left = d.sx / d.w * 100 + '%'; paper.style.top = d.sy / d.h * 100 + '%'; paper.style.width = d.sw / d.w * 100 + '%'; paper.style.height = d.sh / d.h * 100 + '%'; }
      print.append(paper);
    }
    if (full.w > full.h) print.style.width = 'min(100%,520px)';
    const note = el('p', { cls: 'polanote', role: 'status' });
    const caption = el('input', { type: 'text', maxlength: 200, placeholder: 'Add a caption (optional)', 'aria-label': 'Caption for your post' }) as HTMLInputElement;
    const save = el('a', { cls: 'pill ghost', href: url, download: d.polaroid ? 'mumtea-polaroid.png' : 'mumtea-' + d.id + '.png' }, 'Save picture');
    /* Every device writes the caption into the picture itself, so it redraws as you type. */
    let typingAt = 0;
    const redraw = (): void => { clearTimeout(typingAt); typingAt = 0; shot = made(caption.value.trim()); url = shot.toDataURL('image/png'); img.src = url; save.setAttribute('href', url); };
    caption.addEventListener('input', () => { clearTimeout(typingAt); typingAt = window.setTimeout(redraw, 220); });
    const again = el('button', { cls: 'pill ghost', type: 'button', onclick() { printSlot.textContent = ''; camera.scrollIntoView({ block: 'nearest' }); } }, 'Take another');
    const send = el('button', { cls: 'pill', type: 'button' }, 'Post my ' + d.noun);
    const pin = el('button', { cls: 'pill', type: 'button' }, 'Save to gallery');
    pin.addEventListener('click', async () => {
      pin.setAttribute('disabled', ''); note.textContent = 'Printing your Polaroid...';
      try {
        await gallery.add(square, caption.value.trim());
        note.textContent = 'It is in your gallery as a Polaroid. ';
        note.append(el('button', { cls: 'linkish', type: 'button', onclick() { gallery.root.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, 'See it'));
      } catch { pin.removeAttribute('disabled'); note.textContent = 'That did not save to your gallery. This browser may be full or in a private window.'; }
    });
    const actions = el('div', { cls: 'polaacts' }, caption, el('div', { cls: 'row' }, send, pin, save, again), note);
    send.addEventListener('click', async () => {
      if (!canAct()) { note.textContent = 'Log in first to post it. Your ' + d.noun + ' stays here while you do.'; go('registration'); return; }
      if (typingAt) redraw();
      send.setAttribute('disabled', ''); note.textContent = 'Posting...';
      const words = caption.value.trim() || POLA_BLURB;
      const posted = polaroidData(shot);
      const { data, error } = isAdmin() ? await sb.rpc('admin_post_polaroid', { token: adminPass, caption: words, photo: posted }) : await sb.rpc('post_polaroid', { caption: words, photo: posted });
      if (error) {
        send.removeAttribute('disabled');
        note.textContent = error.code === 'PGRST202' ? 'Posting pictures is not switched on yet. You can still save your picture.' : /a day/.test(error.message || '') ? 'That is 30 pictures today. Try again tomorrow.' : 'That did not post. Your ' + d.noun + ' is still here, so try again.';
        return;
      }
      photoCache.set(data, posted);
      caption.setAttribute('disabled', '');
      note.textContent = 'Posted. ';
      note.append(el('button', { cls: 'linkish', type: 'button', onclick() { go('tea', data); } }, 'See it on Spill the Tea'));
      await refreshPosts().catch(() => {});
      redrawPosts(); fillSlide();
    });
    printSlot.textContent = '';
    printSlot.append(print, actions);
    print.scrollIntoView({ block: 'nearest' });
  }

  setFilter(0); drawSwitch(); aim();
})();
