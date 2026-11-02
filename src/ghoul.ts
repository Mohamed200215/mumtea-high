/* ---------- cartoon ghouls: original, layered, dressable ---------- */
interface Look {
  skin: string; eye: string; lip: string; shadow: string;
  hairStyle: string; hair: string; streak: string;
  monster: string; headwear: string; hold: string;
  top: string; topC: string; topP: string; trim: string;
  bottom: string; bottomC: string; bottomP: string;
  legs: string; legsC: string;
  shoes: string; shoesC: string;
}
type Layer = 'wings' | 'hairBack' | 'legs' | 'legwear' | 'pants' | 'shoes' | 'torso' | 'bottom' | 'top' | 'arms' | 'sleeves' | 'hold' | 'head' | 'face' | 'monster' | 'hairFront' | 'headwear';
const LAYER_ORDER: Layer[] = ['wings', 'hairBack', 'legs', 'legwear', 'pants', 'shoes', 'torso', 'bottom', 'top', 'arms', 'sleeves', 'hold', 'head', 'face', 'monster', 'hairFront', 'headwear'];
const INK = '#1c0f22';

const SKINS = ['#d9c8f2', '#f4cfae', '#c98f63', '#7d5136', '#a8dcf0', '#b8f0d0', '#f7b8cf', '#e9e4d6'];
const HAIR_COLOURS = ['#17101c', '#5a2c17', '#a0392a', '#f4d35e', '#f6f0ff', '#f08fb4', '#ff1f8f', '#19b7e8', '#35dcc8', '#8a2be2'];
const BRIGHT = ['#14101a', '#fff6fb', '#ff1f8f', '#f08fb4', '#6a1f86', '#19b7e8', '#35dcc8', '#8df04a', '#f4d35e', '#c0392b'];
const PATTERNS: Array<[string, string]> = [['solid', 'Plain'], ['stripes', 'Stripes'], ['argyle', 'Argyle'], ['tartan', 'Tartan'], ['skulls', 'Skulls']];

interface WardrobePage {
  title: string; key?: keyof Look; items?: Array<[string, string]>;
  colours: Array<[keyof Look, string, string[]]>; pattern?: keyof Look;
  box: string; layers: Layer[];
}
const HEAD_BOX = '62 8 196 206';
const WARDROBE: WardrobePage[] = [
  { title: 'Hair', key: 'hairStyle', items: [['long', 'Long'], ['pony', 'High pony'], ['twins', 'Twin tails'], ['bob', 'Bob'], ['curls', 'Curls'], ['side', 'Side sweep'], ['buns', 'Space buns'], ['hijab', 'Hijab']], colours: [['hair', 'Colour', HAIR_COLOURS], ['streak', 'Streak or folds', BRIGHT]], box: '10 0 300 330', layers: ['hairBack', 'head', 'hairFront'] },
  { title: 'Face', colours: [['skin', 'Skin', SKINS], ['eye', 'Eyes', ['#19b7e8', '#35dcc8', '#8df04a', '#ffb703', '#c77dff', '#ff1f8f', '#7a4a21']], ['shadow', 'Eyeshadow', ['#ff1f8f', '#6a1f86', '#19b7e8', '#35dcc8', '#f4d35e', '#14101a']], ['lip', 'Lips', ['#b80e63', '#ff1f8f', '#d62828', '#5a0f7a', '#14101a', '#b5694f']]], box: HEAD_BOX, layers: ['head', 'face'] },
  { title: 'Monster side', key: 'monster', items: [['none', 'Just me'], ['fangs', 'Vampire fangs'], ['bat', 'Bat wings'], ['wolf', 'Wolf ears'], ['fins', 'Sea fins'], ['bolts', 'Neck bolts'], ['wraps', 'Mummy wraps'], ['horns', 'Little horns'], ['stitches', 'Stitches']], colours: [], box: '0 0 320 330', layers: ['wings', 'head', 'face', 'monster'] },
  { title: 'Tops', key: 'top', items: [['tank', 'Tank'], ['tee', 'Bat tee'], ['stripey', 'Off-shoulder'], ['corset', 'Puff corset'], ['varsity', 'Varsity'], ['hoodie', 'Crop hoodie'], ['blouse', 'Collar blouse'], ['tunic', 'Long tunic']], colours: [['topC', 'Colour', BRIGHT], ['trim', 'Trim', BRIGHT]], pattern: 'topP', box: '40 215 240 225', layers: ['top', 'sleeves'] },
  { title: 'Bottoms', key: 'bottom', items: [['pleats', 'Pleated mini'], ['tutu', 'Tutu'], ['shred', 'Shredded'], ['pencil', 'Pencil'], ['maxi', 'Long skirt'], ['flares', 'Flares'], ['skinny', 'Skinnies'], ['shorts', 'Shorts']], colours: [['bottomC', 'Colour', BRIGHT]], pattern: 'bottomP', box: '40 320 240 395', layers: ['pants', 'bottom'] },
  { title: 'Legwear', key: 'legs', items: [['bare', 'Bare'], ['tights', 'Tights'], ['stripes', 'Striped'], ['argyle', 'Argyle'], ['fishnet', 'Fishnets'], ['knee', 'Knee socks'], ['thigh', 'Thigh highs']], colours: [['legsC', 'Colour', BRIGHT]], box: '60 370 200 340', layers: ['legs', 'legwear'] },
  { title: 'Shoes', key: 'shoes', items: [['heels', 'Strappy'], ['platform', 'Platforms'], ['combat', 'Combat'], ['knee', 'Tall boots'], ['sneaker', 'High tops'], ['mary', 'Mary Janes']], colours: [['shoesC', 'Colour', BRIGHT]], box: '60 520 200 200', layers: ['shoes'] },
  { title: 'Headwear', key: 'headwear', items: [['none', 'None'], ['bow', 'Big bow'], ['tiara', 'Tiara'], ['hat', 'Tiny hat'], ['flower', 'Flower'], ['hoops', 'Hoops'], ['clip', 'Skull clip']], colours: [], box: HEAD_BOX, layers: ['headwear'] },
  { title: 'In hand', key: 'hold', items: [['none', 'Nothing'], ['cup', 'Teacup'], ['purse', 'Purse'], ['skull', 'Skull bag'], ['wand', 'Wand'], ['phone', 'iCoffin']], colours: [], box: '20 370 110 130', layers: ['hold'] },
];

const FANG_LOOK: Look = { skin: '#d9c8f2', eye: '#35dcc8', lip: '#b80e63', shadow: '#ff1f8f', hairStyle: 'hijab', hair: '#f08fb4', streak: '#ff1f8f', monster: 'bat', headwear: 'none', hold: 'cup', top: 'corset', topC: '#14101a', topP: 'solid', trim: '#ff1f8f', bottom: 'tutu', bottomC: '#ff1f8f', bottomP: 'solid', legs: 'argyle', legsC: '#19b7e8', shoes: 'platform', shoesC: '#14101a' };

function randomLook(): Look {
  const look = { ...FANG_LOOK, hairStyle: 'long' };
  for (const page of WARDROBE) {
    if (page.key && page.items) look[page.key] = page.items[Math.floor(Math.random() * page.items.length)][0];
    for (const [key, , values] of page.colours) look[key] = values[Math.floor(Math.random() * values.length)];
    if (page.pattern) look[page.pattern] = Math.random() < .6 ? 'solid' : PATTERNS[1 + Math.floor(Math.random() * 4)][0];
  }
  look.hold = 'none';
  return look;
}
/* Characters saved before this art existed get a fresh outfit but keep any part that still fits. */
function normalizeLook(raw: Partial<Look> | undefined): Look {
  const fresh = randomLook(), out = { ...fresh };
  if (!raw) return out;
  for (const page of WARDROBE) {
    const keep = (key: keyof Look, ok: (v: string) => boolean) => { const v = raw[key]; if (typeof v === 'string' && ok(v)) out[key] = v; };
    if (page.key && page.items) keep(page.key, v => page.items!.some(i => i[0] === v));
    for (const [key] of page.colours) keep(key, v => /^#[0-9a-f]{6}$/i.test(v));
    if (page.pattern) keep(page.pattern, v => PATTERNS.some(p => p[0] === v));
  }
  return out;
}

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const part = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amount > 0 ? (255 - v) * amount : v * amount))));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => part(v).toString(16).padStart(2, '0')).join('');
}
const contrast = (hex: string): string => (parseInt(hex.slice(1, 3), 16) * .3 + parseInt(hex.slice(3, 5), 16) * .59 + parseInt(hex.slice(5, 7), 16) * .11 > 140 ? INK : '#fff6fb');
const strokeLine = (d: string, width: number, colour: string, extra = '') => `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const shape = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" ${extra}/>`;
let ghoulCounter = 0;

function drawGhoul(o: Look, opt: { head?: boolean; label?: string; only?: Layer[]; box?: string } = {}): string {
  const uid = 'g' + (++ghoulCounter);
  let defs = '';
  const texture = (kind: string, a: string, b: string, name: string): string => {
    if (kind === 'solid' || !kind) return a;
    const id = uid + name;
    const inner = ({
      stripes: [18, 18, `<rect width="18" height="18" fill="${a}"/><rect width="18" height="9" fill="${b}"/>`],
      argyle: [34, 34, `<rect width="34" height="34" fill="${a}"/><path d="M17 0L34 17 17 34 0 17z" fill="${b}"/><path d="M0 0L34 34M34 0L0 34" stroke="${contrast(b)}" stroke-width="1" stroke-dasharray="3 3"/>`],
      tartan: [28, 28, `<rect width="28" height="28" fill="${a}"/><rect width="10" height="28" fill="${b}" opacity=".55"/><rect width="28" height="10" fill="${b}" opacity=".55"/><path d="M19 0v28M0 19h28" stroke="${contrast(a)}" stroke-width="1"/>`],
      skulls: [30, 30, `<rect width="30" height="30" fill="${a}"/><circle cx="15" cy="13" r="6" fill="${b}"/><rect x="11.5" y="17" width="7" height="4" fill="${b}"/><circle cx="12.8" cy="13" r="1.5" fill="${a}"/><circle cx="17.2" cy="13" r="1.5" fill="${a}"/>`],
      fishnet: [13, 13, `<path d="M0 0L13 13M13 0L0 13" stroke="${a}" stroke-width="1.5"/>`],
    } as Record<string, [number, number, string]>)[kind];
    if (!inner) return a;
    defs += `<pattern id="${id}" width="${inner[0]}" height="${inner[1]}" patternUnits="userSpaceOnUse">${inner[2]}</pattern>`;
    return `url(#${id})`;
  };
  const other = (c: string): string => (c === o.trim ? (contrast(c) === INK ? '#14101a' : '#fff6fb') : o.trim);
  const topFill = texture(o.topP, o.topC, other(o.topC), 't');
  const bottomFill = texture(o.bottomP, o.bottomC, other(o.bottomC), 'b');
  const S = o.skin, SD = shade(S, -.14), parts: Partial<Record<Layer, string>> = {};
  const hair = o.hair, hairD = shade(hair, -.22), hairL = shade(hair, .24);

  /* ---------- legs: drawn once, mirrored for the other side ---------- */
  const LEG = 'M118 378C112 430 120 480 127 524C124 566 130 612 135 654L151 654C154 612 158 566 155 524C162 470 166 420 162 384Z';
  const clipId = uid + 'c';
  defs += `<clipPath id="${clipId}k"><rect x="90" y="522" width="100" height="200"/></clipPath><clipPath id="${clipId}t"><rect x="90" y="446" width="100" height="280"/></clipPath>`;
  const legsSide = (inner: string) => `<g transform="rotate(3 140 380)">${inner}</g><g transform="translate(320 0) scale(-1 1) rotate(3 140 380)">${inner}</g>`;
  const wearFill = ({ tights: o.legsC, stripes: texture('stripes', o.legsC, contrast(o.legsC) === INK ? '#14101a' : '#fff6fb', 'l'), argyle: texture('argyle', o.legsC, contrast(o.legsC) === INK ? '#6a1f86' : '#ff1f8f', 'a'), fishnet: texture('fishnet', o.legsC === '#fff6fb' ? '#14101a' : o.legsC, '', 'f'), knee: o.legsC, thigh: o.legsC } as Record<string, string>)[o.legs];
  parts.legs = legsSide(shape(LEG, S) + strokeLine('M128 524q14 6 26 0', 1.6, SD));
  if (wearFill) {
    const clip = o.legs === 'knee' ? `clip-path="url(#${clipId}k)"` : o.legs === 'thigh' ? `clip-path="url(#${clipId}t)"` : '';
    const band = o.legs === 'knee' ? shape('M125 522h31v13h-31z', o.trim) : o.legs === 'thigh' ? shape('M117 446h46v13h-46z', o.trim) : '';
    parts.legwear = legsSide(shape(LEG, wearFill, clip) + band);
  }

  /* ---------- shoes ---------- */
  const foot = `M133 648L153 648C156 668 160 684 158 698L128 698C126 684 130 668 133 648Z`;
  const sole = (y: number, h: number, c = '#14101a') => `<path d="M122 ${y}h42q5 0 5 5v${h - 8}q0 3-5 3h-42q-5 0-5-3v-${h - 8}q0-5 5-5z" fill="${c}" stroke="${INK}" stroke-width="2.6"/>`;
  const shaft = (top: number) => `M131 ${top}L157 ${top}C160 ${top + 60} 162 660 162 700L124 700C124 660 128 ${top + 60} 131 ${top}Z`;
  const C = o.shoesC, CL = shade(C, .2), lace = contrast(C);
  parts.shoes = legsSide(({
    heels: shape(foot, S) + strokeLine('M131 660l26 6M129 678l30 2', 5, C) + sole(696, 12, C),
    platform: shape(`M130 628L156 628C158 660 162 680 162 700L124 700C124 680 128 660 130 628Z`, C) + strokeLine('M131 650h24', 4, CL) + sole(696, 22, o.trim),
    combat: shape(shaft(590), C) + [604, 620, 636, 652, 668].map(y => strokeLine(`M136 ${y}h14`, 2.4, lace)).join('') + shape(`M126 698h34l6 10h-46z`, '#14101a') + strokeLine('M131 590h26', 5, CL),
    knee: shape(shaft(530), C) + strokeLine('M138 540l-2 150', 2, CL) + strokeLine('M130 532h28', 5, o.trim) + sole(696, 18, '#14101a'),
    sneaker: shape(shaft(612), C) + [626, 642, 658].map(y => strokeLine(`M135 ${y}h16`, 2.4, lace)).join('') + `<circle cx="144" cy="676" r="7" fill="${o.trim}" stroke="${INK}" stroke-width="2"/>` + sole(696, 14, '#fff6fb'),
    mary: shape(foot, S) + shape('M127 674C136 666 150 666 159 674L160 698L126 698Z', C) + strokeLine('M130 664l26 4', 4, C) + `<circle cx="151" cy="666" r="3" fill="${o.trim}"/>` + sole(696, 16, '#14101a'),
  } as Record<string, string>)[o.shoes] || '');

  /* ---------- body ---------- */
  parts.torso = shape('M148 186L148 232Q160 240 172 232L172 186Z', SD) + shape('M116 244Q138 232 148 232Q160 240 172 232Q182 232 204 244L194 296Q186 318 184 338Q198 360 204 390L116 390Q122 360 136 338Q134 318 126 296Z', S);

  const hipPiece = 'M136 332L184 332Q198 356 205 392L162 402L158 402L115 392Q122 356 136 332Z';
  const waistband = strokeLine('M136 336Q160 342 184 336', 6, o.trim);
  const pantsLeg = (d: string) => legsSide(shape(d, bottomFill));
  if (o.bottom === 'flares') parts.pants = pantsLeg('M114 376C108 430 116 480 122 524C118 590 112 650 102 704L172 704C168 640 162 580 160 524C168 470 168 420 165 384Z');
  if (o.bottom === 'skinny') parts.pants = pantsLeg('M114 376C108 430 116 480 124 524C121 566 127 612 132 640L154 640C157 612 161 566 158 524C165 470 168 420 165 384Z');
  if (o.bottom === 'shorts') parts.pants = pantsLeg('M112 376C106 410 110 440 112 466L164 466C168 440 168 410 165 384Z') + legsSide(strokeLine('M113 460h50', 4, o.trim));
  parts.bottom = ({
    pleats: shape('M136 332L184 332L226 450Q160 474 94 450Z', bottomFill) + [112, 130, 150, 170, 190, 208].map((x, i) => strokeLine(`M${146 + i * 6} 346L${x} 456`, 1.6, INK, 'opacity=".5"')).join('') + strokeLine('M96 450Q160 474 224 450', 5, o.trim) + waistband,
    tutu: shape('M138 332L182 332L240 420Q226 440 204 428Q192 452 168 436Q152 456 130 434Q108 448 96 426Q80 434 80 420Z', shade(o.bottomC, .28)) + shape('M138 332L182 332L224 402Q206 420 190 406Q172 428 154 410Q134 426 118 406Q104 416 96 402Z', bottomFill) + waistband,
    shred: shape('M136 332L184 332L216 440L200 424L190 462L172 432L158 470L142 430L126 458L116 424L102 444Z', bottomFill) + waistband,
    pencil: shape('M136 332L184 332Q204 372 200 420L196 490L124 490L120 420Q116 372 136 332Z', bottomFill) + strokeLine('M124 482h72', 5, o.trim) + waistband,
    maxi: shape('M136 332L184 332C210 430 232 560 246 672Q160 696 74 672C88 560 110 430 136 332Z', bottomFill) + strokeLine('M78 668Q160 692 242 668', 6, o.trim) + strokeLine('M150 350C142 460 124 580 112 670M170 350C178 460 196 580 208 670', 1.6, INK, 'opacity=".4"') + waistband,
    flares: shape(hipPiece, bottomFill) + waistband,
    skinny: shape(hipPiece, bottomFill) + waistband,
    shorts: shape(hipPiece, bottomFill) + waistband,
  } as Record<string, string>)[o.bottom] || '';

  /* ---------- tops and arms ---------- */
  const SH_L = 'M124 250L94 330L74 404', SH_R = 'M196 250L238 322L206 374';
  const arm = (d: string, w: number, c: string, extra = '') => strokeLine(d, w + 5.2, INK) + strokeLine(d, w, c, extra);
  parts.arms = arm(SH_L, 15, S) + arm(SH_R, 15, S)
    + `<ellipse cx="70" cy="418" rx="9" ry="15" transform="rotate(14 70 418)" fill="${S}" stroke="${INK}" stroke-width="2.6"/>`
    + `<ellipse cx="200" cy="384" rx="10" ry="13" transform="rotate(30 200 384)" fill="${S}" stroke="${INK}" stroke-width="2.6"/>`;
  const SHORT_L = 'M124 250L106 298', SHORT_R = 'M196 250L220 292';
  const sleeve = ({ tee: 'short', stripey: 'long', corset: 'puff', varsity: 'long', hoodie: 'long', blouse: 'long', tunic: 'long' } as Record<string, string>)[o.top];
  if (sleeve === 'long') {
    parts.sleeves = arm(SH_L, 21, topFill) + arm(SH_R, 21, topFill) + strokeLine('M66 400l18 8', 7, o.trim) + strokeLine('M200 360l12 14', 7, o.trim);
  } else if (sleeve === 'short') {
    parts.sleeves = arm(SHORT_L, 22, topFill) + arm(SHORT_R, 22, topFill) + strokeLine('M98 292l17 8', 5, o.trim) + strokeLine('M211 300l16-10', 5, o.trim);
  } else if (sleeve === 'puff') {
    const puff = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="24" ry="22" fill="${topFill}" stroke="${INK}" stroke-width="2.6"/>` + strokeLine(`M${x - 12} ${y - 14}Q${x} ${y} ${x - 10} ${y + 14}M${x + 10} ${y - 15}Q${x} ${y} ${x + 11} ${y + 13}`, 1.6, INK, 'opacity=".55"') + strokeLine(`M${x - 16} ${y + 18}q16 8 32 0`, 5, o.trim);
    parts.sleeves = puff(110, 262) + puff(210, 262);
  }
  parts.top = ({
    tank: strokeLine('M132 254L128 238M188 254L192 238', 6, o.topC) + shape('M130 252Q160 288 190 252L194 296Q186 318 186 344L134 344Q134 318 126 296Z', topFill) + strokeLine('M132 340h56', 5, o.trim),
    tee: shape('M116 246Q134 236 146 240Q160 256 174 240Q186 236 204 246L194 296Q186 318 186 346L134 346Q134 318 126 296Z', topFill) + `<path d="M160 280c-5-7-18-9-24-3 6 1 8 7 7 11 5-3 11-3 17 3 6-6 12-6 17-3-1-4 1-10 7-11-6-6-19-4-24 3z" fill="${o.trim}"/>` + strokeLine('M146 241Q160 256 174 241', 4, o.trim),
    stripey: shape('M116 266Q160 280 204 266L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + strokeLine('M116 266Q160 280 204 266', 5, o.trim),
    corset: shape('M126 262Q142 248 160 268Q178 248 194 262L190 298Q182 322 192 356L128 356Q138 322 130 298Z', topFill) + strokeLine('M160 270V352', 2, o.trim) + [282, 296, 310, 324, 338].map(y => strokeLine(`M152 ${y}L168 ${y + 8}M168 ${y}L152 ${y + 8}`, 1.8, o.trim)).join('') + strokeLine('M127 262Q142 250 160 268Q178 250 193 262', 4, o.trim),
    varsity: shape('M114 246Q136 232 148 234L160 300L172 234Q184 232 206 246L198 300Q190 330 194 360L126 360Q130 330 122 300Z', topFill) + strokeLine('M148 236L160 300L172 236', 6, o.trim) + strokeLine('M127 354h66', 7, o.trim) + strokeLine('M160 300V358', 2, INK),
    hoodie: shape('M126 236Q160 214 194 236L188 256Q160 266 132 256Z', shade(o.topC, -.14)) + shape('M114 246Q134 238 148 250Q160 258 172 250Q186 238 206 246L196 298Q190 314 190 322L130 322Q130 314 124 298Z', topFill) + strokeLine('M152 256v22M168 256v22', 2.6, o.trim) + strokeLine('M132 318h56', 6, o.trim),
    blouse: shape('M116 246Q136 234 148 228L172 228Q184 234 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + shape('M146 226Q160 234 160 246Q146 256 134 240ZM174 226Q160 234 160 246Q174 256 186 240Z', o.trim) + [266, 290, 314].map(y => `<circle cx="160" cy="${y}" r="3" fill="${o.trim}" stroke="${INK}" stroke-width="1.2"/>`).join(''),
    tunic: shape('M116 246Q136 234 148 226L172 226Q184 234 204 246L196 300Q196 340 214 426Q160 442 106 426Q124 340 124 300Z', topFill) + strokeLine('M108 422Q160 438 212 422', 5, o.trim) + strokeLine('M148 228Q160 240 172 228', 4, o.trim),
  } as Record<string, string>)[o.top] || '';

  /* ---------- in her hand ---------- */
  parts.hold = ({
    cup: `<path d="M78 416h34v10c0 14-8 22-17 22s-17-8-17-22z" fill="#fff6fb" stroke="${INK}" stroke-width="2.6"/><ellipse cx="95" cy="416" rx="17" ry="4.5" fill="#b80e63" stroke="${INK}" stroke-width="2"/><path d="M111 422h5a6 6 0 010 13h-7" fill="none" stroke="#fff6fb" stroke-width="4"/><circle cx="90" cy="430" r="2" fill="${INK}"/><circle cx="100" cy="430" r="2" fill="${INK}"/>` + strokeLine('M88 408q-3-5 0-10M99 408q-3-5 0-10', 2.4, '#35dcc8'),
    purse: strokeLine('M56 432q12-22 26 0', 3, INK) + shape('M46 432h46l6 36q-29 10-58 0z', o.trim) + `<circle cx="69" cy="444" r="4" fill="#f4d35e" stroke="${INK}" stroke-width="1.6"/>`,
    skull: strokeLine('M58 428q10-14 22 0', 3, INK) + shape('M69 428c-16 0-25 11-25 24 0 9 5 15 12 18v8h26v-8c7-3 12-9 12-18 0-13-9-24-25-24z', '#fff6fb') + `<circle cx="60" cy="452" r="6" fill="${INK}"/><circle cx="78" cy="452" r="6" fill="${INK}"/>`,
    wand: strokeLine('M70 428L44 378', 6, INK) + strokeLine('M70 428L44 378', 3, o.trim) + `<path d="M44 358l5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1z" fill="#f4d35e" stroke="${INK}" stroke-width="2.2"/>`,
    phone: shape('M60 396l18-1 8 8-3 50-20 1-8-8z', '#ff1f8f') + shape('M63 404l14-1 3 3-2 38-13 1-4-4z', '#14101a'),
  } as Record<string, string>)[o.hold] || '';

  /* ---------- head and face ---------- */
  parts.head = `<ellipse cx="100" cy="134" rx="9" ry="15" fill="${SD}" stroke="${INK}" stroke-width="2.4"/><ellipse cx="220" cy="134" rx="9" ry="15" fill="${SD}" stroke="${INK}" stroke-width="2.4"/>`
    + shape('M100 112Q100 44 160 44Q220 44 220 112Q220 162 182 192Q160 208 138 192Q100 162 100 112Z', S);
  const eye = (cx: number, flip: number) => `<g transform="translate(${cx} 128) scale(${flip * .8} .86)">
    <path d="M-26-2Q-10-30 26-16L36-22L30-6Q6 0-26-2Z" fill="${o.shadow}" opacity=".78"/>
    <path d="M-25 4Q-8-22 24-9Q10 20-25 4Z" fill="#fff"/>
    <circle cx="1" cy="-3" r="13.5" fill="${o.eye}"/><circle cx="1" cy="-3" r="13.5" fill="none" stroke="${shade(o.eye, -.45)}" stroke-width="2.4"/><circle cx="1" cy="-2" r="6.8" fill="#0d0710"/><circle cx="6" cy="-8" r="4" fill="#fff"/><circle cx="-4" cy="3" r="2" fill="#fff"/>
    <path d="M-27 5Q-9-24 25-10L40-19" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/>
    <path d="M-20-7l-7-8M-9-14l-4-9M4-16l1-9M16-13l6-8" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M-20 8Q4 16 22-4" fill="none" stroke="${INK}" stroke-width="1.5"/>
    <path d="M-26-30Q2-46 36-30" fill="none" stroke="${shade(o.hairStyle === 'hijab' ? '#17101c' : hair, -.3)}" stroke-width="4.2" stroke-linecap="round"/></g>`;
  parts.face = eye(128, -1) + eye(192, 1)
    + `<ellipse cx="116" cy="158" rx="12" ry="6" fill="#ff1f8f" opacity=".2"/><ellipse cx="204" cy="158" rx="12" ry="6" fill="#ff1f8f" opacity=".2"/>`
    + strokeLine('M156 159q4 4 8 0', 2.2, INK)
    + `<path d="M140 174q10-7 16-4 4 2 8 0 6-3 16 4-10 4-20 4t-20-4z" fill="${shade(o.lip, .12)}" stroke="${INK}" stroke-width="1.8"/><path d="M140 174q20 7 40 0-5 15-20 15t-20-15z" fill="${o.lip}" stroke="${INK}" stroke-width="1.8"/><ellipse cx="160" cy="182" rx="8" ry="2.4" fill="#fff" opacity=".65"/>`;

  /* ---------- monster side ---------- */
  const fang = `<path d="M148 177l3 10 4-9zM172 177l-3 10-4-9z" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`;
  parts.monster = ({
    fangs: fang,
    bat: fang,
    wolf: `<path d="M112 72L92 8l48 34zM208 72l20-64-48 34z" fill="${hair}" stroke="${INK}" stroke-width="2.6"/><path d="M112 54L102 26l22 16zM208 54l10-28-22 16z" fill="${o.streak}"/>`,
    fins: `<path d="M102 118L58 88l8 32-14 22 24-2-8 26 40-16z" fill="${S}" stroke="${INK}" stroke-width="2.6"/><path d="M218 118l44-30-8 32 14 22-24-2 8 26-40-16z" fill="${S}" stroke="${INK}" stroke-width="2.6"/>` + strokeLine('M66 110l32 16M64 142l34-6M254 110l-32 16M256 142l-34-6', 1.6, INK),
    bolts: `<path d="M126 208h22v14h-22zM172 208h22v14h-22z" fill="#c0c0d8" stroke="${INK}" stroke-width="2.4"/><path d="M116 204h10v22h-10zM194 204h10v22h-10z" fill="#8f8fa8" stroke="${INK}" stroke-width="2.4"/>` + strokeLine('M196 92l10 12M206 84l-20 28M116 158h24M122 152v12M134 152v12', 2.2, INK),
    wraps: strokeLine('M104 96L150 112M170 186L214 152M108 146l30 22', 10, '#fff6e0', 'opacity=".95"') + strokeLine('M104 91L150 107M170 180L212 147', 1.4, '#a8946a'),
    horns: `<path d="M124 62C112 44 112 22 124 8c2 18 12 34 24 42zM196 62c12-18 12-40 0-54-2 18-12 34-24 42z" fill="${o.streak}" stroke="${INK}" stroke-width="2.6"/>`,
    stitches: strokeLine('M196 90l14 12M204 84l-14 26M110 158h26M116 152v12M126 152v12', 2.2, INK) + strokeLine('M86 300l20 6M90 294v12M100 296v12', 2, INK),
  } as Record<string, string>)[o.monster] || '';
  if (o.monster === 'bat') {
    const wing = 'M126 264C92 190 44 170 8 190C30 204 34 226 26 252C44 240 62 244 70 266C84 252 102 254 118 286Z';
    parts.wings = `<g>${shape(wing, shade(o.streak, -.15))}${strokeLine('M120 268C90 226 54 204 12 192M116 272C96 250 76 244 70 262M118 276C92 256 54 240 30 248', 1.8, INK, 'opacity=".55"')}</g><g transform="translate(320 0) scale(-1 1)">${shape(wing, shade(o.streak, -.15))}${strokeLine('M120 268C90 226 54 204 12 192M116 272C96 250 76 244 70 262M118 276C92 256 54 240 30 248', 1.8, INK, 'opacity=".55"')}</g>`;
  }

  /* ---------- hair ---------- */
  const streak = (d: string, w = 8) => strokeLine(d, w, o.streak);
  const shine = (d: string) => strokeLine(d, 4, hairL, 'opacity=".75"');
  const SWEPT = 'M100 122C92 62 128 34 162 36C204 34 230 66 222 122C214 96 198 78 172 64C158 92 124 108 100 122Z';
  const BANGS = 'M98 118C94 60 126 34 160 34C194 34 226 60 222 118L212 96L198 108L184 90L170 108L156 90L142 108L128 92L114 106Z';
  const mirror = (inner: string) => `${inner}<g transform="translate(320 0) scale(-1 1)">${inner}</g>`;
  ({
    long() {
      parts.hairBack = shape('M160 24C80 24 74 92 82 150C90 250 60 340 72 436Q104 452 124 410L196 410Q216 452 248 436C260 340 230 250 238 150C246 92 240 24 160 24Z', hair) + streak('M92 170C94 260 72 340 84 424') + shine('M228 170C226 260 246 340 236 420');
      parts.hairFront = shape(SWEPT, hair) + streak('M176 68C190 80 208 96 216 116', 7) + shine('M122 62C136 48 150 44 164 44');
    },
    pony() {
      parts.hairBack = shape('M176 44C236 -6 290 70 276 170C268 230 286 300 256 360C236 300 228 220 224 150C222 100 204 66 176 44Z', hair) + streak('M236 44C262 90 258 170 258 240C258 280 262 310 258 340') + shape('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z', hair);
      parts.hairFront = shape(SWEPT, hair) + shape('M168 28l22-8 8 14-22 8z', o.streak) + shine('M122 60C136 46 150 42 164 42');
    },
    twins() {
      parts.hairBack = mirror(shape('M104 66C58 76 34 170 44 268C50 330 30 370 48 424C84 376 102 280 104 186Z', hair) + streak('M72 100C54 170 54 260 60 330C60 360 54 384 54 400')) + shape('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z', hair);
      parts.hairFront = shape(BANGS, hair) + mirror(shape('M96 58l14-10 8 14-14 10z', o.streak)) + shine('M126 56C142 44 170 42 190 54');
    },
    bob() {
      parts.hairBack = shape('M160 24C84 24 72 92 80 152C84 194 72 214 80 238Q110 250 122 216L198 216Q210 250 240 238C248 214 236 194 240 152C248 92 236 24 160 24Z', hair) + streak('M90 150C92 186 84 212 88 230') + shine('M232 150C230 186 238 210 234 228');
      parts.hairFront = shape(BANGS, hair) + streak('M198 60C206 74 210 86 212 96', 7) + shine('M126 56C142 44 170 42 190 54');
    },
    curls() {
      const blobs: Array<[number, number, number]> = [[160, 40, 44], [106, 58, 36], [214, 58, 36], [76, 112, 34], [244, 112, 34], [66, 174, 34], [254, 174, 34], [78, 238, 34], [242, 238, 34], [92, 296, 30], [228, 296, 30], [112, 346, 24], [208, 346, 24]];
      parts.hairBack = blobs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hair}" stroke="${INK}" stroke-width="2.6"/>`).join('') + blobs.filter((_, i) => i % 2).map(([x, y, r]) => strokeLine(`M${x - r * .5} ${y - r * .2}q${r * .5}-${r * .6} ${r}-${r * .1}`, 5, o.streak)).join('');
      parts.hairFront = shape('M102 118C98 76 120 50 138 46C146 34 174 34 182 46C200 50 222 76 218 118C208 100 196 88 184 78C176 88 160 92 150 80C136 92 116 100 102 118Z', hair) + shine('M128 60q18-12 36-6');
    },
    side() {
      parts.hairBack = shape('M160 24C84 24 70 92 74 160C76 260 40 360 58 470Q96 470 114 410L170 200L226 240C242 200 244 180 240 150C248 92 236 24 160 24Z', hair) + streak('M84 180C84 270 58 360 70 452') + shine('M104 210C100 280 92 340 88 400');
      parts.hairFront = shape('M222 118C226 62 192 32 156 36C112 38 92 72 98 136C106 110 118 92 136 82C166 92 202 92 222 118Z', hair) + streak('M132 62C150 72 182 78 210 98', 7) + shine('M110 86C120 64 140 48 160 46');
    },
    buns() {
      parts.hairBack = mirror(`<circle cx="92" cy="40" r="34" fill="${hair}" stroke="${INK}" stroke-width="2.6"/>` + strokeLine('M72 34q20-22 40-2', 6, o.streak)) + shape('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z', hair);
      parts.hairFront = shape(SWEPT, hair) + shine('M122 60C136 46 150 42 164 42');
    },
    hijab() {
      const folds = shade(hair, -.2);
      parts.hairBack = shape('M160 22C86 22 76 92 84 150C88 200 82 244 68 290Q160 326 252 290C238 244 232 200 236 150C244 92 234 22 160 22Z', hair);
      parts.hairFront = `<path d="M160 26C100 26 88 90 92 140C96 192 118 226 160 236C202 226 224 192 228 140C232 90 220 26 160 26ZM160 56C122 56 106 88 106 122C108 158 130 190 160 204C190 190 212 158 214 122C214 88 198 56 160 56Z" fill="${hair}" fill-rule="evenodd" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`
        + strokeLine('M112 58C100 84 96 124 106 164M208 58C220 84 224 124 214 164M134 36C118 44 108 58 104 76', 1.8, folds)
        + shape('M108 206C84 240 96 282 132 298C166 312 208 304 226 272C238 248 228 222 212 206C190 234 130 234 108 206Z', hair)
        + strokeLine('M112 226C136 252 186 254 216 226M104 250C134 284 192 286 224 252', 2, folds) + strokeLine('M120 278C150 296 186 296 210 280', 4, o.streak)
        + strokeLine('M130 40Q160 28 190 40', 3, hairL, 'opacity=".8"');
    },
  } as Record<string, () => void>)[o.hairStyle]?.();

  /* ---------- headwear ---------- */
  parts.headwear = ({
    bow: `<path d="M160 30L114 4q-12 26 6 46zM160 30l46-26q12 26-6 46z" fill="${o.trim}" stroke="${INK}" stroke-width="2.6"/><circle cx="160" cy="30" r="10" fill="#fff6fb" stroke="${INK}" stroke-width="2.6"/>`,
    tiara: `<path d="M118 50l-6-30 22 14 26-26 26 26 22-14-6 30q-42-14-84 0z" fill="#f4d35e" stroke="${INK}" stroke-width="2.6"/><circle cx="160" cy="28" r="5.5" fill="${o.trim}" stroke="${INK}" stroke-width="1.5"/>`,
    hat: `<g transform="rotate(-10 196 34)"><ellipse cx="196" cy="48" rx="42" ry="9" fill="${o.topC}" stroke="${INK}" stroke-width="2.6"/><path d="M170 46V14q26-8 52 0v32q-26 8-52 0z" fill="${o.topC}" stroke="${INK}" stroke-width="2.6"/><path d="M170 36q26 8 52 0v10q-26 8-52 0z" fill="${o.trim}"/></g>`,
    flower: [0, 72, 144, 216, 288].map(a => `<ellipse cx="206" cy="48" rx="9" ry="15" transform="rotate(${a} 206 62)" fill="${o.trim}" stroke="${INK}" stroke-width="2"/>`).join('') + `<circle cx="206" cy="62" r="7" fill="#f4d35e" stroke="${INK}" stroke-width="2"/>`,
    hoops: `<g fill="none" stroke="#f4d35e" stroke-width="5"><circle cx="100" cy="170" r="16"/><circle cx="220" cy="170" r="16"/></g>`,
    clip: `<path d="M196 54c-11 0-18 8-18 17 0 6 4 11 8 13v6h20v-6c4-2 8-7 8-13 0-9-7-17-18-17z" fill="#fff6fb" stroke="${INK}" stroke-width="2.2"/><circle cx="189" cy="71" r="4" fill="${INK}"/><circle cx="203" cy="71" r="4" fill="${INK}"/>`,
  } as Record<string, string>)[o.headwear] || '';

  const inner = LAYER_ORDER.filter(l => !opt.only || opt.only.includes(l)).map(l => parts[l] || '').join('');
  const box = opt.box || (opt.head ? HEAD_BOX : '0 0 320 720');
  const label = (opt.label || '').replace(/[&<>"]/g, ch => '&#' + ch.charCodeAt(0) + ';');
  return `<svg viewBox="${box}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs>${defs}</defs>${inner}</svg>`;
}

/* Lunch Riot targets: plain skulls, not students */
function riotSkulls(): string[] {
  return ['#ff1f8f', '#19b7e8', '#35dcc8', '#f4d35e'].map(bow => `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 16c-26 0-42 18-42 42 0 16 8 28 20 34v14h44V92c12-6 20-18 20-34 0-24-16-42-42-42z" fill="#fff6fb" stroke="#000" stroke-width="4"/><circle cx="44" cy="60" r="11"/><circle cx="76" cy="60" r="11"/><path d="M60 72l-6 12h12z"/><path d="M60 22L38 8q-6 14 4 22zM60 22l22-14q6 14-4 22z" fill="${bow}" stroke="#000" stroke-width="3"/></svg>`);
}
