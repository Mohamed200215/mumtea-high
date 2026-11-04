/* ---------- Say Fangs: take a picture on your choice of device, get what that device makes, choose to post it ---------- */
type CamOp = [name: 'brightness' | 'contrast' | 'saturate' | 'sepia' | 'hue', amount: number];
/* A sticker sits around the edge of the picture: art, across, down and size as parts of the picture, then its tilt. */
type CamSticker = [art: string, x: number, y: number, size: number, tilt: number];
interface CamFilter { name: string; group: string; ops: CamOp[]; tint?: [colour: string, blend: GlobalCompositeOperation, alpha: number]; vignette?: number; stickers?: CamSticker[] }
const COLOUR = 'Colour filters', SPOOKY = 'Spooky stickers', CUTE = 'Cute stickers';
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
  { name: 'Haunted', group: SPOOKY, ops: [['saturate', .6], ['contrast', 1.12]], tint: ['#35dcc8', 'soft-light', .3], vignette: .5, stickers: [['web', .13, .13, .27, 0], ['ghost', .87, .15, .24, 10], ['bat', .1, .52, .17, -14], ['spider', .91, .55, .14, 12], ['pumpkin', .13, .87, .25, -8], ['ghost', .87, .85, .19, -10]] },
  { name: 'Coffin Club', group: SPOOKY, ops: [['saturate', .25], ['contrast', 1.2]], vignette: .6, stickers: [['crossbones', .13, .13, .23, -10], ['ball', .87, .13, .21, 8], ['candle', .09, .55, .18, -4], ['skull', .91, .52, .17, 12], ['coffin', .15, .85, .27, -10], ['headstone', .85, .85, .26, 6]] },
  { name: 'Bloodsucker', group: SPOOKY, ops: [['saturate', 1.2], ['contrast', 1.15], ['brightness', .92]], tint: ['#c00028', 'soft-light', .6], vignette: .6, stickers: [['moon', .13, .13, .24, -12], ['bat', .85, .12, .25, 12], ['blood', .08, .47, .13, 0], ['blood', .93, .38, .11, 0], ['dagger', .12, .84, .24, -20], ['bat', .87, .82, .22, -14]] },
  { name: 'Sweetheart', group: CUTE, ops: [['brightness', 1.06], ['saturate', 1.15]], tint: ['#ff7ac0', 'soft-light', .4], stickers: [['ribbon', .14, .13, .25, -14], ['heart', .87, .14, .24, 12], ['sparkles', .08, .52, .15, 0], ['heart', .92, .55, .14, -10], ['strawberry', .13, .86, .22, -12], ['lollipop', .87, .84, .25, 14]] },
  { name: 'Bunny Tea', group: CUTE, ops: [['brightness', 1.05], ['sepia', .12]], tint: ['#fff0c0', 'soft-light', .4], stickers: [['bunny', .13, .14, .25, -10], ['blossom', .87, .12, .21, 10], ['blossom', .08, .54, .14, -18], ['sparkles', .92, .5, .15, 0], ['cup', .14, .85, .25, -6], ['cake', .86, .85, .24, 8]] },
  { name: 'Daydream', group: CUTE, ops: [['brightness', 1.08], ['saturate', 1.1]], tint: ['#a8c8ff', 'soft-light', .35], stickers: [['rainbow', .16, .16, .28, -8], ['star', .87, .13, .22, 12], ['butterfly', .09, .53, .16, -14], ['sparkles', .92, .55, .15, 0], ['kitty', .14, .86, .25, -8], ['butterfly', .86, .85, .22, 14]] },
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

async function camStickers(c: CanvasRenderingContext2D, pw: number, ph: number, f: CamFilter): Promise<void> {
  const art = (f.stickers || []).map(st => { const img = new Image(); img.src = STICKER_ART[st[0]]; return img; });
  await Promise.all(art.map(img => img.decode().catch(() => {})));
  (f.stickers || []).forEach((st, i) => {
    const w = st[3] * Math.min(pw, ph);
    c.save(); c.translate(st[1] * pw, st[2] * ph); c.rotate(st[4] * Math.PI / 180); c.drawImage(art[i], -w / 2, -w / 2, w, w); c.restore();
  });
}

/* ---------- the Polaroid frame, hand-drawn in the school's colours ---------- */
function drawPolaroid(photo: HTMLCanvasElement): HTMLCanvasElement {
  const cv = el('canvas', { width: POLA_W, height: POLA_H }) as HTMLCanvasElement, c = cv.getContext('2d') as CanvasRenderingContext2D;
  let seed = 7;
  const jig = (): number => { seed = (seed * 16807) % 2147483647; return (seed / 2147483647 - .5) * 2.6; };
  const sketch = (pts: number[][], width = 5, colour = '#000'): void => {
    c.lineCap = c.lineJoin = 'round'; c.strokeStyle = colour; c.lineWidth = width; c.beginPath();
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length], steps = Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 26);
      if (!i) c.moveTo(p[0], p[1]);
      for (let s = 1; s <= steps; s++) c.lineTo(p[0] + (q[0] - p[0]) * s / steps + (s < steps ? jig() : 0), p[1] + (q[1] - p[1]) * s / steps + (s < steps ? jig() : 0));
    });
    c.closePath(); c.stroke();
  };
  const ticks = (colour: string, lines: number[][]): void => {
    c.strokeStyle = colour; c.lineWidth = 7; c.lineCap = 'round';
    lines.forEach(l => { c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke(); });
  };
  const heart = (x: number, y: number, s: number): void => {
    c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-.12);
    c.beginPath(); c.moveTo(0, 18); c.bezierCurveTo(-30, -4, -24, -26, -10, -24); c.bezierCurveTo(-4, -24, 0, -18, 0, -13); c.bezierCurveTo(0, -18, 5, -24, 11, -24); c.bezierCurveTo(25, -26, 30, -4, 0, 18); c.closePath();
    c.fillStyle = '#ff1f8f'; c.fill(); c.strokeStyle = '#000'; c.lineWidth = 4.5; c.lineJoin = 'round'; c.stroke();
    c.fillStyle = '#ffd0e8'; c.beginPath(); c.ellipse(-12, -13, 4, 2.8, -.6, 0, 7); c.fill();
    c.restore();
  };
  const star = (x: number, y: number, r: number): void => {
    c.save(); c.translate(x, y); c.rotate(.2); c.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * .48 : r; c.lineTo(Math.cos(a) * d, Math.sin(a) * d); }
    c.closePath(); c.fillStyle = '#35dcc8'; c.fill(); c.strokeStyle = '#000'; c.lineWidth = 4.5; c.lineJoin = 'round'; c.stroke(); c.restore();
  };
  const bat = (x: number, y: number, s: number): void => {
    c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-.14); c.fillStyle = '#3a1250'; c.strokeStyle = '#000'; c.lineWidth = 4; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-8, -6); c.quadraticCurveTo(-30, -26, -54, -14); c.quadraticCurveTo(-46, -4, -48, 8); c.quadraticCurveTo(-37, 1, -30, 12); c.quadraticCurveTo(-21, 5, -13, 16); c.lineTo(13, 16);
    c.quadraticCurveTo(21, 5, 30, 12); c.quadraticCurveTo(37, 1, 48, 8); c.quadraticCurveTo(46, -4, 54, -14); c.quadraticCurveTo(30, -26, 8, -6); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-14, -8); c.lineTo(-17, -29); c.lineTo(-5, -18); c.lineTo(5, -18); c.lineTo(17, -29); c.lineTo(14, -8); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, -4, 17, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#ff1f8f'; c.beginPath(); c.arc(-6.5, -7, 3.6, 0, 7); c.arc(6.5, -7, 3.6, 0, 7); c.fill();
    c.fillStyle = '#fff6fb'; c.beginPath(); c.moveTo(-6, 3); c.lineTo(-3, 9); c.lineTo(-1, 3); c.moveTo(1, 3); c.lineTo(3, 9); c.lineTo(6, 3); c.fill();
    c.restore();
  };
  const skull = (x: number, y: number, s: number): void => {
    c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-.1); c.fillStyle = '#fff6fb'; c.strokeStyle = '#000'; c.lineWidth = 4.5; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-14, 16); c.lineTo(-14, 28); c.lineTo(14, 28); c.lineTo(14, 16); c.bezierCurveTo(30, 10, 34, -6, 30, -14); c.bezierCurveTo(24, -38, -24, -38, -30, -14); c.bezierCurveTo(-34, -6, -30, 10, -14, 16); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#000'; c.beginPath(); c.ellipse(-12, -3, 8, 9, .15, 0, 7); c.ellipse(12, -3, 8, 9, -.15, 0, 7); c.fill();
    c.beginPath(); c.moveTo(0, 7); c.lineTo(-4, 14); c.lineTo(4, 14); c.fill();
    c.lineWidth = 3; c.beginPath(); c.moveTo(-5, 20); c.lineTo(-5, 28); c.moveTo(5, 20); c.lineTo(5, 28); c.stroke();
    c.fillStyle = '#ff7ab8'; c.beginPath(); c.arc(-19, 9, 5, 0, 7); c.arc(19, 9, 5, 0, 7); c.fill();
    c.translate(21, -27); c.fillStyle = '#ff1f8f'; c.lineWidth = 3.5;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(-17, -11); c.lineTo(-17, 11); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(0, 0); c.lineTo(17, -11); c.lineTo(17, 11); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill(); c.stroke();
    c.restore();
  };

  c.fillStyle = '#f9e9a6'; c.fillRect(28, 28, 584, 724);
  c.fillStyle = 'rgba(255,31,143,.1)'; c.fillRect(28, 568, 584, 184);
  sketch([[28, 28], [612, 28], [612, 752], [28, 752]], 6);
  c.drawImage(photo, POLA_X, POLA_Y, POLA_S, POLA_S);
  sketch([[POLA_X, POLA_Y], [POLA_X + POLA_S, POLA_Y], [POLA_X + POLA_S, POLA_Y + POLA_S], [POLA_X, POLA_Y + POLA_S]], 5);
  bat(62, 54, 1); ticks('#ff1f8f', [[122, 18, 130, 7], [132, 30, 148, 24]]);
  heart(586, 58, 1.1); ticks('#35dcc8', [[585, 92, 607, 92], [572, 102, 588, 114]]);
  skull(112, 668, 1.15); ticks('#19b7e8', [[168, 660, 192, 654], [168, 684, 190, 694]]);
  heart(506, 640, 1); star(556, 694, 34); ticks('#ff1f8f', [[462, 668, 482, 674], [468, 696, 488, 690]]);
  c.fillStyle = '#2a1420'; c.textAlign = 'center';
  c.font = '38px ' + DISPLAY_FONT; c.fillText('MUMTEA HIGH', POLA_W / 2, 662, 240);
  c.font = '800 18px Nunito, sans-serif'; c.fillText(new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }), POLA_W / 2, 692, 240);
  return cv;
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
  const p = makePanel('booth', 'Say Fangs', 'Pick a device, turn on your camera, choose a filter or some stickers, then press the pink button. Your picture stays on this device unless you choose to post it.', [devPick, devHint, chips, camera, devWrap, printSlot], 'Turn on camera');

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
    (f.stickers || []).forEach((st, n) => stickerLayer.append(el('img', { cls: 'camsticker', src: STICKER_ART[st[0]], alt: '', style: 'left:' + st[1] * 100 + '%;top:' + st[2] * 100 + '%;width:' + st[3] * 100 + '%;--tilt:' + st[4] + 'deg;animation-delay:' + n * 70 + 'ms' })));
    filterName.textContent = f.name;
    dial.setAttribute('aria-label', 'Filter: ' + f.name + '. Press for the next one.');
    dial.style.setProperty('--turn', filterAt * 360 / CAM_FILTERS.length + 'deg');
    $$('button', chips).forEach((b, n) => b.setAttribute('aria-pressed', String(n === filterAt)));
  }
  [COLOUR, SPOOKY, CUTE].forEach(group => {
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
    const photo = el('canvas', { width: pw, height: ph }) as HTMLCanvasElement, c = photo.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    if (mirror) { c.translate(pw, 0); c.scale(-1, 1); }
    c.drawImage(video, (vw - cropW) / 2, (vh - cropH) / 2, cropW, cropH, 0, 0, pw, ph);
    c.setTransform(1, 0, 0, 1, 0, 0);
    const f = CAM_FILTERS[filterAt];
    camShade(c, pw, ph, f);
    await camStickers(c, pw, ph, f);
    await document.fonts.load('38px "Breath of the House"').catch(() => []);
    showPrint(d, photo);
  }

  function showPrint(d: CamDevice, photo: HTMLCanvasElement): void {
    const made = (words: string): HTMLCanvasElement => (d.polaroid ? drawPolaroid(photo) : drawDeviceShot(d, photo, shotWords(words)));
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
    /* Most devices write the caption into the picture itself, so it redraws as you type. */
    let typingAt = 0;
    const redraw = (): void => { clearTimeout(typingAt); typingAt = 0; shot = made(caption.value.trim()); url = shot.toDataURL('image/png'); img.src = url; save.setAttribute('href', url); };
    if (!d.polaroid) caption.addEventListener('input', () => { clearTimeout(typingAt); typingAt = window.setTimeout(redraw, 220); });
    const again = el('button', { cls: 'pill ghost', type: 'button', onclick() { printSlot.textContent = ''; camera.scrollIntoView({ block: 'nearest' }); } }, 'Take another');
    const send = el('button', { cls: 'pill', type: 'button' }, 'Post my ' + d.noun);
    const actions = el('div', { cls: 'polaacts' }, caption, el('div', { cls: 'row' }, send, save, again), note);
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
