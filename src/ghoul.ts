/* ---------- cartoon ghouls: original, layered, dressable ---------- */
interface Look {
  skin: string; eye: string; lip: string; shadow: string;
  hairStyle: string; hair: string; streak: string;
  monster: string; headwear: string; hold: string;
  top: string; topC: string; topP: string; trim: string;
  bottom: string; bottomC: string; bottomP: string;
  legs: string; legsC: string;
  shoes: string; shoesC: string;
  pose: string; eyewear: string; neck: string; gloves: string; gloveC: string; mark: string; back: string;
}
type Layer = 'back' | 'neck' | 'mark' | 'eyewear' | 'armsFront' | 'wings' | 'hairBack' | 'legs' | 'legwear' | 'pants' | 'shoes' | 'torso' | 'bottom' | 'top' | 'arms' | 'sleeves' | 'hold' | 'head' | 'face' | 'monster' | 'hairFront' | 'headwear';
const LAYER_ORDER: Layer[] = ['back', 'wings', 'hairBack', 'legs', 'legwear', 'pants', 'shoes', 'torso', 'bottom', 'top', 'neck', 'arms', 'sleeves', 'hold', 'head', 'face', 'mark', 'monster', 'hairFront', 'eyewear', 'headwear', 'armsFront'];
const HEAD_LAYERS: Layer[] = ['hairBack', 'head', 'face', 'mark', 'monster', 'hairFront', 'eyewear', 'headwear'];
const INK = '#1c0f22';

const SKINS = ['#d9c8f2', '#f4cfae', '#c98f63', '#7d5136', '#a8dcf0', '#b8f0d0', '#f7b8cf', '#e9e4d6'];
const HAIR_COLOURS = ['#17101c', '#5a2c17', '#a0392a', '#f4d35e', '#f6f0ff', '#f08fb4', '#ff1f8f', '#19b7e8', '#35dcc8', '#8a2be2'];
const BRIGHT = ['#14101a', '#fff6fb', '#ff1f8f', '#f08fb4', '#6a1f86', '#19b7e8', '#35dcc8', '#8df04a', '#f4d35e', '#c0392b'];
const PATTERNS: Array<[string, string]> = [['solid', 'Plain'], ['stripes', 'Stripes'], ['argyle', 'Argyle'], ['tartan', 'Tartan'], ['skulls', 'Skulls']];

/* Arms: [upper, forearm] angles in degrees. 0 hangs straight down, 90 points straight out, 180 straight up, and below 0 crosses the body.
   Legs: [hip, knee], with positive swinging outward. Hands: open, relaxed, fist, point, peace, horns. front puts that arm over the face. */
interface Pose { id: string; name: string; armL: [number, number]; armR: [number, number]; legL?: [number, number]; legR?: [number, number]; lean?: number; tilt?: number; lift?: number; handL?: string; handR?: string; front?: 'L' | 'R' | 'LR' }
const POSES: Pose[] = [
  { id: 'classic', name: 'Classic', armL: [20, 15], armR: [30, -31] },
  { id: 'hips', name: 'Both hips', armL: [32, -31], armR: [32, -31], handL: 'relaxed', tilt: 3 },
  { id: 'relaxed', name: 'Relaxed', armL: [12, 8], armR: [12, 8], handL: 'relaxed', handR: 'relaxed' },
  { id: 'wave', name: 'Wave', armL: [18, 12], armR: [105, 165], handR: 'open', tilt: 5 },
  { id: 'bigwave', name: 'Big wave', armL: [32, -31], armR: [150, 175], handR: 'open', lean: 4, tilt: -3 },
  { id: 'peace', name: 'Peace sign', armL: [32, -31], armR: [75, 165], handR: 'peace', tilt: 7 },
  { id: 'pointup', name: 'Point up', armL: [20, 15], armR: [150, 172], handR: 'point', tilt: -5 },
  { id: 'pointyou', name: 'Pointing', armL: [32, -31], armR: [80, 90], handR: 'point', lean: 3 },
  { id: 'cheer', name: 'Cheer', armL: [150, 170], armR: [150, 170], handL: 'fist', handR: 'fist', lift: 6, tilt: 2 },
  { id: 'y', name: 'Victory', armL: [145, 150], armR: [145, 150], handL: 'open', handR: 'open', legL: [7, 0], legR: [7, 0] },
  { id: 'wide', name: 'Arms wide', armL: [88, 92], armR: [88, 92], handL: 'open', handR: 'open' },
  { id: 'shy', name: 'Shy', armL: [8, -22], armR: [8, -22], handL: 'relaxed', handR: 'relaxed', tilt: 9, legL: [-1, 0], legR: [-1, 0] },
  { id: 'thinking', name: 'Thinking', armL: [8, -55], armR: [100, -115], handR: 'relaxed', tilt: 6, front: 'R' },
  { id: 'kiss', name: 'Blow a kiss', armL: [75, 95], armR: [95, -112], handL: 'open', handR: 'relaxed', tilt: -5, front: 'R' },
  { id: 'crossed', name: 'Arms crossed', armL: [18, -82], armR: [18, -82], handL: 'fist', handR: 'fist', front: 'LR', tilt: -3 },
  { id: 'flex', name: 'Flex', armL: [85, 175], armR: [85, 175], handL: 'fist', handR: 'fist', legL: [6, 0], legR: [6, 0] },
  { id: 'onhead', name: 'Hands on head', armL: [120, -155], armR: [120, -155], handL: 'relaxed', handR: 'relaxed', front: 'LR' },
  { id: 'hair', name: 'Fix my hair', armL: [20, 15], armR: [125, -150], handR: 'open', tilt: 8, front: 'R' },
  { id: 'shrug', name: 'Shrug', armL: [35, 110], armR: [35, 110], handL: 'open', handR: 'open', tilt: 6 },
  { id: 'stop', name: 'Stop', armL: [20, 15], armR: [65, 175], handR: 'open', lean: -3 },
  { id: 'salute', name: 'Salute', armL: [20, 15], armR: [100, -125], handR: 'open', front: 'R' },
  { id: 'rock', name: 'Rock on', armL: [32, -31], armR: [145, 165], handR: 'horns', tilt: -6, legR: [12, -8] },
  { id: 'strut', name: 'Runway strut', armL: [32, -31], armR: [22, 12], handR: 'relaxed', legL: [-3, 0], legR: [-5, 0], lean: 3, tilt: -3 },
  { id: 'walk', name: 'Walking', armL: [-8, -2], armR: [22, 14], handL: 'relaxed', handR: 'relaxed', legL: [12, -6], legR: [-3, 8] },
  { id: 'crosslegs', name: 'Crossed legs', armL: [32, -31], armR: [16, 10], handR: 'relaxed', legL: [-7, 3], legR: [-7, 3], tilt: 4 },
  { id: 'kick', name: 'High kick', armL: [85, 95], armR: [60, 75], handL: 'open', handR: 'open', legL: [2, 0], legR: [62, 8], lean: -8 },
  { id: 'star', name: 'Star jump', armL: [125, 130], armR: [125, 130], handL: 'open', handR: 'open', legL: [28, 2], legR: [28, 2], lift: 14 },
  { id: 'jump', name: 'Jump for joy', armL: [150, 165], armR: [120, 170], handL: 'fist', handR: 'open', legL: [20, -55], legR: [20, -55], lift: 16 },
  { id: 'twirl', name: 'Twirl', armL: [150, 195], armR: [65, 40], handL: 'open', handR: 'open', legL: [1, 0], legR: [22, -60], lean: 3, tilt: 6 },
  { id: 'dance', name: 'Disco', armL: [32, -31], armR: [150, 165], handR: 'point', legL: [3, 0], legR: [20, -30], lean: -6, tilt: -6 },
  { id: 'lean', name: 'Sassy lean', armL: [32, -31], armR: [15, 8], handR: 'relaxed', lean: 7, tilt: -8, legL: [8, 0], legR: [-2, 0] },
  { id: 'phone', name: 'Selfie', armL: [20, 15], armR: [70, 150], handR: 'relaxed', tilt: 7, legR: [10, -10] },
];
const poseOf = (id: string): Pose => POSES.find(p => p.id === id) || POSES[0];

interface WardrobePage {
  title: string; key?: keyof Look; items?: Array<[string, string]>;
  colours: Array<[keyof Look, string, string[]]>; pattern?: keyof Look;
  box: string; layers: Layer[];
}
const HEAD_BOX = '62 8 196 206';
const WIDE_BOX = '-50 -10 420 730';
const WARDROBE: WardrobePage[] = [
  { title: 'Poses', key: 'pose', items: POSES.map(p => [p.id, p.name] as [string, string]), colours: [], box: WIDE_BOX, layers: [] },
  { title: 'Hair', key: 'hairStyle', items: [['long', 'Long'], ['pony', 'High pony'], ['twins', 'Twin tails'], ['bob', 'Bob'], ['curls', 'Curls'], ['side', 'Side sweep'], ['buns', 'Space buns'], ['afro', 'Afro'], ['braids', 'Long braids'], ['waves', 'Mermaid waves'], ['pixie', 'Pixie'], ['mohawk', 'Mohawk'], ['halfup', 'Half up'], ['hijab', 'Hijab'], ['turban', 'Head wrap']], colours: [['hair', 'Colour', HAIR_COLOURS], ['streak', 'Streak or folds', BRIGHT]], box: '10 0 300 330', layers: ['hairBack', 'head', 'hairFront'] },
  { title: 'Face', colours: [['skin', 'Skin', SKINS], ['eye', 'Eyes', ['#19b7e8', '#35dcc8', '#8df04a', '#ffb703', '#c77dff', '#ff1f8f', '#7a4a21']], ['shadow', 'Eyeshadow', ['#ff1f8f', '#6a1f86', '#19b7e8', '#35dcc8', '#f4d35e', '#14101a']], ['lip', 'Lips', ['#b80e63', '#ff1f8f', '#d62828', '#5a0f7a', '#14101a', '#b5694f']]], box: HEAD_BOX, layers: ['head', 'face'] },
  { title: 'Face details', key: 'mark', items: [['none', 'None'], ['freckles', 'Freckles'], ['blush', 'Rosy cheeks'], ['star', 'Star'], ['heart', 'Heart'], ['tear', 'Goth tear'], ['mole', 'Beauty mark'], ['bandage', 'Plaster']], colours: [], box: HEAD_BOX, layers: ['head', 'face', 'mark'] },
  { title: 'Eyewear', key: 'eyewear', items: [['none', 'None'], ['round', 'Round glasses'], ['cat', 'Cat eye'], ['shades', 'Shades'], ['hearts', 'Heart shades'], ['visor', 'Visor'], ['monocle', 'Monocle']], colours: [['trim', 'Trim', BRIGHT]], box: HEAD_BOX, layers: ['head', 'eyewear'] },
  { title: 'Monster side', key: 'monster', items: [['none', 'Just me'], ['fangs', 'Vampire fangs'], ['bat', 'Bat wings'], ['wolf', 'Wolf ears'], ['fins', 'Sea fins'], ['bolts', 'Neck bolts'], ['wraps', 'Mummy wraps'], ['horns', 'Little horns'], ['stitches', 'Stitches']], colours: [], box: '0 0 320 330', layers: ['wings', 'head', 'face', 'monster'] },
  { title: 'Tops', key: 'top', items: [['tank', 'Tank'], ['tee', 'Bat tee'], ['stripey', 'Off-shoulder'], ['corset', 'Puff corset'], ['varsity', 'Varsity'], ['hoodie', 'Crop hoodie'], ['blouse', 'Collar blouse'], ['tunic', 'Long tunic'], ['bandeau', 'Bandeau'], ['halter', 'Halter'], ['cardigan', 'Cardigan'], ['sweater', 'Chunky knit'], ['vest', 'Waistcoat'], ['lacetop', 'Lace top'], ['kimono', 'Kimono'], ['bat', 'Bat sleeves']], colours: [['topC', 'Colour', BRIGHT], ['trim', 'Trim', BRIGHT]], pattern: 'topP', box: '40 215 240 225', layers: ['top', 'sleeves'] },
  { title: 'Bottoms', key: 'bottom', items: [['pleats', 'Pleated mini'], ['tutu', 'Tutu'], ['shred', 'Shredded'], ['pencil', 'Pencil'], ['maxi', 'Long skirt'], ['flares', 'Flares'], ['skinny', 'Skinnies'], ['shorts', 'Shorts'], ['tiered', 'Tiered skirt'], ['midi', 'Midi skirt'], ['wrap', 'Wrap skirt'], ['cargo', 'Cargos'], ['bike', 'Bike shorts'], ['bubble', 'Bubble skirt']], colours: [['bottomC', 'Colour', BRIGHT]], pattern: 'bottomP', box: '40 320 240 395', layers: ['pants', 'bottom'] },
  { title: 'Legwear', key: 'legs', items: [['bare', 'Bare'], ['tights', 'Tights'], ['stripes', 'Striped'], ['argyle', 'Argyle'], ['fishnet', 'Fishnets'], ['knee', 'Knee socks'], ['thigh', 'Thigh highs'], ['ankle', 'Ankle socks'], ['warmers', 'Leg warmers'], ['dots', 'Polka dots'], ['skull', 'Skull tights']], colours: [['legsC', 'Colour', BRIGHT]], box: '60 370 200 340', layers: ['legs', 'legwear'] },
  { title: 'Shoes', key: 'shoes', items: [['heels', 'Strappy'], ['platform', 'Platforms'], ['combat', 'Combat'], ['knee', 'Tall boots'], ['sneaker', 'High tops'], ['mary', 'Mary Janes'], ['wedge', 'Wedges'], ['ballet', 'Ballet ties'], ['cowboy', 'Cowboy boots'], ['chunky', 'Chunky trainers'], ['spike', 'Spiked boots']], colours: [['shoesC', 'Colour', BRIGHT]], box: '60 520 200 200', layers: ['shoes'] },
  { title: 'Headwear', key: 'headwear', items: [['none', 'None'], ['bow', 'Big bow'], ['tiara', 'Tiara'], ['hat', 'Tiny hat'], ['flower', 'Flower'], ['hoops', 'Hoops'], ['clip', 'Skull clip'], ['beret', 'Beret'], ['band', 'Headband'], ['witch', 'Witch hat'], ['halo', 'Halo'], ['cat', 'Cat ears'], ['stars', 'Star clips']], colours: [], box: HEAD_BOX, layers: ['headwear'] },
  { title: 'Necklaces', key: 'neck', items: [['none', 'None'], ['choker', 'Choker'], ['skull', 'Skull pendant'], ['pearls', 'Pearls'], ['chain', 'Chain'], ['heart', 'Heart locket'], ['spikes', 'Spiked collar']], colours: [], box: '100 195 120 110', layers: ['neck'] },
  { title: 'Hands', key: 'gloves', items: [['none', 'Bare'], ['nails', 'Painted nails'], ['short', 'Short gloves'], ['opera', 'Long gloves'], ['fingerless', 'Fingerless'], ['claws', 'Claws']], colours: [['gloveC', 'Colour', BRIGHT]], box: '20 300 120 170', layers: ['arms'] },
  { title: 'On your back', key: 'back', items: [['none', 'Nothing'], ['cape', 'Long cape'], ['short', 'Short cape'], ['bag', 'Backpack'], ['tail', 'Devil tail'], ['bigbow', 'Giant bow']], colours: [], box: '0 190 320 480', layers: ['back'] },
  { title: 'In hand', key: 'hold', items: [['none', 'Nothing'], ['cup', 'Teacup'], ['purse', 'Purse'], ['skull', 'Skull bag'], ['wand', 'Wand'], ['phone', 'iCoffin'], ['mic', 'Microphone'], ['rose', 'Black rose'], ['book', 'Spell book'], ['brolly', 'Bat umbrella']], colours: [], box: '0 330 150 170', layers: ['hold'] },
];

const FANG_LOOK: Look = { skin: '#d9c8f2', eye: '#35dcc8', lip: '#b80e63', shadow: '#ff1f8f', hairStyle: 'hijab', hair: '#f08fb4', streak: '#ff1f8f', monster: 'bat', headwear: 'none', hold: 'cup', top: 'corset', topC: '#14101a', topP: 'solid', trim: '#ff1f8f', bottom: 'tutu', bottomC: '#ff1f8f', bottomP: 'solid', legs: 'argyle', legsC: '#19b7e8', shoes: 'platform', shoesC: '#14101a', pose: 'classic', eyewear: 'none', neck: 'choker', gloves: 'nails', gloveC: '#ff1f8f', mark: 'none', back: 'none' };

function randomLook(): Look {
  const look = { ...FANG_LOOK, hairStyle: 'long' };
  for (const page of WARDROBE) {
    if (page.key && page.items) look[page.key] = page.items[Math.floor(Math.random() * page.items.length)][0];
    for (const [key, , values] of page.colours) look[key] = values[Math.floor(Math.random() * values.length)];
    if (page.pattern) look[page.pattern] = Math.random() < .6 ? 'solid' : PATTERNS[1 + Math.floor(Math.random() * 4)][0];
  }
  look.hold = 'none';
  look.pose = 'classic';
  return look;
}
/* Checks everything saved against the wardrobe, because other people's looks are drawn into this page. */
function normalizeLook(raw: Partial<Look> | undefined): Look {
  /* Anything missing gets a plain default, never a random one, or a saved character would change on every visit. */
  const out: Look = { ...FANG_LOOK, hairStyle: 'long', monster: 'none', hold: 'none', neck: 'none', gloves: 'none' };
  if (!raw) return randomLook();
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

/* A hand from the wrist outward, drawn pointing down its own +y. */
function drawHand(shape: string, skin: string, fill: string, tips: string): string {
  const LONG: Record<string, Array<[number, number, number, number]>> = {
    open: [[-5.4, 13, -9, 28], [-1.8, 14, -3, 32], [1.8, 14, 3, 31], [5.2, 13, 9.5, 26]],
    relaxed: [[-5, 13, -6, 26], [-1.7, 14, -2, 29], [1.7, 14, 2, 28], [5, 13, 6, 24]],
    fist: [[-5, 13, -5, 18], [-1.7, 14, -1.7, 19], [1.7, 14, 1.7, 19], [5, 13, 5, 18]],
    point: [[-5, 13, -6, 33], [-1.7, 14, -1.7, 19], [1.7, 14, 1.7, 19], [5, 13, 5, 18]],
    peace: [[-5, 13, -9.5, 31], [-1.7, 14, 1.5, 32], [1.7, 14, 3, 19], [5, 13, 5.5, 18]],
    horns: [[-5, 13, -8, 31], [-1.7, 14, -1.7, 19], [1.7, 14, 1.7, 19], [5, 13, 8, 28]],
  };
  const fingers = LONG[shape] || LONG.relaxed;
  const thumb = shape === 'fist' ? 'M-7 7L3 12' : shape === 'open' ? 'M-7 6L-16 14' : 'M-7 6L-12 15';
  const lines = (w: number, c: string) => fingers.map(([a, b, x, y]) => strokeLine('M' + a + ' ' + b + 'L' + x + ' ' + y, w, c)).join('') + strokeLine(thumb, w, c);
  const nails = tips ? fingers.map(([, , x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="2.1" fill="' + tips + '"/>').join('') : '';
  return lines(6.6, INK) + '<path d="M-7.5 1Q-8 15 -6 16L6 16Q8 15 7.5 1Z" fill="' + fill + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' + lines(4, skin) + nails;
}

function drawGhoul(o: Look, opt: { head?: boolean; label?: string; only?: Layer[]; box?: string } = {}): string {
  const uid = 'g' + (++ghoulCounter);
  const pose = opt.head ? POSES[0] : poseOf(o.pose);
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
  defs += `<clipPath id="${clipId}a"><rect x="-200" y="600" width="700" height="200"/></clipPath><clipPath id="${clipId}w"><rect x="-200" y="545" width="700" height="100"/></clipPath><clipPath id="${clipId}u"><rect x="-200" y="200" width="700" height="332"/></clipPath><clipPath id="${clipId}d"><rect x="-200" y="518" width="700" height="300"/></clipPath>`;
  const oneLeg = (inner: string, [hip, knee]: [number, number]) => '<g transform="rotate(' + hip + ' 140 380)">' + (knee
    ? '<g clip-path="url(#' + clipId + 'u)">' + inner + '</g><g transform="rotate(' + knee + ' 140 524)"><g clip-path="url(#' + clipId + 'd)">' + inner + '</g></g>'
    : inner) + '</g>';
  const legsSide = (inner: string) => oneLeg(inner, pose.legL || [3, 0]) + '<g transform="translate(320 0) scale(-1 1)">' + oneLeg(inner, pose.legR || [3, 0]) + '</g>';
  const wearFill = ({ tights: o.legsC, stripes: texture('stripes', o.legsC, contrast(o.legsC) === INK ? '#14101a' : '#fff6fb', 'l'), argyle: texture('argyle', o.legsC, contrast(o.legsC) === INK ? '#6a1f86' : '#ff1f8f', 'a'), fishnet: texture('fishnet', o.legsC === '#fff6fb' ? '#14101a' : o.legsC, '', 'f'), knee: o.legsC, thigh: o.legsC, ankle: o.legsC, warmers: texture('stripes', o.legsC, o.trim, 'w'), dots: texture('skulls', o.legsC, '#fff6fb', 'p'), skull: texture('skulls', '#14101a', o.legsC, 's') } as Record<string, string>)[o.legs];
  parts.legs = legsSide(shape(LEG, S) + strokeLine('M128 524q14 6 26 0', 1.6, SD));
  if (wearFill) {
    const clipFor: Record<string, string> = { knee: 'k', thigh: 't', ankle: 'a', warmers: 'w' };
    const clip = clipFor[o.legs] ? `clip-path="url(#${clipId}${clipFor[o.legs]})"` : '';
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
    wedge: shape(foot, S) + strokeLine('M131 662l26 4M129 678l30 2', 5, C) + shape('M118 696h50l-4 22h-30z', C),
    ballet: shape(foot, S) + strokeLine('M133 650l22 14M155 650l-22 14M134 628l20 12M154 628l-20 12M135 606l18 12M153 606l-18 12', 2.6, C) + shape('M127 680C136 672 150 672 159 680L160 704L126 704Z', C),
    cowboy: shape(shaft(590), C) + strokeLine('M133 610q11 10 22 0M133 630q11 10 22 0', 2, CL) + shape('M126 672h34l10 26q-22 8-44 0z', C) + strokeLine('M131 590h26', 5, o.trim) + sole(696, 12, '#5a2c17'),
    chunky: shape('M128 652L158 652C162 668 166 684 166 698L120 698C120 684 124 668 128 652Z', C) + strokeLine('M133 664l20 3M131 676l24 3', 3, lace) + sole(694, 20, '#fff6fb') + strokeLine('M120 704h46', 3, o.trim),
    spike: shape(shaft(560), C) + [580, 610, 640, 670].map(y => `<path d="M124 ${y}l-9 4 9 4zM160 ${y}l9 4-9 4z" fill="#c0c0d8" stroke="${INK}" stroke-width="1.6"/>`).join('') + strokeLine('M129 560h30', 5, o.trim) + sole(696, 16, '#14101a'),
  } as Record<string, string>)[o.shoes] || '');

  /* ---------- body ---------- */
  parts.torso = shape('M148 186L148 232Q160 240 172 232L172 186Z', SD) + shape('M116 244Q138 232 148 232Q160 240 172 232Q182 232 204 244L194 296Q186 318 184 338Q198 360 204 390L116 390Q122 360 136 338Q134 318 126 296Z', S);

  const hipPiece = 'M136 332L184 332Q198 356 205 392L162 402L158 402L115 392Q122 356 136 332Z';
  const waistband = strokeLine('M136 336Q160 342 184 336', 6, o.trim);
  const pantsLeg = (d: string) => legsSide(shape(d, bottomFill));
  if (o.bottom === 'flares') parts.pants = pantsLeg('M114 376C108 430 116 480 122 524C118 590 112 650 102 704L172 704C168 640 162 580 160 524C168 470 168 420 165 384Z');
  if (o.bottom === 'skinny') parts.pants = pantsLeg('M114 376C108 430 116 480 124 524C121 566 127 612 132 640L154 640C157 612 161 566 158 524C165 470 168 420 165 384Z');
  if (o.bottom === 'shorts') parts.pants = pantsLeg('M112 376C106 410 110 440 112 466L164 466C168 440 168 410 165 384Z') + legsSide(strokeLine('M113 460h50', 4, o.trim));
  if (o.bottom === 'cargo') parts.pants = pantsLeg('M114 376C108 430 114 480 120 524C118 570 122 620 124 650L160 650C162 620 164 570 162 524C168 470 168 420 165 384Z') + legsSide(shape('M112 470h26v34h-24z', bottomFill) + strokeLine('M112 484h26', 2, o.trim) + strokeLine('M124 644h36', 5, o.trim));
  if (o.bottom === 'bike') parts.pants = pantsLeg('M114 376C108 410 112 470 118 508L160 508C166 470 168 420 165 384Z') + legsSide(strokeLine('M118 502h42', 4, o.trim));
  parts.bottom = ({
    pleats: shape('M136 332L184 332L226 450Q160 474 94 450Z', bottomFill) + [112, 130, 150, 170, 190, 208].map((x, i) => strokeLine(`M${146 + i * 6} 346L${x} 456`, 1.6, INK, 'opacity=".5"')).join('') + strokeLine('M96 450Q160 474 224 450', 5, o.trim) + waistband,
    tutu: shape('M138 332L182 332L240 420Q226 440 204 428Q192 452 168 436Q152 456 130 434Q108 448 96 426Q80 434 80 420Z', shade(o.bottomC, .28)) + shape('M138 332L182 332L224 402Q206 420 190 406Q172 428 154 410Q134 426 118 406Q104 416 96 402Z', bottomFill) + waistband,
    shred: shape('M136 332L184 332L216 440L200 424L190 462L172 432L158 470L142 430L126 458L116 424L102 444Z', bottomFill) + waistband,
    pencil: shape('M136 332L184 332Q204 372 200 420L196 490L124 490L120 420Q116 372 136 332Z', bottomFill) + strokeLine('M124 482h72', 5, o.trim) + waistband,
    maxi: shape('M136 332L184 332C210 430 232 560 246 672Q160 696 74 672C88 560 110 430 136 332Z', bottomFill) + strokeLine('M78 668Q160 692 242 668', 6, o.trim) + strokeLine('M150 350C142 460 124 580 112 670M170 350C178 460 196 580 208 670', 1.6, INK, 'opacity=".4"') + waistband,
    tiered: shape('M136 332L184 332L224 500Q160 520 96 500Z', shade(o.bottomC, .22)) + shape('M136 332L184 332L212 440Q160 458 108 440Z', bottomFill) + shape('M136 332L184 332L198 382Q160 394 122 382Z', shade(o.bottomC, .22)) + waistband,
    midi: shape('M136 332L184 332C200 410 214 500 224 572Q160 592 96 572C106 500 120 410 136 332Z', bottomFill) + strokeLine('M100 568Q160 588 220 568', 5, o.trim) + waistband,
    wrap: shape('M136 332L184 332L216 480Q170 498 118 470L104 440Z', bottomFill) + strokeLine('M184 340L132 474', 2.4, INK) + `<circle cx="176" cy="350" r="5" fill="${o.trim}" stroke="${INK}" stroke-width="1.6"/>` + waistband,
    bubble: shape('M136 332L184 332Q240 390 216 440Q160 468 104 440Q80 390 136 332Z', bottomFill) + strokeLine('M108 436Q160 462 212 436', 4, o.trim) + waistband,
    cargo: shape(hipPiece, bottomFill) + waistband,
    bike: shape(hipPiece, bottomFill) + waistband,
    flares: shape(hipPiece, bottomFill) + waistband,
    skinny: shape(hipPiece, bottomFill) + waistband,
    shorts: shape(hipPiece, bottomFill) + waistband,
  } as Record<string, string>)[o.bottom] || '';

  /* ---------- tops and arms ---------- */
  const arm = (d: string, w: number, c: string, extra = '') => strokeLine(d, w + 5.2, INK) + strokeLine(d, w, c, extra);
  const sleeve = ({ tee: 'short', stripey: 'long', corset: 'puff', varsity: 'long', hoodie: 'long', blouse: 'long', tunic: 'long', cardigan: 'long', sweater: 'fat', vest: '', lacetop: 'long', kimono: 'wide', bat: 'wide', halter: '', bandeau: '' } as Record<string, string>)[o.top];
  const rad = (d: number) => d * Math.PI / 180;
  const glove = o.gloves === 'short' || o.gloves === 'opera' ? o.gloveC : '';
  const backParts = { arms: '', sleeves: '', hold: '' };
  let frontParts = '', holdDX = 0, holdDY = 0, needsRoom = (pose.legL?.[0] || 0) >= 20 || (pose.legR?.[0] || 0) >= 20;
  const buildArm = (side: 1 | -1, [upper, fore]: [number, number], handShape: string) => {
    const sx = side < 0 ? 124 : 196, sy = 250, ex = sx + side * Math.sin(rad(upper)) * 85, ey = sy + Math.cos(rad(upper)) * 85;
    const wx = ex + side * Math.sin(rad(fore)) * 77, wy = ey + Math.cos(rad(fore)) * 77;
    const f = (n: number) => n.toFixed(1);
    const path = 'M' + f(sx) + ' ' + sy + 'L' + f(ex) + ' ' + f(ey) + 'L' + f(wx) + ' ' + f(wy);
    const forearm = 'M' + f(ex) + ' ' + f(ey) + 'L' + f(wx) + ' ' + f(wy);
    const midX = ex + (wx - ex) * .72, midY = ey + (wy - ey) * .72;
    const angle = Math.atan2(wy - ey, wx - ex) * 180 / Math.PI - 90;
    const cuff = (x: number, y: number, w: number, c: string) => { const nx = -(wy - ey) / 77, ny = (wx - ex) / 77; return strokeLine('M' + f(x + nx * w) + ' ' + f(y + ny * w) + 'L' + f(x - nx * w) + ' ' + f(y - ny * w), 6, c); };
    let skin = arm(path, 15, S);
    if (o.gloves === 'opera') skin += arm(forearm, 15.5, o.gloveC);
    if (o.gloves === 'short') skin += arm('M' + f(midX) + ' ' + f(midY) + 'L' + f(wx) + ' ' + f(wy), 15.5, o.gloveC);
    const palm = glove || (o.gloves === 'fingerless' ? o.gloveC : S), digits = glove || S;
    const tips = o.gloves === 'nails' ? o.gloveC : o.gloves === 'claws' ? '#14101a' : '';
    const hand = '<g transform="translate(' + f(wx) + ' ' + f(wy) + ') rotate(' + f(angle) + ') scale(' + (side < 0 ? 1.18 : -1.18) + ' 1.18)">' + drawHand(handShape, digits, palm, tips) + '</g>';
    let sleeves = '';
    if (sleeve === 'long' || sleeve === 'fat') sleeves = arm(path, sleeve === 'fat' ? 27 : 21, topFill) + cuff(wx, wy, sleeve === 'fat' ? 15 : 12, o.trim);
    else if (sleeve === 'wide') sleeves = '<path d="M' + f(sx) + ' ' + (sy - 10) + 'L' + f(ex) + ' ' + f(ey) + 'L' + f(wx) + ' ' + f(wy) + 'L' + f(sx - side * 4) + ' ' + (sy + 62) + 'Z" fill="' + topFill + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
    else if (sleeve === 'short') { const hx = sx + (ex - sx) * .58, hy = sy + (ey - sy) * .58; sleeves = arm('M' + f(sx) + ' ' + sy + 'L' + f(hx) + ' ' + f(hy), 22, topFill); }
    else if (sleeve === 'puff') {
      const x = side < 0 ? 110 : 210, y = 262;
      sleeves = '<ellipse cx="' + x + '" cy="' + y + '" rx="24" ry="22" fill="' + topFill + '" stroke="' + INK + '" stroke-width="2.6"/>' + strokeLine('M' + (x - 12) + ' ' + (y - 14) + 'Q' + x + ' ' + y + ' ' + (x - 10) + ' ' + (y + 14) + 'M' + (x + 10) + ' ' + (y - 15) + 'Q' + x + ' ' + y + ' ' + (x + 11) + ' ' + (y + 13), 1.6, INK, 'opacity=".55"') + strokeLine('M' + (x - 16) + ' ' + (y + 18) + 'q16 8 32 0', 5, o.trim);
    }
    if (wx < 16 || wx > 304) needsRoom = true;
    if (side < 0) { holdDX = wx - 74; holdDY = wy - 404; }
    const inFront = pose.front && pose.front.includes(side < 0 ? 'L' : 'R');
    if (inFront) frontParts += skin + sleeves + hand;
    else { backParts.arms += skin + hand; backParts.sleeves += sleeves; }
  };
  buildArm(-1, pose.armL, pose.handL || 'relaxed');
  buildArm(1, pose.armR, pose.handR || 'relaxed');
  parts.arms = backParts.arms; parts.sleeves = backParts.sleeves;
  parts.top = ({
    tank: strokeLine('M132 254L128 238M188 254L192 238', 6, o.topC) + shape('M130 252Q160 288 190 252L194 296Q186 318 186 344L134 344Q134 318 126 296Z', topFill) + strokeLine('M132 340h56', 5, o.trim),
    tee: shape('M116 246Q134 236 146 240Q160 256 174 240Q186 236 204 246L194 296Q186 318 186 346L134 346Q134 318 126 296Z', topFill) + `<path d="M160 280c-5-7-18-9-24-3 6 1 8 7 7 11 5-3 11-3 17 3 6-6 12-6 17-3-1-4 1-10 7-11-6-6-19-4-24 3z" fill="${o.trim}"/>` + strokeLine('M146 241Q160 256 174 241', 4, o.trim),
    stripey: shape('M116 266Q160 280 204 266L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + strokeLine('M116 266Q160 280 204 266', 5, o.trim),
    corset: shape('M126 262Q142 248 160 268Q178 248 194 262L190 298Q182 322 192 356L128 356Q138 322 130 298Z', topFill) + strokeLine('M160 270V352', 2, o.trim) + [282, 296, 310, 324, 338].map(y => strokeLine(`M152 ${y}L168 ${y + 8}M168 ${y}L152 ${y + 8}`, 1.8, o.trim)).join('') + strokeLine('M127 262Q142 250 160 268Q178 250 193 262', 4, o.trim),
    varsity: shape('M114 246Q136 232 148 234L160 300L172 234Q184 232 206 246L198 300Q190 330 194 360L126 360Q130 330 122 300Z', topFill) + strokeLine('M148 236L160 300L172 236', 6, o.trim) + strokeLine('M127 354h66', 7, o.trim) + strokeLine('M160 300V358', 2, INK),
    hoodie: shape('M126 236Q160 214 194 236L188 256Q160 266 132 256Z', shade(o.topC, -.14)) + shape('M114 246Q134 238 148 250Q160 258 172 250Q186 238 206 246L196 298Q190 314 190 322L130 322Q130 314 124 298Z', topFill) + strokeLine('M152 256v22M168 256v22', 2.6, o.trim) + strokeLine('M132 318h56', 6, o.trim),
    blouse: shape('M116 246Q136 234 148 228L172 228Q184 234 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + shape('M146 226Q160 234 160 246Q146 256 134 240ZM174 226Q160 234 160 246Q174 256 186 240Z', o.trim) + [266, 290, 314].map(y => `<circle cx="160" cy="${y}" r="3" fill="${o.trim}" stroke="${INK}" stroke-width="1.2"/>`).join(''),
    tunic: shape('M116 246Q136 234 148 226L172 226Q184 234 204 246L196 300Q196 340 214 426Q160 442 106 426Q124 340 124 300Z', topFill) + strokeLine('M108 422Q160 438 212 422', 5, o.trim) + strokeLine('M148 228Q160 240 172 228', 4, o.trim),
    bandeau: shape('M124 268Q160 282 196 268L192 300Q160 312 128 300Z', topFill) + strokeLine('M127 298Q160 310 193 298', 4, o.trim),
    halter: strokeLine('M138 262L150 226M182 262L170 226', 6, o.topC) + shape('M128 262Q160 246 192 262L194 296Q186 318 186 344L134 344Q134 318 126 296Z', topFill) + strokeLine('M132 340h56', 5, o.trim),
    cardigan: shape('M116 246Q134 234 148 234L156 380L118 376Q124 330 124 298ZM204 246Q186 234 172 234L164 380L202 376Q196 330 196 298Z', topFill) + strokeLine('M148 236L156 378M172 236L164 378', 4, o.trim) + [270, 300, 330].map(y => `<circle cx="151" cy="${y}" r="3" fill="${o.trim}" stroke="${INK}" stroke-width="1.2"/>`).join(''),
    sweater: shape('M110 246Q136 228 148 226L172 226Q184 228 210 246L204 300Q204 340 208 372Q160 386 112 372Q116 340 116 300Z', topFill) + strokeLine('M114 368Q160 382 206 368', 7, o.trim) + strokeLine('M146 228Q160 238 174 228', 7, o.trim),
    vest: shape('M122 250Q136 236 148 234L160 296L172 234Q184 236 198 250L194 296Q188 322 192 352L160 366L128 352Q132 322 126 296Z', topFill) + [300, 322, 344].map(y => `<circle cx="160" cy="${y}" r="3" fill="${o.trim}" stroke="${INK}" stroke-width="1.2"/>`).join(''),
    lacetop: shape('M116 246Q136 234 148 228L172 228Q184 234 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + [260, 278, 296, 314, 332].map(y => strokeLine('M134 ' + y + 'q6 7 13 0t13 0 13 0 13 0', 1.6, o.trim)).join('') + strokeLine('M146 230Q160 240 174 230', 5, o.trim),
    kimono: shape('M116 246Q136 234 150 232L160 300L170 232Q184 234 204 246L198 300Q196 350 212 430Q160 444 108 430Q124 350 122 300Z', topFill) + strokeLine('M150 234L160 300L170 234', 7, o.trim) + shape('M124 340Q160 352 196 340L198 372Q160 384 122 372Z', o.trim),
    bat: shape('M116 246Q136 234 148 230L172 230Q184 234 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + strokeLine('M134 340h52', 5, o.trim) + strokeLine('M146 232Q160 244 174 232', 4, o.trim),
  } as Record<string, string>)[o.top] || '';

  /* ---------- in her hand ---------- */
  const held = ({
    cup: `<path d="M78 416h34v10c0 14-8 22-17 22s-17-8-17-22z" fill="#fff6fb" stroke="${INK}" stroke-width="2.6"/><ellipse cx="95" cy="416" rx="17" ry="4.5" fill="#b80e63" stroke="${INK}" stroke-width="2"/><path d="M111 422h5a6 6 0 010 13h-7" fill="none" stroke="#fff6fb" stroke-width="4"/><circle cx="90" cy="430" r="2" fill="${INK}"/><circle cx="100" cy="430" r="2" fill="${INK}"/>` + strokeLine('M88 408q-3-5 0-10M99 408q-3-5 0-10', 2.4, '#35dcc8'),
    purse: strokeLine('M56 432q12-22 26 0', 3, INK) + shape('M46 432h46l6 36q-29 10-58 0z', o.trim) + `<circle cx="69" cy="444" r="4" fill="#f4d35e" stroke="${INK}" stroke-width="1.6"/>`,
    skull: strokeLine('M58 428q10-14 22 0', 3, INK) + shape('M69 428c-16 0-25 11-25 24 0 9 5 15 12 18v8h26v-8c7-3 12-9 12-18 0-13-9-24-25-24z', '#fff6fb') + `<circle cx="60" cy="452" r="6" fill="${INK}"/><circle cx="78" cy="452" r="6" fill="${INK}"/>`,
    wand: strokeLine('M70 428L44 378', 6, INK) + strokeLine('M70 428L44 378', 3, o.trim) + `<path d="M44 358l5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1z" fill="#f4d35e" stroke="${INK}" stroke-width="2.2"/>`,
    phone: shape('M60 396l18-1 8 8-3 50-20 1-8-8z', '#ff1f8f') + shape('M63 404l14-1 3 3-2 38-13 1-4-4z', '#14101a'),
    mic: strokeLine('M74 440L58 396', 7, INK) + strokeLine('M74 440L58 396', 4, '#c0c0d8') + '<circle cx="55" cy="388" r="10" fill="#14101a" stroke="' + INK + '" stroke-width="2.4"/>' + strokeLine('M49 384l12 8M49 392l10-10', 1.4, '#c0c0d8'),
    rose: strokeLine('M74 440L52 384', 3.4, '#2f8f00') + '<circle cx="50" cy="376" r="12" fill="#14101a" stroke="' + INK + '" stroke-width="2.4"/>' + strokeLine('M44 374q6-8 12 0-6 8-12 0', 1.8, '#b80e63'),
    book: shape('M40 414h48v50H40z', '#6a1f86') + strokeLine('M46 414v50', 3, o.trim) + '<circle cx="66" cy="436" r="8" fill="#fff6fb"/><circle cx="63" cy="435" r="1.8" fill="' + INK + '"/><circle cx="69" cy="435" r="1.8" fill="' + INK + '"/>',
    brolly: strokeLine('M74 440L58 346', 4, '#14101a') + '<path d="M16 352Q58 300 100 340L88 346L76 336L66 350L52 338L40 354L28 344Z" fill="#14101a" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' + strokeLine('M30 342Q58 312 88 334', 1.6, '#ff1f8f'),
  } as Record<string, string>)[o.hold] || '';
  const heldThere = held ? '<g transform="translate(' + holdDX.toFixed(1) + ' ' + holdDY.toFixed(1) + ')">' + held + '</g>' : '';
  if (pose.front && pose.front.includes('L')) frontParts += heldThere; else parts.hold = heldThere;
  parts.armsFront = frontParts;

  /* ---------- necklaces, on-your-back things and face details ---------- */
  parts.neck = ({
    choker: strokeLine('M147 222Q160 230 173 222', 6, o.trim),
    skull: strokeLine('M146 226Q160 262 174 226', 2.4, INK) + '<circle cx="160" cy="254" r="8" fill="#fff6fb" stroke="' + INK + '" stroke-width="1.8"/><circle cx="157" cy="253" r="1.8" fill="' + INK + '"/><circle cx="163" cy="253" r="1.8" fill="' + INK + '"/>',
    pearls: [[146, 228], [150, 238], [155, 245], [160, 248], [165, 245], [170, 238], [174, 228]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3.6" fill="#fff6fb" stroke="' + INK + '" stroke-width="1"/>').join(''),
    chain: strokeLine('M146 226Q160 268 174 226', 3, '#f4d35e') + strokeLine('M146 226Q160 268 174 226', 1, INK, 'stroke-dasharray="2 3"'),
    heart: strokeLine('M146 226Q160 256 174 226', 2, '#f4d35e') + '<path d="M160 262c-9-7-11-14-5-16 3-1 5 1 5 3 0-2 2-4 5-3 6 2 4 9-5 16z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1.6"/>',
    spikes: strokeLine('M146 222Q160 232 174 222', 8, '#14101a') + '<path d="M148 228l2 9 3-7zM156 231l3 9 3-9zM164 230l3 7 2-9z" fill="#c0c0d8" stroke="' + INK + '" stroke-width="1"/>',
  } as Record<string, string>)[o.neck] || '';
  parts.back = ({
    cape: '<path d="M124 236L196 236C230 380 250 540 262 650Q160 680 58 650C70 540 90 380 124 236Z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>',
    short: '<path d="M122 236L198 236L240 420Q160 446 80 420Z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>',
    bag: '<rect x="108" y="254" width="104" height="108" rx="24" fill="' + o.topC + '" stroke="' + INK + '" stroke-width="2.6"/>' + strokeLine('M120 340h80', 3, o.trim),
    tail: strokeLine('M186 372C250 400 270 450 244 490', 9, INK) + strokeLine('M186 372C250 400 270 450 244 490', 5, o.trim) + '<path d="M244 482l-18 22 26 2z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.4"/>',
    bigbow: '<path d="M160 300L66 240q-16 60 0 120zM160 300l94-60q16 60 0 120z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>',
  } as Record<string, string>)[o.back] || '';
  parts.mark = ({
    freckles: [[112, 152], [120, 158], [128, 152], [192, 152], [200, 158], [208, 152]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="1.8" fill="' + shade(S, -.42) + '"/>').join(''),
    blush: '<ellipse cx="116" cy="158" rx="16" ry="8" fill="#ff1f8f" opacity=".42"/><ellipse cx="204" cy="158" rx="16" ry="8" fill="#ff1f8f" opacity=".42"/>',
    star: '<path d="M204 152l2.5 6 6.5.5-5 4 1.5 6.5-5.500-3.500-5.500 3.500 1.500-6.500-5-4 6.500-.5z" fill="' + o.shadow + '"/>',
    heart: '<path d="M204 166c-8-6-10-12-5-14 3-1 5 1 5 3 0-2 2-4 5-3 5 2 3 8-5 14z" fill="' + o.shadow + '"/>',
    tear: '<path d="M196 146c3 5 5 8 5 11a5 5 0 01-10 0c0-3 2-6 5-11z" fill="#14101a"/>',
    mole: '<circle cx="178" cy="170" r="2.2" fill="#14101a"/>',
    bandage: '<g transform="rotate(-18 112 158)"><rect x="98" y="152" width="28" height="11" rx="4" fill="#f4d9b0" stroke="' + INK + '" stroke-width="1.4"/><path d="M108 155v5M112 155v5M116 155v5" stroke="' + INK + '" stroke-width=".9"/></g>',
  } as Record<string, string>)[o.mark] || '';
  parts.eyewear = ({
    round: '<g fill="none" stroke="' + o.trim + '" stroke-width="3.4"><circle cx="128" cy="126" r="21"/><circle cx="192" cy="126" r="21"/><path d="M149 124h22"/></g>',
    cat: '<g fill="none" stroke="' + o.trim + '" stroke-width="3.6" stroke-linejoin="round"><path d="M100 110L150 116Q150 148 124 146Q104 142 100 110Z"/><path d="M220 110L170 116Q170 148 196 146Q216 142 220 110Z"/><path d="M150 122h20"/></g>',
    shades: '<path d="M102 112H152V132Q148 150 124 148Q104 146 102 112ZM218 112H168V132Q172 150 196 148Q216 146 218 112Z" fill="#14101a" stroke="' + INK + '" stroke-width="2.4"/>' + strokeLine('M152 118h16', 4, o.trim) + strokeLine('M112 120l20 14M178 120l20 14', 2.4, '#fff6fb', 'opacity=".5"'),
    hearts: '<path d="M128 150c-24-16-30-32-16-38 8-3 14 2 16 8 2-6 8-11 16-8 14 6 8 22-16 38zM192 150c-24-16-30-32-16-38 8-3 14 2 16 8 2-6 8-11 16-8 14 6 8 22-16 38z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.4"/>' + strokeLine('M146 124h28', 3, INK),
    visor: '<path d="M98 110Q160 96 222 110L218 140Q160 126 102 140Z" fill="' + o.trim + '" opacity=".78" stroke="' + INK + '" stroke-width="2.6"/>',
    monocle: '<circle cx="192" cy="126" r="22" fill="none" stroke="#f4d35e" stroke-width="3.4"/>' + strokeLine('M212 136C224 170 216 200 208 226', 1.6, '#f4d35e'),
  } as Record<string, string>)[o.eyewear] || '';

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
    afro() {
      parts.hairBack = '<circle cx="160" cy="92" r="96" fill="' + hair + '" stroke="' + INK + '" stroke-width="2.6"/>' + strokeLine('M86 92q8-52 54-68M234 92q-8-52-54-68', 5, o.streak, 'opacity=".8"');
      parts.hairFront = shape('M100 112C104 66 130 46 160 46C190 46 216 66 220 112C206 84 186 72 160 72C134 72 114 84 100 112Z', hair);
    },
    braids() {
      const braid = '<g>' + [130, 170, 210, 250, 290, 330, 370, 410].map((y, i) => '<ellipse cx="' + (72 + (i % 2) * 8) + '" cy="' + y + '" rx="17" ry="24" fill="' + (i % 2 ? hair : hairD) + '" stroke="' + INK + '" stroke-width="2.4"/>').join('') + '</g>' + shape('M64 430h24l-4 30h-16z', o.streak);
      parts.hairBack = mirror(braid) + shape('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z', hair);
      parts.hairFront = shape(SWEPT, hair) + shine('M122 60C136 46 150 42 164 42');
    },
    waves() {
      parts.hairBack = shape('M160 24C80 24 72 92 78 150C60 190 96 220 74 262C54 300 92 330 70 374C60 410 84 440 104 444C126 420 116 400 130 380L190 380C204 400 194 420 216 444C236 440 260 410 250 374C228 330 266 300 246 262C224 220 260 190 242 150C248 92 240 24 160 24Z', hair) + streak('M90 170C74 200 106 226 86 262C70 300 102 330 84 372') + shine('M230 170C246 200 214 226 234 262C250 300 218 330 236 372');
      parts.hairFront = shape(SWEPT, hair) + streak('M176 68C190 80 208 96 216 116', 7);
    },
    pixie() {
      parts.hairBack = shape('M160 26C96 26 86 84 92 142L104 170L216 170L228 142C234 84 224 26 160 26Z', hair);
      parts.hairFront = shape('M98 126C94 62 130 34 164 36C204 36 228 66 222 118L206 100L188 96L176 74L150 92L124 96L112 112Z', hair) + streak('M178 62L204 94', 6);
    },
    mohawk() {
      parts.hairBack = '<path d="M122 62L104 18L136 38L146 2L164 32L184 2L188 38L218 18L198 62Z" fill="' + o.streak + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
      parts.hairFront = shape('M124 62C136 46 184 46 196 62L186 74C174 66 146 66 134 74Z', hair);
    },
    halfup() {
      parts.hairBack = shape('M160 24C80 24 74 92 82 150C88 240 74 300 84 370Q110 384 124 350L196 350Q210 384 236 370C246 300 232 240 238 150C246 92 240 24 160 24Z', hair) + streak('M94 170C94 240 84 300 92 356');
      parts.hairFront = '<circle cx="160" cy="26" r="24" fill="' + hair + '" stroke="' + INK + '" stroke-width="2.6"/>' + shape(BANGS, hair) + strokeLine('M138 42q22 12 44 0', 5, o.streak);
    },
    turban() {
      parts.hairFront = '<path d="M98 112C86 50 124 16 164 18C206 18 236 56 222 112C206 86 188 74 160 74C132 74 114 86 98 112Z" fill="' + hair + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>' + strokeLine('M104 86C130 44 186 30 220 84M116 54C150 68 190 62 212 44', 2.4, hairD) + '<circle cx="160" cy="36" r="9" fill="' + o.streak + '" stroke="' + INK + '" stroke-width="2.2"/>';
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
    beret: `<path d="M92 66C96 24 170 2 226 32C238 56 214 72 170 64C140 58 110 62 92 66Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.6"/>` + strokeLine('M186 16l6-10', 4, INK),
    band: strokeLine('M100 90C116 36 204 36 220 90', 9, INK) + strokeLine('M100 90C116 36 204 36 220 90', 5, o.trim),
    witch: `<path d="M58 66Q160 36 262 66Q160 88 58 66Z" fill="#14101a" stroke="${INK}" stroke-width="2.6"/><path d="M112 58L170 -40Q176 20 208 58Q160 44 112 58Z" fill="#14101a" stroke="${INK}" stroke-width="2.6"/><path d="M116 50Q160 36 204 50L208 60Q160 46 112 60Z" fill="${o.trim}"/>`,
    halo: strokeLine('M100 6a60 14 0 10120 0a60 14 0 10-120 0', 8, INK) + strokeLine('M100 6a60 14 0 10120 0a60 14 0 10-120 0', 4.4, '#f4d35e'),
    cat: `<path d="M108 66L104 12L150 44ZM212 66L216 12L170 44Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`,
    stars: [[120, 66], [204, 66], [212, 92]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="M0-11l3 7 8 .5-6 5 2 8-7-4-7 4 2-8-6-5 8-.5z" fill="#f4d35e" stroke="${INK}" stroke-width="1.8"/>`).join(''),
  } as Record<string, string>)[o.headwear] || '';

  const lean = pose.lean || 0, tilt = pose.tilt || 0, lift = pose.lift || 0;
  const LOWER: Layer[] = ['legs', 'legwear', 'pants', 'shoes'];
  const placed = (l: Layer): string => {
    let out = parts[l] || '';
    if (!out) return '';
    if (tilt && HEAD_LAYERS.includes(l)) out = '<g transform="rotate(' + tilt + ' 160 195)">' + out + '</g>';
    if (lean && !LOWER.includes(l)) out = '<g transform="rotate(' + lean + ' 160 385)">' + out + '</g>';
    return lift ? '<g transform="translate(0 ' + (-lift) + ')">' + out + '</g>' : out;
  };
  const inner = LAYER_ORDER.filter(l => !opt.only || opt.only.includes(l)).map(placed).join('');
  const box = opt.box || (opt.head ? HEAD_BOX : needsRoom ? WIDE_BOX : '0 0 320 720');
  const label = (opt.label || '').replace(/[&<>"]/g, ch => '&#' + ch.charCodeAt(0) + ';');
  return `<svg viewBox="${box}" style="overflow:visible" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs>${defs}</defs>${inner}</svg>`;
}

/* Lunch Riot targets: plain skulls, not students */
function riotSkulls(): string[] {
  return ['#ff1f8f', '#19b7e8', '#35dcc8', '#f4d35e'].map(bow => `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 16c-26 0-42 18-42 42 0 16 8 28 20 34v14h44V92c12-6 20-18 20-34 0-24-16-42-42-42z" fill="#fff6fb" stroke="#000" stroke-width="4"/><circle cx="44" cy="60" r="11"/><circle cx="76" cy="60" r="11"/><path d="M60 72l-6 12h12z"/><path d="M60 22L38 8q-6 14 4 22zM60 22l22-14q6 14-4 22z" fill="${bow}" stroke="#000" stroke-width="3"/></svg>`);
}
