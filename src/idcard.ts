/* ---------- the student ID card: shiny emblems, frames, colours and patterns ---------- */
interface IdCard { emblem: string; metal: string; place: string; size: string; frame: string; frameC: string; colour: string; pattern: string }
const ID_EMBLEMS: Array<[string, string]> = [['i', 'Big bow'], ['b', 'Almond eyes'], ['cc', 'Drippy'], ['d', 'Swoop hair'], ['e', 'Spiky hair'], ['f', 'Bow tie'], ['g', 'Flame crown'], ['ii', 'Snakes'], ['k', 'Icing'], ['l', 'Cat-eye glasses'], ['m', 'Earmuffs'], ['n', 'Tiger kitty'], ['c', 'Masked cat'], ['p', 'Mummy'], ['s', 'Top knot'], ['u', 'Eye swirl'], ['v', 'Fire']];
const ID_METALS: Array<[string, string, string[]]> = [
  ['gold', 'Gold', ['#fff6c2', '#d4a017', '#fff9dc', '#a8770c', '#f7dc6f']],
  ['silver', 'Silver', ['#ffffff', '#9aa0ac', '#f4f6fb', '#6d7280', '#d8dce6']],
  ['rose', 'Rose gold', ['#ffe9ef', '#e88aa8', '#fff4f7', '#b9587a', '#f7b8cf']],
  ['chrome', 'Black chrome', ['#7b7b8a', '#0e0e14', '#a8a8b8', '#14141c', '#44444f']],
  ['holo', 'Holographic', ['#ff9de2', '#9dd6ff', '#b7ffcf', '#fff3a8', '#d5a8ff']],
];
const ID_PLACES: Array<[string, string]> = [['corner', 'Top corner'], ['bottom', 'Bottom corner'], ['photo', 'On my photo']];
const ID_SIZES: Array<[string, string]> = [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']];
const ID_FRAMES: Array<[string, string]> = [['none', 'No frame'], ['zebra', 'Zebra'], ['swirl', 'Swirls'], ['baroque', 'Baroque'], ['curtain', 'Curtains'], ['hearts', 'Hearts']];
const ID_FRAME_COLOURS: Array<[string, string]> = [['Hot pink', '#ff1f8f'], ['Soft pink', '#f58cc4'], ['Purple', '#6a2a9c'], ['Aqua', '#19b7c8'], ['Gold', '#d4a017'], ['Black', '#2c2436']];
const ID_COLOURS: Array<[string, string, string, string]> = [
  ['Cream', '#fff6fb', '#2a1430', '#c80e6e'], ['Blush', '#ffd3e8', '#2a1430', '#b00c5f'], ['Hot pink', '#ff4fa8', '#1c0f22', '#fff6fb'], ['Lilac', '#d9c8f2', '#2a1430', '#6a1f86'],
  ['Aqua', '#a8f0ea', '#10303a', '#0d6b75'], ['Plum', '#3a1250', '#fff6fb', '#ff8cc8'], ['Black', '#14101a', '#fff6fb', '#ff5aae'], ['Holographic', 'holo', '#2a1430', '#8a0f6e'],
];
const ID_PATTERNS: Array<[string, string]> = [['plain', 'Plain'], ['argyle', 'Argyle'], ['stripes', 'Stripes'], ['dots', 'Dots'], ['hearts', 'Hearts'], ['zebra', 'Zebra']];
const ID_PLAIN: IdCard = { emblem: 'none', metal: 'gold', place: 'corner', size: 'm', frame: 'none', frameC: '#ff1f8f', colour: 'Cream', pattern: 'plain' };

/* Other people's cards are drawn into this page too, so only known values get through. */
function normalizeCard(raw: Partial<IdCard> | null | undefined): IdCard {
  const r = raw || {}, oneOf = (v: unknown, ok: string[], d: string): string => (typeof v === 'string' && ok.includes(v) ? v : d);
  return {
    emblem: oneOf(r.emblem, ['none', ...ID_EMBLEMS.map(e => e[0])], 'none'), metal: oneOf(r.metal, ID_METALS.map(m => m[0]), 'gold'), place: oneOf(r.place, ID_PLACES.map(p => p[0]), 'corner'), size: oneOf(r.size, ID_SIZES.map(p => p[0]), 'm'),
    frame: oneOf(r.frame, ID_FRAMES.map(f => f[0]), 'none'), frameC: oneOf(r.frameC, ID_FRAME_COLOURS.map(f => f[1]), '#ff1f8f'), colour: oneOf(r.colour, ID_COLOURS.map(c => c[0]), 'Cream'), pattern: oneOf(r.pattern, ID_PATTERNS.map(p => p[0]), 'plain'),
  };
}

/* ---------- emblems: the cut-out picture, set in a metal rim with a glossy finish ---------- */
const emblemPics: Record<string, HTMLImageElement> = {};
function emblemPicture(id: string): HTMLImageElement {
  if (!emblemPics[id]) { const img = new Image(); img.onerror = () => { delete emblemPics[id]; }; img.src = 'emblems/' + id + '.webp'; emblemPics[id] = img; }
  return emblemPics[id];
}
const EMBLEM_SIZE = 240, EMBLEM_FACE = 192;
function polishEmblem(cv: HTMLCanvasElement, img: HTMLImageElement, metal: string): void {
  const stops = (ID_METALS.find(m => m[0] === metal) || ID_METALS[0])[2], S = EMBLEM_SIZE;
  cv.width = S; cv.height = S;
  const k = EMBLEM_FACE / Math.max(img.naturalWidth, img.naturalHeight) || 1, w = img.naturalWidth * k, h = img.naturalHeight * k, x = (S - w) / 2, y = (S - h) / 2;
  const c = cv.getContext('2d') as CanvasRenderingContext2D;
  const rim = document.createElement('canvas'); rim.width = S; rim.height = S;
  const r = rim.getContext('2d') as CanvasRenderingContext2D;
  for (let a = 0; a < 32; a++) r.drawImage(img, x + Math.cos(a / 32 * Math.PI * 2) * 11, y + Math.sin(a / 32 * Math.PI * 2) * 11, w, h);
  r.globalCompositeOperation = 'source-in';
  const g = r.createLinearGradient(0, 0, S, S); stops.forEach((col, i) => g.addColorStop(i / (stops.length - 1), col));
  r.fillStyle = g; r.fillRect(0, 0, S, S);
  c.drawImage(rim, 0, 0);
  /* a dark groove between the rim and the face */
  c.save(); c.globalAlpha = .55; c.filter = 'brightness(0)';
  for (let a = 0; a < 16; a++) c.drawImage(img, x + Math.cos(a / 16 * Math.PI * 2) * 2.5, y + Math.sin(a / 16 * Math.PI * 2) * 2.5, w, h);
  c.restore();
  c.drawImage(img, x, y, w, h);
  /* enamel: a soft shade low down, and a bright sweep of light across the top */
  c.globalCompositeOperation = 'source-atop';
  const shadeUp = c.createLinearGradient(0, S * .3, 0, S); shadeUp.addColorStop(0, 'rgba(70,30,120,0)'); shadeUp.addColorStop(1, 'rgba(70,30,120,.42)');
  c.fillStyle = shadeUp; c.fillRect(0, 0, S, S);
  const shine = c.createLinearGradient(S * .1, 0, S * .55, S * .6); shine.addColorStop(0, 'rgba(255,255,255,.95)'); shine.addColorStop(.55, 'rgba(255,255,255,.28)'); shine.addColorStop(.56, 'rgba(255,255,255,0)');
  c.fillStyle = shine; c.beginPath(); c.ellipse(S * .44, S * .24, S * .42, S * .22, -.35, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(S * .28, S * .2, S * .05, S * .022, -.7, 0, 7); c.fill();
  c.globalCompositeOperation = 'source-over';
}
function emblemEl(id: string, metal: string, cls = 'emblem', moving = true): HTMLElement {
  const cv = document.createElement('canvas'), img = emblemPicture(id);
  const box = el('span', { cls, 'aria-hidden': 'true' }, cv);
  const ready = () => polishEmblem(cv, img, metal);
  if (img.complete && img.naturalWidth) ready(); else img.addEventListener('load', ready, { once: true });
  if (moving) { const glint = el('i', { cls: 'emblemglint' }); glint.style.setProperty('--art', 'url(emblems/' + id + '.webp)'); box.append(glint); }
  return box;
}

/* ---------- frames ---------- */
const frameArt = (w: number, h: number, body: string, stretch = false): string => "url(\"data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + w + ' ' + h + "'" + (stretch ? " preserveAspectRatio='none'" : '') + '>' + body + '</svg>') + '")';
function drawFrame(card: IdCard, ring: HTMLElement, deco: HTMLElement): void {
  const c = card.frameC, dark = shade(c, -.32), light = shade(c, .42), pale = shade(c, .72), GOLD = '#e6bf4e';
  ring.removeAttribute('style'); deco.removeAttribute('style'); ring.hidden = true;
  const flip = (art: (t: string) => string, n: number) => [art(''), art("transform='translate(" + n + " 0) scale(-1 1)'"), art("transform='translate(0 " + n + ") scale(1 -1)'"), art("transform='translate(" + n + ' ' + n + ") scale(-1 -1)'")];
  const place = (images: string[], where: string[]) => { deco.style.backgroundImage = images.join(','); deco.style.backgroundRepeat = 'no-repeat'; deco.style.backgroundPosition = where.map(w => w.split('/')[0]).join(','); deco.style.backgroundSize = where.map(w => w.split('/')[1]).join(','); };
  if (card.frame === 'zebra') {
    const stripe = (y: number, t: number, a: number, b: number) => "<path fill='" + c + "' d='M0 " + y + 'C50 ' + (y - a) + ' 110 ' + (y + b) + ' 160 ' + y + 'V' + (y + t) + 'C110 ' + (y + t + b * .4) + ' 50 ' + (y + t - a * .4) + ' 0 ' + (y + t) + "Z'/><path fill='" + light + "' opacity='.5' d='M34 " + (y + 1) + 'L92 ' + (y + t * .4) + 'L44 ' + (y + t * .7) + "Z'/>";
    ring.hidden = false;
    ring.style.backgroundImage = frameArt(160, 80, "<rect width='160' height='80' fill='#0c0810'/>" + stripe(2, 13, 6, 4) + stripe(24, 9, -4, 6) + stripe(40, 14, 5, -4) + stripe(62, 11, -5, 5));
    ring.style.backgroundSize = '130px 65px';
    ring.style.padding = '22px';
  }
  if (card.frame === 'swirl') {
    const arm = "<path stroke-width='3.400' d='M8 8C40 6 74 10 112 6'/><path stroke-width='2.600' d='M30 8C36 28 60 34 66 20C69 11 55 8 52 17'/><path stroke-width='2.200' d='M62 9C68 22 86 26 90 17C92 11 83 9 81 14'/><circle cx='52' cy='17' r='2.800' fill='" + c + "' stroke='none'/><circle cx='81' cy='14' r='2.200' fill='" + c + "' stroke='none'/>";
    const corner = (t: string) => frameArt(120, 120, "<g " + t + " fill='none' stroke='" + c + "' stroke-linecap='round'>" + arm + "<g transform='matrix(0 1 1 0 0 0)'>" + arm + "</g><path stroke-width='4' d='M8 8C16 34 38 48 52 40C62 33 54 20 44 25C37 29 41 37 47 35'/><circle cx='47' cy='35' r='3' fill='" + c + "' stroke='none'/></g>");
    place(flip(corner, 120), ['left 4px top 4px/78px 78px', 'right 4px top 4px/78px 78px', 'left 4px bottom 4px/78px 78px', 'right 4px bottom 4px/78px 78px']);
  }
  if (card.frame === 'baroque') {
    const rosette = (x: number, y: number, r: number) => [0, 60, 120, 180, 240, 300].map(a => "<ellipse transform='translate(" + x + ' ' + y + ') rotate(' + a + ")' cy='" + -r * .62 + "' rx='" + r * .36 + "' ry='" + r * .5 + "' fill='" + light + "' stroke='" + dark + "' stroke-width='1'/>").join('') + "<circle cx='" + x + "' cy='" + y + "' r='" + r * .32 + "' fill='" + c + "' stroke='" + dark + "' stroke-width='1'/><circle cx='" + (x - r * .1) + "' cy='" + (y - r * .1) + "' r='" + r * .1 + "' fill='#fff'/>";
    ring.hidden = false;
    ring.style.backgroundImage = frameArt(40, 40, "<rect width='40' height='40' fill='" + c + "'/><rect width='40' height='40' fill='none' stroke='" + dark + "' stroke-width='3'/>" + rosette(20, 20, 15));
    ring.style.backgroundSize = '20px 20px';
    ring.style.padding = '20px';
    ring.style.boxShadow = 'inset 0 0 0 1px ' + dark;
    const corner = (t: string) => frameArt(100, 100, "<g " + t + "><path d='M2 40C2 18 18 2 40 2C58 2 72 8 72 20C72 30 58 30 54 24C60 40 44 56 26 52C30 58 30 72 20 72C8 72 2 58 2 40Z' fill='" + c + "' stroke='" + dark + "' stroke-width='2.500'/><path d='M12 44C10 26 26 10 44 12' fill='none' stroke='" + pale + "' stroke-width='3' stroke-linecap='round'/><ellipse cx='33' cy='33' rx='15' ry='11' transform='rotate(-45 33 33)' fill='" + light + "' stroke='" + dark + "' stroke-width='2'/><ellipse cx='29' cy='29' rx='5' ry='3' transform='rotate(-45 29 29)' fill='#fff'/>" + rosette(66, 12, 10) + rosette(12, 66, 10) + '</g>');
    const centre = frameArt(120, 40, "<path d='M4 30C20 8 40 22 60 6C80 22 100 8 116 30C96 24 80 38 60 34C40 38 24 24 4 30Z' fill='" + c + "' stroke='" + dark + "' stroke-width='2.500'/><path d='M22 26C34 18 46 24 60 14' fill='none' stroke='" + pale + "' stroke-width='2.400' stroke-linecap='round'/>" + rosette(60, 22, 13) + rosette(30, 24, 7) + rosette(90, 24, 7));
    const low = frameArt(120, 40, "<g transform='translate(0 40) scale(1 -1)'><path d='M4 30C20 8 40 22 60 6C80 22 100 8 116 30C96 24 80 38 60 34C40 38 24 24 4 30Z' fill='" + c + "' stroke='" + dark + "' stroke-width='2.500'/>" + rosette(60, 22, 13) + rosette(30, 24, 7) + rosette(90, 24, 7) + '</g>');
    place([...flip(corner, 100), centre, low], ['left -6px top -6px/84px 84px', 'right -6px top -6px/84px 84px', 'left -6px bottom -6px/84px 84px', 'right -6px bottom -6px/84px 84px', 'center top -6px/124px 42px', 'center bottom -6px/124px 42px']);
  }
  if (card.frame === 'curtain') {
    const swag = frameArt(400, 70, "<defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='" + light + "'/><stop offset='1' stop-color='" + c + "'/></linearGradient></defs><path d='M0 0H400V34C370 62 320 60 280 34C250 62 150 62 120 34C80 60 30 62 0 34Z' fill='url(#s)' stroke='" + dark + "' stroke-width='1.500'/><path d='M0 34C30 62 80 60 120 34C150 62 250 62 280 34C320 60 370 62 400 34' fill='none' stroke='" + GOLD + "' stroke-width='3.500'/><path d='M10 16C50 40 90 34 116 18M284 18C310 34 350 40 390 16M132 14C170 38 230 38 268 14M150 6C180 22 220 22 250 6' fill='none' stroke='" + dark + "' stroke-width='1.600' opacity='.55'/><path d='M20 8C50 24 84 22 110 10M290 10C316 22 350 24 380 8' fill='none' stroke='" + pale + "' stroke-width='2' opacity='.8'/>", true);
    const side = (t: string) => frameArt(70, 300, "<defs><linearGradient id='d' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='" + light + "'/><stop offset='.55' stop-color='" + c + "'/><stop offset='1' stop-color='" + dark + "'/></linearGradient></defs><g " + t + "><path d='M0 0H52C50 60 46 100 24 140C44 180 60 240 68 292H0Z' fill='url(#d)' stroke='" + dark + "' stroke-width='1.200'/><path d='M12 8C14 60 12 100 8 138M28 6C28 60 24 100 16 138M12 150C16 200 16 250 12 290M26 150C36 200 42 250 44 290' fill='none' stroke='" + dark + "' stroke-width='1.500' opacity='.5'/><path d='M0 292H68' stroke='" + GOLD + "' stroke-width='6' stroke-dasharray='3 2'/><path d='M0 136C10 146 20 146 30 136' fill='none' stroke='" + GOLD + "' stroke-width='5'/><path d='M12 144V164' stroke='" + GOLD + "' stroke-width='2'/><path d='M6 164H18L21 192H3Z' fill='" + dark + "' stroke='" + GOLD + "' stroke-width='1.500'/><path d='M46 40V96' stroke='" + GOLD + "' stroke-width='1.800'/><circle cx='46' cy='100' r='4' fill='#fff' stroke='" + GOLD + "' stroke-width='1.500'/></g>", true);
    place([swag, side(''), side("transform='translate(70 0) scale(-1 1)'")], ['center top/100% 58px', 'left top/15% 100%', 'right top/15% 100%']);
  }
  if (card.frame === 'hearts') {
    const beads = "stroke='" + c + "' stroke-width='3.600' stroke-linecap='round' stroke-dasharray='.1 5.200' fill='none'";
    const flourish = (t: string) => frameArt(320, 54, "<g " + t + " " + beads + "><path d='M160 44C144 30 124 22 128 10C132 2 150 4 160 18C170 4 188 2 192 10C196 22 176 30 160 44Z'/><path d='M126 30C100 40 60 40 12 24'/><path d='M194 30C220 40 260 40 308 24'/><path d='M86 22C80 10 62 10 64 20C66 28 80 28 88 36'/><path d='M234 22C240 10 258 10 256 20C254 28 240 28 232 36'/></g>");
    place([flourish(''), flourish("transform='translate(0 54) scale(1 -1)'")], ['center top 2px/84% auto', 'center bottom 2px/84% auto']);
  }
}

/* ---------- the card itself ---------- */
let idCardNow: IdCard = { ...ID_PLAIN }, idSaveTimer = 0, idMakerRedraw: () => void = () => {};
const idKey = (): string => 'idcard.' + (isAdmin() ? 'fang' : signedInId() || 'guest');
function currentCard(): IdCard {
  const me = isAdmin() ? null : currentStudent();
  return me?.card || normalizeCard(store.get<Partial<IdCard> | null>(idKey(), null));
}
const ID_TILES: Record<string, (ink: string) => string> = {
  argyle: ink => frameArt(40, 40, "<path d='M20 0L40 20 20 40 0 20Z' fill='" + ink + "' opacity='.16'/><path d='M0 0L40 40M40 0L0 40' stroke='" + ink + "' stroke-width='.8' stroke-dasharray='3 3' opacity='.4'/>"),
  stripes: ink => frameArt(24, 24, "<path d='M-6 6L6 -6M-6 30L30 -6M18 30L30 18' stroke='" + ink + "' stroke-width='6' opacity='.12'/>"),
  dots: ink => frameArt(22, 22, "<circle cx='6' cy='6' r='3.400' fill='" + ink + "' opacity='.16'/><circle cx='17' cy='17' r='3.400' fill='" + ink + "' opacity='.16'/>"),
  hearts: ink => frameArt(34, 34, "<path d='M17 26C5 17 7 8 12 8C15 8 17 11 17 13C17 11 19 8 22 8C27 8 29 17 17 26Z' fill='" + ink + "' opacity='.16'/>"),
  zebra: ink => frameArt(80, 40, "<path d='M0 4C20 0 50 9 80 4V9C50 13 20 5 0 9ZM0 18C30 13 50 22 80 18V25C50 27 30 19 0 25ZM0 32C20 29 60 37 80 32V36C60 40 20 33 0 36Z' fill='" + ink + "' opacity='.18'/>"),
};
const idRing = el('div', { cls: 'idring', hidden: '' }), idDeco = el('div', { cls: 'iddeco' }), idEmblemSlot = el('div', { cls: 'idemblemslot' });
function paintCard(card: IdCard = currentCard()): void {
  idCardNow = card;
  const box = $('#idcard');
  if (!idRing.parentElement) box.prepend(idRing, idDeco);
  if (!idEmblemSlot.parentElement) box.append(idEmblemSlot);
  const [, bg, ink, head] = ID_COLOURS.find(c => c[0] === card.colour) || ID_COLOURS[0];
  box.dataset.frame = card.frame; box.dataset.place = card.place; box.dataset.size = card.size;
  box.classList.toggle('idholo', bg === 'holo');
  box.style.setProperty('--idbg', bg === 'holo' ? '#fff' : bg); box.style.setProperty('--idink', ink); box.style.setProperty('--idhead', head);
  const tile = ID_TILES[card.pattern]?.(ink);
  box.style.setProperty('--idtile', tile || 'none');
  box.style.setProperty('--idtsize', ({ argyle: '40px 40px', stripes: '24px 24px', dots: '22px 22px', hearts: '34px 34px', zebra: '120px 60px' } as Record<string, string>)[card.pattern] || 'auto');
  drawFrame(card, idRing, idDeco);
  idEmblemSlot.textContent = '';
  if (card.emblem !== 'none') idEmblemSlot.append(emblemEl(card.emblem, card.metal, 'emblem idemblem'));
}

/* ---------- the maker under the card ---------- */
(function () {
  const rows = el('div', { cls: 'idrows' }), note = el('p', { cls: 'idnote', role: 'status' });
  const save = el('button', { cls: 'pill idsave', type: 'button' }, 'Save my ID');
  const maker = el('div', { cls: 'idmaker wframe' }, el('h4', { text: 'Customize your ID' }), rows, save, note);
  const said = el('p', { cls: 'idsaid', role: 'status' });
  /* a little skull in a hijab, like the one on the school crest */
  const badge = '<svg viewBox="0 0 64 72" aria-hidden="true"><path d="M32 3C14 3 5 18 6 36C7 50 12 62 4 69H60C52 62 57 50 58 36C59 18 50 3 32 3Z" fill="#f08fb4" stroke="#14101a" stroke-width="3" stroke-linejoin="round"/><path d="M12 24C16 12 26 8 36 9" fill="none" stroke="#ffd0e8" stroke-width="3" stroke-linecap="round"/><path d="M4 69C16 62 22 58 24 52M60 69C48 62 42 58 40 52" fill="none" stroke="#b80e63" stroke-width="2.500"/><path d="M32 15C20 15 15 24 15 33C15 40 19 44 23 46V52H41V46C45 44 49 40 49 33C49 24 44 15 32 15Z" fill="#fff6fb" stroke="#14101a" stroke-width="2.600" stroke-linejoin="round"/><ellipse cx="25" cy="33" rx="5.200" ry="5.800" fill="#14101a"/><ellipse cx="39" cy="33" rx="5.200" ry="5.800" fill="#14101a"/><path d="M32 39L29.500 44H34.500Z" fill="#14101a"/><path d="M28 47V52M32 47V52M36 47V52" stroke="#14101a" stroke-width="1.600"/><circle cx="23.500" cy="31" r="1.400" fill="#fff"/><circle cx="37.500" cy="31" r="1.400" fill="#fff"/></svg>';
  const open = el('button', { cls: 'idopen', type: 'button', hidden: '' }, 'Customize ID');
  open.insertAdjacentHTML('afterbegin', badge);
  let closed = store.get<boolean>('idMakerClosed', false);
  const showMaker = (): void => { maker.hidden = closed; open.hidden = !closed; if (!closed) drawMaker(); };
  function change(key: keyof IdCard, value: string): void {
    const card = { ...idCardNow, [key]: value };
    store.set(idKey(), card);
    const me = isAdmin() ? null : currentStudent();
    if (me) me.card = card;
    paintCard(card);
    drawMaker();
    note.textContent = me ? 'Saving...' : isAdmin() ? 'Saved on this device.' : 'This stays on this device until you register.';
    if (me) {
      clearTimeout(idSaveTimer);
      idSaveTimer = window.setTimeout(async () => {
        const fresh = currentStudent();
        const done = fresh ? await updateMe({ look: fresh.look }).catch(() => false) : false;
        note.textContent = done ? 'Saved to your account.' : 'Saved on this device. It did not reach your account, so try again later.';
      }, 700);
    }
  }
  const row = (label: string, ...kids: HTMLElement[]) => el('div', { cls: 'wrow' }, el('span', { text: label }), ...kids);
  const chips = (key: keyof IdCard, list: Array<[string, string]>) => list.map(([id, name]) => el('button', { cls: 'wchip', type: 'button', 'data-id': key + ':' + id, 'aria-pressed': idCardNow[key] === id, onclick() { change(key, id); } }, name));
  function drawMaker(): void {
    const focused = (document.activeElement as HTMLElement | null)?.dataset?.id;
    rows.textContent = '';
    const tiles = el('div', { cls: 'idtiles' });
    tiles.append(el('button', { cls: 'idtile idnone', type: 'button', 'data-id': 'emblem:none', title: 'No emblem', 'aria-label': 'No emblem', 'aria-pressed': idCardNow.emblem === 'none', onclick() { change('emblem', 'none'); } }, 'None'));
    ID_EMBLEMS.forEach(([id, name]) => tiles.append(el('button', { cls: 'idtile', type: 'button', 'data-id': 'emblem:' + id, title: name, 'aria-label': name, 'aria-pressed': idCardNow.emblem === id, onclick() { change('emblem', id); } }, emblemEl(id, idCardNow.metal, 'emblem', false))));
    rows.append(row('Emblem', tiles), row('Emblem finish', ...chips('metal', ID_METALS.map(m => [m[0], m[1]] as [string, string]))), row('Emblem spot', ...chips('place', ID_PLACES)), row('Emblem size', ...chips('size', ID_SIZES)));
    rows.append(row('Frame', ...chips('frame', ID_FRAMES)));
    if (idCardNow.frame !== 'none') rows.append(row('Frame colour', ...ID_FRAME_COLOURS.map(([name, col]) => {
      const b = el('button', { cls: 'wswatch', type: 'button', 'data-id': 'frameC:' + col, title: name, 'aria-label': name, 'aria-pressed': idCardNow.frameC === col, onclick() { change('frameC', col); } });
      b.style.background = col;
      return b;
    })));
    rows.append(row('Card colour', ...ID_COLOURS.map(([name, bg]) => {
      const b = el('button', { cls: 'wswatch' + (bg === 'holo' ? ' idholoswatch' : ''), type: 'button', 'data-id': 'colour:' + name, title: name, 'aria-label': name, 'aria-pressed': idCardNow.colour === name, onclick() { change('colour', name); } });
      if (bg !== 'holo') b.style.background = bg;
      return b;
    })), row('Pattern', ...chips('pattern', ID_PATTERNS)));
    if (focused) (rows.querySelector('[data-id="' + focused + '"]') as HTMLElement | null)?.focus();
  }
  async function saveCard(): Promise<void> {
    clearTimeout(idSaveTimer);
    closed = true; store.set('idMakerClosed', true); note.textContent = '';
    showMaker();
    open.focus();
    const fresh = isAdmin() ? null : currentStudent();
    if (!fresh) { said.textContent = isAdmin() ? 'Saved on this device.' : 'Saved on this device. Register to keep it.'; return; }
    said.textContent = 'Saving...';
    const done = await updateMe({ look: fresh.look }).catch(() => false);
    said.textContent = done ? 'Saved to your account.' : 'Saved on this device. It did not reach your account, so try again later.';
  }
  save.addEventListener('click', () => { saveCard(); });
  open.addEventListener('click', () => { closed = false; store.set('idMakerClosed', false); said.textContent = ''; showMaker(); maker.scrollIntoView({ block: 'nearest' }); });
  $('#idForm').after(maker, open, said);
  idMakerRedraw = () => { note.textContent = ''; showMaker(); };
})();
