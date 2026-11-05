/* ---------- cartoon ghouls: original, layered, dressable ---------- */
interface Look {
  skin: string; eye: string; lip: string; shadow: string;
  hairStyle: string; hair: string; streak: string;
  monster: string; headwear: string; hold: string;
  top: string; topC: string; topP: string; trim: string;
  bottom: string; bottomC: string; bottomP: string;
  legs: string; legsC: string;
  shoes: string; shoesC: string;
  pet: string; petC: string;
  pose: string; nose: string; lipSize: string; eyeStyle: string; brow: string; browC: string; eyewear: string; neck: string; gloves: string; gloveC: string; wrist: string; mark: string; back: string;
}
type Layer = 'back' | 'neck' | 'mark' | 'eyewear' | 'armsFront' | 'wings' | 'hairBack' | 'legs' | 'legwear' | 'pants' | 'shoes' | 'torso' | 'bottom' | 'top' | 'arms' | 'sleeves' | 'hold' | 'head' | 'face' | 'monster' | 'hairFront' | 'headwear' | 'pet';
const LAYER_ORDER: Layer[] = ['back', 'wings', 'hairBack', 'legs', 'legwear', 'pants', 'shoes', 'torso', 'bottom', 'top', 'neck', 'arms', 'sleeves', 'hold', 'head', 'face', 'mark', 'monster', 'hairFront', 'eyewear', 'headwear', 'armsFront', 'pet'];
/* Trousers whose hem reaches the shoes: these fall over the shoes instead of being tucked under them. */
const LONG_TROUSERS = ['palazzo', 'flares', 'wide', 'sailor', 'bootcut', 'overalls', 'tux', 'straps', 'straight', 'ripped', 'patched', 'chains', 'track', 'paperbag', 'leather', 'laceup', 'bellcuff', 'harem', 'leggings', 'cargo', 'skinny', 'joggers'];
const HEAD_LAYERS: Layer[] = ['hairBack', 'head', 'face', 'mark', 'monster', 'hairFront', 'eyewear', 'headwear'];
const INK = '#1c0f22';

const SKINS = ['#d9c8f2', '#f4cfae', '#c98f63', '#7d5136', '#a8dcf0', '#b8f0d0', '#f7b8cf', '#e9e4d6', '#fbe3d0', '#e8b48a', '#a96f45', '#5b3522', '#3d2417', '#9bd16b', '#c7c9d3', '#ffd9a0'];
const HAIR_COLOURS = ['#17101c', '#5a2c17', '#a0392a', '#f4d35e', '#f6f0ff', '#f08fb4', '#ff1f8f', '#19b7e8', '#35dcc8', '#8a2be2', '#2c2436', '#8b5a2b', '#d98a3d', '#c0392b', '#9aa0ac', '#6a1f86', '#1f6fb2', '#2f8f4e', '#ffb3c7', '#e9e4d6'];
const BRIGHT = ['#14101a', '#fff6fb', '#ff1f8f', '#f08fb4', '#6a1f86', '#19b7e8', '#35dcc8', '#8df04a', '#f4d35e', '#c0392b', '#2c2436', '#9aa0ac', '#1f3a8a', '#0f766e', '#2f8f4e', '#ff8c1a', '#8b5a2b', '#c9a227', '#b19cd9', '#ffd1dc'];
const PATTERNS: Array<[string, string]> = [['solid', 'Plain'], ['stripes', 'Stripes'], ['argyle', 'Argyle'], ['tartan', 'Tartan'], ['skulls', 'Skulls'], ['dots', 'Polka dots'], ['hearts', 'Hearts'], ['stars', 'Stars'], ['bats', 'Bats'], ['checks', 'Checks'], ['zigzag', 'Zigzag'], ['webs', 'Webs'], ['spots', 'Leopard'], ['diamonds', 'Diamonds'], ['flowers', 'Flowers']];

/* Arms: [upper, forearm] angles in degrees. 0 hangs straight down, 90 points straight out, 180 straight up, and below 0 crosses the body.
   Legs: [hip, knee], with positive swinging outward. Hands: open, relaxed, fist, point, peace, horns. front puts that arm over the face. */
interface Pose { id: string; name: string; armL: [number, number]; armR: [number, number]; legL?: [number, number]; legR?: [number, number]; lean?: number; tilt?: number; lift?: number; handL?: string; handR?: string; front?: 'L' | 'R' | 'LR' }
const POSES: Pose[] = [
  { id: 'classic', name: 'Classic', armL: [20, 15], armR: [32, -31], legL: [-4, 2], legR: [5, -6], tilt: 4 },
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
  { id: 'power', name: 'Power pose', armL: [32, -31], armR: [32, -31], handL: 'relaxed', legL: [-15, 7], legR: [-15, 7], lean: 2, tilt: -7 },
  { id: 'cheek', name: 'Finger to cheek', armL: [16, 10], armR: [95, -118], handL: 'relaxed', handR: 'point', legL: [-5, 3], legR: [14, -24], lean: -2, tilt: 9, front: 'R' },
  { id: 'toss', name: 'Hair toss', armL: [32, -31], armR: [125, -150], handR: 'open', legL: [11, -16], legR: [-7, 4], lean: 6, tilt: -10, front: 'R' },
  { id: 'pigeon', name: 'Pigeon toes', armL: [32, -31], armR: [14, 8], handR: 'relaxed', legL: [11, -24], legR: [11, -24], tilt: 8 },
  { id: 'stride', name: 'Big stride', armL: [-12, -4], armR: [28, 18], handL: 'relaxed', handR: 'relaxed', legL: [-14, 8], legR: [22, -18], lean: 4, tilt: 7 },
  { id: 'vogue', name: 'Vogue', armL: [125, -150], armR: [32, -31], handL: 'open', legL: [7, -6], legR: [-14, 7], tilt: 8, lean: -4, front: 'L' },
  { id: 'curtsy', name: 'Curtsy', armL: [38, 12], armR: [38, 12], handL: 'relaxed', handR: 'relaxed', legL: [-17, 12], legR: [20, -20], tilt: 10 },
  { id: 'phone', name: 'Selfie', armL: [20, 15], armR: [70, 150], handR: 'relaxed', tilt: 7, legR: [10, -10] },
];
const poseOf = (id: string): Pose => POSES.find(p => p.id === id) || POSES[0];

interface WardrobePage {
  title: string; key?: keyof Look; items?: Array<[string, string]>;
  colours: Array<[keyof Look, string, string[]]>; pattern?: keyof Look;
  /* crop: this box shows just part of a bigger drawing, so it stays zoomed in. */
  box: string; layers: Layer[]; crop?: boolean;
}
/* Scarf styles are built from parts: how it falls, the top of the head, the edge and any pin. */
interface Hijab { id: string; name: string; drape?: string; crown?: string; edge?: string; acc?: string; print?: string }
const HIJABS: Hijab[] = [
  { id: 'hijab', name: 'Classic wrap' }, { id: 'turban', name: 'Head wrap' },
  { id: 'shayla', name: 'Shayla', drape: 'side' }, { id: 'amira', name: 'Al-Amira', drape: 'short', crown: 'band' },
  { id: 'khimar', name: 'Khimar', drape: 'long' }, { id: 'capewrap', name: 'Cape khimar', drape: 'cape' },
  { id: 'pashmina', name: 'Pashmina', drape: 'cross' }, { id: 'bawal', name: 'Square peak', crown: 'peak', acc: 'pin' },
  { id: 'turkish', name: 'Pinned chin', drape: 'bib', acc: 'pin' }, { id: 'sporty', name: 'Sport hijab', drape: 'neck' },
  { id: 'volume', name: 'Volume crown', crown: 'volume' }, { id: 'highbun', name: 'High bun', crown: 'bun', drape: 'side' },
  { id: 'crosswrap', name: 'Cross front', drape: 'cross', crown: 'band' }, { id: 'twotails', name: 'Two tails', drape: 'tails' },
  { id: 'chestknot', name: 'Chest knot', drape: 'knot' }, { id: 'neckwrap', name: 'Neck wrap', drape: 'neck', crown: 'volume' },
  { id: 'layered', name: 'Layered', drape: 'layers' }, { id: 'ruffled', name: 'Ruffle edge', edge: 'ruffle' },
  { id: 'lacetrim', name: 'Lace trim', edge: 'lace', drape: 'long' }, { id: 'pearltrim', name: 'Pearl trim', edge: 'pearl' },
  { id: 'fringed', name: 'Fringe', edge: 'fringe', drape: 'long' }, { id: 'stripeedge', name: 'Stripe edge', edge: 'stripe' },
  { id: 'dotted', name: 'Polka scarf', print: 'dots' }, { id: 'starry', name: 'Star scarf', print: 'stars', drape: 'side' },
  { id: 'floral', name: 'Floral scarf', print: 'flowers', drape: 'long' }, { id: 'rosepin', name: 'Rose pin', acc: 'rose' },
  { id: 'sidebow', name: 'Side bow', acc: 'bow', drape: 'short' }, { id: 'gempin', name: 'Gem brooch', acc: 'gem', drape: 'long' },
  { id: 'chainscarf', name: 'Chain trim', acc: 'chain', drape: 'short' }, { id: 'twotone', name: 'Two-tone', crown: 'band', edge: 'stripe', drape: 'cape' },
];
/* Every skirt's hem height and half width at the hem, so it can be stretched over a raised leg. */
const SKIRT_FIT: Record<string, [number, number]> = { pleats: [456, 66], tutu: [440, 75], shred: [440, 56], pencil: [490, 38], maxi: [680, 86], tiered: [510, 64], midi: [580, 64], wrap: [480, 50], bubble: [455, 58], aline: [448, 56], skater: [450, 72], circle: [560, 90], mermaid: [680, 84], hilow: [650, 76], asym: [600, 60], rufflemaxi: [650, 72], lacehem: [500, 60], tulle: [680, 96], denim: [440, 42], kilt: [470, 54], cargoskirt: [520, 50], slit: [676, 70], buttonmidi: [570, 56], pleatmaxi: [680, 80], batwing: [470, 68], hanky: [490, 80], corsetskirt: [530, 42], beltedmidi: [570, 60], sequin: [440, 54], gypsy: [680, 82] };
const GLOVE_LONG = ['opera', 'lace', 'mesh', 'stripes', 'dots', 'skeleton', 'satin', 'velvet', 'scales', 'batgloves'];
const GLOVE_SHORT = ['short', 'biker', 'frill', 'driving', 'spiked', 'wraps', 'mittens', 'boxing', 'paws'];
const NAILS: Record<string, string> = { nails: '', french: '#fff6fb', ombre: '', stilettos: '', glitter: '', rainbownails: '#ff1f8f|#f4d35e|#35dcc8|#6a1f86', gothnails: '#14101a', claws: '#14101a', henna: '#8a3324' };
/* Eye shapes: white of the eye, upper lid, lower lid, iris height, iris size, lash shift. */
const EYE_SHAPES: Record<string, [string, string, string, number, number, number]> = {
  almond: ['M-27 6C-22-17 4-27 29-11C24 9 0 23-27 6Z', 'M-29 7C-23-19 4-29 30-12L38-15', 'M-21 11Q4 22 25-2', -3, 16, 0],
  round: ['M-26 2C-26-28 26-28 26 0C26 24-26 24-26 2Z', 'M-28 3C-27-30 27-30 28-1', 'M-21 14Q0 24 21 13', -1, 16, 0],
  doll: ['M-30 2C-30-36 30-36 30 0C30 28-30 28-30 2Z', 'M-32 3C-31-38 31-38 32-1', 'M-25 16Q0 30 25 15', 0, 20, -6],
  cat: ['M-25 8Q-6-16 30-20Q16 16-25 8Z', 'M-27 9Q-6-18 30-21L44-30', 'M-20 12Q8 16 26-12', -3, 12.5, 0],
  doe: ['M-24-6Q0-24 26 6Q4 18-24-6Z', 'M-26-6Q0-27 28 8', 'M-20 1Q6 18 24 8', -2, 13, -2],
  wide: ['M-31 2Q0-22 31-2Q0 19-31 2Z', 'M-33 3Q0-25 33-2L42-8', 'M-26 8Q0 19 26 4', -2, 13.5, -1],
  narrow: ['M-26 2Q0-10 26-4Q0 10-26 2Z', 'M-28 3Q0-12 28-4L38-9', 'M-20 6Q4 10 22 0', -1, 12, 8],
  hooded: ['M-25 2Q-4-6 25-4Q8 16-25 2Z', 'M-28 0Q-4-12 28-6', 'M-20 6Q4 15 22 0', 0, 12, 7],
  sleepy: ['M-25 4Q-6-2 24 0Q8 18-25 4Z', 'M-27 4Q-6-4 26 0', 'M-20 9Q4 17 22 3', 3, 12, 9],
  monolid: ['M-26 2Q-4-12 28-8Q10 12-26 2Z', 'M-28 3Q-4-14 30-9L38-13', 'M-20 6Q6 12 24-3', -2, 11.5, 5],
  angry: ['M-25 6Q-6-4 26-16Q12 18-25 6Z', 'M-27 6Q-6-5 28-18', 'M-20 10Q6 18 24-4', 1, 12, 3],
  sad: ['M-25-8Q4-16 26 6Q4 18-25-8Z', 'M-27-9Q4-19 28 8', 'M-20 0Q4 16 24 8', 0, 12, -1],
};
const EYES: Array<{ id: string; name: string; shape?: string; pupil?: string; lash?: string }> = [
  { id: 'classic', name: 'Almond' }, { id: 'round', name: 'Round', shape: 'round' }, { id: 'doll', name: 'Big doll', shape: 'doll' }, { id: 'cat', name: 'Cat eye', shape: 'cat' }, { id: 'doe', name: 'Doe eye', shape: 'doe' },
  { id: 'wide', name: 'Wide', shape: 'wide' }, { id: 'narrow', name: 'Narrow', shape: 'narrow' }, { id: 'hooded', name: 'Hooded', shape: 'hooded' }, { id: 'sleepy', name: 'Sleepy', shape: 'sleepy' }, { id: 'monolid', name: 'Monolid', shape: 'monolid' },
  { id: 'closed', name: 'Closed', pupil: 'shut' }, { id: 'wink', name: 'Wink', pupil: 'wink' }, { id: 'happy', name: 'Happy arcs', pupil: 'arc' }, { id: 'angry', name: 'Angry', shape: 'angry' }, { id: 'sad', name: 'Sad', shape: 'sad' },
  { id: 'winged', name: 'Winged liner', lash: 'wing' }, { id: 'bold', name: 'Bold liner', lash: 'thick' }, { id: 'nolash', name: 'No lashes', lash: 'none' }, { id: 'lashy', name: 'Long lashes', lash: 'long' }, { id: 'bottomlash', name: 'Bottom lashes', lash: 'bottom' },
  { id: 'slit', name: 'Vampire slit', shape: 'cat', pupil: 'slit' }, { id: 'star', name: 'Star pupils', shape: 'round', pupil: 'star' }, { id: 'heart', name: 'Heart pupils', shape: 'round', pupil: 'heart' }, { id: 'cross', name: 'Diamond pupils', pupil: 'diamond' }, { id: 'spiral', name: 'Hypnotised', shape: 'round', pupil: 'spiral' },
  { id: 'glow', name: 'Glowing', pupil: 'glow', lash: 'none' }, { id: 'blackout', name: 'Demon black', shape: 'cat', pupil: 'blackout' }, { id: 'button', name: 'Button eyes', shape: 'round', pupil: 'button', lash: 'none' }, { id: 'sparkle', name: 'Sparkly', shape: 'doll', pupil: 'sparkle' }, { id: 'mismatch', name: 'Two colours', pupil: 'mismatch' },
];
const BROW_COLOURS = ['#17101c', '#3f2412', '#5a2c17', '#8b5a2b', '#a0392a', '#d98a3d', '#f4d35e', '#9aa0ac', '#f6f0ff', '#ff1f8f', '#f08fb4', '#6a1f86', '#19b7e8', '#35dcc8', '#2f8f4e', '#c0392b'];
const LEG_IN = 4, SLIM = .82;
const LIP_SIZES: Record<string, number> = { tiny: .5, small: .65, medium: .82, full: 1, big: 1.18 };
const HEAD_ONLY_BOX = '46 -14 228 232';
const HEAD_BOX = '62 8 196 206';
const WIDE_BOX = '-50 -10 420 730';
/* Everything the Bone Boutique sells. The names and prices also live in the database's buy_shop_item. */
interface ShopItem { id: string; slot: 'neck' | 'wrist'; name: string; brand: string; price: number }
const SHOP_ITEMS: ShopItem[] = [
  { id: 'pearlstrand', slot: 'neck', name: 'Pearl necklace', brand: 'Fine jewellery', price: 300 },
  { id: 'diamondpendant', slot: 'neck', name: 'Diamond pendant', brand: 'Fine jewellery', price: 350 },
  { id: 'tiffanyheart', slot: 'neck', name: 'Return to Tiffany heart tag', brand: 'Tiffany & Co.', price: 380 },
  { id: 'rubyheart', slot: 'neck', name: 'Ruby heart pendant', brand: 'Fine jewellery', price: 450 },
  { id: 'tennisnecklace', slot: 'neck', name: 'Diamond tennis necklace', brand: 'Fine jewellery', price: 480 },
  { id: 'sapphirependant', slot: 'neck', name: 'Sapphire and pearl pendant', brand: 'Fine jewellery', price: 550 },
  { id: 'diamondchain', slot: 'neck', name: 'Iced-out diamond chain', brand: 'Fine jewellery', price: 650 },
  { id: 'alhambra', slot: 'neck', name: 'Vintage Alhambra', brand: 'Van Cleef & Arpels', price: 700 },
  { id: 'tennisbracelet', slot: 'wrist', name: 'Diamond tennis bracelet', brand: 'Fine jewellery', price: 400 },
  { id: 'diamondring', slot: 'wrist', name: 'Diamond solitaire ring', brand: 'Fine jewellery', price: 500 },
  { id: 'cartierlove', slot: 'wrist', name: 'Love bracelet', brand: 'Cartier', price: 600 },
  { id: 'rolexsub', slot: 'wrist', name: 'Submariner', brand: 'Rolex', price: 700 },
  { id: 'omegaseamaster', slot: 'wrist', name: 'Seamaster', brand: 'Omega', price: 750 },
  { id: 'cartiertank', slot: 'wrist', name: 'Tank', brand: 'Cartier', price: 850 },
  { id: 'rolexdaydate', slot: 'wrist', name: 'Day-Date', brand: 'Rolex', price: 1000 },
  { id: 'hublotbigbang', slot: 'wrist', name: 'Big Bang', brand: 'Hublot', price: 1100 },
  { id: 'aproyaloak', slot: 'wrist', name: 'Royal Oak', brand: 'Audemars Piguet', price: 1200 },
  { id: 'rolexdaytona', slot: 'wrist', name: 'Daytona', brand: 'Rolex', price: 1300 },
  { id: 'pateknautilus', slot: 'wrist', name: 'Nautilus', brand: 'Patek Philippe', price: 1500 },
  { id: 'rolexiced', slot: 'wrist', name: 'Iced-out Datejust', brand: 'Rolex', price: 1800 },
  { id: 'richardmille', slot: 'wrist', name: 'RM 011', brand: 'Richard Mille', price: 2500 },
];
const SHOP_BY_ID: Record<string, ShopItem> = Object.fromEntries(SHOP_ITEMS.map(i => [i.id, i]));
let shopOwned = new Set<string>();
/* The wardrobe only offers shop pieces you own. */
const visibleItems = (page: WardrobePage): Array<[string, string]> => (page.items || []).filter(([id]) => !SHOP_BY_ID[id] || isAdmin() || shopOwned.has(id));
const WARDROBE: WardrobePage[] = [
  { title: 'Poses', key: 'pose', items: POSES.map(p => [p.id, p.name] as [string, string]), colours: [], box: WIDE_BOX, layers: [] },
  { title: 'Pets', key: 'pet', items: [['none', 'No pet'], ['bat', 'Bat'], ['cat', 'Black cat'], ['ghost', 'Ghost'], ['spider', 'Spider'], ['piranha', 'Piranha'], ['snake', 'Snake'], ['dragon', 'Baby dragon'], ['owl', 'Owl'], ['pup', 'Wolf pup'], ['bunny', 'Were-bunny'], ['jelly', 'Jellyfish'], ['frog', 'Frog prince'], ['earl', 'Earl Ghoul teacup'], ['raven', 'Raven'], ['rat', 'Sewer rat'], ['pumpkin', 'Pumpkin sprite'], ['kraken', 'Baby kraken'], ['turtle', 'Snapping turtle'], ['scorpion', 'Scorpion'], ['hedgehog', 'Hedgehog'], ['chameleon', 'Chameleon'], ['fox', 'Fox'], ['hamster', 'Hamster'], ['moth', 'Luna moth'], ['eyeball', 'Flying eyeball'], ['skull', 'Lil skull'], ['axolotl', 'Axolotl'], ['penguin', 'Vampire penguin'], ['slime', 'Slime']], colours: [['petC', 'Pet colour', ['#14101a', '#6a1f86', '#ff1f8f', '#f08fb4', '#19b7e8', '#35dcc8', '#8df04a', '#f4d35e', '#ff8c1a', '#c0392b', '#7d5136', '#9aa0ac', '#f6f0ff']]], box: '245 590 120 120', layers: ['pet'], crop: true },
  { title: 'Hair', key: 'hairStyle', items: [['long', 'Long'], ['pony', 'High pony'], ['twins', 'Twin tails'], ['bob', 'Bob'], ['curls', 'Curls'], ['side', 'Side sweep'], ['buns', 'Space buns'], ['afro', 'Afro'], ['braids', 'Long braids'], ['waves', 'Mermaid waves'], ['pixie', 'Pixie'], ['mohawk', 'Mohawk'], ['halfup', 'Half up'], ['lob', 'Long bob'], ['shag', 'Shaggy layers'], ['fishtail', 'Fishtail braid'], ['lowpony', 'Low pony'], ['topknot', 'Top knot'], ['lowbuns', 'Low buns'], ['boxbraids', 'Box braids'], ['locs', 'Locs'], ['bantu', 'Bantu knots'], ['puffs', 'Afro puffs'], ['hime', 'Blunt fringe'], ['beehive', 'Beehive'], ['rolls', 'Victory rolls'], ['crimped', 'Crimped'], ['ringlets', 'Ringlets'], ['undercut', 'Side shave'], ['spiky', 'Spiky']], colours: [['hair', 'Colour', HAIR_COLOURS], ['streak', 'Streak or folds', BRIGHT]], box: '10 0 300 330', layers: ['hairBack', 'head', 'hairFront'] },
  { title: 'Hijabs', key: 'hairStyle', items: HIJABS.map(h => [h.id, h.name] as [string, string]), colours: [['hair', 'Scarf colour', HAIR_COLOURS], ['streak', 'Second colour', BRIGHT]], box: '10 0 300 400', layers: ['hairBack', 'head', 'hairFront'] },
  { title: 'Skin and lips', key: 'lipSize', items: [['tiny', 'Tiny lips'], ['small', 'Small lips'], ['medium', 'Medium lips'], ['full', 'Full lips'], ['big', 'Big lips']], colours: [['skin', 'Skin', SKINS], ['lip', 'Lips', ['#b80e63', '#ff1f8f', '#d62828', '#5a0f7a', '#14101a', '#b5694f', '#e58f9e', '#c76b5a', '#8a3324', '#ff8c1a', '#19b7e8', '#6a1f86', '#8df04a', '#f7b8cf']]], box: '108 142 104 72', layers: ['head', 'face'], crop: true },
  { title: 'Eyes', key: 'eyeStyle', items: EYES.map(e => [e.id, e.name] as [string, string]), colours: [['eye', 'Eye colour', ['#19b7e8', '#35dcc8', '#8df04a', '#ffb703', '#c77dff', '#ff1f8f', '#7a4a21', '#3f2412', '#14101a', '#6f8f4e', '#9aa0ac', '#d62828', '#f4d35e', '#1f3a8a']], ['shadow', 'Eyeshadow', ['#ff1f8f', '#6a1f86', '#19b7e8', '#35dcc8', '#f4d35e', '#14101a', '#c0392b', '#ff8c1a', '#8df04a', '#b19cd9', '#c98f63', '#fff6fb', '#c9a227', '#1f3a8a']]], box: '88 84 144 88', layers: ['head', 'face'], crop: true },
  { title: 'Eyebrows', key: 'brow', items: [['arch', 'Soft arch'], ['high', 'High arch'], ['straight', 'Straight'], ['pencil', 'Pencil thin'], ['thick', 'Thick'], ['bushy', 'Bushy'], ['angry', 'Angry'], ['worried', 'Worried'], ['round', 'Rounded'], ['scurve', 'S curve'], ['tapered', 'Tapered'], ['feather', 'Feathered'], ['slit', 'One slit'], ['doubleslit', 'Two slits'], ['pierced', 'Pierced'], ['dotted', 'Dotted'], ['dashed', 'Dashed'], ['stitched', 'Stitched'], ['unibrow', 'Unibrow'], ['none', 'No brows'], ['ombre', 'Ombre'], ['zigzag', 'Zigzag'], ['wavy', 'Wavy'], ['starend', 'Star tip'], ['heartend', 'Heart tip'], ['spiked', 'Spiked'], ['gems', 'Gems'], ['square', 'Square'], ['flick', 'Flick up'], ['short', 'Short']], colours: [['browC', 'Colour', BROW_COLOURS]], box: '88 72 144 88', layers: ['head', 'face'], crop: true },
  { title: 'Noses', key: 'nose', items: [['button', 'Button'], ['dots', 'Two dots'], ['none', 'No nose'], ['snub', 'Snub'], ['upturned', 'Upturned'], ['pointed', 'Pointed'], ['straight', 'Straight'], ['long', 'Long'], ['wide', 'Wide'], ['ball', 'Round'], ['hooked', 'Hooked'], ['flared', 'Flared'], ['shine', 'Shiny'], ['contour', 'Contoured'], ['pink', 'Rosy tip'], ['freckled', 'Freckled'], ['pig', 'Piggy'], ['cat', 'Cat'], ['bunny', 'Bunny'], ['wolf', 'Wolf'], ['skull', 'Skull'], ['pumpkin', 'Pumpkin'], ['witch', 'Witch'], ['clown', 'Clown'], ['stud', 'Nose stud'], ['ring', 'Nose ring'], ['septum', 'Septum ring'], ['bandage', 'Plaster'], ['stitched', 'Stitched'], ['heart', 'Heart']], colours: [], box: '116 126 88 62', layers: ['head', 'face'], crop: true },
  { title: 'Face details', key: 'mark', items: [['none', 'None'], ['freckles', 'Freckles'], ['blush', 'Rosy cheeks'], ['star', 'Star'], ['heart', 'Heart'], ['tear', 'Goth tear'], ['mole', 'Beauty mark'], ['bandage', 'Plaster'], ['gems', 'Face gems'], ['glitter', 'Glitter'], ['moon', 'Moon'], ['bat', 'Bat'], ['butterfly', 'Butterfly'], ['flower', 'Flower'], ['bolt', 'Lightning'], ['scar', 'Scar'], ['web', 'Spider web'], ['dots', 'Dot trail'], ['bindi', 'Bindi'], ['nosering', 'Nose ring'], ['lipring', 'Lip ring'], ['brow', 'Brow slit'], ['whiskers', 'Whiskers'], ['tears', 'Crystal tears'], ['stripes', 'Cheek stripes'], ['warpaint', 'War paint'], ['sugar', 'Sugar skull'], ['dimples', 'Dimples'], ['liner', 'Graphic liner'], ['tattoo', 'Rose tattoo']], colours: [], box: HEAD_BOX, layers: ['head', 'face', 'mark'] },
  { title: 'Eyewear', key: 'eyewear', items: [['none', 'None'], ['round', 'Round glasses'], ['cat', 'Cat eye'], ['shades', 'Shades'], ['hearts', 'Heart shades'], ['visor', 'Visor'], ['monocle', 'Monocle'], ['square', 'Square'], ['aviator', 'Aviators'], ['oval', 'Oval'], ['half', 'Half rim'], ['starry', 'Star shades'], ['skull', 'Skull shades'], ['flower', 'Flower shades'], ['goggles', 'Goggles'], ['steam', 'Steam goggles'], ['mask', 'Party mask'], ['patch', 'Eye patch'], ['butterfly', 'Butterfly mask'], ['lace', 'Lace mask'], ['vr', 'VR visor'], ['threed', '3D glasses'], ['rainbow', 'Rainbow lens'], ['nerd', 'Taped glasses'], ['pixel', 'Pixel shades'], ['ski', 'Ski goggles'], ['catmask', 'Cat mask'], ['batmask', 'Bat mask'], ['chain', 'Chain glasses'], ['rimless', 'Rimless']], colours: [['trim', 'Trim', BRIGHT]], box: HEAD_BOX, layers: ['head', 'eyewear'] },
  { title: 'Monster side', key: 'monster', items: [['none', 'Just me'], ['fangs', 'Vampire fangs'], ['bat', 'Bat wings'], ['wolf', 'Wolf ears'], ['fins', 'Sea fins'], ['bolts', 'Neck bolts'], ['wraps', 'Mummy wraps'], ['horns', 'Little horns'], ['stitches', 'Stitches'], ['cat', 'Were-cat'], ['fox', 'Fox spirit'], ['bunny', 'Were-bunny'], ['dragon', 'Dragon'], ['ghost', 'Ghost'], ['zombie', 'Zombie'], ['scales', 'Sea scales'], ['elf', 'Elf ears'], ['alien', 'Alien'], ['cyclops', 'Third eye'], ['snakes', 'Snake hair'], ['pumpkin', 'Pumpkin kid'], ['skeleton', 'Skeleton'], ['antlers', 'Antlers'], ['unicorn', 'Unicorn horn'], ['spidereyes', 'Spider eyes'], ['gills', 'Gills'], ['tentacles', 'Tentacles'], ['tusks', 'Ogre tusks'], ['ram', 'Ram horns'], ['shark', 'Shark teeth']], colours: [], box: '0 0 320 330', layers: ['wings', 'head', 'face', 'monster'] },
  { title: 'Tops', key: 'top', items: [['tank', 'Tank'], ['tee', 'Bat tee'], ['stripey', 'Off-shoulder'], ['corset', 'Puff corset'], ['varsity', 'Varsity'], ['hoodie', 'Crop hoodie'], ['blouse', 'Collar blouse'], ['tunic', 'Long tunic'], ['bandeau', 'Bandeau'], ['halter', 'Halter'], ['cardigan', 'Cardigan'], ['sweater', 'Chunky knit'], ['vest', 'Waistcoat'], ['lacetop', 'Lace top'], ['kimono', 'Kimono'], ['bat', 'Bat sleeves'], ['croptee', 'Crop tee'], ['tiefront', 'Tie front'], ['sailor', 'Sailor'], ['turtle', 'Turtleneck'], ['peplum', 'Peplum'], ['mesh', 'Mesh'], ['biker', 'Biker jacket'], ['blazer', 'Blazer'], ['tube', 'Tube top'], ['ruffle', 'Ruffle blouse'], ['cami', 'Cami'], ['jersey', 'Jersey'], ['bolero', 'Bolero'], ['coat', 'Long coat']], colours: [['topC', 'Colour', BRIGHT], ['trim', 'Trim', BRIGHT]], pattern: 'topP', box: '40 215 240 225', layers: ['top', 'sleeves'] },
  { title: 'Skirts', key: 'bottom', items: [['pleats', 'Pleated mini'], ['tutu', 'Tutu'], ['shred', 'Shredded'], ['pencil', 'Pencil'], ['maxi', 'Long skirt'], ['tiered', 'Tiered skirt'], ['midi', 'Midi skirt'], ['wrap', 'Wrap skirt'], ['bubble', 'Bubble skirt'], ['aline', 'A-line mini'], ['skater', 'Skater'], ['circle', 'Circle midi'], ['mermaid', 'Mermaid'], ['hilow', 'High-low'], ['asym', 'Slanted hem'], ['rufflemaxi', 'Ruffle maxi'], ['lacehem', 'Lace hem'], ['tulle', 'Long tulle'], ['denim', 'Denim mini'], ['kilt', 'Kilt'], ['cargoskirt', 'Cargo skirt'], ['slit', 'Split maxi'], ['buttonmidi', 'Button midi'], ['pleatmaxi', 'Pleated maxi'], ['batwing', 'Bat hem'], ['hanky', 'Handkerchief'], ['corsetskirt', 'Lace-up skirt'], ['beltedmidi', 'Belted midi'], ['sequin', 'Sequin mini'], ['gypsy', 'Layered maxi']], colours: [['bottomC', 'Colour', BRIGHT]], pattern: 'bottomP', box: '40 320 240 395', layers: ['pants', 'bottom'] },
  { title: 'Trousers and shorts', key: 'bottom', items: [['flares', 'Flares'], ['skinny', 'Skinnies'], ['shorts', 'Shorts'], ['cargo', 'Cargos'], ['bike', 'Bike shorts'], ['straight', 'Straight jeans'], ['wide', 'Wide leg'], ['palazzo', 'Palazzo'], ['joggers', 'Joggers'], ['leggings', 'Leggings'], ['capri', 'Capris'], ['bermuda', 'Bermudas'], ['culottes', 'Culottes'], ['hotpants', 'Hot pants'], ['cutoffs', 'Cut-offs'], ['ripped', 'Ripped jeans'], ['sailor', 'Sailor pants'], ['track', 'Track pants'], ['harem', 'Harem pants'], ['bootcut', 'Bootcut'], ['tux', 'Tux stripe'], ['leather', 'Zip leather'], ['paperbag', 'Paperbag'], ['overalls', 'Overalls'], ['chains', 'Chain pants'], ['straps', 'Strap pants'], ['patched', 'Patched jeans'], ['laceup', 'Lace-up sides'], ['bellcuff', 'Bell cuffs'], ['skort', 'Skort']], colours: [['bottomC', 'Colour', BRIGHT]], pattern: 'bottomP', box: '40 320 240 395', layers: ['pants', 'bottom'] },
  { title: 'Legwear', key: 'legs', items: [['bare', 'Bare'], ['tights', 'Tights'], ['stripes', 'Striped'], ['argyle', 'Argyle'], ['fishnet', 'Fishnets'], ['knee', 'Knee socks'], ['thigh', 'Thigh highs'], ['ankle', 'Ankle socks'], ['warmers', 'Leg warmers'], ['dots', 'Polka dots'], ['skull', 'Skull tights'], ['leggings', 'Leggings'], ['hearts', 'Heart tights'], ['stars', 'Star tights'], ['bats', 'Bat tights'], ['webs', 'Web tights'], ['zigzag', 'Zigzag'], ['checks', 'Checks'], ['diamonds', 'Diamonds'], ['spots', 'Leopard'], ['rainbow', 'Rainbow stripes'], ['ripped', 'Ripped tights'], ['lacetop', 'Lace tops'], ['garter', 'Garters'], ['sheer', 'Sheer'], ['laces', 'Lace-up'], ['overknee', 'Over-knee'], ['slouch', 'Slouch socks'], ['wraps', 'Mummy wraps'], ['frills', 'Frilly socks']], colours: [['legsC', 'Colour', BRIGHT]], box: '60 370 200 340', layers: ['legs', 'legwear'] },
  { title: 'Shoes', key: 'shoes', items: [['heels', 'Strappy'], ['platform', 'Platforms'], ['combat', 'Combat'], ['knee', 'Tall boots'], ['sneaker', 'High tops'], ['mary', 'Mary Janes'], ['wedge', 'Wedges'], ['ballet', 'Ballet ties'], ['cowboy', 'Cowboy boots'], ['chunky', 'Chunky trainers'], ['spike', 'Spiked boots'], ['gladiator', 'Gladiators'], ['flats', 'Flats'], ['loafers', 'Loafers'], ['pumps', 'Pumps'], ['ankle', 'Ankle boots'], ['chelsea', 'Chelsea boots'], ['rain', 'Rain boots'], ['fluffy', 'Fluffy boots'], ['creepers', 'Creepers'], ['skates', 'Roller skates'], ['iceskates', 'Ice skates'], ['moon', 'Moon boots'], ['thigh', 'Thigh boots'], ['bowflats', 'Bow flats'], ['clogs', 'Clogs'], ['slides', 'Slides'], ['batheels', 'Bat heels'], ['slippers', 'Fluffy slippers'], ['hooves', 'Hooves']], colours: [['shoesC', 'Colour', BRIGHT]], box: '60 520 200 200', layers: ['shoes'] },
  { title: 'Headwear', key: 'headwear', items: [['none', 'None'], ['bow', 'Big bow'], ['tiara', 'Tiara'], ['hat', 'Tiny hat'], ['flower', 'Flower'], ['hoops', 'Hoops'], ['clip', 'Skull clip'], ['beret', 'Beret'], ['band', 'Headband'], ['witch', 'Witch hat'], ['halo', 'Halo'], ['cat', 'Cat ears'], ['stars', 'Star clips'], ['crown', 'Crown'], ['beanie', 'Beanie'], ['bucket', 'Bucket hat'], ['cap', 'Cap'], ['tophat', 'Top hat'], ['veil', 'Veil'], ['bunny', 'Bunny ears'], ['flowers', 'Flower crown'], ['bandana', 'Bandana'], ['butterflies', 'Butterfly clips'], ['pearlband', 'Pearl band'], ['antennae', 'Antennae'], ['sunhat', 'Sun hat'], ['dangles', 'Star earrings'], ['batears', 'Bat earrings'], ['tikka', 'Tikka'], ['spider', 'Spider clip']], colours: [], box: '30 -50 260 270', layers: ['head', 'headwear'] },
  { title: 'Necklaces', key: 'neck', items: [['none', 'None'], ['choker', 'Choker'], ['skull', 'Skull pendant'], ['pearls', 'Pearls'], ['chain', 'Chain'], ['heart', 'Heart locket'], ['spikes', 'Spiked collar'], ['bowtie', 'Bow tie'], ['tie', 'School tie'], ['ribbon', 'Ribbon'], ['cameo', 'Cameo'], ['moon', 'Moon'], ['star', 'Star'], ['bat', 'Bat'], ['lariat', 'Lariat'], ['layered', 'Layered chains'], ['beads', 'Beads'], ['gems', 'Gem collar'], ['ruff', 'Ruff'], ['scarf', 'Scarf'], ['bandana', 'Neck scarf'], ['boa', 'Feather boa'], ['shell', 'Shell'], ['key', 'Key'], ['padlock', 'Padlock'], ['tags', 'Tags'], ['bone', 'Bone'], ['spider', 'Spider'], ['coffin', 'Coffin'], ['teacup', 'Teacup']], colours: [], box: '70 190 180 170', layers: ['torso', 'neck'] },
  { title: 'Hands', key: 'gloves', items: [['none', 'Bare'], ['nails', 'Painted nails'], ['short', 'Short gloves'], ['opera', 'Long gloves'], ['fingerless', 'Fingerless'], ['claws', 'Claws'], ['lace', 'Lace gloves'], ['mesh', 'Mesh gloves'], ['stripes', 'Striped gloves'], ['dots', 'Dotted gloves'], ['mittens', 'Mittens'], ['boxing', 'Boxing gloves'], ['skeleton', 'Skeleton'], ['biker', 'Biker gloves'], ['satin', 'Satin with bow'], ['frill', 'Frilly gloves'], ['french', 'French nails'], ['ombre', 'Ombre nails'], ['stilettos', 'Long nails'], ['glitter', 'Glitter nails'], ['wraps', 'Hand wraps'], ['henna', 'Henna'], ['scales', 'Scales'], ['paws', 'Paws'], ['driving', 'Driving gloves'], ['spiked', 'Spiked gloves'], ['rainbownails', 'Rainbow nails'], ['gothnails', 'Goth nails'], ['velvet', 'Velvet gloves'], ['batgloves', 'Bat gloves']], colours: [['gloveC', 'Colour', BRIGHT]], box: '0 290 150 190', layers: ['arms'], crop: true },
  { title: 'Hand accessories', key: 'wrist', items: [['none', 'None'], ['bangle', 'Bangle'], ['stack', 'Bangle stack'], ['charm', 'Charm bracelet'], ['pearls', 'Pearls'], ['watch', 'Watch'], ['smart', 'Smart watch'], ['spikes', 'Spiked cuff'], ['leather', 'Leather cuff'], ['ribbon', 'Ribbon'], ['friend', 'Friendship band'], ['beads', 'Beads'], ['skulls', 'Skull beads'], ['chain', 'Chain'], ['gold', 'Gold cuff'], ['ring', 'Ring'], ['tworings', 'Two rings'], ['gem', 'Big gem ring'], ['heartring', 'Heart ring'], ['skullring', 'Skull ring'], ['knuckles', 'Knuckle rings'], ['handchain', 'Hand chain'], ['scrunchie', 'Scrunchie'], ['sweatband', 'Sweatband'], ['corsage', 'Corsage'], ['bow', 'Wrist bow'], ['wrapribbon', 'Ribbon wrap'], ['snake', 'Snake armlet'], ['armband', 'Arm band'], ['tattoo', 'Bat tattoo']], colours: [['trim', 'Trim', BRIGHT]], box: '10 240 150 230', layers: ['arms', 'sleeves'], crop: true },
  { title: 'On your back', key: 'back', items: [['none', 'Nothing'], ['cape', 'Long cape'], ['short', 'Short cape'], ['bag', 'Backpack'], ['tail', 'Devil tail'], ['bigbow', 'Giant bow'], ['angel', 'Angel wings'], ['butterfly', 'Butterfly wings'], ['fairy', 'Fairy wings'], ['dragon', 'Dragon wings'], ['demon', 'Demon wings'], ['peacock', 'Peacock fan'], ['cat', 'Cat tail'], ['fox', 'Fox tail'], ['cloak', 'Hooded cloak'], ['guitar', 'Guitar'], ['coffin', 'Coffin bag'], ['teddy', 'Teddy bag'], ['batbag', 'Bat bag'], ['skullbag', 'Skull bag'], ['broom', 'Broomstick'], ['jetpack', 'Jetpack'], ['sash', 'Sash'], ['moon', 'Moon halo'], ['shawl', 'Lace shawl'], ['balloons', 'Balloons'], ['parasol', 'Parasol'], ['longscarf', 'Flying scarf'], ['ribbons', 'Ribbons'], ['shell', 'Shell']], colours: [], box: '-80 -40 480 730', layers: ['back'] },
  { title: 'In hand', key: 'hold', items: [['none', 'Nothing'], ['cup', 'Teacup'], ['purse', 'Purse'], ['skull', 'Skull bag'], ['wand', 'Wand'], ['phone', 'iCoffin'], ['mic', 'Microphone'], ['rose', 'Black rose'], ['book', 'Spell book'], ['brolly', 'Bat umbrella'], ['boba', 'Bubble tea'], ['lipstick', 'Lipstick'], ['icecream', 'Ice cream'], ['lollipop', 'Lollipop'], ['mirror', 'Mirror'], ['fan', 'Fan'], ['candle', 'Candle'], ['potion', 'Potion'], ['orb', 'Crystal ball'], ['teddy', 'Teddy'], ['pumpkin', 'Pumpkin'], ['balloon', 'Balloon'], ['bouquet', 'Bouquet'], ['camera', 'Camera'], ['lantern', 'Lantern'], ['donut', 'Donut'], ['cupcake', 'Cupcake'], ['cat', 'Kitten'], ['brush', 'Paintbrush'], ['scroll', 'Scroll']], colours: [], box: '-40 240 230 260', layers: ['hold'] },
];

/* Shop pieces join the wardrobe. */
SHOP_ITEMS.forEach(item => {
  const title = item.slot === 'neck' ? 'Necklaces' : 'Hand accessories';
  WARDROBE.find(p => p.title === title)?.items?.push([item.id, (item.brand === 'Fine jewellery' ? '' : item.brand + ' ') + item.name]);
});
const FANG_LOOK: Look = { pet: 'none', petC: '#6a1f86', skin: '#d9c8f2', eye: '#35dcc8', lip: '#b80e63', shadow: '#ff1f8f', hairStyle: 'hijab', hair: '#f08fb4', streak: '#ff1f8f', monster: 'bat', headwear: 'none', hold: 'cup', top: 'corset', topC: '#14101a', topP: 'solid', trim: '#ff1f8f', bottom: 'tutu', bottomC: '#ff1f8f', bottomP: 'solid', legs: 'argyle', legsC: '#19b7e8', shoes: 'platform', shoesC: '#14101a', pose: 'classic', eyewear: 'none', neck: 'choker', gloves: 'nails', gloveC: '#ff1f8f', wrist: 'none', mark: 'none', back: 'none', eyeStyle: 'classic', brow: 'arch', browC: '', lipSize: 'full', nose: 'button' };

/* ---------- pets: each is drawn around 0,0 and stands at the ghoul's feet ---------- */
function drawPet(id: string, c: string): string {
  const d = shade(c, -.28), l = shade(c, .34), eyeline = INK;
  const p = (path: string, fill = c, w = 2.6) => '<path d="' + path + '" fill="' + fill + '" stroke="' + eyeline + '" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"/>';
  const o = (cx: number, cy: number, rx: number, ry: number, fill = c, w = 2.6) => '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" stroke="' + eyeline + '" stroke-width="' + w + '"/>';
  const dot = (cx: number, cy: number, r: number, fill: string) => '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"/>';
  const eye = (cx: number, cy: number, r: number, iris = '#14101a') => o(cx, cy, r, r, '#fff', 2) + dot(cx, cy + r * .12, r * .62, iris) + dot(cx, cy + r * .12, r * .34, '#000') + dot(cx - r * .24, cy - r * .22, r * .22, '#fff');
  const both = (a: string) => a + '<g transform="scale(-1 1)">' + a + '</g>';
  const art: Record<string, () => string> = {
    bat: () => both(p('M-14 0C-28 -24 -50 -28 -60 -16C-52 -12 -50 -3 -52 6C-46 1 -40 3 -36 11C-30 5 -22 7 -14 13Z', d)) + both(p('M-20 -18L-25 -46L-5 -27Z')) + o(0, -2, 25, 24) + o(0, 8, 13, 12, l, 1.6) + eye(-10, -8, 8, '#ff1f8f') + eye(10, -8, 8, '#ff1f8f') + both(p('M-7 6l3 8 3-8z', '#fff', 1.6)) + both(p('M-9 22l-2 8 6-4z', d, 2)),
    cat: () => p('M18 44C46 46 56 22 42 2C38 14 34 28 14 30Z', d) + o(0, 26, 24, 22) + o(-9, 44, 10, 6) + o(9, 44, 10, 6) + both(p('M-24 -24L-26 -50L-5 -32Z')) + both(p('M-20 -28L-21 -41L-11 -32Z', '#f7b8cf', 1.2)) + o(0, -8, 27, 25) + eye(-11, -11, 9, '#8df04a') + eye(11, -11, 9, '#8df04a') + p('M-3 0h6l-3 4z', '#ff1f8f', 1.2) + both('<path d="M-14 3L-34 -1M-14 7L-34 9" stroke="#fff6fb" stroke-width="1.400"/>'),
    ghost: () => p('M-30 44V-8C-30 -52 30 -52 30 -8V44Q22 32 15 44T0 44T-15 44T-30 44Z', shade(c, .62)) + p('M30 2Q44 -4 42 -18', shade(c, .62)) + p('M-30 2Q-44 -4 -42 -18', shade(c, .62)) + o(-11, -10, 7, 10, '#14101a', 1) + o(11, -10, 7, 10, '#14101a', 1) + dot(-13, -14, 2.4, '#fff') + dot(9, -14, 2.4, '#fff') + dot(-20, 4, 5, '#f7b8cf') + dot(20, 4, 5, '#f7b8cf') + p('M-6 6Q0 18 6 6Z', '#14101a', 1.4),
    spider: () => both('<path d="M-18 4L-44 -18L-56 4M-20 10L-48 4L-60 26M-20 18L-46 24L-54 46M-16 26L-34 40L-38 54" fill="none" stroke="' + INK + '" stroke-width="4.500" stroke-linejoin="round" stroke-linecap="round"/>') + o(0, 18, 25, 24) + p('M-9 16Q0 8 9 16Q0 24 -9 16Z', l, 1.4) + o(0, -14, 21, 19, d) + eye(-9, -16, 8, '#ff1f8f') + eye(9, -16, 8, '#ff1f8f') + dot(-3, -28, 2.2, '#fff') + dot(3, -28, 2.2, '#fff') + both(p('M-6 2l1 8 5-6z', '#fff', 1.4)),
    piranha: () => o(0, 8, 44, 44, 'rgba(170,235,255,.45)') + p('M-29 -8Q0 -2 29 -8Q40 30 0 48Q-40 30 -29 -8Z', 'rgba(25,183,232,.45)', 1.2) + p('M18 10L40 -6L36 12L40 28Z', d) + o(-4, 10, 26, 18) + p('M-8 -8L6 -18L12 -4Z', d) + p('M-30 12h16l-3 6-3-5-3 5-3-5z', '#fff', 1.4) + eye(-14, 2, 6, '#c0392b') + '<path d="M-22 -5L-8 0" stroke="' + INK + '" stroke-width="2.600"/>' + dot(24, -22, 3, '#fff') + dot(16, -14, 2, '#fff') + o(0, -36, 24, 6, 'rgba(240,250,255,.8)', 2.2),
    snake: () => o(0, 40, 38, 11) + o(0, 27, 31, 10) + o(0, 15, 24, 9) + p('M-14 12C-22 -4 -6 -8 -6 -18L10 -14C12 0 16 4 14 12Z') + [[-22, 39], [0, 44], [22, 39], [-16, 27], [8, 30], [-6, 16]].map(([x, y]) => dot(x, y, 3, l)).join('') + o(2, -24, 21, 16) + eye(-6, -30, 7, '#f4d35e') + eye(12, -30, 7, '#f4d35e') + '<path d="M-14 -16Q-22 -14 -28 -14M-28 -14l-6 -4M-28 -14l-6 3" fill="none" stroke="#ff1f8f" stroke-width="2.200" stroke-linecap="round"/>',
    dragon: () => p('M18 36C44 44 56 28 54 12L46 20L42 8C38 22 30 28 16 24Z', d) + p('M-14 4C-40 -22 -56 -10 -58 8C-50 4 -46 10 -46 18C-38 12 -30 16 -18 20Z', d) + p('M14 4C40 -22 56 -10 58 8C50 4 46 10 46 18C38 12 30 16 18 20Z', d) + o(0, 24, 24, 24) + o(0, 30, 14, 16, l, 1.6) + o(-11, 46, 10, 6) + o(11, 46, 10, 6) + both(p('M-14 -30L-20 -50L-4 -36Z', '#f4d35e')) + o(0, -14, 26, 22) + o(0, -3, 15, 10, l, 1.8) + dot(-5, -5, 1.8, INK) + dot(5, -5, 1.8, INK) + eye(-11, -20, 8, '#ffb703') + eye(11, -20, 8, '#ffb703') + both(p('M-6 5l2 6 3-5z', '#fff', 1.2)),
    owl: () => both(p('M-26 -10C-42 6 -42 30 -28 40L-20 18Z', d)) + both(p('M-22 -30L-26 -52L-6 -38Z', d)) + o(0, 6, 30, 40) + o(0, 22, 19, 21, l, 1.6) + [12, 22, 32].map(y => both('<path d="M-12 ' + y + 'q4 5 8 0" fill="none" stroke="' + INK + '" stroke-width="1.600"/>')).join('') + eye(-13, -14, 13, '#ffb703') + eye(13, -14, 13, '#ffb703') + p('M-5 -6h10l-5 10z', '#ff8c1a', 1.8) + both(p('M-16 44l-4 6h10l-1-6z', '#ff8c1a', 1.8)),
    pup: () => p('M18 26C34 22 42 4 34 -8C30 2 22 8 12 12Z', d) + o(0, 28, 24, 21) + o(-11, 45, 10, 6, l) + o(11, 45, 10, 6, l) + p('M-18 12Q0 20 18 12V20Q0 28 -18 20Z', '#14101a', 1.6) + both(dot(-9, 19, 2.2, '#c0c0d8')) + o(0, -10, 28, 25) + both(p('M-22 -28C-40 -26 -42 -2 -32 8C-24 4 -20 -10 -16 -24Z', d)) + o(0, 2, 15, 12, l, 1.8) + p('M-5 -4h10l-5 6z', '#14101a', 1.2) + p('M-5 8Q0 22 5 8Z', '#ff1f8f', 1.4) + eye(-11, -14, 8, '#35dcc8') + eye(11, -14, 8, '#35dcc8'),
    bunny: () => p('M-16 -22C-24 -54 -20 -64 -11 -62C-3 -58 -3 -36 -5 -24Z') + p('M6 -24C8 -38 14 -48 34 -44C42 -38 28 -30 16 -22Z') + p('M-14 -26C-18 -44 -16 -52 -12 -52C-8 -50 -8 -36 -9 -26Z', '#f7b8cf', 1.2) + p('M14 -34l10 -4 3 7-10 4z', '#fff6e0', 1.4) + o(0, 28, 23, 21) + o(0, 32, 12, 13, l, 1.6) + o(-11, 46, 10, 6) + o(11, 46, 10, 6) + o(24, 34, 7, 7, '#fff') + o(0, -6, 26, 23) + eye(-10, -9, 9, '#c0392b') + eye(10, -9, 9, '#c0392b') + p('M-3 3h6l-3 4z', '#ff1f8f', 1.2) + p('M-5 8h10v6h-10zM0 8v6', '#fff', 1.4),
    jelly: () => [-22, -11, 0, 11, 22].map((x, i) => '<path d="M' + x + ' 2q' + (i % 2 ? 8 : -8) + ' 12 0 22t0 22" fill="none" stroke="' + d + '" stroke-width="4" stroke-linecap="round"/>').join('') + p('M-32 -2C-32 -50 32 -50 32 -2Q22 8 11 -2T-11 -2T-32 -2Z', l) + p('M-20 -30Q-12 -40 -2 -40', 'none', 2) + eye(-11, -16, 8, '#ff1f8f') + eye(11, -16, 8, '#ff1f8f') + dot(-20, -6, 4, '#ff1f8f') + dot(20, -6, 4, '#ff1f8f'),
    frog: () => both(p('M-24 28C-48 20 -50 42 -36 48H-14Z', d)) + o(0, 26, 30, 24) + o(0, 32, 18, 15, l, 1.6) + both(o(-16, 46, 11, 5, d)) + o(0, -2, 32, 22) + eye(-17, -21, 11, '#f4d35e') + eye(17, -21, 11, '#f4d35e') + '<path d="M-20 6Q0 18 20 6" fill="none" stroke="' + INK + '" stroke-width="2.600" stroke-linecap="round"/>' + dot(-24, 2, 4, '#f7b8cf') + dot(24, 2, 4, '#f7b8cf') + p('M-10 -24l-2 -14 7 6 5 -9 5 9 7 -6 -2 14z', '#f4d35e', 1.8),
    earl: () => o(0, 44, 38, 8, l) + '<path d="M26 2C48 0 48 30 22 30" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/><path d="M26 2C48 0 48 30 22 30" fill="none" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>' + p('M-30 -6H30Q30 40 0 42Q-30 40 -30 -6Z') + o(0, -6, 30, 7, l) + o(0, -6, 24, 4.5, '#b5651d', 1.4) + both('<path d="M-9 -16q-6 -8 0 -14t0 -14" fill="none" stroke="#fff6fb" stroke-width="2.600" stroke-linecap="round"/>') + eye(-11, 11, 8, '#ff1f8f') + eye(11, 11, 8, '#ff1f8f') + '<path d="M-10 24Q0 29 10 24" fill="none" stroke="' + INK + '" stroke-width="2.200" stroke-linecap="round"/>' + both(p('M-7 25l3 7 3-6z', '#fff', 1.4)) + dot(-20, 22, 4, '#f7b8cf') + dot(20, 22, 4, '#f7b8cf'),
    raven: () => both(p('M-18 0C-42 8 -42 36 -22 46L-12 20Z', d)) + '<path d="M-8 42v9M8 42v9M-12 51h8M4 51h8" stroke="#f4d35e" stroke-width="3" stroke-linecap="round"/>' + o(0, 16, 24, 30) + o(0, 22, 13, 19, l, 1.6) + p('M-4 -38L0 -56L6 -38Z', d) + o(0, -22, 21, 19) + p('M-7 -17L0 -3L7 -17Z', '#f4d35e', 1.8) + eye(-9, -27, 7, '#ff1f8f') + eye(9, -27, 7, '#ff1f8f'),
    rat: () => '<path d="M18 40C46 46 54 18 40 6" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/><path d="M18 40C46 46 54 18 40 6" fill="none" stroke="#f7b8cf" stroke-width="3.400" stroke-linecap="round"/>' + o(0, 28, 24, 20) + o(-11, 46, 9, 5, '#f7b8cf') + o(11, 46, 9, 5, '#f7b8cf') + both(o(-20, -24, 12, 12) + o(-20, -24, 7, 7, '#f7b8cf', 1.2)) + o(0, -6, 23, 20) + o(0, 7, 11, 8, l, 1.6) + dot(0, 2, 3.4, '#ff1f8f') + p('M-4 12h8v6h-8zM0 12v6', '#fff', 1.2) + eye(-9, -10, 7, '#c0392b') + eye(9, -10, 7, '#c0392b') + both('<path d="M-11 6L-30 2M-11 9L-30 12" stroke="#fff6fb" stroke-width="1.400"/>'),
    pumpkin: () => p('M-3 -12C-3 -22 2 -28 8 -30L11 -24C7 -21 5 -17 5 -12Z', '#3d7a2a', 2) + p('M6 -20C16 -32 28 -22 26 -15C17 -13 11 -15 6 -20Z', '#8df04a', 1.6) + o(-18, 18, 16, 27) + o(18, 18, 16, 27) + o(0, 18, 18, 29, l) + both(p('M-18 8L-8 -1L-5 11Z', '#f4d35e', 1.8)) + p('M-16 24Q0 36 16 24L10 27L5 22L0 29L-5 22L-10 27Z', '#f4d35e', 1.8) + dot(-26, 20, 4, '#f7b8cf') + dot(26, 20, 4, '#f7b8cf'),
    kraken: () => [[-10, -44], [-4, -26], [4, 26], [10, 44]].map(([x, e]) => '<path d="M' + x + ' 16C' + (x * 2) + ' 40 ' + e + ' 30 ' + e + ' 46" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/><path d="M' + x + ' 16C' + (x * 2) + ' 40 ' + e + ' 30 ' + e + ' 46" fill="none" stroke="' + c + '" stroke-width="5.400" stroke-linecap="round"/>').join('') + p('M-29 12C-36 -42 36 -42 29 12Q0 26 -29 12Z') + dot(-14, -24, 4, l) + dot(6, -30, 3, l) + dot(18, -18, 3.4, l) + eye(-11, -4, 9, '#f4d35e') + eye(11, -4, 9, '#f4d35e') + '<path d="M-6 10Q0 15 6 10" fill="none" stroke="' + INK + '" stroke-width="2.200" stroke-linecap="round"/>' + dot(-22, 6, 4, '#f7b8cf') + dot(22, 6, 4, '#f7b8cf'),
    turtle: () => o(-20, 40, 9, 8, l) + o(12, 40, 9, 8, l) + p('M-36 32C-36 30 -34 34 -46 30', 'none', 2) + o(36, 6, 15, 14, l) + eye(40, 2, 6, '#35dcc8') + '<path d="M38 13Q44 15 48 11" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' + p('M-36 32C-36 -16 28 -16 28 32Z') + '<path d="M-24 28L-18 6L0 0L14 12L10 28M-18 6L-26 -2M0 0L-2 -12M14 12L24 8" fill="none" stroke="' + d + '" stroke-width="2.400" stroke-linecap="round"/>' + p('M-40 32H32Q32 38 26 38H-34Q-40 38 -40 32Z', d, 2.2),
    scorpion: () => both('<path d="M-14 26L-34 22L-42 34M-14 32L-30 36L-34 48M-12 38L-22 46L-22 54" fill="none" stroke="' + INK + '" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round"/>') + '<path d="M6 30C34 34 44 -6 28 -30C22 -40 10 -40 8 -30" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/><path d="M6 30C34 34 44 -6 28 -30C22 -40 10 -40 8 -30" fill="none" stroke="' + c + '" stroke-width="6.600" stroke-linecap="round"/>' + p('M8 -30L-2 -40L12 -40Z', '#f4d35e', 1.8) + both(p('M-18 16C-36 16 -50 4 -46 -10C-40 -4 -34 -6 -34 -12C-28 -4 -26 6 -16 8Z', d)) + o(0, 32, 22, 15) + o(0, 14, 20, 16) + eye(-8, 10, 6.5, '#ff1f8f') + eye(8, 10, 6.5, '#ff1f8f'),
    hedgehog: () => p('M-34 32C-46 12 -38 -22 -14 -32L-10 -44L-2 -34L6 -46L10 -32L20 -40L20 -26L32 -30L28 -16L42 -12L32 0L44 8L32 16L40 28Z', d) + both(o(-18, -14, 7, 7, l)) + o(0, 16, 25, 27, l) + both(o(-12, 44, 9, 5, l)) + eye(-10, 6, 7.5, '#14101a') + eye(10, 6, 7.5, '#14101a') + o(0, 22, 9, 7, shade(l, .2), 1.6) + o(0, 18, 4, 3, '#14101a', 1) + dot(-18, 20, 4, '#f7b8cf') + dot(18, 20, 4, '#f7b8cf'),
    chameleon: () => '<path d="M-26 22C-50 22 -54 46 -40 49C-30 51 -28 40 -36 38" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/><path d="M-26 22C-50 22 -54 46 -40 49C-30 51 -28 40 -36 38" fill="none" stroke="' + c + '" stroke-width="5.400" stroke-linecap="round"/>' + '<path d="M-12 26L-16 46M12 26L16 46" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/><path d="M-12 26L-16 46M12 26L16 46" stroke="' + d + '" stroke-width="4.600" stroke-linecap="round"/>' + o(-17, 47, 6, 3.5, d, 2) + o(17, 47, 6, 3.5, d, 2) + p('M-30 22C-32 -6 20 -16 34 6C38 18 28 30 12 30H-20C-30 30 -30 26 -30 22Z') + p('M-24 4L-18 -10L-10 2L-2 -12L6 0L14 -12L18 0', 'none', 2.4) + '<path d="M-18 20Q-6 12 6 20Q16 26 26 18" fill="none" stroke="' + l + '" stroke-width="3" stroke-linecap="round"/>' + o(20, 4, 10, 10, d) + dot(22, 4, 4.4, '#14101a') + dot(20, 2, 1.6, '#fff') + '<path d="M28 16Q34 18 38 14" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>',
    fox: () => p('M14 30C48 34 58 0 40 -12C40 6 30 16 14 18Z') + p('M48 -6C46 -10 42 -12 40 -12C40 -4 38 2 34 8C42 8 48 2 48 -6Z', '#fff6fb', 1.8) + o(0, 28, 22, 20) + o(0, 32, 12, 13, '#fff6fb', 1.6) + o(-10, 46, 9, 5, d) + o(10, 46, 9, 5, d) + both(p('M-24 -16L-22 -50L-4 -26Z')) + both(p('M-20 -22L-19 -41L-9 -28Z', '#14101a', 1.2)) + o(0, -8, 27, 22) + p('M-27 -4Q-14 -4 0 12Q14 -4 27 -4Q20 16 0 16Q-20 16 -27 -4Z', '#fff6fb', 1.6) + p('M-4 8h8l-4 5z', '#14101a', 1.2) + eye(-10, -12, 8, '#f4d35e') + eye(10, -12, 8, '#f4d35e'),
    hamster: () => both(o(-14, 47, 8, 4, '#f7b8cf', 1.8)) + both(o(-20, -12, 9, 9) + o(-20, -12, 5, 5, '#f7b8cf', 1)) + o(0, 18, 33, 31) + o(0, 30, 21, 18, l, 1.6) + eye(-12, 6, 7, '#14101a') + eye(12, 6, 7, '#14101a') + dot(0, 15, 3.2, '#ff1f8f') + '<path d="M-5 19Q0 23 5 19" fill="none" stroke="' + INK + '" stroke-width="1.800" stroke-linecap="round"/>' + dot(-21, 18, 6, '#f7b8cf') + dot(21, 18, 6, '#f7b8cf') + both(o(-7, 30, 5, 4, '#f7b8cf', 1.4)) + p('M-4 26Q0 20 4 26Q4 34 0 36Q-4 34 -4 26Z', '#f4d35e', 1.4),
    moth: () => both(p('M-6 -6C-30 -46 -58 -32 -50 -6C-46 6 -26 8 -6 2Z')) + both(p('M-6 6C-24 14 -42 34 -28 46C-16 52 -8 30 -4 14Z', l)) + both(o(-30, -16, 7, 7, '#fff6fb', 1.6) + dot(-30, -16, 3.6, d)) + '<path d="M-3 -30C-8 -44 -16 -50 -24 -48M3 -30C8 -44 16 -50 24 -48" fill="none" stroke="' + INK + '" stroke-width="2.400" stroke-linecap="round"/>' + o(0, 8, 9, 26, d) + o(0, -22, 11, 10, '#fff6fb') + eye(-4, -22, 4.4, '#14101a') + eye(4, -22, 4.4, '#14101a'),
    eyeball: () => o(0, 50, 18, 4, 'rgba(20,8,26,.35)', 0) + both(p('M-26 -4C-40 -24 -58 -22 -60 -10C-54 -8 -52 -2 -54 4C-48 0 -42 2 -40 8C-34 4 -30 6 -26 8Z', d)) + o(0, 2, 30, 30, '#fff6fb') + '<path d="M-28 -6Q-20 -4 -16 -10M-27 14Q-19 12 -15 18M27 -8Q21 -4 17 -10M25 16Q19 12 15 18" fill="none" stroke="#c0392b" stroke-width="1.600" stroke-linecap="round"/>' + o(0, 4, 14, 14) + dot(0, 4, 7, '#000') + dot(-5, -1, 3.2, '#fff') + dot(4, 8, 1.6, '#fff'),
    skull: () => o(0, 50, 18, 4, 'rgba(20,8,26,.35)', 0) + p('M-26 4C-30 -36 30 -36 26 4C26 14 18 16 16 22V32H-16V22C-18 16 -26 14 -26 4Z', '#fff6fb') + o(-11, -4, 8.5, 9.5, '#14101a', 1) + o(11, -4, 8.5, 9.5, '#14101a', 1) + dot(-11, -3, 3.6, c) + dot(11, -3, 3.6, c) + dot(-13, -6, 1.4, '#fff') + dot(9, -6, 1.4, '#fff') + p('M-3 11L0 5L3 11Z', '#14101a', 1.2) + '<path d="M-8 22V32M0 22V32M8 22V32" stroke="' + INK + '" stroke-width="1.800"/>' + both(p('M0 -30L-17 -40V-20Z')) + o(0, -30, 4.4, 4.4, d, 2),
    axolotl: () => '<path d="M16 32C38 34 48 24 52 14" fill="none" stroke="' + INK + '" stroke-width="11" stroke-linecap="round"/><path d="M16 32C38 34 48 24 52 14" fill="none" stroke="' + c + '" stroke-width="6.400" stroke-linecap="round"/>' + both(o(-14, 44, 7, 5, l)) + o(0, 30, 21, 17) + o(0, 34, 12, 10, l, 1.4) + both(p('M-26 -14L-46 -24L-38 -12L-50 -4L-36 -4L-44 8L-26 2Z', d, 2)) + o(0, -2, 31, 23) + dot(-14, -6, 4.6, '#14101a') + dot(14, -6, 4.6, '#14101a') + dot(-15.4, -7.6, 1.6, '#fff') + dot(12.6, -7.6, 1.6, '#fff') + '<path d="M-9 6Q0 13 9 6" fill="none" stroke="' + INK + '" stroke-width="2.200" stroke-linecap="round"/>' + dot(-22, 4, 4.4, '#ff8fb8') + dot(22, 4, 4.4, '#ff8fb8'),
    penguin: () => both(p('M-14 44h12l-2 6h-12z', '#ff8c1a', 1.8)) + both(p('M-24 0C-38 10 -38 28 -27 34L-22 10Z', d)) + p('M-36 -8L-26 -18L26 -18L36 -8L26 -2H-26Z', '#c0392b', 2) + o(0, 10, 26, 36) + o(0, 18, 17, 27, '#fff6fb', 1.6) + eye(-8, -12, 6.5, '#ff1f8f') + eye(8, -12, 6.5, '#ff1f8f') + p('M-6 -3H6L0 5Z', '#ff8c1a', 1.6) + both(p('M-3 5l1.500 4 1.500-4z', '#fff', 1)) + dot(-15, -1, 3.4, '#f7b8cf') + dot(15, -1, 3.4, '#f7b8cf'),
    slime: () => p('M-34 44C-38 20 -26 -26 0 -28C26 -26 38 20 34 44Q26 38 18 44T2 44T-16 44T-34 44Z') + o(-28, 48, 5, 3, c, 2) + p('M-18 -12Q-14 -21 -6 -23', 'none', 3) + '<path d="M-18 -12Q-14 -21 -6 -23" fill="none" stroke="#fff6fb" stroke-width="2.400" stroke-linecap="round"/>' + eye(-11, 4, 8.5, '#14101a') + eye(11, 4, 8.5, '#14101a') + p('M-8 18Q0 27 8 18Z', '#14101a', 1.4) + o(24, -30, 5, 5, l, 1.6) + o(32, -40, 3, 3, l, 1.4) + dot(-22, 16, 4, '#f7b8cf') + dot(22, 16, 4, '#f7b8cf'),
  };
  const body = art[id];
  return body ? '<g transform="translate(305 648)">' + body() + '</g>' : '';
}

function randomLook(): Look {
  const look = { ...FANG_LOOK, hairStyle: 'long' };
  for (const page of WARDROBE) {
    if (page.key && page.items) { const all = WARDROBE.filter(p => p.key === page.key).flatMap(p => p.items || []).filter(i => !SHOP_BY_ID[i[0]]); look[page.key] = all[Math.floor(Math.random() * all.length)][0]; }
    for (const [key, , values] of page.colours) look[key] = values[Math.floor(Math.random() * values.length)];
    if (page.pattern) look[page.pattern] = Math.random() < .6 ? 'solid' : PATTERNS[1 + Math.floor(Math.random() * (PATTERNS.length - 1))][0];
  }
  look.hold = 'none';
  look.wrist = 'none';
  look.browC = '';
  look.pose = 'classic';
  return look;
}
/* Checks everything saved against the wardrobe, because other people's looks are drawn into this page. */
function normalizeLook(raw: Partial<Look> | undefined): Look {
  /* Anything missing gets a plain default, never a random one, or a saved character would change on every visit. */
  const out: Look = { ...FANG_LOOK, hairStyle: 'long', monster: 'none', hold: 'none', neck: 'none', gloves: 'none', wrist: 'none' };
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
const shape = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" ${extra}/>`;
let ghoulCounter = 0;

/* A hand from the wrist outward, drawn pointing down its own +y. */
function drawHand(shape: string, skin: string, fill: string, tips: string, tipStyle = ''): string {
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
  const colours = tips.split('|');
  const nails = tips ? fingers.map(([a, b, x, y], i) => {
    const c = colours[i % colours.length], len = Math.hypot(x - a, y - b) || 1, ux = (x - a) / len, uy = (y - b) / len;
    if (tipStyle === 'long') return '<path d="M' + (x - uy * 2.2) + ' ' + (y + ux * 2.2) + 'L' + (x + ux * 11) + ' ' + (y + uy * 11) + 'L' + (x + uy * 2.2) + ' ' + (y - ux * 2.2) + 'Z" fill="' + c + '" stroke="' + INK + '" stroke-width=".8"/>';
    return '<circle cx="' + x + '" cy="' + y + '" r="2.1" fill="' + c + '"/>' + (tipStyle === 'ombre' ? '<circle cx="' + (x + ux) + '" cy="' + (y + uy) + '" r="1.1" fill="' + shade(c, .6) + '"/>' : tipStyle === 'glitter' ? '<circle cx="' + (x - .6) + '" cy="' + (y - .6) + '" r=".7" fill="#fff"/>' : tipStyle === 'french' ? strokeLine('M' + (x - 1.6) + ' ' + (y - .4) + 'h3.2', .8, '#f7b8cf') : '');
  }).join('') : '';
  return lines(6.6, INK) + '<path d="M-7.5 1Q-8 15 -6 16L6 16Q8 15 7.5 1Z" fill="' + fill + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' + lines(4, skin) + nails;
}

/* plain: small previews skip the costly shading and hair streaks. detail: the big wardrobe figure shades each layer on its own. */
function drawGhoul(o: Look, opt: { head?: boolean; label?: string; only?: Layer[]; box?: string; plain?: boolean; detail?: boolean; pose?: Pose; shaded?: boolean; stream?: boolean; merBelt?: string } = {}): string {
  const uid = 'g' + (++ghoulCounter);
  const pose = opt.pose || (opt.head ? POSES[0] : poseOf(o.pose));
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
      dots: [20, 20, `<rect width="20" height="20" fill="${a}"/><circle cx="10" cy="10" r="4.200" fill="${b}"/>`],
      hearts: [26, 26, `<rect width="26" height="26" fill="${a}"/><path d="M13 21c-8-6-10-11-6-13 3-1 5 0 6 3 1-3 3-4 6-3 4 2 2 7-6 13z" fill="${b}"/>`],
      stars: [28, 28, `<rect width="28" height="28" fill="${a}"/><path d="M14 4l3 6.500 7 .700-5.300 4.600 1.600 7-6.300-3.700-6.300 3.700 1.600-7-5.300-4.600 7-.7z" fill="${b}"/>`],
      bats: [36, 24, `<rect width="36" height="24" fill="${a}"/><path d="M18 11c-2-3-8-5-14-2 4 1 5 4 4 7 3-2 7-2 10 3 3-5 7-5 10-3-1-3 0-6 4-7-6-3-12-1-14 2z" fill="${b}"/>`],
      checks: [24, 24, `<rect width="24" height="24" fill="${a}"/><rect width="12" height="12" fill="${b}"/><rect x="12" y="12" width="12" height="12" fill="${b}"/>`],
      zigzag: [24, 16, `<rect width="24" height="16" fill="${a}"/><path d="M0 13L12 3 24 13" fill="none" stroke="${b}" stroke-width="4.500"/>`],
      webs: [40, 40, `<rect width="40" height="40" fill="${a}"/><path d="M0 0L40 40M40 0L0 40M20 0V40M0 20H40" stroke="${b}" stroke-width="1.200"/><circle cx="20" cy="20" r="8" fill="none" stroke="${b}" stroke-width="1.200"/><circle cx="20" cy="20" r="16" fill="none" stroke="${b}" stroke-width="1.200"/>`],
      spots: [30, 30, `<rect width="30" height="30" fill="${a}"/><ellipse cx="8" cy="9" rx="6" ry="4.500" fill="${b}"/><ellipse cx="22" cy="22" rx="6" ry="4.500" fill="${b}"/><ellipse cx="8" cy="9" rx="2.600" ry="1.800" fill="${a}"/><ellipse cx="22" cy="22" rx="2.600" ry="1.800" fill="${a}"/>`],
      diamonds: [22, 22, `<rect width="22" height="22" fill="${a}"/><path d="M11 2L20 11 11 20 2 11z" fill="${b}"/>`],
      flowers: [30, 30, `<rect width="30" height="30" fill="${a}"/><g fill="${b}"><circle cx="15" cy="8" r="4"/><circle cx="22" cy="13" r="4"/><circle cx="19" cy="21" r="4"/><circle cx="11" cy="21" r="4"/><circle cx="8" cy="13" r="4"/></g><circle cx="15" cy="15" r="3" fill="#f4d35e"/>`],
      merscales: [16, 12, `<rect width="16" height="12" fill="${a}"/><path d="M0 0a8 8 0 0 0 16 0M-8 6a8 8 0 0 0 16 0M8 6a8 8 0 0 0 16 0" fill="${b}" fill-opacity=".3" stroke="${INK}" stroke-opacity=".55" stroke-width="1"/>`],
      rainbow: [10, 42, ['#ff1f8f', '#ff8c1a', '#f4d35e', '#8df04a', '#19b7e8', '#6a1f86'].map((c, i) => `<rect y="${i * 7}" width="10" height="7" fill="${c}"/>`).join('')],
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
  const LEG = 'M122 378C115 430 124 482 131 522C127 566 133 612 137 654L149 654C152 612 156 566 152 522C160 470 163 420 159 384Z';
  const clipId = uid + 'c';
  defs += `<clipPath id="${clipId}k"><rect x="90" y="522" width="100" height="200"/></clipPath><clipPath id="${clipId}t"><rect x="90" y="446" width="100" height="280"/></clipPath>`;
  defs += `<clipPath id="${clipId}o"><rect x="90" y="480" width="100" height="240"/></clipPath><clipPath id="${clipId}s"><rect x="90" y="570" width="100" height="150"/></clipPath><clipPath id="${clipId}a"><rect x="-200" y="600" width="700" height="200"/></clipPath><clipPath id="${clipId}w"><rect x="-200" y="545" width="700" height="100"/></clipPath><clipPath id="${clipId}u"><rect x="-200" y="200" width="700" height="332"/></clipPath><clipPath id="${clipId}d"><rect x="-200" y="518" width="700" height="300"/></clipPath>`;
  const oneLeg = (inner: string, [hip, knee]: [number, number]) => '<g transform="translate(' + LEG_IN + ' 0) rotate(' + hip + ' 140 380)">' + (knee
    ? '<g clip-path="url(#' + clipId + 'u)">' + inner + '</g><g transform="rotate(' + knee + ' 140 524)"><g clip-path="url(#' + clipId + 'd)">' + inner + '</g></g>'
    : inner) + '</g>';
  const legsSide = (inner: string) => oneLeg(inner, pose.legL || [3, 0]) + '<g transform="translate(320 0) scale(-1 1)">' + oneLeg(inner, pose.legR || [3, 0]) + '</g>';
  const legPale = contrast(o.legsC) === INK ? '#14101a' : '#fff6fb';
  const wearMakers: Record<string, () => string> = {
    tights: () => o.legsC, knee: () => o.legsC, thigh: () => o.legsC, ankle: () => o.legsC, leggings: () => o.legsC, sheer: () => o.legsC, lacetop: () => o.legsC, garter: () => o.legsC, ripped: () => o.legsC, slouch: () => o.legsC, frills: () => o.legsC,
    stripes: () => texture('stripes', o.legsC, legPale, 'l'), argyle: () => texture('argyle', o.legsC, contrast(o.legsC) === INK ? '#6a1f86' : '#ff1f8f', 'a'), fishnet: () => texture('fishnet', o.legsC === '#fff6fb' ? '#14101a' : o.legsC, '', 'f'),
    warmers: () => texture('stripes', o.legsC, o.trim, 'w'), dots: () => texture('dots', o.legsC, legPale, 'p'), skull: () => texture('skulls', '#14101a', o.legsC, 's'),
    hearts: () => texture('hearts', o.legsC, legPale, 'l'), stars: () => texture('stars', o.legsC, legPale, 'l'), bats: () => texture('bats', o.legsC, legPale, 'l'), webs: () => texture('webs', o.legsC, legPale, 'l'), zigzag: () => texture('zigzag', o.legsC, legPale, 'l'), checks: () => texture('checks', o.legsC, legPale, 'l'), diamonds: () => texture('diamonds', o.legsC, legPale, 'l'), spots: () => texture('spots', '#f4d35e', '#5a2c17', 'l'),
    rainbow: () => texture('rainbow', '', '', 'l'), overknee: () => texture('stripes', o.legsC, legPale, 'l'), laces: () => S, wraps: () => '#fff6e0',
  };
  const wearFill = wearMakers[o.legs]?.();
  parts.legs = legsSide(shape(LEG, S) + strokeLine('M131 522q10 6 20 0', 2, SD));
  if (wearFill) {
    const clipFor: Record<string, string> = { knee: 'k', thigh: 't', lacetop: 't', garter: 't', ankle: 'a', frills: 'a', warmers: 'w', overknee: 'o', slouch: 's', laces: 'k' };
    const clip = clipFor[o.legs] ? `clip-path="url(#${clipId}${clipFor[o.legs]})"` : '';
    const band = ({
      knee: () => shape('M125 522h31v13h-31z', o.trim), thigh: () => shape('M117 446h46v13h-46z', o.trim), overknee: () => shape('M119 480h42v13h-42z', o.trim),
      leggings: () => shape('M131 634h26v9h-26z', o.trim) + strokeLine('M120 400L128 524L136 630', 2.4, shade(o.legsC, .35)),
      ripped: () => [[140, 462, 11, 7], [132, 540, 8, 6], [147, 600, 7, 5]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${S}" stroke="${INK}" stroke-width="1.800"/>`).join('') + strokeLine('M131 462h18M136 456v12M145 456v12', 1.2, legPale),
      lacetop: () => strokeLine('M117 448q4 9 8 0t8 0 8 0 8 0 8 0 8 0', 5, o.trim),
      garter: () => strokeLine('M126 450L122 396M154 450L158 396', 2.6, o.trim) + strokeLine('M117 450h46', 4, o.trim),
      laces: () => [532, 552, 572, 592, 612, 632].map(y => strokeLine(`M130 ${y}L156 ${y + 16}M156 ${y}L130 ${y + 16}`, 2.4, o.legsC)).join(''),
      slouch: () => strokeLine('M127 580q16 7 30 0M128 600q15 7 28 0M130 622q13 6 25 0', 2, shade(o.legsC, -.28)),
      wraps: () => [400, 432, 464, 496, 528, 560, 592, 624].map(y => strokeLine(y < 524 ? `M120 ${y}L160 ${y + 14}` : `M130 ${y}L155 ${y + 10}`, 1.600, '#a8946a')).join('') + strokeLine('M148 640q10 8 22 6', 5, '#fff6e0'),
      frills: () => strokeLine('M127 604q4 8 8 0t8 0 8 0 8 0', 6, o.trim),
    } as Record<string, () => string>)[o.legs]?.() || '';
    parts.legwear = legsSide(shape(LEG, wearFill, clip + (o.legs === 'sheer' ? ' fill-opacity=".45"' : '')) + band);
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
      gladiator: shape(foot, S) + [540, 566, 592, 618, 640].map(y => strokeLine(`M129 ${y}h28`, 4, C)).join('') + strokeLine('M143 540V640', 3, C) + strokeLine('M131 660l26 6M129 678l30 2', 5, C) + sole(696, 10, C),
    flats: shape(foot, S) + shape('M127 672C136 664 150 664 159 672L163 700L123 700Z', C) + sole(698, 8, C),
    loafers: shape(foot, S) + shape('M124 664Q143 656 162 664L166 700L120 700Z', C) + strokeLine('M131 678h24', 4, CL) + `<circle cx="143" cy="678" r="3" fill="#f4d35e" stroke="${INK}" stroke-width="1.200"/>` + sole(698, 11, '#14101a'),
    pumps: shape(foot, S) + shape('M125 670Q143 660 161 670L152 716Q143 724 134 716Z', C) + strokeLine('M133 678Q143 672 153 678', 2, CL),
    ankle: shape(shaft(626), C) + strokeLine('M131 626h26', 5, CL) + strokeLine('M150 636v50', 2, CL) + sole(696, 18, '#14101a'),
    chelsea: shape(shaft(618), C) + shape('M134 628h18v36h-18z', shade(C, -.32)) + strokeLine('M132 618h24', 5, CL) + sole(696, 11, '#14101a'),
    rain: shape(shaft(556), C) + strokeLine('M130 556h28', 7, CL) + `<circle cx="143" cy="576" r="4.500" fill="${o.trim}" stroke="${INK}" stroke-width="1.400"/>` + sole(696, 15, shade(C, -.32)),
    fluffy: shape(shaft(590), C) + [127, 137, 147, 157].map(x => `<circle cx="${x}" cy="592" r="9" fill="#fff6fb" stroke="${INK}" stroke-width="1.800"/>`).join('') + [122, 134, 146, 158, 168].map(x => `<circle cx="${x}" cy="694" r="8" fill="#fff6fb" stroke="${INK}" stroke-width="1.800"/>`).join(''),
    creepers: shape(foot, S) + shape('M122 660h44v36h-44z', C) + strokeLine('M128 672h32', 3, lace) + sole(694, 26, '#14101a') + strokeLine('M120 708l8-6 8 6 8-6 8 6 8-6 8 6', 2.200, o.trim),
    skates: shape(shaft(610), C) + [624, 640, 656, 672].map(y => strokeLine(`M135 ${y}h16`, 2.4, lace)).join('') + shape('M120 698h46v8h-46z', '#14101a') + [128, 158].map(x => `<circle cx="${x}" cy="716" r="10" fill="${o.trim}" stroke="${INK}" stroke-width="2.200"/>`).join(''),
    iceskates: shape(shaft(600), C) + [614, 630, 646, 662, 678].map(y => strokeLine(`M135 ${y}h16`, 2.4, lace)).join('') + sole(696, 8, '#14101a') + strokeLine('M126 704V716M160 704V716', 3.4, '#c0c0d8') + strokeLine('M112 718h62', 5, '#c0c0d8'),
    moon: shape('M124 596h38q10 50 10 104h-58q0-54 10-104z', C) + [616, 638, 660, 682].map(y => strokeLine(`M120 ${y}q23 8 46 0`, 3, CL)).join('') + sole(696, 18, '#fff6fb'),
    thigh: shape('M116 446L164 446C167 500 160 520 158 524C162 580 162 660 162 700L124 700C124 660 124 580 126 524C120 500 113 480 116 446Z', C) + strokeLine('M118 450h44', 6, o.trim) + sole(696, 15, '#14101a'),
    bowflats: shape(foot, S) + shape('M127 672C136 664 150 664 159 672L163 700L123 700Z', C) + `<path d="M143 678l-14-8v16zM143 678l14-8v16z" fill="${o.trim}" stroke="${INK}" stroke-width="1.800"/>` + sole(698, 8, C),
    clogs: shape(foot, S) + shape('M122 666Q143 650 164 666L168 700L118 700Z', C) + [132, 143, 154].map(x => `<circle cx="${x}" cy="672" r="2.200" fill="#f4d35e"/>`).join('') + sole(698, 16, '#8b5a2b'),
    slides: shape(foot, S) + shape('M122 666h42v16h-42z', C) + strokeLine('M130 674h26', 3, lace) + sole(698, 9, '#14101a'),
    batheels: shape(foot, S) + strokeLine('M131 660l26 6M129 680l30 2', 5, C) + `<path d="M143 642c-3-5-13-8-22-4 5 2 6 7 5 10 5-2 12-2 17 5 5-7 12-7 17-5-1-3 0-8 5-10-9-4-19-1-22 4z" fill="${C}" stroke="${INK}" stroke-width="1.800"/>` + sole(696, 12, C),
    slippers: shape(foot, S) + `<ellipse cx="143" cy="686" rx="30" ry="23" fill="${C}" stroke="${INK}" stroke-width="2.600"/><circle cx="133" cy="680" r="3" fill="${INK}"/><circle cx="153" cy="680" r="3" fill="${INK}"/><path d="M139 688q4 5 8 0" fill="none" stroke="${INK}" stroke-width="2"/>` + shape('M122 668l-4-20 14 12zM164 668l4-20-14 12z', C),
    hooves: shape(shaft(610), C) + strokeLine('M128 626l8-6M138 640l10-5M130 656l10-5', 2, shade(C, -.28)) + shape('M124 668h38l10 34h-58z', '#2c2436') + strokeLine('M143 682V702', 3, '#fff6fb'),
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
  const pantLong = (k: number, h: number, w: number) => `M114 376C108 430 ${140 - k} 480 ${140 - k} 524C${139 - k} 580 ${143 - w} ${h - 40} ${143 - w} ${h}L${143 + w} ${h}C${143 + w} ${h - 40} ${142 + k} 580 ${141 + k} 524C${141 + k + 5} 470 168 420 165 384Z`;
  const pantShort = (h: number, w: number) => `M112 376C106 410 ${140 - w} ${h - 30} ${140 - w} ${h}L${142 + w} ${h}C${142 + w} ${h - 30} 168 410 165 384Z`;
  const button = (x: number, y: number, c = o.trim) => `<circle cx="${x}" cy="${y}" r="3" fill="${c}" stroke="${INK}" stroke-width="1.200"/>`;
  const PANTS: Record<string, () => string> = {
    straight: () => pantsLeg(pantLong(20, 690, 19)) + legsSide(strokeLine('M124 684h38', 4, o.trim) + strokeLine('M150 410L148 680', 1.6, INK, 'opacity=".4"')),
    wide: () => pantsLeg(pantLong(28, 700, 34)) + legsSide(strokeLine('M130 420L126 696M156 420L160 696', 1.6, INK, 'opacity=".4"')),
    palazzo: () => pantsLeg(pantLong(36, 704, 46)) + legsSide(strokeLine('M124 440L108 700M140 440V700M156 440L176 700', 1.6, INK, 'opacity=".4"') + strokeLine('M100 700h86', 4, o.trim)),
    joggers: () => pantsLeg(pantLong(20, 640, 15)) + legsSide(shape('M126 628h34v14h-34z', o.trim)),
    leggings: () => pantsLeg(pantLong(15, 650, 12)) + legsSide(strokeLine('M122 400L128 520L136 640', 2.4, shade(o.bottomC, .35))),
    capri: () => pantsLeg(pantLong(17, 576, 17)) + legsSide(strokeLine('M127 570h32', 4, o.trim)),
    bermuda: () => pantsLeg(pantShort(516, 25)) + legsSide(strokeLine('M116 510h50', 4, o.trim)),
    culottes: () => pantsLeg(pantLong(32, 592, 38)) + legsSide(strokeLine('M128 430L116 588M154 430L168 588', 1.6, INK, 'opacity=".4"')),
    hotpants: () => pantsLeg(pantShort(424, 27)) + legsSide(strokeLine('M114 418h54', 3, o.trim)),
    cutoffs: () => pantsLeg(pantShort(450, 27)) + legsSide(strokeLine('M114 450l6 7 6-7 6 7 6-7 6 7 6-7 6 7 6-7', 2.2, '#fff6fb')),
    ripped: () => pantsLeg(pantLong(20, 690, 19)) + legsSide([[140, 470, 12, 8], [132, 540, 9, 7], [150, 612, 8, 6]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${S}" stroke="${INK}" stroke-width="1.800"/>` + strokeLine(`M${x - a} ${y - 2}h${a * 2}M${x - a} ${y + 3}h${a * 2}`, 1.2, '#fff6fb')).join('')),
    sailor: () => pantsLeg(pantLong(24, 700, 32)) + legsSide(strokeLine('M114 696h58', 4, o.trim)),
    track: () => pantsLeg(pantLong(20, 680, 18)) + legsSide(strokeLine('M118 400L120 524L127 676', 5, o.trim) + strokeLine('M127 400L128 524L135 676', 2, o.trim)),
    harem: () => pantsLeg('M112 376C88 440 94 520 110 600C120 630 124 640 126 650L160 650C162 640 170 620 178 590C178 500 170 420 165 384Z') + legsSide(shape('M124 642h38v12h-38z', o.trim) + strokeLine('M124 440Q110 520 124 600M154 440Q168 520 154 600', 1.6, INK, 'opacity=".4"')),
    bootcut: () => pantsLeg(pantLong(18, 700, 28)) + legsSide(strokeLine('M116 696h54', 4, o.trim)),
    tux: () => pantsLeg(pantLong(18, 690, 18)) + legsSide(strokeLine('M120 400L122 524L126 686', 7, o.trim)),
    leather: () => pantsLeg(pantLong(17, 680, 15)) + legsSide(strokeLine('M128 540L133 676', 4, '#c0c0d8') + strokeLine('M128 540L133 676', 1.200, INK, 'stroke-dasharray="2 2"') + strokeLine('M150 400L148 500', 3, shade(o.bottomC, .4), 'opacity=".7"')),
    paperbag: () => pantsLeg(pantLong(24, 680, 22)) + legsSide(strokeLine('M122 676h42', 4, o.trim)),
    overalls: () => pantsLeg(pantLong(24, 694, 24)) + legsSide(strokeLine('M120 690h46', 4, o.trim) + shape('M116 450h26v30h-26z', bottomFill)),
    chains: () => pantsLeg(pantLong(22, 690, 22)) + legsSide(strokeLine('M116 410Q100 480 128 510', 3, '#c0c0d8', 'stroke-dasharray="4 3"')),
    straps: () => pantsLeg(pantLong(20, 690, 19)) + legsSide([440, 500, 580, 640].map(y => strokeLine(`M${y < 524 ? 118 : 124} ${y}h${y < 524 ? 46 : 36}`, 5, '#14101a') + `<rect x="139" y="${y - 5}" width="9" height="10" fill="none" stroke="#c0c0d8" stroke-width="2"/>`).join('')),
    patched: () => pantsLeg(pantLong(20, 690, 20)) + legsSide(shape('M122 450h26v22h-26z', o.trim, 'stroke-dasharray="3 2"') + shape('M138 580h22v22h-22z', texture('checks', o.trim, '#fff6fb', 'x'), 'stroke-dasharray="3 2"')),
    laceup: () => pantsLeg(pantLong(18, 680, 17)) + legsSide([400, 430, 460, 490, 520, 550, 580, 610, 640].map(y => strokeLine(`M${y < 524 ? 116 : 126} ${y}l12 14M${y < 524 ? 128 : 138} ${y}l-12 14`, 2, o.trim)).join('')),
    bellcuff: () => pantsLeg(pantLong(16, 600, 15)) + legsSide(shape('M127 594L159 594L180 654L106 654Z', bottomFill) + strokeLine('M108 650h70', 4, o.trim)),
    skort: () => pantsLeg(pantShort(424, 27)),
  };
  if (PANTS[o.bottom]) parts.pants = PANTS[o.bottom]();
  const skirt = (hem: number, hw: number, fill = bottomFill) => shape(`M136 332L184 332L${160 + hw} ${hem}Q160 ${hem + 24} ${160 - hw} ${hem}Z`, fill);
  const hemLine = (hem: number, hw: number, w = 5, c = o.trim, extra = '') => strokeLine(`M${162 - hw} ${hem - 2}Q160 ${hem + 20} ${158 + hw} ${hem - 2}`, w, c, extra);
  const folds = (hem: number, hw: number, n: number) => Array.from({ length: n }, (_, i) => { const t = (i + 1) / (n + 1) * 2 - 1; return strokeLine(`M${(160 + t * 20).toFixed(1)} 344L${(160 + t * hw * .94).toFixed(1)} ${(hem + 11 - t * t * 11).toFixed(1)}`, 1.6, INK, 'opacity=".42"'); }).join('');
  const hipOnly = () => shape(hipPiece, bottomFill) + waistband;
  const bib = o.bottom === 'overalls' ? shape('M132 270h56v70h-56z', bottomFill) + strokeLine('M138 272L132 236M182 272L188 236', 7, bottomFill) + button(138, 280) + button(182, 280) + shape('M146 296h28v22h-28z', bottomFill) : '';
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
      aline: skirt(448, 56) + hemLine(448, 56) + waistband,
    skater: shape('M136 332L184 332C200 360 222 420 232 440Q160 470 88 440C98 420 120 360 136 332Z', bottomFill) + folds(446, 72, 6) + strokeLine('M92 440Q160 466 228 440', 4, o.trim) + waistband,
    circle: skirt(560, 90) + folds(560, 90, 8) + hemLine(560, 90) + waistband,
    mermaid: shape('M136 332L184 332C212 400 208 500 204 560C208 600 228 650 244 676Q160 700 76 676C92 650 112 600 116 560C112 500 108 400 136 332Z', bottomFill) + strokeLine('M116 558Q160 574 204 558', 5, o.trim) + strokeLine('M136 574C132 610 116 650 100 682M184 574C188 610 204 650 220 682M160 578V692', 1.6, INK, 'opacity=".42"') + waistband,
    hilow: shape('M136 332L184 332L236 640Q160 672 84 640Z', shade(o.bottomC, -.18)) + strokeLine('M88 638Q160 668 232 638', 5, o.trim) + shape('M136 332L184 332L214 440Q160 470 106 440Z', bottomFill) + strokeLine('M110 440Q160 464 210 440', 4, o.trim) + waistband,
    asym: shape('M136 332L184 332L232 600Q170 590 98 470Z', bottomFill) + strokeLine('M102 472Q170 588 228 598', 5, o.trim) + waistband,
    rufflemaxi: skirt(600, 62) + [0, 1].map(i => shape(`M${96 - i * 8} ${540 + i * 66}Q160 ${566 + i * 66} ${224 + i * 8} ${540 + i * 66}L${236 + i * 6} ${606 + i * 48}q-12 12-24 0t-26 0-26 0-26 0-26 0-24 0Z`, i ? bottomFill : shade(o.bottomC, .2))).join('') + waistband,
    lacehem: skirt(500, 60) + strokeLine('M100 502q6 12 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0', 8, '#fff6fb') + waistband,
    tulle: shape('M136 332L184 332L256 680Q160 712 64 680Z', shade(o.bottomC, .42)) + shape('M136 332L184 332L240 640Q160 668 80 640Z', shade(o.bottomC, .2)) + shape('M136 332L184 332L222 580Q160 604 98 580Z', bottomFill) + folds(580, 62, 4) + waistband,
    denim: shape('M136 332L184 332L202 440L118 440Z', bottomFill) + strokeLine('M160 340V438', 2.200, INK) + strokeLine('M124 372q12 18 26 0M170 372q12 18 26 0', 2, o.trim) + strokeLine('M118 440l7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6', 2.200, '#fff6fb') + waistband,
    kilt: skirt(470, 54, texture('tartan', o.bottomC, other(o.bottomC), 'k')) + folds(470, 54, 7) + shape('M196 400h8v46h-8z', '#c0c0d8') + hemLine(470, 54, 3) + waistband,
    cargoskirt: skirt(520, 50) + shape('M118 430h34v44h-34zM168 430h34v44h-34z', bottomFill) + strokeLine('M118 444h34M168 444h34', 2, o.trim) + hemLine(520, 50) + waistband,
    slit: skirt(676, 70) + `<path d="M192 470L216 688L180 690Z" fill="${S}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + folds(676, 70, 4) + waistband,
    buttonmidi: skirt(570, 56) + strokeLine('M160 340V588', 2, INK) + [370, 410, 450, 490, 530, 566].map(y => button(166, y)).join('') + waistband,
    pleatmaxi: skirt(680, 80) + folds(680, 80, 11) + hemLine(680, 80) + waistband,
    batwing: shape('M136 332L184 332L228 470Q210 448 194 470Q178 448 160 480Q142 448 126 470Q110 448 92 470Z', bottomFill) + waistband,
    hanky: shape('M136 332L184 332L240 470L200 440L160 506L120 440L80 470Z', bottomFill) + strokeLine('M160 340V500', 1.600, INK, 'opacity=".42"') + strokeLine('M240 470L200 440L160 506L120 440L80 470', 4, o.trim) + waistband,
    corsetskirt: skirt(530, 42) + [360, 386, 412, 438, 464, 490].map(y => strokeLine(`M150 ${y}L170 ${y + 14}M170 ${y}L150 ${y + 14}`, 2.200, o.trim)).join('') + hemLine(530, 42) + waistband,
    beltedmidi: skirt(570, 60) + folds(570, 60, 4) + shape('M132 338h56v16h-56z', '#14101a') + `<rect x="150" y="336" width="20" height="20" rx="3" fill="#f4d35e" stroke="${INK}" stroke-width="2"/><rect x="155" y="341" width="10" height="10" fill="#14101a"/>`,
    sequin: skirt(440, 54) + [[126, 400], [146, 380], [168, 396], [192, 388], [116, 430], [140, 426], [162, 440], [186, 430], [206, 420], [150, 358], [172, 356]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.400" fill="${shade(o.bottomC, .55)}" stroke="${INK}" stroke-width=".8"/>`).join('') + hemLine(440, 54, 3) + waistband,
    gypsy: skirt(680, 82, shade(o.bottomC, -.14)) + hemLine(680, 82, 4) + skirt(560, 66) + hemLine(560, 66, 4) + skirt(450, 48, shade(o.bottomC, .2)) + hemLine(450, 48, 4) + waistband,
    ...Object.fromEntries(Object.keys(PANTS).map(id => [id, id === 'skort' ? shape('M136 332L184 332L208 430Q160 448 112 430Z', bottomFill) + folds(430, 48, 4) + strokeLine('M116 430Q160 446 204 430', 4, o.trim) + waistband : id === 'paperbag' ? hipOnly() + strokeLine('M134 332q5-9 10 0t10 0 10 0 10 0 10 0 10 0', 5, o.trim) + strokeLine('M134 348h52', 5, o.trim) : id === 'sailor' ? hipOnly() + [344, 362, 380].map(y => button(146, y) + button(174, y)).join('') : hipOnly() + bib])),
} as Record<string, string>)[o.bottom] || '';

  /* ---------- tops and arms ---------- */
  const arm = (d: string, w: number, c: string, extra = '') => strokeLine(d, w + 5.2, INK) + strokeLine(d, w, c, extra);
  const sleeve = ({ tee: 'short', stripey: 'long', corset: 'puff', varsity: 'long', hoodie: 'long', blouse: 'long', tunic: 'long', cardigan: 'long', sweater: 'fat', vest: '', lacetop: 'long', kimono: 'wide', bat: 'wide', halter: '', bandeau: '', croptee: 'short', tiefront: 'short', sailor: 'long', turtle: 'long', peplum: '', mesh: '', biker: 'long', blazer: 'long', tube: '', ruffle: 'long', cami: '', jersey: 'short', bolero: 'long', coat: 'long' } as Record<string, string>)[o.top];
  const rad = (d: number) => d * Math.PI / 180;
  const longGlove = GLOVE_LONG.includes(o.gloves), shortGlove = GLOVE_SHORT.includes(o.gloves);
  const glovePale = contrast(o.gloveC) === INK ? '#14101a' : '#fff6fb';
  const GLOVE_FILL: Record<string, () => string> = {
    lace: () => texture('flowers', o.gloveC, glovePale, 'gl'), mesh: () => texture('fishnet', o.gloveC === '#fff6fb' ? '#14101a' : o.gloveC, '', 'gm'), stripes: () => texture('stripes', o.gloveC, glovePale, 'gs'), dots: () => texture('dots', o.gloveC, glovePale, 'gd'),
    scales: () => texture('diamonds', o.gloveC, shade(o.gloveC, .35), 'gc'), skeleton: () => '#14101a', velvet: () => shade(o.gloveC, -.18), wraps: () => '#fff6e0',
  };
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
    /* ---------- gloves and bracelets, measured along this forearm ---------- */
    const along = (t: number): [number, number] => [ex + (wx - ex) * t, ey + (wy - ey) * t];
    const normal: [number, number] = [-(wy - ey) / 77, (wx - ex) / 77];
    const across = (t: number, wide: number) => { const [x, y] = along(t), half = wide * .72; return 'M' + f(x + normal[0] * half) + ' ' + f(y + normal[1] * half) + 'L' + f(x - normal[0] * half) + ' ' + f(y - normal[1] * half); };
    const wband = (t: number, half: number, c: string, w = 6) => strokeLine(across(t, half), w + 2.6, INK) + strokeLine(across(t, half), w, c);
    const beadband = (t: number, half: number, c: string, size = 6, gap = 7) => strokeLine(across(t, half), size + 2, INK, 'stroke-dasharray="0 ' + gap + '"') + strokeLine(across(t, half), size, c, 'stroke-dasharray="0 ' + gap + '"');
    const blob = (t: number, off: number, r: number, c: string) => { const [x, y] = along(t); return '<circle cx="' + f(x + normal[0] * off) + '" cy="' + f(y + normal[1] * off) + '" r="' + r + '" fill="' + c + '" stroke="' + INK + '" stroke-width="1.500"/>'; };
    const ringAt = (y: number, x: number, w: number, c: string) => strokeLine('M' + (x - w) + ' ' + y + 'h' + (w * 2), 2.4, c);
    const WRIST: Record<string, () => [string, string]> = {
      bangle: () => [wband(.82, 11, '#f4d35e', 5), ''],
      stack: () => [wband(.72, 11, o.trim, 3.5) + wband(.8, 11, '#f4d35e', 3.5) + wband(.88, 11, '#fff6fb', 3.5), ''],
      charm: () => [wband(.84, 11, '#c0c0d8', 3) + blob(.92, -6, 3, o.trim) + blob(.94, 1, 3, '#f4d35e') + blob(.92, 7, 3, '#ff1f8f'), ''],
      pearls: () => [beadband(.84, 11, '#fff6fb', 6.5), ''],
      rolexdaytona: () => [wband(.84, 11, '#d7dbe4', 7) + blob(.84, 0, 9, '#14141c') + blob(.84, 0, 3, '#f6f7fb'), ''],
      rolexiced: () => [beadband(.84, 11, '#eaf7ff', 6, 6) + blob(.84, 0, 10, '#eaf7ff') + blob(.84, 0, 5.500, '#9fd8ff'), ''],
      omegaseamaster: () => [wband(.84, 11, '#d7dbe4', 7) + blob(.84, 0, 9, '#1f4fa8') + blob(.84, 0, 3, '#f6f7fb'), ''],
      cartiertank: () => [wband(.84, 11, '#2a1420', 6) + blob(.84, 0, 8.500, '#e0b83c') + blob(.84, 0, 5.500, '#f8f4e6'), ''],
      hublotbigbang: () => [wband(.84, 11, '#14141c', 7) + blob(.84, 0, 9.500, '#55555f') + blob(.84, 0, 6, '#101016'), ''],
      richardmille: () => [wband(.84, 11, '#ff4fa8', 7) + blob(.84, 0, 9.500, '#ff1f8f') + blob(.84, 0, 6, '#101016'), ''],
      cartierlove: () => [wband(.84, 11, '#e0b83c', 7) + blob(.84, -6, 1.800, '#fff3b8') + blob(.84, 0, 1.800, '#fff3b8') + blob(.84, 6, 1.800, '#fff3b8'), ''],
      diamondring: () => ['', ringAt(19, -1.7, 3.2, '#e8ebf2') + '<path d="M-1.700 12.500l5 5.500-5 5.500-5-5.500z" fill="#dff4ff" stroke="' + INK + '" stroke-width="1"/>'],
      rolexsub: () => [wband(.84, 11, '#d7dbe4', 7) + blob(.84, 0, 9, '#0f7a4f') + blob(.84, 0, 3, '#f6f7fb'), ''],
      rolexdaydate: () => [wband(.84, 11, '#e0b83c', 7) + blob(.84, 0, 9, '#f6e7a8') + blob(.84, 0, 3, '#a8770c'), ''],
      aproyaloak: () => [wband(.84, 11, '#c7ccd8', 8) + blob(.84, 0, 9.500, '#1f3a8a') + blob(.84, 0, 3, '#dfe6ff'), ''],
      pateknautilus: () => [wband(.84, 11, '#e8a98a', 7) + blob(.84, 0, 9, '#23405e') + blob(.84, 0, 3, '#ffe9de'), ''],
      tennisbracelet: () => [beadband(.84, 11, '#e9f7ff', 5, 6), ''],
      watch: () => [wband(.84, 11, '#14101a', 6) + blob(.84, 0, 8, '#fff6fb') + strokeLine('M' + f(along(.84)[0]) + ' ' + f(along(.84)[1]) + 'l3 -3', 1.5, INK), ''],
      smart: () => { const [x, y] = along(.84); return [wband(.84, 11, o.trim, 6) + '<rect x="' + f(x - 7) + '" y="' + f(y - 7) + '" width="14" height="14" rx="3" fill="#14101a" stroke="' + INK + '" stroke-width="1.500"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="3" fill="#35dcc8"/>', '']; },
      spikes: () => [wband(.82, 12, '#14101a', 10) + [-8, 0, 8].map(o2 => blob(.82, o2, 2.6, '#c0c0d8')).join(''), ''],
      leather: () => [wband(.8, 12, '#5a2c17', 13) + blob(.8, 0, 2.6, '#f4d35e'), ''],
      ribbon: () => { const [x, y] = along(.84); return [wband(.84, 11, o.trim, 4) + '<path d="M' + f(x) + ' ' + f(y) + 'l-14 -8v14zM' + f(x) + ' ' + f(y) + 'l14 -8v14z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1.500"/>', '']; },
      friend: () => [wband(.8, 11, '#ff1f8f', 3) + wband(.85, 11, '#f4d35e', 3) + wband(.9, 11, '#19b7e8', 3), ''],
      beads: () => [beadband(.84, 11, o.trim, 6.5), ''],
      skulls: () => [beadband(.84, 11, '#14101a', 5, 11) + blob(.84, -6, 4, '#fff6fb') + blob(.84, 6, 4, '#fff6fb'), ''],
      chain: () => [strokeLine(across(.84, 11), 4.6, INK) + strokeLine(across(.84, 11), 3, '#f4d35e', 'stroke-dasharray="3 2"'), ''],
      gold: () => [wband(.8, 12, '#f4d35e', 16) + blob(.8, 0, 4, o.trim), ''],
      ring: () => ['', ringAt(19, -1.7, 3.2, '#f4d35e')],
      tworings: () => ['', ringAt(19, -1.7, 3.2, '#f4d35e') + ringAt(19, 5, 3, o.trim)],
      gem: () => ['', ringAt(19, -1.7, 3.2, '#f4d35e') + '<path d="M-1.700 13.500l4.500 5-4.500 5-4.500-5z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1"/>'],
      heartring: () => ['', ringAt(19, -1.7, 3.2, '#c0c0d8') + '<path d="M-1.700 24c-5-4-6-8-3-9 2-.5 3 .5 3 2 0-1.500 1-2.500 3-2 3 1 2 5-3 9z" fill="#ff1f8f" stroke="' + INK + '" stroke-width="1"/>'],
      skullring: () => ['', ringAt(19, -1.7, 3.2, '#c0c0d8') + '<circle cx="-1.700" cy="18" r="4.500" fill="#fff6fb" stroke="' + INK + '" stroke-width="1"/><circle cx="-3.300" cy="17.500" r="1" fill="' + INK + '"/><circle cx="-.1" cy="17.500" r="1" fill="' + INK + '"/>'],
      knuckles: () => ['', [-5, -1.7, 1.7, 5].map(x => ringAt(18, x, 1.9, '#c0c0d8')).join('')],
      handchain: () => [strokeLine(across(.86, 11), 2.4, '#f4d35e'), strokeLine('M0 1Q-1 10 -1.700 19M-1.700 19h-3.400M-1.700 19h3.400', 1.400, '#f4d35e') + '<circle cx="0" cy="9" r="2.400" fill="' + o.trim + '" stroke="' + INK + '" stroke-width=".8"/>'],
      scrunchie: () => [wband(.82, 13, o.trim, 13) + strokeLine(across(.82, 13), 1.2, INK, 'stroke-dasharray="1 4"'), ''],
      sweatband: () => [wband(.76, 12, '#fff6fb', 18) + wband(.76, 12, o.trim, 4), ''],
      corsage: () => [wband(.84, 11, '#fff6fb', 3) + [[-6, 0], [6, 0], [0, -6], [0, 6]].map(([a, b]) => { const [x, y] = along(.84); return '<circle cx="' + f(x + a) + '" cy="' + f(y + b) + '" r="5" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1.200"/>'; }).join('') + blob(.84, 0, 3.4, '#f4d35e'), ''],
      bow: () => { const [x, y] = along(.84); return [wband(.84, 11, '#14101a', 3) + '<path d="M' + f(x) + ' ' + f(y) + 'l-18 -11v22zM' + f(x) + ' ' + f(y) + 'l18 -11v22z" fill="#14101a" stroke="' + INK + '" stroke-width="1.500"/>' + blob(.84, 0, 3, o.trim), '']; },
      wrapribbon: () => [[.3, .45, .6, .75, .9].map(t => wband(t, 10.5, o.trim, 4)).join(''), ''],
      snake: () => [[.08, .22, .36].map(t => wband(t, 11, '#2f8f4e', 5)).join('') + blob(.48, 3, 5, '#2f8f4e'), ''],
      armband: () => { const ux = sx + (ex - sx) * .55, uy = sy + (ey - sy) * .55, lx = (ey - sy) / 85, ly = -(ex - sx) / 85, d = 'M' + f(ux + lx * 13) + ' ' + f(uy + ly * 13) + 'L' + f(ux - lx * 13) + ' ' + f(uy - ly * 13); return [strokeLine(d, 9, INK) + strokeLine(d, 6, '#f4d35e'), '']; },
      tattoo: () => { const [x, y] = along(.42); return ['<path d="M' + f(x) + ' ' + f(y) + 'c-2-3-6-4-10-2 3 1 3 3 3 5 2-1 5-1 7 3 2-4 5-4 7-3 0-2 0-4 3-5-4-2-8-1-10 2z" fill="#14101a"/>', '']; },
    };
    const [wristArm, wristHand] = WRIST[o.wrist]?.() || ['', ''];
    const gFill = GLOVE_FILL[o.gloves]?.() || '';
    const gloveBits: Record<string, () => [string, string]> = {
      lace: () => [wband(.04, 10, o.gloveC, 4), ''], mesh: () => [wband(.04, 10, o.gloveC, 4), ''],
      skeleton: () => [strokeLine('M' + f(along(.2)[0] + normal[0] * 3) + ' ' + f(along(.2)[1] + normal[1] * 3) + 'L' + f(along(.92)[0] + normal[0] * 3) + ' ' + f(along(.92)[1] + normal[1] * 3) + 'M' + f(along(.2)[0] - normal[0] * 3) + ' ' + f(along(.2)[1] - normal[1] * 3) + 'L' + f(along(.92)[0] - normal[0] * 3) + ' ' + f(along(.92)[1] - normal[1] * 3), 2.4, '#fff6fb'), strokeLine('M-5 13L-6 26M-1.700 14L-2 29M1.700 14L2 28M5 13L6 24', 1.800, '#fff6fb') + strokeLine('M-5 3h10M-5 8h10', 1.600, '#fff6fb')],
      biker: () => [wband(.72, 11, '#14101a', 5), strokeLine('M-6 12h12', 3, '#14101a') + [-4, 0, 4].map(x => '<circle cx="' + x + '" cy="12" r="1.200" fill="#c0c0d8"/>').join('')],
      satin: () => { const [x, y] = along(.1); return ['<path d="M' + f(x) + ' ' + f(y) + 'l-15 -10v20zM' + f(x) + ' ' + f(y) + 'l15 -10v20z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1.600"/>', '']; },
      frill: () => [[-9, -3, 3, 9].map(d => blob(.72, d, 5, o.trim)).join(''), ''],
      wraps: () => [[.68, .76, .84, .92].map(t => strokeLine(across(t, 9), 1.200, '#a8946a')).join(''), strokeLine('M-6 3l12 4M-6 9l12 4', 1.200, '#a8946a')],
      henna: () => [[.55, .68, .8].map(t => blob(t, 0, 1.600, '#8a3324')).join('') + strokeLine(across(.9, 7), 1.600, '#8a3324'), '<g fill="none" stroke="#8a3324" stroke-width="1"><circle cx="0" cy="8" r="3.500"/><circle cx="0" cy="8" r="1"/><path d="M-5 13L-6 20M-1.700 14L-2 22M1.700 14L2 22M5 13L6 19"/></g>'],
      driving: () => ['', [-3.500, 0, 3.500].map(x => '<circle cx="' + x + '" cy="7" r="1.100" fill="' + S + '"/>').join('') + strokeLine('M-6 12h12', 1.400, INK)],
      spiked: () => [[-9, -3, 3, 9].map(d => { const [x, y] = along(.74); return '<path d="M' + f(x + normal[0] * d - 2) + ' ' + f(y + normal[1] * d - 2) + 'l2 -7 2 7z" fill="#c0c0d8" stroke="' + INK + '" stroke-width="1"/>'; }).join(''), ''],
      velvet: () => [wband(.04, 10, o.trim, 5), ''],
      batgloves: () => { const a = along(.2), b = along(.98), s2 = side; return ['<path d="M' + f(a[0]) + ' ' + f(a[1]) + 'Q' + f(a[0] + s2 * 22) + ' ' + f((a[1] + b[1]) / 2) + ' ' + f(b[0]) + ' ' + f(b[1]) + 'Z" fill="' + o.gloveC + '" stroke="' + INK + '" stroke-width="2"/>', '']; },
    };
    const [gloveArm, gloveHand] = gloveBits[o.gloves]?.() || ['', ''];
    let skin = arm(path, 11, S);
    const gloveColour = gFill || o.gloveC, sheer = o.gloves === 'mesh';
    const coverArm = (d: string) => (sheer ? arm(d, 11.5, S) + strokeLine(d, 11.5, gloveColour) : arm(d, 11.5, gloveColour));
    if (longGlove) skin += coverArm(forearm);
    if (shortGlove) skin += coverArm('M' + f(midX) + ' ' + f(midY) + 'L' + f(wx) + ' ' + f(wy));
    skin += gloveArm;
    const noFingers = ['fingerless', 'biker', 'driving'].includes(o.gloves);
    const palm = noFingers ? gloveColour : sheer ? S : longGlove || shortGlove ? gloveColour : S, digits = !noFingers && !sheer && (longGlove || shortGlove) ? gloveColour : S;
    const tips = o.gloves in NAILS ? NAILS[o.gloves] || o.gloveC : '';
    const tipStyle = o.gloves === 'stilettos' ? 'long' : o.gloves === 'ombre' ? 'ombre' : o.gloves === 'glitter' ? 'glitter' : o.gloves === 'french' ? 'french' : '';
    const wholeHand = ({
      mittens: '<ellipse cx="-13" cy="14" rx="5" ry="8" fill="' + gloveColour + '" stroke="' + INK + '" stroke-width="2"/><path d="M-9 1Q-14 18 -10 30Q0 40 10 30Q14 18 9 1Z" fill="' + gloveColour + '" stroke="' + INK + '" stroke-width="2.200"/>' + strokeLine('M-8 5h16', 4, o.trim),
      boxing: '<ellipse cx="-16" cy="18" rx="7" ry="10" fill="' + gloveColour + '" stroke="' + INK + '" stroke-width="2.200"/><circle cx="0" cy="22" r="19" fill="' + gloveColour + '" stroke="' + INK + '" stroke-width="2.400"/>' + strokeLine('M-8 3h16', 7, o.trim) + strokeLine('M-8 16q5-6 14-4', 2.400, '#fff6fb', 'opacity=".7"'),
      paws: '<circle cx="0" cy="18" r="14" fill="' + gloveColour + '" stroke="' + INK + '" stroke-width="2.200"/>' + [[-10, 28], [-3.500, 32], [3.500, 32], [10, 28]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="4.500" fill="' + gloveColour + '" stroke="' + INK + '" stroke-width="1.800"/><path d="M' + (x - 1.500) + ' ' + (y + 3) + 'l1.500 6 1.500-6z" fill="#14101a"/>').join('') + '<ellipse cx="0" cy="18" rx="6" ry="5" fill="#f7b8cf"/>',
    } as Record<string, string>)[o.gloves];
    const handTurn = 'translate(' + f(wx) + ' ' + f(wy) + ') rotate(' + f(angle) + ') scale(' + (side < 0 ? 1.02 : -1.02) + ' 1.1)';
    const hand = '<g transform="' + handTurn + '">' + (wholeHand || drawHand(handShape, digits, palm, tips, tipStyle)) + (wholeHand ? '' : gloveHand) + '</g>';
    const wristBits = wristArm + (wristHand && !wholeHand ? '<g transform="' + handTurn + '">' + wristHand + '</g>' : '');
    let sleeves = '';
    if (sleeve === 'long' || sleeve === 'fat') sleeves = arm(path, sleeve === 'fat' ? 21 : 15, topFill) + cuff(wx, wy, sleeve === 'fat' ? 12 : 9, o.trim);
    else if (sleeve === 'wide') sleeves = '<path d="M' + f(sx) + ' ' + (sy - 10) + 'L' + f(ex) + ' ' + f(ey) + 'L' + f(wx) + ' ' + f(wy) + 'L' + f(sx - side * 4) + ' ' + (sy + 62) + 'Z" fill="' + topFill + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
    else if (sleeve === 'short') { const hx = sx + (ex - sx) * .58, hy = sy + (ey - sy) * .58; sleeves = arm('M' + f(sx) + ' ' + sy + 'L' + f(hx) + ' ' + f(hy), 16, topFill); }
    else if (sleeve === 'puff') {
      const x = side < 0 ? 118 : 202, y = 260;
      sleeves = '<ellipse cx="' + x + '" cy="' + y + '" rx="24" ry="22" fill="' + topFill + '" stroke="' + INK + '" stroke-width="2.6"/>' + strokeLine('M' + (x - 12) + ' ' + (y - 14) + 'Q' + x + ' ' + y + ' ' + (x - 10) + ' ' + (y + 14) + 'M' + (x + 10) + ' ' + (y - 15) + 'Q' + x + ' ' + y + ' ' + (x + 11) + ' ' + (y + 13), 1.6, INK, 'opacity=".55"') + strokeLine('M' + (x - 16) + ' ' + (y + 18) + 'q16 8 32 0', 5, o.trim);
    }
    if (wx < 16 || wx > 304) needsRoom = true;
    if (side < 0) { holdDX = wx - 74; holdDY = wy - 404; }
    const inFront = pose.front && pose.front.includes(side < 0 ? 'L' : 'R');
    if (inFront) frontParts += skin + sleeves + hand + wristBits;
    else { backParts.arms += skin + hand; backParts.sleeves += sleeves + wristBits; }
  };
  buildArm(-1, pose.armL, pose.handL || 'relaxed');
  buildArm(1, pose.armR, pose.handR || 'relaxed');
  parts.arms = backParts.arms; parts.sleeves = backParts.sleeves;
  /* A raised leg lifts the skirt: extra cloth runs from the waist over the thigh to that point on the leg, then falls back to the hem. */
  const fit = SKIRT_FIT[o.bottom];
  if (fit) {
    const [hem, hw] = fit, tilted = pose.lean || 0;
    const turn = ([x, y]: [number, number], cx: number, cy: number, deg: number): [number, number] => { const a = rad(deg), dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; };
    const legAt = (side: 1 | -1, arc: number): [number, number] => {
      const [hip, knee] = (side < 0 ? pose.legL : pose.legR) || [3, 0];
      let p: [number, number] = [140, 380 + arc];
      if (arc > 144) p = turn(p, 140, 524, knee);
      p = turn(p, 140, 380, hip);
      p = [p[0] + LEG_IN, p[1]];
      if (side > 0) p = [320 - p[0], p[1]];
      p = turn(p, 160, 385, -tilted);
      return [160 + (p[0] - 160) / SLIM, p[1]];
    };
    const room = (y: number) => 24 + (hw - 24) * (Math.min(hem, Math.max(332, y)) - 332) / (hem - 332);
    const n = (v: number) => v.toFixed(1);
    let lifted = '';
    ([-1, 1] as Array<1 | -1>).forEach(side => {
      const [hipAngle, kneeAngle] = (side < 0 ? pose.legL : pose.legR) || [3, 0], hip = Math.abs(hipAngle);
      if (hip < 10 && !(tilted && hem > 560)) return;
      /* a bent knee is as far as the cloth needs to go, the shin folds away behind it */
      const reach = Math.min(hem - 380, Math.abs(kneeAngle) > 20 ? 150 : Math.max(150, 300 - hip * 2.2));
      let pokes = false;
      for (let arc = 30; arc <= reach; arc += 15) {
        const [x, y] = legAt(side, arc);
        if (side * (x - 160) + (arc < 144 ? 24 - arc * .06 : 15) > room(y) + 4) pokes = true;
      }
      if (!pokes) return;
      const [px, py] = legAt(side, reach), [qx, qy] = legAt(side, reach - 12);
      const len = Math.hypot(px - qx, py - qy) || 1;
      let nx = -(py - qy) / len, ny = (px - qx) / len;
      if (side * nx < 0) { nx = -nx; ny = -ny; }
      const w = (reach < 144 ? 24 - reach * .06 : 15) + 7;
      const [mx, my] = legAt(side, reach * .55);
      const tx = px + nx * w, ty = py + ny * w, bx = px - nx * w, by = py - ny * w;
      const jx = 160 + side * hw * .9, jy = Math.max(hem - 6, by + 6);
      const edge = `L${n(bx)} ${n(by)}Q${n(bx - side * 6)} ${n(jy)} ${n(jx)} ${n(jy)}`;
      lifted += shape(`M${160 + side * 22} 336Q${n(mx + nx * (w + 12))} ${n(my + ny * (w + 12))} ${n(tx)} ${n(ty)}${edge}L160 ${Math.min(hem - 20, 400)}Z`, bottomFill)
        + strokeLine(`M${n(tx)} ${n(ty)}${edge}`, 4.5, o.trim)
        + strokeLine(`M${160 + side * 18} 350L${n((bx + jx) / 2)} ${n((by + jy) / 2)}`, 1.6, INK, 'opacity=".42"');
    });
    parts.bottom = lifted + parts.bottom;
  }
  parts.top = ({
    merscale: strokeLine('M136 262Q142 240 150 228M184 262Q178 240 170 228', 4, o.trim) + shape('M122 262Q142 250 160 270Q178 250 198 262L192 304Q160 316 128 304Z', texture('merscales', o.topC, o.trim, 'ms')) + strokeLine('M128 304Q160 316 192 304', 4, o.trim),
    mershell: strokeLine('M146 228Q130 248 128 268M174 228Q190 248 192 268M126 282Q160 298 194 282', 3, '#fff6fb', 'stroke-dasharray="0 7"') + [[138, 278], [182, 278]].map(([x, y]) => '<g transform="translate(' + x + ' ' + y + ')"><path d="M-23 -6Q-26 -22 -14 -24Q-8 -32 0 -28Q8 -32 14 -24Q26 -22 23 -6Q14 16 0 20Q-14 16 -23 -6Z" fill="' + o.topC + '" stroke="' + INK + '" stroke-width="2.600"/><path d="M0 18L-14 -21M0 18L-5 -27M0 18L5 -27M0 18L14 -21M0 18L-20 -8M0 18L20 -8" stroke="' + o.trim + '" stroke-width="2" stroke-linecap="round"/></g>').join(''),
    mernet: shape('M148 230L160 268L172 230Q188 240 196 262L192 300Q186 322 188 344L132 344Q134 322 128 300L124 262Q132 240 148 230Z', o.topC) + '<path d="M128 262L188 344M140 248L190 316M160 268L188 300M124 288L168 344M128 320L146 344M192 262L132 344M180 248L130 316M160 268L132 300M196 288L152 344M192 320L174 344" stroke="' + o.trim + '" stroke-width="1.500"/>' + [[160, 268], [145, 282], [175, 282], [160, 296], [132, 296], [188, 296], [146, 310], [174, 310], [160, 324], [134, 326], [186, 326]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3" fill="#fff6fb" stroke="' + INK + '" stroke-width=".8"/>').join(''),
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
      croptee: shape('M116 246Q134 236 146 240Q160 256 174 240Q186 236 204 246L196 296Q160 312 124 296Z', topFill) + strokeLine('M146 241Q160 256 174 241', 4, o.trim) + strokeLine('M126 292Q160 308 194 292', 4, o.trim),
    tiefront: shape('M116 246Q134 236 146 240Q160 256 174 240Q186 236 204 246L196 290Q180 306 168 300L160 322L152 300Q140 306 124 290Z', topFill) + `<circle cx="160" cy="304" r="8" fill="${o.trim}" stroke="${INK}" stroke-width="2"/>` + strokeLine('M146 241Q160 256 174 241', 4, o.trim),
    sailor: shape('M116 246Q136 234 148 228L172 228Q184 234 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + shape('M146 228L160 272L174 228L208 248L190 280L160 296L130 280L112 248Z', o.trim) + strokeLine('M128 270L160 288L192 270', 2.4, '#fff6fb') + `<path d="M160 298l-16-9v18zM160 298l16-9v18z" fill="#c0392b" stroke="${INK}" stroke-width="1.800"/>`,
    turtle: shape('M144 204h32v34h-32z', topFill) + shape('M116 246Q136 232 146 232L174 232Q184 232 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + strokeLine('M146 212h28M146 224h28', 1.6, INK, 'opacity=".45"') + strokeLine('M134 340h52', 4, o.trim),
    peplum: shape('M132 336Q160 346 188 336L214 386Q160 406 106 386Z', topFill) + strokeLine('M110 384Q160 402 210 384', 4, o.trim) + shape('M124 252Q160 276 196 252L192 298Q184 320 188 342L132 342Q136 320 128 298Z', topFill) + strokeLine('M124 252Q160 276 196 252', 4, o.trim),
    mesh: shape('M116 246Q136 234 148 228L172 228Q184 234 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', texture('fishnet', o.topC === '#fff6fb' ? '#14101a' : o.topC, '', 'm')) + shape('M124 268Q160 282 196 268L192 300Q160 312 128 300Z', o.topC) + strokeLine('M146 230Q160 240 174 230', 5, o.trim),
    biker: shape('M124 260h72v86h-72z', '#14101a') + shape('M114 246Q134 232 150 232L172 356L124 350Q128 320 122 298Z', topFill) + shape('M206 246Q186 232 170 232L176 350L196 350Q192 320 198 298Z', topFill) + strokeLine('M150 234L172 354', 3.6, '#c0c0d8') + strokeLine('M150 234L172 354', 1.200, INK, 'stroke-dasharray="2 3"') + shape('M150 232L128 262L120 244ZM170 232L192 262L200 244Z', shade(o.topC, -.2)) + strokeLine('M128 300h22M178 300h16', 3, '#c0c0d8'),
    blazer: shape('M126 240h68v130h-68z', o.trim) + shape('M114 246Q134 232 148 232L160 330L156 384L120 378Q126 330 122 298Z', topFill) + shape('M206 246Q186 232 172 232L160 330L164 384L200 378Q194 330 198 298Z', topFill) + shape('M148 232L126 276L156 306ZM172 232L194 276L164 306Z', shade(o.topC, -.2)) + `<circle cx="165" cy="340" r="3.500" fill="#f4d35e" stroke="${INK}" stroke-width="1.200"/>`,
    tube: shape('M122 266Q160 276 198 266L194 322Q160 332 126 322Z', topFill) + strokeLine('M124 272Q160 282 196 272', 4, o.trim) + strokeLine('M127 316Q160 326 193 316', 4, o.trim),
    ruffle: shape('M116 246Q136 234 148 228L172 228Q184 234 204 246L194 298Q186 318 186 346L134 346Q134 318 126 298Z', topFill) + [244, 268, 292, 316].map(y => shape(`M136 ${y}q6 12 12 0t12 0 12 0 12 0L176 ${y + 8}Q160 ${y + 22} 144 ${y + 8}Z`, o.trim)).join(''),
    cami: strokeLine('M136 268L142 232M184 268L178 232', 3, o.topC) + shape('M126 272Q160 258 194 272L194 298Q186 318 186 342L134 342Q134 318 126 298Z', topFill) + strokeLine('M127 272q6 8 11 2t11 2 11 0 11 0 11-2 11-2', 3.4, o.trim),
    jersey: shape('M116 246Q134 236 146 240Q160 256 174 240Q186 236 204 246L196 296Q190 340 196 366L124 366Q130 340 124 296Z', topFill) + strokeLine('M146 241Q160 256 174 241', 6, o.trim) + strokeLine('M126 356h68', 6, o.trim) + `<text x="160" y="322" font-family="Arial, sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="${o.trim}" stroke="${INK}" stroke-width="1.400">13</text>`,
    bolero: shape('M126 268Q160 282 194 268L192 306Q160 318 128 306Z', '#14101a') + shape('M114 246Q134 232 148 232L146 290Q130 300 120 286Z', topFill) + shape('M206 246Q186 232 172 232L174 290Q190 300 200 286Z', topFill) + strokeLine('M148 234L146 290Q130 300 120 286M172 234L174 290Q190 300 200 286', 4, o.trim),
    coat: shape('M116 246Q136 232 148 232L160 310L172 232Q184 232 204 246L206 300Q210 410 228 540Q160 556 92 540Q110 410 114 300Z', topFill) + strokeLine('M160 310V548', 2.2, INK) + shape('M148 232L126 280L160 310ZM172 232L194 280L160 310Z', shade(o.topC, -.2)) + [330, 366, 402, 438].map(y => `<circle cx="168" cy="${y}" r="3.200" fill="${o.trim}" stroke="${INK}" stroke-width="1.200"/>`).join('') + strokeLine('M116 366Q160 378 204 366', 7, o.trim) + strokeLine('M96 536Q160 552 224 536', 4, o.trim),
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
      boba: `<path d="M58 406h36l-6 60H64z" fill="#f7d9c4" stroke="${INK}" stroke-width="2.600"/>` + `<ellipse cx="76" cy="406" rx="20" ry="5" fill="#fff6fb" stroke="${INK}" stroke-width="2.200"/>` + strokeLine('M78 402L88 368', 4.400, '#ff1f8f') + [[66, 456], [76, 458], [84, 454], [70, 446], [80, 444]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.600" fill="#14101a"/>`).join(''),
    lipstick: shape('M64 430h20v30H64z', '#f4d35e') + shape('M67 408h14v22H67z', '#c0c0d8') + shape('M69 408V388l11 7v13z', '#b80e63'),
    icecream: `<path d="M56 396h36l-18 62z" fill="#e0a95e" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M62 406l20 24M86 406L66 430', 1.400, '#8b5a2b') + `<circle cx="74" cy="384" r="19" fill="#f08fb4" stroke="${INK}" stroke-width="2.600"/><circle cx="74" cy="360" r="14" fill="#fff6fb" stroke="${INK}" stroke-width="2.600"/><circle cx="74" cy="346" r="4.500" fill="#c0392b" stroke="${INK}" stroke-width="1.400"/>`,
    lollipop: strokeLine('M74 452V388', 6, INK) + strokeLine('M74 452V388', 3, '#fff6fb') + `<circle cx="74" cy="368" r="24" fill="#ff1f8f" stroke="${INK}" stroke-width="2.600"/>` + strokeLine('M74 368a6 6 0 016 6 11 11 0 01-17-9 16 16 0 0127 12', 3.500, '#fff6fb'),
    mirror: shape('M68 462h12V410H68z', '#c9a227') + `<ellipse cx="74" cy="382" rx="26" ry="32" fill="#c9a227" stroke="${INK}" stroke-width="2.600"/><ellipse cx="74" cy="382" rx="19" ry="25" fill="#bfe9f5" stroke="${INK}" stroke-width="1.800"/>` + strokeLine('M64 372l12-12M66 388l18-18', 2.600, '#fff6fb'),
    fan: `<path d="M74 440L18 396Q74 340 130 396Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M74 440L42 374M74 440V360M74 440l32-66', 1.800, INK, 'opacity=".55"') + strokeLine('M22 396Q74 346 126 396', 3, '#fff6fb'),
    candle: shape('M50 448h48v8H50z', '#c9a227') + shape('M64 396h20v52H64z', '#fff6fb') + strokeLine('M74 396v-7', 2, INK) + `<path d="M74 366c7 8 10 13 8 18a8 8 0 01-16 0c-2-5 1-10 8-18z" fill="#ffb703" stroke="${INK}" stroke-width="1.800"/>`,
    potion: shape('M66 382h16v20L100 440q5 22-26 22T48 440L66 402z', '#35dcc8') + shape('M63 372h22v12H63z', '#8b5a2b') + `<circle cx="68" cy="440" r="4" fill="#fff6fb" opacity=".8"/><circle cx="84" cy="448" r="2.600" fill="#fff6fb" opacity=".8"/>` + strokeLine('M50 432Q74 442 98 432', 1.800, INK),
    orb: shape('M52 446h44l6 16H46z', '#6a1f86') + `<circle cx="74" cy="412" r="33" fill="#c7a6ff" stroke="${INK}" stroke-width="2.600"/><circle cx="74" cy="412" r="20" fill="#8a2be2" opacity=".45"/>` + strokeLine('M56 396q10-12 22-10', 4, '#fff6fb'),
    teddy: `<circle cx="52" cy="384" r="9" fill="#8b5a2b" stroke="${INK}" stroke-width="2.200"/><circle cx="96" cy="384" r="9" fill="#8b5a2b" stroke="${INK}" stroke-width="2.200"/><ellipse cx="74" cy="442" rx="23" ry="26" fill="#8b5a2b" stroke="${INK}" stroke-width="2.600"/><circle cx="74" cy="400" r="24" fill="#a56f3c" stroke="${INK}" stroke-width="2.600"/><ellipse cx="74" cy="408" rx="10" ry="8" fill="#e8c9a0"/><circle cx="65" cy="396" r="3" fill="${INK}"/><circle cx="83" cy="396" r="3" fill="${INK}"/><circle cx="74" cy="404" r="2.600" fill="${INK}"/>`,
    pumpkin: `<ellipse cx="74" cy="430" rx="38" ry="30" fill="#ff8c1a" stroke="${INK}" stroke-width="2.600"/>` + strokeLine('M74 400V460M54 404Q44 430 54 456M94 404Q104 430 94 456', 1.800, INK, 'opacity=".55"') + shape('M68 402l2-14 10 2-2 12z', '#2f8f4e') + `<path d="M56 420l8 6-8 4zM92 420l-8 6 8 4zM58 442q16 10 32 0-16 6-32 0z" fill="#14101a"/>`,
    balloon: strokeLine('M74 436Q60 380 70 330', 1.800, INK) + `<ellipse cx="72" cy="296" rx="30" ry="36" fill="#ff1f8f" stroke="${INK}" stroke-width="2.600"/><path d="M72 332l-5 8h10z" fill="#ff1f8f" stroke="${INK}" stroke-width="1.800"/>` + strokeLine('M56 280q6-12 16-14', 4, '#fff6fb'),
    bouquet: `<path d="M56 410h38l-14 56h-10z" fill="#fff6fb" stroke="${INK}" stroke-width="2.400" stroke-linejoin="round"/>` + [[58, 392, '#ff1f8f'], [90, 392, '#f4d35e'], [74, 378, '#c0392b'], [46, 372, '#19b7e8'], [102, 372, '#8a2be2'], [74, 400, '#f08fb4']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="#fff6fb"/>`).join(''),
    camera: shape('M38 408h72v48H38z', '#14101a') + shape('M58 396h28v12H58z', '#14101a') + `<circle cx="74" cy="432" r="17" fill="#2c2436" stroke="#c0c0d8" stroke-width="3.500"/><circle cx="74" cy="432" r="7" fill="#19b7e8"/><circle cx="100" cy="416" r="3" fill="#ff1f8f"/>`,
    lantern: strokeLine('M74 416V376', 3, INK) + shape('M50 416h48v8H50z', '#14101a') + shape('M56 424h36l4 40H52z', '#ffb703') + shape('M50 464h48v8H50z', '#14101a') + `<path d="M74 434c6 7 8 11 7 15a7 7 0 01-14 0c-1-4 1-8 7-15z" fill="#fff6fb"/>`,
    donut: `<circle cx="74" cy="408" r="34" fill="#e0a95e" stroke="${INK}" stroke-width="2.600"/><path d="M42 402a33 33 0 0164 0q-6 10-12 2-6 12-14 2-8 10-14 0-8 10-14 0-6 6-10-4z" fill="#ff1f8f"/><circle cx="74" cy="408" r="11" fill="none" stroke="${INK}" stroke-width="2.600"/>` + strokeLine('M56 390l5 3M86 386l-3 5M74 382l1 5M92 402l-5-1M52 402l5 1', 2.400, '#fff6fb'),
    cupcake: `<path d="M50 416h48l-8 44H58z" fill="#fff6fb" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M62 420l3 38M74 420v38M86 420l-3 38', 1.600, INK, 'opacity=".5"') + `<path d="M46 416c0-14 8-16 12-18 0-14 10-18 16-18s16 4 16 18c4 2 12 4 12 18q-28 8-56 0z" fill="#f08fb4" stroke="${INK}" stroke-width="2.600"/><circle cx="74" cy="374" r="6" fill="#c0392b" stroke="${INK}" stroke-width="1.600"/>`,
    cat: `<ellipse cx="74" cy="440" rx="22" ry="26" fill="#14101a" stroke="${INK}" stroke-width="2.400"/>` + shape('M52 386l2-22 14 12zM96 386l-2-22-14 12z', '#14101a') + `<circle cx="74" cy="398" r="24" fill="#14101a" stroke="${INK}" stroke-width="2.400"/><ellipse cx="64" cy="396" rx="5" ry="6" fill="#8df04a"/><ellipse cx="84" cy="396" rx="5" ry="6" fill="#8df04a"/><path d="M71 406h6l-3 4z" fill="#ff1f8f"/>` + strokeLine('M50 404l12 2M50 412l12-2M98 404l-12 2M98 412l-12-2', 1.400, '#fff6fb'),
    brush: strokeLine('M74 462L52 374', 9, INK) + strokeLine('M74 462L52 374', 5, '#c9a227') + `<path d="M46 378l12-4 5 14-9 4z" fill="#c0c0d8" stroke="${INK}" stroke-width="1.800"/><path d="M45 376c-4-16-4-22-1-34 9 10 14 18 14 30z" fill="${o.trim}" stroke="${INK}" stroke-width="2.200"/>`,
    scroll: shape('M42 394h64v62H42z', '#f4e6c3') + [`<ellipse cx="42" cy="425" rx="6" ry="33" fill="#d9c28f" stroke="${INK}" stroke-width="2.200"/>`, `<ellipse cx="106" cy="425" rx="6" ry="33" fill="#d9c28f" stroke="${INK}" stroke-width="2.200"/>`].join('') + strokeLine('M54 408h40M54 420h40M54 432h28', 2, '#8b5a2b'),
} as Record<string, string>)[o.hold] || '';
  const heldThere = held ? '<g transform="translate(' + holdDX.toFixed(1) + ' ' + holdDY.toFixed(1) + ')">' + held + '</g>' : '';
  if (pose.front && pose.front.includes('L')) frontParts += heldThere; else parts.hold = heldThere;
  parts.armsFront = frontParts;

  /* ---------- necklaces, on-your-back things and face details ---------- */
  parts.neck = ({
    mercoral: [[146, 226], [149, 234], [153, 241], [157, 246], [163, 246], [167, 241], [171, 234], [174, 226]].map(([x, y], i) => '<ellipse cx="' + x + '" cy="' + y + '" rx="4.200" ry="3.400" fill="' + (i % 3 === 1 ? '#7fe8ff' : '#ff7a66') + '" stroke="' + INK + '" stroke-width="1"/>').join('') + '<path d="M153 250h14l-3 10h-8z" fill="#7fe8ff" stroke="' + INK + '" stroke-width="1.200"/>',
    pearlstrand: [[146, 226], [148, 233], [151.500, 239], [155.500, 244], [160, 246], [164.500, 244], [168.500, 239], [172, 233], [174, 226]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3.400" fill="#fbf2c9" stroke="' + INK + '" stroke-width="1.100"/>').join(''),
    sapphirependant: [[146, 226], [149, 234], [153.500, 240], [166.500, 240], [171, 234], [174, 226]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3.200" fill="#fbf2c9" stroke="' + INK + '" stroke-width="1.100"/>').join('') + '<ellipse cx="160" cy="252" rx="8" ry="10" fill="#e0b83c" stroke="' + INK + '" stroke-width="1.800"/><ellipse cx="160" cy="252" rx="5" ry="7" fill="#2f55c4"/>',
    rubyheart: strokeLine('M146 226Q160 256 174 226', 2, '#e0e4ee') + '<path d="M160 264C148 254 148 244 155 243C158 243 160 246 160 248C160 246 162 243 165 243C172 244 172 254 160 264Z" fill="#d3122a" stroke="' + INK + '" stroke-width="1.800"/>',
    tiffanyheart: strokeLine('M146 226Q160 256 174 226', 2.2, '#e8ebf2') + '<path d="M160 264C148 254 148 244 155 243C158 243 160 246 160 248C160 246 162 243 165 243C172 244 172 254 160 264Z" fill="#dfe3ec" stroke="' + INK + '" stroke-width="1.800"/>',
    alhambra: strokeLine('M146 226Q160 262 174 226', 2, '#e0b83c') + [[150, 239], [160, 250], [170, 239]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="5" fill="#f6f4ee" stroke="#e0b83c" stroke-width="2.400"/>').join(''),
    diamondchain: strokeLine('M144 226Q160 264 176 226', 9, INK) + strokeLine('M144 226Q160 264 176 226', 6, '#eaf7ff') + strokeLine('M144 226Q160 264 176 226', 2, '#9fd8ff', 'stroke-dasharray="1 4"') + '<path d="M160 244l8 9-8 12-8-12Z" fill="#eaf7ff" stroke="' + INK + '" stroke-width="1.8"/><path d="M152 253H168M160 244V265" stroke="#9fd8ff" stroke-width="1"/>',
    diamondpendant: strokeLine('M146 226Q160 258 174 226', 2.2, '#e0e6f0') + '<path d="M160 244l9 10-9 13-9-13Z" fill="#dff4ff" stroke="' + INK + '" stroke-width="1.8"/><path d="M151 254H169M155 254L160 244L165 254L160 267Z" fill="none" stroke="#7fcfff" stroke-width="1"/>',
    tennisnecklace: [[146, 226], [148.500, 233], [152, 239], [156, 243.500], [160, 245], [164, 243.500], [168, 239], [171.500, 233], [174, 226]].map(([x, y]) => '<path d="M' + x + ' ' + (y - 4) + 'l4 4-4 4-4-4Z" fill="#eaf7ff" stroke="' + INK + '" stroke-width="1.100"/>').join(''),
    choker: strokeLine('M147 222Q160 230 173 222', 6, o.trim),
    skull: strokeLine('M146 226Q160 262 174 226', 2.4, INK) + '<circle cx="160" cy="254" r="8" fill="#fff6fb" stroke="' + INK + '" stroke-width="1.8"/><circle cx="157" cy="253" r="1.8" fill="' + INK + '"/><circle cx="163" cy="253" r="1.8" fill="' + INK + '"/>',
    pearls: [[146, 228], [150, 238], [155, 245], [160, 248], [165, 245], [170, 238], [174, 228]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3.6" fill="#fff6fb" stroke="' + INK + '" stroke-width="1"/>').join(''),
    chain: strokeLine('M146 226Q160 268 174 226', 3, '#f4d35e') + strokeLine('M146 226Q160 268 174 226', 1, INK, 'stroke-dasharray="2 3"'),
    heart: strokeLine('M146 226Q160 256 174 226', 2, '#f4d35e') + '<path d="M160 262c-9-7-11-14-5-16 3-1 5 1 5 3 0-2 2-4 5-3 6 2 4 9-5 16z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1.6"/>',
    spikes: strokeLine('M146 222Q160 232 174 222', 8, '#14101a') + '<path d="M148 228l2 9 3-7zM156 231l3 9 3-9zM164 230l3 7 2-9z" fill="#c0c0d8" stroke="' + INK + '" stroke-width="1"/>',
      bowtie: `<path d="M160 228l-20-11v22zM160 228l20-11v22z" fill="${o.trim}" stroke="${INK}" stroke-width="2.200" stroke-linejoin="round"/><circle cx="160" cy="228" r="4" fill="${shade(o.trim, -.25)}" stroke="${INK}" stroke-width="1.600"/>`,
    tie: shape('M153 228h14l-3 14 7 64-11 12-11-12 7-64z', o.trim) + strokeLine('M154 262l12-8M153 284l14-10', 2, contrast(o.trim)),
    ribbon: strokeLine('M147 222Q160 230 173 222', 7, o.trim) + `<path d="M160 232l-5 28 5-5 5 5z" fill="${o.trim}" stroke="${INK}" stroke-width="1.600"/><path d="M160 230l-14-8v15zM160 230l14-8v15z" fill="${o.trim}" stroke="${INK}" stroke-width="1.600"/>`,
    cameo: strokeLine('M147 222Q160 230 173 222', 5, '#14101a') + `<ellipse cx="160" cy="238" rx="10" ry="12" fill="#fff6fb" stroke="#f4d35e" stroke-width="3"/><circle cx="160" cy="235" r="4" fill="#c7a6ff"/><path d="M153 246q7-8 14 0z" fill="#c7a6ff"/>`,
    moon: strokeLine('M146 226Q160 256 174 226', 2, '#c0c0d8') + `<path d="M166 244a12 12 0 100 20 10 10 0 010-20z" fill="#f4d35e" stroke="${INK}" stroke-width="1.600"/>`,
    star: strokeLine('M146 226Q160 256 174 226', 2, '#f4d35e') + `<path d="M160 243l3.500 7.500 8 .8-6 5.400 1.800 8-7.300-4.200-7.300 4.200 1.800-8-6-5.400 8-.8z" fill="${o.trim}" stroke="${INK}" stroke-width="1.500"/>`,
    bat: strokeLine('M146 226Q160 252 174 226', 2, '#c0c0d8') + `<path d="M160 250c-3-5-10-7-17-4 4 2 5 5 4 9 4-2 9-2 13 5 4-7 9-7 13-5-1-4 0-7 4-9-7-3-14-1-17 4z" fill="#14101a" stroke="${INK}" stroke-width="1.200"/>`,
    lariat: strokeLine('M146 226Q160 246 174 226', 2.400, '#f4d35e') + strokeLine('M160 236V296', 2.400, '#f4d35e') + `<circle cx="160" cy="300" r="5" fill="${o.trim}" stroke="${INK}" stroke-width="1.500"/>`,
    layered: strokeLine('M146 224Q160 240 174 224', 2.400, '#f4d35e') + strokeLine('M144 228Q160 262 176 228', 2.400, '#c0c0d8') + strokeLine('M142 232Q160 284 178 232', 2.400, '#f4d35e') + `<circle cx="160" cy="260" r="3.500" fill="${o.trim}" stroke="${INK}" stroke-width="1"/>`,
    beads: [[144, 226], [147, 236], [152, 244], [160, 248], [168, 244], [173, 236], [176, 226]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${i % 2 ? o.trim : '#f4d35e'}" stroke="${INK}" stroke-width="1.400"/>`).join(''),
    gems: strokeLine('M144 224Q160 238 176 224', 9, '#14101a') + [[148, 228], [154, 232], [160, 234], [166, 232], [172, 228]].map(([x, y]) => `<path d="M${x} ${y - 4}l4 4-4 4-4-4z" fill="${o.trim}" stroke="${INK}" stroke-width="1"/>`).join(''),
    ruff: `<path d="M124 226q6-12 16-8 6-10 20-6 14-4 20 6 10-4 16 8-6 12-16 10-6 8-20 4-14 4-20-4-10 2-16-10z" fill="#fff6fb" stroke="${INK}" stroke-width="2.400"/>` + strokeLine('M138 220l6 14M160 214v22M182 220l-6 14', 1.600, INK, 'opacity=".5"'),
    scarf: shape('M136 214Q160 232 184 214L194 240Q160 262 126 240Z', o.trim) + shape('M170 248h24l4 70-14 4-6-4-8 4z', o.trim) + strokeLine('M174 300h22', 3, contrast(o.trim)),
    bandana: shape('M132 218Q160 234 188 218L160 280Z', o.trim) + `<circle cx="160" cy="246" r="3" fill="${contrast(o.trim)}"/><circle cx="148" cy="234" r="2" fill="${contrast(o.trim)}"/><circle cx="172" cy="234" r="2" fill="${contrast(o.trim)}"/>`,
    boa: [[126, 240], [136, 256], [146, 268], [160, 276], [174, 268], [184, 256], [194, 240], [120, 262], [200, 262], [114, 286], [206, 286], [110, 312], [210, 312]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${o.trim}" stroke="${INK}" stroke-width="1.400"/>`).join(''),
    shell: strokeLine('M146 226Q160 250 174 226', 2, '#35dcc8') + `<path d="M160 268l-16-20q16-12 32 0z" fill="#f7b8cf" stroke="${INK}" stroke-width="1.800"/>` + strokeLine('M160 268l-9-22M160 268v-24M160 268l9-22', 1.200, INK),
    key: strokeLine('M146 226Q160 250 174 226', 2, '#c0c0d8') + `<circle cx="160" cy="246" r="6" fill="none" stroke="#f4d35e" stroke-width="3.400"/>` + strokeLine('M160 252v22M160 266h7M160 274h6', 3.400, '#f4d35e'),
    padlock: strokeLine('M147 222Q160 230 173 222', 5, '#14101a') + `<path d="M154 238v-5a6 6 0 0112 0v5" fill="none" stroke="#c0c0d8" stroke-width="3"/>` + shape('M150 238h20v18h-20z', '#f4d35e') + `<circle cx="160" cy="246" r="2.400" fill="${INK}"/>`,
    tags: strokeLine('M146 226Q160 258 174 226', 2, '#c0c0d8') + `<rect x="150" y="250" width="14" height="24" rx="4" fill="#c0c0d8" stroke="${INK}" stroke-width="1.500" transform="rotate(-10 157 262)"/><rect x="158" y="252" width="14" height="24" rx="4" fill="#e6e6f0" stroke="${INK}" stroke-width="1.500" transform="rotate(8 165 264)"/>`,
    bone: strokeLine('M147 222Q160 230 173 222', 5, '#14101a') + shape('M150 240a4 4 0 10-3 7 4 4 0 103 6l20 0a4 4 0 103-6 4 4 0 10-3-7z', '#fff6e0'),
    spider: strokeLine('M146 226Q160 252 174 226', 1.400, '#fff6fb') + strokeLine('M148 248l-8-6M148 254h-10M148 260l-8 6M172 248l8-6M172 254h10M172 260l8 6', 2, '#14101a') + `<ellipse cx="160" cy="254" rx="12" ry="9" fill="#14101a" stroke="${INK}" stroke-width="1.200"/><circle cx="160" cy="246" r="5" fill="#14101a"/>`,
    coffin: strokeLine('M146 226Q160 248 174 226', 2, '#c0c0d8') + shape('M155 242h10l6 8-4 22h-14l-4-22z', '#14101a'),
    teacup: strokeLine('M146 226Q160 248 174 226', 2, '#f4d35e') + `<path d="M148 244h24v6c0 9-5 14-12 14s-12-5-12-14z" fill="#fff6fb" stroke="${INK}" stroke-width="1.800"/><path d="M172 248h3a4 4 0 010 9h-5" fill="none" stroke="${INK}" stroke-width="1.800"/>`,
} as Record<string, string>)[o.neck] || '';
  const twin = (inner: string) => inner + '<g transform="translate(320 0) scale(-1 1)">' + inner + '</g>';
  parts.back = ({
    cape: '<path d="M124 236L196 236C230 380 250 540 262 650Q160 680 58 650C70 540 90 380 124 236Z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>',
    short: '<path d="M122 236L198 236L240 420Q160 446 80 420Z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>',
    bag: '<rect x="108" y="254" width="104" height="108" rx="24" fill="' + o.topC + '" stroke="' + INK + '" stroke-width="2.6"/>' + strokeLine('M120 340h80', 3, o.trim),
    tail: strokeLine('M186 372C250 400 270 450 244 490', 9, INK) + strokeLine('M186 372C250 400 270 450 244 490', 5, o.trim) + '<path d="M244 482l-18 22 26 2z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.4"/>',
    bigbow: '<path d="M160 300L66 240q-16 60 0 120zM160 300l94-60q16 60 0 120z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>',
      angel: twin('<path d="M126 268C78 170 26 150 -24 178C-10 200 -26 222 -18 244C-6 244 0 262 12 268C18 274 34 286 56 286C72 298 100 300 120 294Z" fill="#fff6fb" stroke="' + INK + '" stroke-width="2.600" stroke-linejoin="round"/>' + strokeLine('M116 264C74 212 34 194 -10 190M112 272C78 244 30 230 -6 240M114 282C82 272 50 268 20 266', 1.600, '#b19cd9')),
    butterfly: twin('<path d="M130 268C90 170 20 150 -6 186C-22 222 30 280 130 290Z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.600"/><path d="M130 292C70 300 18 330 30 376C50 410 110 380 132 310Z" fill="' + shade(o.trim, .25) + '" stroke="' + INK + '" stroke-width="2.600"/><circle cx="46" cy="212" r="14" fill="#f4d35e" stroke="' + INK + '" stroke-width="2"/><circle cx="70" cy="346" r="11" fill="#14101a"/>'),
    fairy: twin('<path d="M130 272C96 190 40 150 6 168C-8 200 60 272 130 288Z" fill="#bfe9f5" fill-opacity=".85" stroke="' + INK + '" stroke-width="2.200"/><path d="M130 296C96 312 44 350 48 388C70 402 116 356 132 310Z" fill="#f7b8cf" fill-opacity=".85" stroke="' + INK + '" stroke-width="2.200"/>' + strokeLine('M126 280C90 236 52 196 18 176M126 300C96 330 66 362 54 382', 1.400, INK, 'opacity=".5"')),
    dragon: twin(shape('M128 262C100 170 40 130 -24 150C-6 170 -8 196 -18 214C2 204 20 212 24 236C40 222 60 228 66 252C80 240 104 248 122 290Z', '#2f8f4e') + strokeLine('M122 268C92 208 44 170 -14 154M118 272C94 240 56 214 24 232M120 280C96 262 80 250 66 250', 2, INK, 'opacity=".6"') + '<path d="M-24 150l-14-14 20 4z" fill="#c0c0d8" stroke="' + INK + '" stroke-width="1.600"/>'),
    demon: twin(shape('M128 264C102 200 60 150 2 150C14 180 12 200 0 226C22 216 38 224 44 250C58 236 78 244 86 272C100 262 112 270 124 292Z', '#c0392b') + strokeLine('M122 270C96 220 54 176 8 156', 2, INK, 'opacity=".55"')),
    peacock: [-60, -42, -24, -8, 8, 24, 42, 60].map(a => `<g transform="rotate(${a} 160 380)">` + strokeLine('M160 380V130', 3, '#0f766e') + `<ellipse cx="160" cy="124" rx="26" ry="38" fill="#0f766e" stroke="${INK}" stroke-width="2.200"/><ellipse cx="160" cy="118" rx="14" ry="20" fill="#19b7e8"/><circle cx="160" cy="114" r="7" fill="#1f3a8a"/></g>`).join(''),
    cat: strokeLine('M186 378C260 410 278 470 240 500C222 514 212 494 228 484', 15, INK) + strokeLine('M186 378C260 410 278 470 240 500C222 514 212 494 228 484', 10, o.trim),
    fox: `<path d="M184 372C258 366 302 440 276 520C268 546 244 540 238 524C216 470 200 420 180 400Z" fill="#ff8c1a" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/><path d="M276 520C268 546 244 540 238 524C232 500 262 480 280 490Z" fill="#fff6fb" stroke="${INK}" stroke-width="2"/>`,
    cloak: `<path d="M116 216C100 170 120 110 160 96C200 110 220 170 204 216C238 380 256 540 268 668Q160 700 52 668C64 540 82 380 116 216Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M100 340C92 460 80 570 74 660M220 340C228 460 240 570 246 660', 1.800, INK, 'opacity=".4"'),
    guitar: `<g transform="rotate(32 160 330)">` + shape('M152 130h16v160h-16z', '#5a2c17') + shape('M146 96h28v36h-28z', '#14101a') + `<path d="M160 280c-30 0-44 22-40 44 3 14 8 18 4 34-5 26 14 46 36 46s41-20 36-46c-4-16 1-20 4-34 4-22-10-44-40-44z" fill="#c0392b" stroke="${INK}" stroke-width="2.600"/><circle cx="160" cy="340" r="13" fill="#14101a"/></g>`,
    coffin: shape('M130 224h60l26 40-14 116h-84l-14-116z', '#14101a'),
    teddy: `<circle cx="104" cy="240" r="20" fill="#8b5a2b" stroke="${INK}" stroke-width="2.600"/><circle cx="216" cy="240" r="20" fill="#8b5a2b" stroke="${INK}" stroke-width="2.600"/><rect x="100" y="240" width="120" height="120" rx="42" fill="#a56f3c" stroke="${INK}" stroke-width="2.600"/>`,
    batbag: twin('<path d="M120 276C96 240 66 230 44 244C56 256 54 274 48 286C66 280 76 286 80 304C94 296 106 304 116 320Z" fill="#14101a" stroke="' + INK + '" stroke-width="2.200"/>') + `<rect x="110" y="256" width="100" height="98" rx="30" fill="#14101a" stroke="${INK}" stroke-width="2.600"/>`,
    skullbag: `<path d="M160 226c-44 0-62 32-62 66 0 26 12 42 28 50v34h68v-34c16-8 28-24 28-50 0-34-18-66-62-66z" fill="#fff6fb" stroke="${INK}" stroke-width="2.600"/>`,
    broom: `<g transform="rotate(28 160 330)">` + strokeLine('M160 60V540', 11, INK) + strokeLine('M160 60V540', 7, '#8b5a2b') + `<path d="M144 530h32l26 110q-42 20-84 0z" fill="#e0a95e" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M140 570l-8 62M160 570v72M180 570l8 62', 2, '#8b5a2b') + `</g>`,
    jetpack: twin(shape('M92 244h44v120H92z', '#c0c0d8') + shape('M92 244q22-30 44 0z', '#ff1f8f') + shape('M98 364h32l6 16H92z', '#14101a') + `<path d="M114 382c20 30 14 56 0 76-14-20-20-46 0-76z" fill="#ffb703" stroke="${INK}" stroke-width="2"/>`),
    sash: `<path d="M116 248L134 238L216 400L196 410Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>`,
    moon: `<path d="M214 34a124 124 0 100 240 104 104 0 010-240z" fill="#f4d35e" stroke="${INK}" stroke-width="2.600" transform="rotate(18 160 150)"/>`,
    shawl: `<path d="M118 240Q160 220 202 240L276 420L160 540L44 420Z" fill="${shade(o.trim, .25)}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M50 424q8 10 14 16t14 16 16 16 14 16 14 16 18 16M270 424q-8 10-14 16t-14 16-16 16-14 16-14 16-18 16', 5, o.trim, 'stroke-dasharray="1 7"'),
    balloons: strokeLine('M160 300L54 150M160 300L260 130M160 300L170 60', 1.800, INK) + [[54, 110, '#ff1f8f'], [262, 92, '#19b7e8'], [170, 26, '#f4d35e']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="40" fill="${c}" stroke="${INK}" stroke-width="2.600"/>`).join(''),
    parasol: strokeLine('M160 340L262 96', 5, '#14101a') + `<path d="M126 110Q262 -40 374 86L342 90L314 66L286 94L258 72L228 104L202 82L176 112L150 94Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>`,
    longscarf: `<path d="M178 226C240 240 300 220 356 180L368 210C310 256 244 276 176 256Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M356 180L368 210', 7, contrast(o.trim)),
    ribbons: twin(strokeLine('M150 330C110 420 130 500 86 590', 16, INK) + strokeLine('M150 330C110 420 130 500 86 590', 11, o.trim)) + `<path d="M160 320L118 294v52zM160 320l42-26v52z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600"/>`,
    shell: `<path d="M160 400C60 400 30 300 60 214Q88 240 104 220Q116 180 160 180Q204 180 216 220Q232 240 260 214C290 300 260 400 160 400Z" fill="#f7b8cf" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M160 400V190M160 400L92 230M160 400L228 230M160 400L66 300M160 400L254 300', 2, INK, 'opacity=".45"'),
} as Record<string, string>)[o.back] || '';
  if (['angel', 'butterfly', 'fairy', 'dragon', 'demon', 'peacock', 'balloons', 'parasol', 'longscarf', 'moon', 'guitar', 'broom', 'cat', 'fox'].includes(o.back)) needsRoom = true;
  parts.mark = ({
    freckles: [[112, 152], [120, 158], [128, 152], [192, 152], [200, 158], [208, 152]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="1.8" fill="' + shade(S, -.42) + '"/>').join(''),
    blush: '<ellipse cx="116" cy="158" rx="16" ry="8" fill="#ff1f8f" opacity=".42"/><ellipse cx="204" cy="158" rx="16" ry="8" fill="#ff1f8f" opacity=".42"/>',
    star: '<path d="M204 152l2.5 6 6.5.5-5 4 1.5 6.5-5.500-3.500-5.500 3.500 1.500-6.500-5-4 6.500-.5z" fill="' + o.shadow + '"/>',
    heart: '<path d="M204 166c-8-6-10-12-5-14 3-1 5 1 5 3 0-2 2-4 5-3 5 2 3 8-5 14z" fill="' + o.shadow + '"/>',
    tear: '<path d="M196 146c3 5 5 8 5 11a5 5 0 01-10 0c0-3 2-6 5-11z" fill="#14101a"/>',
    mole: '<circle cx="178" cy="170" r="2.2" fill="#14101a"/>',
    bandage: '<g transform="rotate(-18 112 158)"><rect x="98" y="152" width="28" height="11" rx="4" fill="#f4d9b0" stroke="' + INK + '" stroke-width="1.4"/><path d="M108 155v5M112 155v5M116 155v5" stroke="' + INK + '" stroke-width=".9"/></g>',
      gems: [[108, 158], [118, 165], [130, 168], [190, 168], [202, 165], [212, 158]].map(([x, y]) => `<path d="M${x} ${y - 4}l3.500 4-3.500 4-3.500-4z" fill="${o.shadow}" stroke="#fff6fb" stroke-width=".8"/>`).join(''),
    glitter: [[110, 148], [120, 154], [130, 160], [114, 164], [126, 170], [190, 160], [200, 154], [210, 148], [206, 164], [194, 170], [156, 80], [166, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.800" fill="${o.shadow}"/>`).join(''),
    moon: `<path d="M210 150a10 10 0 100 18 8 8 0 010-18z" fill="${o.shadow}"/>`,
    bat: `<path d="M204 156c-2-3-7-5-12-3 3 1 4 4 3 6 3-2 6-2 9 3 3-5 6-5 9-3-1-2 0-5 3-6-5-2-10 0-12 3z" fill="#14101a"/>`,
    butterfly: `<path d="M204 160c-4-8-12-11-15-8-2 4 3 8 8 9-5 1-7 6-5 8 3 2 9-2 12-9 3 7 9 11 12 9 2-2 0-7-5-8 5-1 10-5 8-9-3-3-11 0-15 8z" fill="${o.shadow}" stroke="${INK}" stroke-width=".8"/>`,
    flower: [0, 72, 144, 216, 288].map(a => `<ellipse cx="204" cy="151" rx="3.600" ry="6" transform="rotate(${a} 204 158)" fill="${o.shadow}"/>`).join('') + `<circle cx="204" cy="158" r="2.800" fill="#f4d35e"/>`,
    bolt: `<path d="M208 144l-11 15h7l-5 13 12-16h-7l6-12z" fill="#f4d35e" stroke="${INK}" stroke-width="1"/>`,
    scar: strokeLine('M190 92l22 48', 2, '#9c3b3b') + strokeLine('M192 104l8-4M198 118l8-4M204 130l8-4', 1.200, '#9c3b3b'),
    web: `<g fill="none" stroke="#14101a" stroke-width="1"><path d="M226 186L190 150M226 186L204 138M226 186L184 170M226 186L212 128"/><path d="M212 172q-6-5-8-3t-5-8q-2-5-3-4M204 162q-3-5-4-3"/></g>`,
    dots: [[188, 148], [196, 156], [204, 164], [212, 172]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${3 - i * .5}" fill="${o.shadow}"/>`).join(''),
    bindi: `<circle cx="160" cy="92" r="5" fill="#c0392b" stroke="${INK}" stroke-width="1"/><circle cx="160" cy="92" r="1.600" fill="#f4d35e"/>`,
    nosering: `<path d="M152 162a6 6 0 108 2" fill="none" stroke="#f4d35e" stroke-width="2.200"/>`,
    lipring: `<path d="M172 186a6 6 0 11-8 4" fill="none" stroke="#c0c0d8" stroke-width="2.200"/>`,
    brow: strokeLine('M204 90l-5 12', 3.600, S),
    whiskers: strokeLine('M100 154l28 4M100 166l28-2M100 178l28-8M220 154l-28 4M220 166l-28-2M220 178l-28-8', 1.800, '#14101a'),
    tears: [[122, 150], [122, 164], [198, 150], [198, 164]].map(([x, y]) => `<path d="M${x} ${y - 5}c2.500 4 4 6 4 8a4 4 0 01-8 0c0-2 1.500-4 4-8z" fill="#bfe9f5" stroke="${INK}" stroke-width=".8"/>`).join(''),
    stripes: strokeLine('M104 152l20 4M106 162l20 4M216 152l-20 4M214 162l-20 4', 3.400, o.shadow),
    warpaint: strokeLine('M104 146q24 4 48 4M108 160q18 2 32 2M216 146q-24 4-48 4M212 160q-18 2-32 2', 5, o.shadow, 'opacity=".9"'),
    sugar: `<g fill="none" stroke="#14101a" stroke-width="1.400"><circle cx="128" cy="126" r="24"/><circle cx="192" cy="126" r="24"/></g>` + [0, 60, 120, 180, 240, 300].map(a => `<circle cx="128" cy="99" r="2.600" transform="rotate(${a} 128 126)" fill="${o.shadow}"/><circle cx="192" cy="99" r="2.600" transform="rotate(${a} 192 126)" fill="${o.shadow}"/>`).join('') + strokeLine('M160 192v-6M152 192v-5M168 192v-5', 1.400, '#14101a') + `<path d="M154 150h12l-6 8z" fill="#14101a"/>`,
    dimples: strokeLine('M128 176q3 4 0 8M192 176q-3 4 0 8', 1.800, shade(S, -.34)),
    liner: strokeLine('M96 118l16 2M224 118l-16 2M96 112l20 -6M224 112l-20 -6', 3, '#14101a') + strokeLine('M128 158v8M192 158v8', 2, '#14101a'),
    tattoo: `<circle cx="204" cy="166" r="6" fill="#c0392b" stroke="${INK}" stroke-width="1"/>` + strokeLine('M204 166q3-3 0-4-3 1 0 4', 1, '#fff6fb') + `<path d="M200 172q-4 6-9 6 4-5 9-6zM208 172q4 6 9 6-4-5-9-6z" fill="#2f8f4e"/>`,
} as Record<string, string>)[o.mark] || '';
  parts.eyewear = ({
    round: '<g fill="none" stroke="' + o.trim + '" stroke-width="3.4"><circle cx="128" cy="126" r="21"/><circle cx="192" cy="126" r="21"/><path d="M149 124h22"/></g>',
    cat: '<g fill="none" stroke="' + o.trim + '" stroke-width="3.6" stroke-linejoin="round"><path d="M100 110L150 116Q150 148 124 146Q104 142 100 110Z"/><path d="M220 110L170 116Q170 148 196 146Q216 142 220 110Z"/><path d="M150 122h20"/></g>',
    shades: '<path d="M102 112H152V132Q148 150 124 148Q104 146 102 112ZM218 112H168V132Q172 150 196 148Q216 146 218 112Z" fill="#14101a" stroke="' + INK + '" stroke-width="2.4"/>' + strokeLine('M152 118h16', 4, o.trim) + strokeLine('M112 120l20 14M178 120l20 14', 2.4, '#fff6fb', 'opacity=".5"'),
    hearts: '<path d="M128 150c-24-16-30-32-16-38 8-3 14 2 16 8 2-6 8-11 16-8 14 6 8 22-16 38zM192 150c-24-16-30-32-16-38 8-3 14 2 16 8 2-6 8-11 16-8 14 6 8 22-16 38z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2.4"/>' + strokeLine('M146 124h28', 3, INK),
    visor: '<path d="M98 110Q160 96 222 110L218 140Q160 126 102 140Z" fill="' + o.trim + '" opacity=".78" stroke="' + INK + '" stroke-width="2.6"/>',
    monocle: '<circle cx="192" cy="126" r="22" fill="none" stroke="#f4d35e" stroke-width="3.4"/>' + strokeLine('M212 136C224 170 216 200 208 226', 1.6, '#f4d35e'),
      square: '<g fill="none" stroke="' + o.trim + '" stroke-width="3.800"><rect x="104" y="106" width="48" height="40" rx="4"/><rect x="168" y="106" width="48" height="40" rx="4"/><path d="M152 122h16"/></g>',
    aviator: '<g fill="#14101a" fill-opacity=".62" stroke="#f4d35e" stroke-width="3"><path d="M104 110H152Q156 146 128 150Q102 148 104 110Z"/><path d="M216 110H168Q164 146 192 150Q218 148 216 110Z"/></g>' + strokeLine('M152 116h16', 3, '#f4d35e'),
    oval: '<g fill="none" stroke="' + o.trim + '" stroke-width="3.400"><ellipse cx="128" cy="128" rx="25" ry="17"/><ellipse cx="192" cy="128" rx="25" ry="17"/><path d="M153 126h14"/></g>',
    half: strokeLine('M102 118Q128 108 152 118M168 118Q192 108 218 118', 6, o.trim) + strokeLine('M152 120h16', 3, o.trim) + '<path d="M102 118Q106 148 128 148Q148 148 152 118M168 118Q172 148 192 148Q214 148 218 118" fill="none" stroke="' + o.trim + '" stroke-width="1.400"/>',
    starry: [128, 192].map(x => '<path transform="translate(' + x + ' 128) scale(2.700)" d="M0-11l3 7 8 .5-6 5 2 8-7-4-7 4 2-8-6-5 8-.5z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width=".9"/>').join('') + strokeLine('M150 124h20', 3, INK),
    skull: [128, 192].map(x => '<path d="M' + x + ' 102c-16 0-26 11-26 24 0 9 5 15 12 18v8h28v-8c7-3 12-9 12-18 0-13-10-24-26-24z" fill="#14101a" stroke="#fff6fb" stroke-width="2"/><circle cx="' + (x - 9) + '" cy="124" r="5" fill="#fff6fb"/><circle cx="' + (x + 9) + '" cy="124" r="5" fill="#fff6fb"/>').join('') + strokeLine('M154 122h12', 3, INK),
    flower: [128, 192].map(x => [0, 60, 120, 180, 240, 300].map(a => '<circle cx="' + x + '" cy="106" r="11" transform="rotate(' + a + ' ' + x + ' 128)" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1.600"/>').join('') + '<circle cx="' + x + '" cy="128" r="16" fill="#14101a" fill-opacity=".85" stroke="' + INK + '" stroke-width="1.600"/>').join(''),
    goggles: '<path d="M92 124H228" fill="none" stroke="#14101a" stroke-width="9"/>' + [128, 192].map(x => '<circle cx="' + x + '" cy="126" r="26" fill="#bfe9f5" fill-opacity=".55" stroke="' + o.trim + '" stroke-width="6"/>').join(''),
    steam: strokeLine('M92 124H228', 8, '#5a2c17') + [128, 192].map(x => '<circle cx="' + x + '" cy="126" r="27" fill="#ffb703" fill-opacity=".45" stroke="#c9a227" stroke-width="6"/><circle cx="' + x + '" cy="126" r="20" fill="none" stroke="#5a2c17" stroke-width="2" stroke-dasharray="2 4"/>').join(''),
    mask: '<path d="M90 104Q128 84 160 110Q192 84 230 104Q226 150 192 152Q170 150 160 134Q150 150 128 152Q94 150 90 104ZM108 122Q128 106 146 124Q128 142 108 122ZM174 124Q192 106 212 122Q192 142 174 124Z" fill="' + o.trim + '" fill-rule="evenodd" stroke="' + INK + '" stroke-width="2.400"/>',
    patch: strokeLine('M96 92L222 142', 4, '#14101a') + '<ellipse cx="192" cy="128" rx="27" ry="23" fill="#14101a" stroke="' + INK + '" stroke-width="2"/>' + strokeLine('M180 122l24 12M204 122l-24 12', 2, o.trim),
    butterfly: '<path d="M160 134C138 92 92 80 84 96C76 128 106 158 140 150C150 148 156 142 160 134C164 142 170 148 180 150C214 158 244 128 236 96C228 80 182 92 160 134ZM108 118Q128 106 146 128Q128 142 108 118ZM174 128Q192 106 212 118Q192 142 174 128Z" fill="' + o.trim + '" fill-rule="evenodd" stroke="' + INK + '" stroke-width="2.400"/>',
    lace: '<path d="M92 108Q128 92 160 112Q192 92 228 108Q226 150 192 152Q170 150 160 136Q150 150 128 152Q94 150 92 108ZM108 124Q128 108 146 126Q128 142 108 124ZM174 126Q192 108 212 124Q192 142 174 126Z" fill="#14101a" fill-rule="evenodd" stroke="' + INK + '" stroke-width="1.600"/>' + strokeLine('M94 112q8 -12 16 -6t16 -6 16 2 18 6 18-6 16-2 16 6 16 6', 3, '#14101a', 'stroke-dasharray="2 3"'),
    vr: '<rect x="94" y="102" width="132" height="50" rx="14" fill="#14101a" stroke="' + INK + '" stroke-width="2.400"/>' + strokeLine('M106 124h108', 6, o.trim) + '<circle cx="202" cy="112" r="3" fill="#8df04a"/>',
    threed: '<g stroke="#fff6fb" stroke-width="4"><rect x="104" y="108" width="48" height="36" fill="#d62828" fill-opacity=".72"/><rect x="168" y="108" width="48" height="36" fill="#19b7e8" fill-opacity=".72"/><path d="M152 118h16" fill="none"/></g>',
    rainbow: [['#ff1f8f', 26], ['#f4d35e', 20], ['#19b7e8', 14]].map(([c, r]) => '<circle cx="128" cy="126" r="' + r + '" fill="' + c + '"/><circle cx="192" cy="126" r="' + r + '" fill="' + c + '"/>').join('') + strokeLine('M154 122h12', 3, INK),
    nerd: '<g fill="none" stroke="#14101a" stroke-width="5"><rect x="104" y="108" width="46" height="36" rx="10"/><rect x="170" y="108" width="46" height="36" rx="10"/></g>' + strokeLine('M148 124h24', 8, '#fff6fb') + strokeLine('M154 120v8M162 120v8', 1.400, INK),
    pixel: '<path d="M100 112h116v8h-4v16h-8v8h-28v-8h-8v-16h-8v16h-8v8h-28v-8h-8v-16h-4v-8z" fill="#14101a"/><path d="M112 120h8v8h-8zM120 128h8v8h-8zM176 120h8v8h-8zM184 128h8v8h-8z" fill="#fff6fb"/>',
    ski: strokeLine('M92 126H228', 10, o.trim) + '<rect x="98" y="102" width="124" height="50" rx="24" fill="#ff8c1a" fill-opacity=".82" stroke="#14101a" stroke-width="5"/>' + strokeLine('M112 134l26-22M128 138l26-24', 3, '#fff6fb', 'opacity=".75"'),
    catmask: '<path d="M92 114L94 76L116 96Q160 84 204 96L226 76L228 114Q226 150 192 152Q170 150 160 136Q150 150 128 152Q94 150 92 114ZM108 124Q128 108 146 126Q128 142 108 124ZM174 126Q192 108 212 124Q192 142 174 126Z" fill="' + o.trim + '" fill-rule="evenodd" stroke="' + INK + '" stroke-width="2.400"/>',
    batmask: '<path d="M88 104L108 72L124 92L160 84L196 92L212 72L232 104Q228 150 192 152Q170 150 160 136Q150 150 128 152Q92 150 88 104ZM108 124Q128 108 146 126Q128 142 108 124ZM174 126Q192 108 212 124Q192 142 174 126Z" fill="#14101a" fill-rule="evenodd" stroke="' + INK + '" stroke-width="2.400"/>',
    chain: '<g fill="none" stroke="' + o.trim + '" stroke-width="3"><circle cx="128" cy="126" r="21"/><circle cx="192" cy="126" r="21"/><path d="M149 124h22"/></g>' + strokeLine('M106 128C86 170 92 200 112 226M214 128C234 170 228 200 208 226', 2.400, '#f4d35e', 'stroke-dasharray="3 3"'),
    rimless: '<g fill="#bfe9f5" fill-opacity=".28" stroke="#c0c0d8" stroke-width="1"><rect x="106" y="110" width="44" height="32" rx="12"/><rect x="170" y="110" width="44" height="32" rx="12"/></g>' + strokeLine('M150 122h20', 2.400, '#c0c0d8'),
} as Record<string, string>)[o.eyewear] || '';

  /* ---------- head and face ---------- */
  parts.head = `<ellipse cx="96" cy="136" rx="8" ry="14" fill="${SD}" stroke="${INK}" stroke-width="2.6"/><ellipse cx="224" cy="136" rx="8" ry="14" fill="${SD}" stroke="${INK}" stroke-width="2.6"/>`
    + shape('M94 112Q94 42 160 42Q226 42 226 112Q226 146 200 172Q178 194 160 212Q142 194 120 172Q94 146 94 112Z', S)
    + `<path d="M226 112Q226 146 200 172Q178 194 160 212Q172 190 190 168Q212 142 214 104Z" fill="${SD}" opacity=".55"/>`;
  const scarfOn = HIJABS.some(h => h.id === o.hairStyle);
  const browColour = o.browC || shade(scarfOn ? '#17101c' : hair, -.3);
  const lipScale = LIP_SIZES[o.lipSize] ?? 1;
  const atMouth = (inner: string) => (lipScale === 1 ? inner : '<g transform="translate(160 184) scale(' + lipScale + ') translate(-160 -184)">' + inner + '</g>');
  const noseArt = (): string => {
    const line = (d: string, w = 2) => strokeLine(d, w, INK), BUTTON = 'M155 163q2 3 4 2M165 163q-2 3-4 2';
    const dot = (x: number, y: number, r: number, c: string, edge = '') => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"' + (edge ? ' stroke="' + edge + '" stroke-width="1.600"' : '') + '/>';
    return ({
      button: () => line(BUTTON),
      dots: () => dot(156, 164, 1.500, INK) + dot(164, 164, 1.500, INK),
      none: () => '',
      snub: () => line('M153 162q7 6 14 0'),
      upturned: () => line('M153 157q-3 7 3 7q4 1 8 0q6 0 3-7'),
      pointed: () => line('M161 142L154 165Q160 170 166 165'),
      straight: () => line('M158 134L154 164Q160 170 166 164'),
      long: () => line('M158 128L151 169Q160 176 169 169'),
      wide: () => line('M147 159q-3 8 6 7q7-4 14 0q9 1 6-7'),
      ball: () => dot(160, 161, 8, SD, INK),
      hooked: () => line('M155 134Q170 150 165 164Q158 171 151 164'),
      flared: () => line('M146 158q-1 10 8 8q6 2 12 0q9 2 8-8'),
      shine: () => line(BUTTON) + dot(160, 156, 2.200, '#fff'),
      contour: () => strokeLine('M154 134L152 160M166 134L168 160', 3, SD) + line(BUTTON) + dot(160, 154, 1.800, '#fff'),
      pink: () => '<ellipse cx="160" cy="160" rx="10" ry="7" fill="#ff1f8f" opacity=".42"/>' + line(BUTTON),
      freckled: () => line(BUTTON) + [[146, 152], [152, 148], [160, 147], [168, 148], [174, 152]].map(([x, y]) => dot(x, y, 1.500, shade(S, -.42))).join(''),
      pig: () => '<ellipse cx="160" cy="161" rx="12" ry="9" fill="#f7b8cf" stroke="' + INK + '" stroke-width="2"/>' + dot(155, 161, 2.200, INK) + dot(165, 161, 2.200, INK),
      cat: () => '<path d="M152 157h16l-8 9z" fill="#ff1f8f" stroke="' + INK + '" stroke-width="1.600" stroke-linejoin="round"/>' + line('M160 166v5'),
      bunny: () => '<path d="M154 158h12l-6 7z" fill="#f7b8cf" stroke="' + INK + '" stroke-width="1.600" stroke-linejoin="round"/>' + line('M160 165v4M160 169q-4 3-7 1M160 169q4 3 7 1', 1.600),
      wolf: () => '<path d="M148 154Q160 148 172 154Q170 166 160 170Q150 166 148 154Z" fill="#14101a" stroke="' + INK + '" stroke-width="1.600"/><ellipse cx="156" cy="155" rx="3" ry="1.600" fill="#fff" opacity=".7"/>',
      skull: () => '<path d="M160 150c-3 6-9 12-8 16 1 3 6 3 8 0 2 3 7 3 8 0 1-4-5-10-8-16z" fill="#14101a"/>',
      pumpkin: () => '<path d="M150 170L160 150L170 170Z" fill="#14101a" stroke="#ff8c1a" stroke-width="1.600" stroke-linejoin="round"/>',
      witch: () => '<path d="M154 134Q172 158 184 178Q166 180 150 165Z" fill="' + S + '" stroke="' + INK + '" stroke-width="2.200" stroke-linejoin="round"/>' + dot(170, 164, 3, '#6f8f4e', INK),
      clown: () => dot(160, 161, 10, '#d62828', INK) + dot(157, 157, 2.400, '#fff'),
      stud: () => line(BUTTON) + dot(169, 161, 2.600, o.trim, INK),
      ring: () => line(BUTTON) + '<path d="M167 161a5 5 0 11-3 6" fill="none" stroke="#f4d35e" stroke-width="2.200"/>',
      septum: () => line(BUTTON) + '<path d="M155 166a5 5 0 0010 0" fill="none" stroke="#c0c0d8" stroke-width="2.400"/>',
      bandage: () => line(BUTTON) + '<rect x="146" y="146" width="28" height="10" rx="4" fill="#f4d9b0" stroke="' + INK + '" stroke-width="1.400"/>' + strokeLine('M156 149v4M160 149v4M164 149v4', .9, INK),
      stitched: () => line(BUTTON) + line('M160 136V156', 1.600) + line('M155 140h10M155 147h10M155 154h10', 1.600),
      heart: () => '<path d="M160 169c-8-6-10-11-6-13 3-1 5 0 6 3 1-3 3-4 6-3 4 2 2 7-6 13z" fill="#ff1f8f" stroke="' + INK + '" stroke-width="1.600"/>',
    } as Record<string, () => string>)[o.nose]?.() ?? line(BUTTON);
  };
  const eyeSpec = EYES.find(e => e.id === o.eyeStyle) || EYES[0];
  const LASHES = 'M12-19l4-9M20-16l7-8M27-12l9-6M30-7l10-3';
  const eyeInner = (flip: number): string => {
    const shut = eyeSpec.pupil === 'shut' || (eyeSpec.pupil === 'wink' && flip > 0);
    if (shut) return '<path d="M-16-8C-4-26 22-28 40-14L30 0C14-10-2-10-16-8Z" fill="' + o.shadow + '" opacity=".85"/>' + strokeLine('M-26 0Q0 12 26 -4', 5.4, INK) + strokeLine('M-18 6l-5 8M-6 9l-2 9M8 9l2 9M19 4l6 7', 2.6, INK);
    if (eyeSpec.pupil === 'arc') return strokeLine('M-24 2Q0 -24 24 0', 12, o.shadow, 'opacity=".55" transform="translate(0 -6)"') + strokeLine('M-24 5Q0 -18 24 3', 5.4, INK) + strokeLine('M-16 -7l-5-7M-2 -11l-1-9M13 -8l5-8', 2.6, INK);
    const [sc, lid, low, iy, ir, dy] = EYE_SHAPES[eyeSpec.shape || 'almond'];
    const clip = uid + 'e' + (flip > 0 ? 'r' : 'l');
    defs += '<clipPath id="' + clip + '"><path d="' + sc + '"/></clipPath>';
    const colour = eyeSpec.pupil === 'mismatch' && flip > 0 ? o.streak : o.eye, kind = eyeSpec.pupil || 'round';
    const c = 'translate(1 ' + iy + ')';
    const iris = '<circle cx="1" cy="' + iy + '" r="' + ir + '" fill="' + colour + '"/><circle cx="1" cy="' + iy + '" r="' + ir + '" fill="none" stroke="' + shade(colour, -.45) + '" stroke-width="2.4"/>';
    const glints = '<circle cx="6" cy="' + (iy - 5) + '" r="4" fill="#fff"/><circle cx="-4" cy="' + (iy + 5) + '" r="2" fill="#fff"/>';
    const BLACK = '#0d0710';
    const middle = ({
      slit: () => iris + '<ellipse cx="1" cy="' + iy + '" rx="2.800" ry="' + (ir - 1) + '" fill="' + BLACK + '"/><circle cx="6" cy="' + (iy - 5) + '" r="2.400" fill="#fff"/>',
      star: () => iris + '<path transform="' + c + '" d="M0-10l2.800 6.300 6.700.6-5 4.500 1.500 6.600-6-3.500-6 3.500 1.500-6.600-5-4.500 6.700-.6z" fill="' + BLACK + '"/>',
      heart: () => iris + '<path transform="' + c + '" d="M0 9c-10-7-12-13-7-15 3-1 6 0 7 3 1-3 4-4 7-3 5 2 3 8-7 15z" fill="' + BLACK + '"/><circle cx="6" cy="' + (iy - 6) + '" r="2.200" fill="#fff"/>',
      diamond: () => iris + '<path transform="' + c + '" d="M0-10L8 0 0 10-8 0z" fill="' + BLACK + '"/>',
      spiral: () => '<circle cx="1" cy="' + iy + '" r="' + ir + '" fill="#fff"/>' + strokeLine('M1 ' + iy + 'a2 2 0 013 2 5 5 0 01-8-2 8 8 0 0113-4 11 11 0 01-1 14', 2.400, colour),
      glow: () => '<circle cx="1" cy="' + iy + '" r="' + ir + '" fill="' + colour + '"/><circle cx="1" cy="' + iy + '" r="' + (ir * .55) + '" fill="#fff" opacity=".85"/>',
      blackout: () => '<circle cx="1" cy="' + iy + '" r="4" fill="' + colour + '"/>',
      sparkle: () => iris + '<circle cx="1" cy="' + (iy + 1) + '" r="6.800" fill="' + BLACK + '"/><path transform="translate(6 ' + (iy - 5) + ') scale(.75)" d="M0-9Q1-1 9 0Q1 1 0 9Q-1 1-9 0Q-1-1 0-9z" fill="#fff"/><path transform="translate(-5 ' + (iy + 5) + ') scale(.45)" d="M0-9Q1-1 9 0Q1 1 0 9Q-1 1-9 0Q-1-1 0-9z" fill="#fff"/><circle cx="-6" cy="' + (iy - 5) + '" r="1.500" fill="#fff"/>',
      button: () => '<circle cx="1" cy="' + iy + '" r="' + (ir + 3) + '" fill="#14101a"/><circle cx="1" cy="' + iy + '" r="' + (ir - 2) + '" fill="none" stroke="' + colour + '" stroke-width="1.800"/>' + strokeLine('M-4 ' + (iy - 5) + 'l10 10M6 ' + (iy - 5) + 'l-10 10', 2.600, '#fff6fb'),
    } as Record<string, () => string>)[kind]?.() || iris + '<circle cx="1" cy="' + (iy + 1) + '" r="' + (ir * .5).toFixed(1) + '" fill="' + BLACK + '"/>' + glints;
    const lash = eyeSpec.lash || 'classic', up = 'transform="translate(0 ' + dy + ')"';
    const lashes = lash === 'none' ? '' : lash === 'long' ? strokeLine('M8-21l2-15M16-18l7-14M24-14l12-11M29-9l15-6', 2.800, INK, up) : lash === 'thick' ? strokeLine(LASHES, 4, INK, up) : lash === 'bottom' ? strokeLine(LASHES, 2.600, INK, up) + strokeLine('M-14 15l-4 8M-3 18l-1 9M9 16l3 8M18 9l6 6', 2.200, INK) : strokeLine(LASHES, 2.600, INK, up);
    const shadow = '<path transform="translate(0 ' + (dy * .6) + ')" d="M-16-14C-4-38 22-42 44-26L34-8C16-24-2-22-16-14Z" fill="' + o.shadow + '" opacity=".85"/>';
    const wing = lash === 'wing' ? '<path d="M22 -16L50 -28L30 -6Z" fill="' + INK + '"/>' : '';
    return shadow + '<path d="' + sc + '" fill="' + (kind === 'blackout' ? BLACK : '#fff') + '"/><g clip-path="url(#' + clip + ')">' + middle + '</g>' + strokeLine(lid, lash === 'thick' ? 9 : 6.5, '#0d0710') + wing + lashes + strokeLine(low, lash === 'thick' ? 3 : 1.5, INK);
  };
  /* Brows are drawn on the outside-going line, so one drawing suits both sides. */
  const brow = (flip: number): string => {
    const c = browColour, line = (d: string, w = 3.4, extra = '') => strokeLine(d, w, c, extra);
    const ARCH = 'M-26-38Q6-58 42-36';
    return ({
      arch: () => line(ARCH),
      high: () => line('M-26-32Q4-58 36-34'),
      straight: () => line('M-26-34L36-34', 5),
      pencil: () => line('M-26-32Q4-50 36-32', 1.800),
      thick: () => line(ARCH, 9),
      bushy: () => line(ARCH, 8) + line('M-22-30l-3-9M-12-36l-2-9M0-39l0-9M12-39l2-9M24-35l4-8', 3),
      angry: () => line('M-28-20L36-44', 6.500),
      worried: () => line('M-28-46Q0-40 36-22', 5),
      round: () => line('M-22-30C-16-52 22-52 30-30', 5.500),
      scurve: () => line('M-28-30C-14-46 4-34 14-38S30-42 38-30', 4.600),
      tapered: () => '<path d="M-28-28Q-26-38-18-38Q10-48 40-28Q8-40-18-30Z" fill="' + c + '"/>',
      feather: () => [-24, -16, -8, 0, 8, 16, 24, 32].map((x, i) => line('M' + x + ' ' + (-31 - Math.sin(i / 7 * 3.14) * 8) + 'l' + (i < 4 ? -2 : 4) + ' -9', 2.200)).join(''),
      slit: () => line(ARCH, 5) + strokeLine('M16-46l-5 17', 3.600, S),
      doubleslit: () => line(ARCH, 5) + strokeLine('M14-46l-5 16M23-44l-5 16', 2.800, S),
      pierced: () => line(ARCH) + '<circle cx="22" cy="-29" r="4.500" fill="none" stroke="#c0c0d8" stroke-width="2.200"/><circle cx="10" cy="-30" r="4.500" fill="none" stroke="#c0c0d8" stroke-width="2.200"/>',
      dotted: () => line(ARCH, 5, 'stroke-dasharray="0 9"'),
      dashed: () => '<path d="' + ARCH + '" fill="none" stroke="' + c + '" stroke-width="4.600" stroke-dasharray="9 5"/>',
      stitched: () => line('M-26-34Q2-46 36-34', 2) + line('M-18-44l3 13M-6-48l2 13M6-50l1 13M18-48l-1 13M28-44l-2 12', 2),
      unibrow: () => line('M-52-36Q-34-36-26-36Q2-48 36-32', 6),
      none: () => '',
      ombre: () => line('M-26-30Q-14-38 -6-39', 5, 'opacity=".28"') + line('M-6-39Q6-41 16-38', 5, 'opacity=".62"') + line('M16-38Q28-35 36-30', 5),
      zigzag: () => line('M-26-30L-14-42L-4-32L8-46L18-34L36-40', 3.600),
      wavy: () => line('M-26-32q10-14 20-2t20-2 22 2', 4),
      starend: () => line('M-26-32Q-2-44 20-38') + '<path transform="translate(30 -36)" d="M0-9l2.500 6 6.500.5-5 4 1.500 6.500-5.500-3.500-5.500 3.500 1.500-6.500-5-4 6.500-.5z" fill="' + c + '"/>',
      heartend: () => line('M-26-32Q-2-44 18-38') + '<path transform="translate(28 -38)" d="M0 8c-9-6-11-12-6-14 3-1 5 0 6 3 1-3 3-4 6-3 5 2 3 8-6 14z" fill="' + c + '"/>',
      spiked: () => '<path d="M-28-28L-24-40L-16-34L-10-46L-2-38L6-50L12-40L22-48L24-38L38-38L36-30Q6-40-28-28Z" fill="' + c + '"/>',
      gems: () => line(ARCH, 3) + [-16, -4, 8, 20, 30].map((x, i) => '<path transform="translate(' + x + ' ' + [-42, -46, -46, -42, -37][i] + ')" d="M0-4l3.500 4-3.500 4-3.500-4z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width=".8"/>').join(''),
      square: () => '<path d="M-26-30V-42L24-46L38-30L18-36Z" fill="' + c + '" stroke="' + c + '" stroke-width="1"/>',
      flick: () => line('M-26-30Q6-40 24-34L44-50', 4.600),
      short: () => line('M-10-38Q6-46 22-38', 6),
    } as Record<string, () => string>)[o.brow]?.() || line(ARCH);
  };
  const eye = (cx: number, flip: number) => '<g transform="translate(' + cx + ' 128) scale(' + (flip * .78) + ' .9)">' + eyeInner(flip) + '<g transform="translate(0 -6)">' + brow(flip) + '</g></g>';
  parts.face = eye(124, -1) + eye(196, 1)
    + noseArt()
    + atMouth(`<path d="M134 178q12-11 20-8 6 3 12 0 8-3 20 8-13 5-26 5t-26-5z" fill="${shade(o.lip, -.12)}" stroke="${INK}" stroke-width="2.200" stroke-linejoin="round"/><path d="M134 178q26 8 52 0-5 20-26 20t-26-20z" fill="${o.lip}" stroke="${INK}" stroke-width="2.200" stroke-linejoin="round"/><path d="M146 186q14 5 28 0-4 7-14 7t-14-7z" fill="#fff" opacity=".6"/><path d="M134 178q26 8 52 0" fill="none" stroke="#0d0710" stroke-width="2.400"/>`);

  /* ---------- monster side ---------- */
  const fang = atMouth(`<path d="M146 181l3 11 5-9zM174 181l-3 11-5-9z" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`);
  parts.monster = ({
    fangs: fang,
    bat: fang,
    wolf: `<path d="M112 72L92 8l48 34zM208 72l20-64-48 34z" fill="${hair}" stroke="${INK}" stroke-width="2.6"/><path d="M112 54L102 26l22 16zM208 54l10-28-22 16z" fill="${o.streak}"/>`,
    fins: `<path d="M102 118L58 88l8 32-14 22 24-2-8 26 40-16z" fill="${S}" stroke="${INK}" stroke-width="2.6"/><path d="M218 118l44-30-8 32 14 22-24-2 8 26-40-16z" fill="${S}" stroke="${INK}" stroke-width="2.6"/>` + strokeLine('M66 110l32 16M64 142l34-6M254 110l-32 16M256 142l-34-6', 1.6, INK),
    bolts: `<path d="M126 208h22v14h-22zM172 208h22v14h-22z" fill="#c0c0d8" stroke="${INK}" stroke-width="2.4"/><path d="M116 204h10v22h-10zM194 204h10v22h-10z" fill="#8f8fa8" stroke="${INK}" stroke-width="2.4"/>` + strokeLine('M196 92l10 12M206 84l-20 28M116 158h24M122 152v12M134 152v12', 2.2, INK),
    wraps: strokeLine('M104 96L150 112M170 186L214 152M108 146l30 22', 10, '#fff6e0', 'opacity=".95"') + strokeLine('M104 91L150 107M170 180L212 147', 1.4, '#a8946a'),
    horns: `<path d="M124 62C112 44 112 22 124 8c2 18 12 34 24 42zM196 62c12-18 12-40 0-54-2 18-12 34-24 42z" fill="${o.streak}" stroke="${INK}" stroke-width="2.6"/>`,
    stitches: strokeLine('M196 90l14 12M204 84l-14 26M110 158h26M116 152v12M126 152v12', 2.2, INK) + strokeLine('M86 300l20 6M90 294v12M100 296v12', 2, INK),
      cat: `<path d="M110 72L102 18L146 48ZM210 72L218 18L174 48Z" fill="${hair}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/><path d="M114 56L110 32L132 48ZM206 56L210 32L188 48Z" fill="#f7b8cf"/>` + strokeLine('M104 152l26 4M104 164l26-2M216 152l-26 4M216 164l-26-2', 1.800, INK) + `<path d="M156 158h8l-4 4z" fill="#ff1f8f"/>`,
    fox: `<path d="M112 72L86 2L146 44ZM208 72L234 2L174 44Z" fill="#ff8c1a" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/><path d="M86 2L112 56L120 46ZM234 2L208 56L200 46Z" fill="#14101a"/>` + strokeLine('M100 170l16-4M104 182l14-8M220 170l-16-4M216 182l-14-8', 3, '#ff8c1a'),
    bunny: `<path d="M126 56C108 26 108 -30 124 -44C142 -30 146 26 142 50ZM194 56C212 26 212 -30 196 -44C178 -30 174 26 178 50Z" fill="${S}" stroke="${INK}" stroke-width="2.600"/><path d="M128 38C118 18 118 -14 124 -26C132 -14 136 18 134 38ZM192 38C202 18 202 -14 196 -26C188 -14 184 18 186 38Z" fill="#f7b8cf"/><path d="M155 188h10v8h-10z" fill="#fff" stroke="${INK}" stroke-width="1.200"/>`,
    dragon: `<path d="M124 62C100 50 82 26 84 -2C100 16 124 30 146 44ZM196 62C220 50 238 26 236 -2C220 16 196 30 174 44Z" fill="#c9a227" stroke="${INK}" stroke-width="2.600"/>` + [[108, 110], [118, 96], [212, 110], [202, 96], [106, 126], [214, 126]].map(([x, y]) => `<path d="M${x - 6} ${y}q6-8 12 0q-6 6-12 0z" fill="#2f8f4e" stroke="${INK}" stroke-width="1"/>`).join(''),
    ghost: `<path d="M84 110C80 36 240 36 236 110C244 190 228 240 228 280L208 258L188 282L160 256L132 282L112 258L92 280C92 240 76 190 84 110Z" fill="#fff6fb" fill-opacity=".36" stroke="#fff6fb" stroke-width="2"/>`,
    zombie: `<path d="M186 86h26v28h-26z" fill="#9bd16b" stroke="${INK}" stroke-width="1.800"/><path d="M110 154h26v22h-26z" fill="#b8a07a" stroke="${INK}" stroke-width="1.800"/>` + strokeLine('M186 86h26M186 114h26M110 154v22M136 154v22', 2, INK, 'stroke-dasharray="3 3"') + strokeLine('M198 150q6 16 2 30', 3, '#6a0f0f'),
    scales: [[110, 110], [122, 120], [110, 130], [122, 140], [110, 150], [210, 110], [198, 120], [210, 130], [198, 140], [210, 150]].map(([x, y]) => `<path d="M${x - 6} ${y}a6 6 0 0012 0z" fill="#35dcc8" stroke="${INK}" stroke-width="1"/>`).join(''),
    elf: `<path d="M104 128L44 84L100 158ZM216 128L276 84L220 158Z" fill="${S}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M92 126L60 100M228 126L260 100', 1.600, SD),
    alien: strokeLine('M138 52Q124 18 104 8M182 52Q196 18 216 8', 3.400, INK) + `<circle cx="102" cy="6" r="9" fill="#8df04a" stroke="${INK}" stroke-width="2.400"/><circle cx="218" cy="6" r="9" fill="#8df04a" stroke="${INK}" stroke-width="2.400"/>`,
    cyclops: `<ellipse cx="160" cy="84" rx="20" ry="13" fill="#fff" stroke="${INK}" stroke-width="2.400"/><circle cx="160" cy="84" r="9" fill="${o.eye}" stroke="${INK}" stroke-width="1.600"/><circle cx="160" cy="84" r="4" fill="#0d0710"/><circle cx="163" cy="81" r="1.800" fill="#fff"/>`,
    snakes: [[100, 40, -28], [124, 18, -12], [160, 8, 0], [196, 18, 12], [220, 40, 28]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})">` + strokeLine('M0 40Q-14 20 0 8T0 -18', 14, INK) + strokeLine('M0 40Q-14 20 0 8T0 -18', 9, '#2f8f4e') + `<ellipse cx="0" cy="-22" rx="9" ry="8" fill="#2f8f4e" stroke="${INK}" stroke-width="2"/><circle cx="-3" cy="-24" r="1.600" fill="#fff"/><circle cx="3" cy="-24" r="1.600" fill="#fff"/>` + strokeLine('M0 -30v-7', 1.400, '#c0392b') + `</g>`).join(''),
    pumpkin: `<path d="M152 44l2-22 18 4-6 20z" fill="#2f8f4e" stroke="${INK}" stroke-width="2.200"/>` + strokeLine('M128 56Q118 110 128 150M192 56Q202 110 192 150', 1.800, '#c76b1a', 'opacity=".75"') + `<path d="M172 40q18-8 22 4" fill="none" stroke="#2f8f4e" stroke-width="3"/>`,
    skeleton: `<path d="M122 164q-4 8 6 12M198 164q4 8-6 12" fill="none" stroke="${INK}" stroke-width="1.800"/><path d="M150 148h20l-10 14z" fill="#14101a"/>` + strokeLine('M142 190v8M151 194v8M160 196v8M169 194v8M178 190v8', 1.800, INK),
    antlers: strokeLine('M128 56C116 30 96 12 78 4M108 26L92 36M98 16L104 -4', 7, INK) + strokeLine('M128 56C116 30 96 12 78 4M108 26L92 36M98 16L104 -4', 3.800, '#8b5a2b') + strokeLine('M192 56C204 30 224 12 242 4M212 26L228 36M222 16L216 -4', 7, INK) + strokeLine('M192 56C204 30 224 12 242 4M212 26L228 36M222 16L216 -4', 3.800, '#8b5a2b'),
    unicorn: `<path d="M148 50L160 -34L172 50Z" fill="#f4d35e" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + strokeLine('M152 34l16-6M155 14l11-5M157 -4l6-3', 2, '#ff1f8f'),
    spidereyes: [[140, 84, 6], [180, 84, 6], [124, 92, 4], [196, 92, 4], [150, 70, 4], [170, 70, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#14101a" stroke="${INK}" stroke-width="1"/><circle cx="${x + 1}" cy="${y - 1}" r="1.200" fill="#fff"/>`).join(''),
    gills: strokeLine('M138 196q6 8 2 18M146 200q6 8 2 18M182 196q-6 8-2 18M174 200q-6 8-2 18', 2.600, '#0f766e') + `<path d="M100 150l-18-8 6 14-8 12 20-4zM220 150l18-8-6 14 8 12-20-4z" fill="#35dcc8" stroke="${INK}" stroke-width="2"/>`,
    tentacles: [[-1, 0], [1, 0], [-1, 30], [1, 30]].map(([s, d]) => strokeLine(`M${160 + s * 56} ${180 + d}C${160 + s * 90} ${210 + d} ${160 + s * 70} ${250 + d} ${160 + s * 104} ${270 + d}`, 15, INK) + strokeLine(`M${160 + s * 56} ${180 + d}C${160 + s * 90} ${210 + d} ${160 + s * 70} ${250 + d} ${160 + s * 104} ${270 + d}`, 10, '#8a2be2')).join(''),
    tusks: `<path d="M138 184l-4-20 12 12zM182 184l4-20-12 12z" fill="#fff6e0" stroke="${INK}" stroke-width="1.800"/>`,
    ram: `<path d="M116 66C80 26 40 54 56 94C66 116 92 110 94 92C94 80 80 78 76 88" fill="none" stroke="${INK}" stroke-width="17"/><path d="M116 66C80 26 40 54 56 94C66 116 92 110 94 92C94 80 80 78 76 88" fill="none" stroke="#c9a227" stroke-width="12"/><path d="M204 66C240 26 280 54 264 94C254 116 228 110 226 92C226 80 240 78 244 88" fill="none" stroke="${INK}" stroke-width="17"/><path d="M204 66C240 26 280 54 264 94C254 116 228 110 226 92C226 80 240 78 244 88" fill="none" stroke="#c9a227" stroke-width="12"/>`,
    shark: atMouth(`<path d="M142 176l4 8 4-7 5 8 5-8 5 8 5-8 4 7 4-8q0 12-18 12t-18-12z" fill="#fff" stroke="${INK}" stroke-width="1.200"/>`) + strokeLine('M100 140l14 2M100 150l14 0M220 140l-14 2M220 150l-14 0', 2, '#0f766e'),
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
  const STRAND_DARK: Array<[number, number]> = [[-20, 22], [42, 26], [100, 18], [150, 10], [176, 12], [226, 18], [282, 26], [342, 22]];
  const STRAND_LIGHT: Array<[number, number]> = [[12, 7], [72, 9], [128, 5], [202, 5], [252, 9], [312, 7]];
  const strand = ([x, w]: [number, number], c: string) => '<path d="M' + (160 + (x - 160) * .16) + ' 22C' + (x - w) + ' 160 ' + (x - w) + ' 320 ' + x + ' 540C' + (x + w) + ' 320 ' + (x + w) + ' 160 ' + (160 + (x - 160) * .16) + ' 22Z" fill="' + c + '"/>';
  const hairDark = shade(hair, -.68);
  let lockCount = 0;
  const locks = (d: string): string => {
    if (opt.plain) return shape(d, hair);
    const id = uid + 'h' + (++lockCount);
    defs += '<clipPath id="' + id + '"><path d="' + d + '"/></clipPath>';
    return '<path d="' + d + '" fill="' + hair + '"/><g clip-path="url(#' + id + ')">' + STRAND_DARK.map(t => strand(t, hairDark)).join('') + STRAND_LIGHT.map(t => strand(t, hairL)).join('') + '</g><path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="3.200" stroke-linejoin="round"/>';
  };
  const mirror = (inner: string) => `${inner}<g transform="translate(320 0) scale(-1 1)">${inner}</g>`;
  ({
    long() {
      parts.hairBack = locks('M160 20C70 20 62 96 68 160C72 260 36 360 22 470C52 452 72 462 84 492C98 462 112 446 128 410L192 410C208 446 222 462 236 492C248 462 268 452 298 470C284 360 248 260 252 160C258 96 250 20 160 20Z') + streak('M92 170C94 260 72 340 84 424') + shine('M228 170C226 260 246 340 236 420');
      parts.hairFront = locks(SWEPT) + streak('M176 68C190 80 208 96 216 116', 7) + shine('M122 62C136 48 150 44 164 44');
    },
    pony() {
      parts.hairBack = locks('M176 44C236 -6 290 70 276 170C268 230 286 300 256 360C236 300 228 220 224 150C222 100 204 66 176 44Z') + streak('M236 44C262 90 258 170 258 240C258 280 262 310 258 340') + locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      parts.hairFront = locks(SWEPT) + shape('M168 28l22-8 8 14-22 8z', o.streak) + shine('M122 60C136 46 150 42 164 42');
    },
    twins() {
      parts.hairBack = mirror(locks('M108 52C44 44 -14 120 -6 230C-2 300 -8 356 -44 408C24 412 76 372 92 296C102 240 100 190 112 140Z') + streak('M52 96C18 150 16 230 24 300C26 330 10 366 -14 392', 6)) + locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      parts.hairFront = locks(BANGS) + mirror(shape('M96 58l14-10 8 14-14 10z', o.streak)) + shine('M126 56C142 44 170 42 190 54');
    },
    bob() {
      parts.hairBack = locks('M160 24C84 24 72 92 80 152C84 194 72 214 80 238Q110 250 122 216L198 216Q210 250 240 238C248 214 236 194 240 152C248 92 236 24 160 24Z') + streak('M90 150C92 186 84 212 88 230') + shine('M232 150C230 186 238 210 234 228');
      parts.hairFront = locks(BANGS) + streak('M198 60C206 74 210 86 212 96', 7) + shine('M126 56C142 44 170 42 190 54');
    },
    curls() {
      const blobs: Array<[number, number, number]> = [[160, 40, 44], [106, 58, 36], [214, 58, 36], [76, 112, 34], [244, 112, 34], [66, 174, 34], [254, 174, 34], [78, 238, 34], [242, 238, 34], [92, 296, 30], [228, 296, 30], [112, 346, 24], [208, 346, 24]];
      parts.hairBack = blobs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hair}" stroke="${INK}" stroke-width="2.6"/>`).join('') + blobs.filter((_, i) => i % 2).map(([x, y, r]) => strokeLine(`M${x - r * .5} ${y - r * .2}q${r * .5}-${r * .6} ${r}-${r * .1}`, 5, o.streak)).join('');
      parts.hairFront = locks('M102 118C98 76 120 50 138 46C146 34 174 34 182 46C200 50 222 76 218 118C208 100 196 88 184 78C176 88 160 92 150 80C136 92 116 100 102 118Z') + shine('M128 60q18-12 36-6');
    },
    side() {
      parts.hairBack = locks('M160 24C84 24 70 92 74 160C76 260 40 360 58 470Q96 470 114 410L170 200L226 240C242 200 244 180 240 150C248 92 236 24 160 24Z') + streak('M84 180C84 270 58 360 70 452') + shine('M104 210C100 280 92 340 88 400');
      parts.hairFront = locks('M222 118C226 62 192 32 156 36C112 38 92 72 98 136C106 110 118 92 136 82C166 92 202 92 222 118Z') + streak('M132 62C150 72 182 78 210 98', 7) + shine('M110 86C120 64 140 48 160 46');
    },
    buns() {
      parts.hairBack = mirror(`<circle cx="92" cy="40" r="34" fill="${hair}" stroke="${INK}" stroke-width="2.6"/>` + strokeLine('M72 34q20-22 40-2', 6, o.streak)) + locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      parts.hairFront = locks(SWEPT) + shine('M122 60C136 46 150 42 164 42');
    },
    afro() {
      parts.hairBack = '<circle cx="160" cy="92" r="96" fill="' + hair + '" stroke="' + INK + '" stroke-width="2.6"/>' + strokeLine('M86 92q8-52 54-68M234 92q-8-52-54-68', 5, o.streak, 'opacity=".8"');
      parts.hairFront = locks('M100 112C104 66 130 46 160 46C190 46 216 66 220 112C206 84 186 72 160 72C134 72 114 84 100 112Z');
    },
    braids() {
      const braid = '<g>' + [130, 170, 210, 250, 290, 330, 370, 410].map((y, i) => '<ellipse cx="' + (72 + (i % 2) * 8) + '" cy="' + y + '" rx="17" ry="24" fill="' + (i % 2 ? hair : hairD) + '" stroke="' + INK + '" stroke-width="2.4"/>').join('') + '</g>' + shape('M64 430h24l-4 30h-16z', o.streak);
      parts.hairBack = mirror(braid) + locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      parts.hairFront = locks(SWEPT) + shine('M122 60C136 46 150 42 164 42');
    },
    waves() {
      parts.hairBack = locks('M160 20C72 20 60 92 66 150C36 196 84 226 54 270C22 316 72 342 34 392C14 428 44 466 84 470C70 440 96 410 130 380L190 380C224 410 250 440 236 470C276 466 306 428 286 392C248 342 298 316 266 270C236 226 284 196 254 150C260 92 248 20 160 20Z') + streak('M90 170C74 200 106 226 86 262C70 300 102 330 84 372') + shine('M230 170C246 200 214 226 234 262C250 300 218 330 236 372');
      parts.hairFront = locks(SWEPT) + streak('M176 68C190 80 208 96 216 116', 7);
    },
    pixie() {
      parts.hairBack = locks('M160 26C96 26 86 84 92 142L104 170L216 170L228 142C234 84 224 26 160 26Z');
      parts.hairFront = locks('M98 126C94 62 130 34 164 36C204 36 228 66 222 118L206 100L188 96L176 74L150 92L124 96L112 112Z') + streak('M178 62L204 94', 6);
    },
    mohawk() {
      parts.hairBack = '<path d="M122 62L104 18L136 38L146 2L164 32L184 2L188 38L218 18L198 62Z" fill="' + o.streak + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
      parts.hairFront = locks('M124 62C136 46 184 46 196 62L186 74C174 66 146 66 134 74Z');
    },
    halfup() {
      parts.hairBack = locks('M160 24C80 24 74 92 82 150C88 240 74 300 84 370Q110 384 124 350L196 350Q210 384 236 370C246 300 232 240 238 150C246 92 240 24 160 24Z') + streak('M94 170C94 240 84 300 92 356');
      parts.hairFront = '<circle cx="160" cy="26" r="24" fill="' + hair + '" stroke="' + INK + '" stroke-width="2.6"/>' + locks(BANGS) + strokeLine('M138 42q22 12 44 0', 5, o.streak);
    },
    lob() {
      parts.hairBack = locks('M160 24C84 24 72 92 78 152C80 210 70 260 76 300Q110 316 124 270L196 270Q210 316 244 300C250 260 240 210 242 152C248 92 236 24 160 24Z') + streak('M88 170C90 220 80 260 86 292') + shine('M232 170C230 220 240 260 234 292');
      parts.hairFront = locks(SWEPT) + shine('M122 62C136 48 150 44 164 44');
    },
    shag() {
      parts.hairBack = locks('M160 24C84 24 70 92 74 150L58 212L80 206L60 276L88 264L72 336L106 300L124 250L196 250L214 300L248 336L232 264L260 276L240 206L262 212L246 150C250 92 236 24 160 24Z') + streak('M86 170L76 240') + shine('M234 170L244 240');
      parts.hairFront = locks('M98 122C94 60 126 34 160 34C194 34 226 60 222 122L212 90L200 112L186 84L172 110L158 84L144 110L130 86L116 112L106 92Z') + streak('M186 60L198 92', 6);
    },
    fishtail() {
      parts.hairBack = locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      const links = [170, 196, 222, 248, 274, 300, 326, 352, 378].map((y, i) => '<ellipse cx="' + (212 + (i % 2 ? 10 : -10)) + '" cy="' + y + '" rx="17" ry="11" transform="rotate(' + (i % 2 ? -32 : 32) + ' 212 ' + y + ')" fill="' + (i % 2 ? hair : hairD) + '" stroke="' + INK + '" stroke-width="2.200"/>').join('');
      parts.hairFront = links + locks('M204 392h18l-2 12 8 14-16-6-14 6 8-14z') + strokeLine('M202 390h22', 5, o.streak) + locks(SWEPT) + shine('M122 60C136 46 150 42 164 42');
    },
    lowpony() {
      parts.hairBack = locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      parts.hairFront = locks('M204 176C246 210 256 300 226 400C210 360 200 290 184 220Z') + streak('M216 220C232 270 234 320 226 372', 6) + `<circle cx="196" cy="208" r="10" fill="${o.streak}" stroke="${INK}" stroke-width="2.200"/>` + locks(SWEPT);
    },
    topknot() {
      parts.hairBack = '<circle cx="160" cy="4" r="30" fill="' + hair + '" stroke="' + INK + '" stroke-width="2.600"/>' + strokeLine('M140 -8q20-16 40 0', 5, hairL) + locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      parts.hairFront = shape('M142 22q18 8 36 0v12q-18 8-36 0z', o.streak) + locks(SWEPT) + shine('M122 62C136 48 150 44 164 44');
    },
    lowbuns() {
      parts.hairBack = mirror(`<circle cx="88" cy="186" r="33" fill="${hair}" stroke="${INK}" stroke-width="2.600"/>` + strokeLine('M68 180q20-22 40-2', 6, o.streak)) + locks('M160 26C102 26 90 80 96 134L224 134C230 80 218 26 160 26Z');
      parts.hairFront = locks(BANGS) + shine('M126 56C142 44 170 42 190 54');
    },
    boxbraids() {
      const xs = [66, 80, 94, 108, 122, 198, 212, 226, 240, 254];
      parts.hairBack = xs.map((x, i) => { const d = 'M' + x + ' 90C' + (x - 4) + ' 200 ' + (x + 4) + ' 300 ' + x + ' ' + (396 + (i % 3) * 18); return strokeLine(d, 12, INK) + strokeLine(d, 8, i % 2 ? hair : hairD) + strokeLine(d, 8, hairL, 'stroke-dasharray="1 7" opacity=".55"') + '<circle cx="' + x + '" cy="' + (398 + (i % 3) * 18) + '" r="4.400" fill="' + o.streak + '" stroke="' + INK + '" stroke-width="1.400"/>'; }).join('') + locks('M160 26C96 26 82 84 88 140L232 140C238 84 224 26 160 26Z');
      parts.hairFront = locks(SWEPT) + strokeLine('M124 56C118 70 112 86 108 104M146 42C140 56 134 72 130 86M186 56C198 70 208 84 214 100', 1.800, hairD);
    },
    locs() {
      const xs = [62, 82, 102, 122, 198, 218, 238, 258];
      parts.hairBack = xs.map((x, i) => { const d = 'M' + x + ' 96Q' + (x + (i % 2 ? 12 : -12)) + ' 210 ' + x + ' 300T' + x + ' ' + (372 + (i % 3) * 22); return strokeLine(d, 19, INK) + strokeLine(d, 14, i % 2 ? hairD : hair) + strokeLine(d, 3, hairL, 'stroke-dasharray="6 9" opacity=".6"'); }).join('') + locks('M160 26C96 26 82 84 88 140L232 140C238 84 224 26 160 26Z');
      parts.hairFront = locks(SWEPT) + streak('M176 68C190 80 208 96 216 116', 5);
    },
    bantu() {
      const knots: Array<[number, number]> = [[160, 22], [114, 34], [206, 34], [86, 72], [234, 72], [136, 2], [184, 2]];
      parts.hairBack = knots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${hair}" stroke="${INK}" stroke-width="2.400"/><path d="M${x - 9} ${y}a9 9 0 1118 0 6 6 0 11-12 0" fill="none" stroke="${hairL}" stroke-width="2.600"/>`).join('');
      parts.hairFront = locks('M102 110C96 64 124 42 160 42C196 42 224 64 218 110C206 76 186 64 160 64C134 64 114 76 102 110Z') + strokeLine('M160 42V64M126 52L136 68M194 52L184 68', 1.800, S);
    },
    puffs() {
      parts.hairBack = mirror(`<circle cx="82" cy="34" r="50" fill="${hair}" stroke="${INK}" stroke-width="2.600"/>` + strokeLine('M50 30q10-30 38-34', 5, hairL, 'opacity=".75"')) + locks('M160 30C102 30 92 80 96 130L224 130C228 80 218 30 160 30Z');
      parts.hairFront = locks('M100 112C104 66 130 46 160 46C190 46 216 66 220 112C206 84 186 72 160 72C134 72 114 84 100 112Z') + mirror(strokeLine('M112 60l14-12', 7, o.streak));
    },
    hime() {
      parts.hairBack = locks('M160 24C80 24 74 92 76 150L68 470Q160 490 252 470L244 150C246 92 240 24 160 24Z') + streak('M90 170L84 460') + shine('M230 170L236 460');
      parts.hairFront = locks('M100 106C94 56 126 32 160 32C194 32 226 56 220 106Q160 92 100 106Z') + mirror(locks('M96 96L120 104L118 232L92 228Z')) + shine('M124 54C142 44 178 44 196 54');
    },
    beehive() {
      parts.hairBack = '<ellipse cx="160" cy="4" rx="72" ry="70" fill="' + hair + '" stroke="' + INK + '" stroke-width="2.600"/>' + strokeLine('M100 20Q160 -50 220 20M106 44Q160 -14 214 44', 3, hairD) + locks('M160 30C102 30 88 90 94 150L226 150C232 90 218 30 160 30Z');
      parts.hairFront = locks(SWEPT) + strokeLine('M98 60Q160 16 222 60', 8, o.streak) + shine('M122 62C136 48 150 44 164 44');
    },
    rolls() {
      parts.hairBack = locks('M160 30C96 30 82 90 80 150C76 196 66 226 84 256Q120 258 124 220L196 220Q200 258 236 256C254 226 244 196 240 150C238 90 224 30 160 30Z');
      parts.hairFront = mirror(`<circle cx="116" cy="46" r="33" fill="${hair}" stroke="${INK}" stroke-width="2.600"/><path d="M102 46a14 14 0 1128 0 9 9 0 11-18 0" fill="none" stroke="${hairD}" stroke-width="3"/>`) + locks('M116 80C126 58 194 58 204 80C196 96 172 90 160 96C148 90 124 96 116 80Z') + strokeLine('M138 66q22 10 44 0', 5, o.streak);
    },
    crimped() {
      const edge = (x0: number, dir: number) => { let d = ''; for (let i = 0; i < 14; i++) d += 'L' + (x0 + dir * (i * .8 + (i % 2 ? 14 : 0))) + ' ' + (120 + i * 22); return d; };
      parts.hairBack = shape('M160 24C84 24 78 70 80 120' + edge(80, -1) + 'L120 430L200 430' + edge(240, 1).split('L').filter(Boolean).reverse().map(p => 'L' + p).join('') + 'L240 120C242 70 236 24 160 24Z', hair) + [100, 120, 200, 220].map(x => strokeLine('M' + x + ' 150l-8 14 8 14-8 14 8 14-8 14 8 14-8 14 8 14-8 14 8 14-8 14 8 14', 2, x % 40 ? hairD : o.streak)).join('');
      parts.hairFront = locks(SWEPT) + shine('M122 62C136 48 150 44 164 44');
    },
    ringlets() {
      const curl = (x: number, n: number) => Array.from({ length: n }, (_, i) => '<circle cx="' + (x + (i % 2 ? 7 : -7)) + '" cy="' + (150 + i * 30) + '" r="' + (19 - i * .9) + '" fill="' + (i % 2 ? hair : hairD) + '" stroke="' + INK + '" stroke-width="2.200"/>').join('');
      parts.hairBack = mirror(curl(66, 9) + curl(100, 7)) + locks('M160 26C96 26 82 84 86 150L234 150C238 84 224 26 160 26Z');
      parts.hairFront = locks(BANGS) + mirror(`<path d="M96 56q18-16 26 6-14 16-26-6z" fill="${o.streak}" stroke="${INK}" stroke-width="2"/>`);
    },
    undercut() {
      parts.hairBack = locks('M168 24C110 24 100 70 104 120L224 330Q256 300 244 220C240 190 242 170 240 150C248 92 236 24 168 24Z') + streak('M232 170C230 220 244 260 234 306');
      parts.hairFront = locks('M108 96C110 48 146 30 176 32C212 34 230 66 222 122C212 92 192 72 164 64C146 78 124 88 108 96Z') + strokeLine('M102 88v44M108 80v40', 3, hairD, 'stroke-dasharray="2 4"') + streak('M170 44C188 52 208 76 216 100', 6);
    },
    spiky() {
      parts.hairBack = locks('M96 136L62 112L88 92L52 54L96 62L84 14L126 44L136 -6L160 34L184 -6L194 44L236 14L224 62L268 54L232 92L258 112L224 136Z') + strokeLine('M126 44L136 8M194 44L184 8', 4, o.streak);
      parts.hairFront = locks('M100 118L108 86L124 100L134 70L150 92L164 62L178 92L194 72L202 100L216 86L220 118C224 60 196 36 160 36C124 36 96 60 100 118Z');
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
  /* every other scarf is built from its parts */
  const scarf = HIJABS.find(h => h.id === o.hairStyle);
  if (scarf && scarf.id !== 'hijab' && scarf.id !== 'turban') {
    const d = scarf.drape || 'bib', crown = scarf.crown, sf = scarf.print ? texture(scarf.print, hair, o.streak, 'h') : hair, line = shade(hair, -.2), second = o.streak;
    const FACE = 'M160 56C122 56 106 88 106 122C108 158 130 190 160 204C190 190 212 158 214 122C214 88 198 56 160 56Z';
    const BIB = 'M108 206C84 240 96 282 132 298C166 312 208 304 226 272C238 248 228 222 212 206C190 234 130 234 108 206Z', BIB_HEM = 'M98 254C120 302 200 308 232 258';
    const SHORT = 'M112 208C104 232 116 254 160 262C204 254 216 232 208 208C190 226 130 226 112 208Z', SHORT_HEM = 'M110 234C130 262 190 262 210 234';
    const drapes: Record<string, [string, string]> = {
      bib: [shape(BIB, sf) + strokeLine('M112 226C136 252 186 254 216 226M104 250C134 284 192 286 224 252', 2, line), BIB_HEM],
      short: [shape(SHORT, sf) + strokeLine('M118 224C140 240 180 240 202 224', 2, line), SHORT_HEM],
      long: [shape('M108 206C80 260 86 340 96 372Q160 396 224 372C234 340 240 260 212 206C190 234 130 234 108 206Z', sf) + strokeLine('M116 240C112 290 116 340 124 376M204 240C208 290 204 340 196 376M112 226C136 252 186 254 208 226', 2, line), 'M98 368Q160 392 222 368'],
      cape: [shape('M108 206C60 280 60 380 66 430Q160 458 254 430C260 380 260 280 212 206C190 234 130 234 108 206Z', sf) + strokeLine('M100 260C88 320 84 380 88 436M220 260C232 320 236 380 232 436M112 226C136 252 186 254 208 226', 2, line), 'M68 426Q160 454 252 426'],
      side: [shape(BIB, sf) + shape('M196 214C238 228 256 300 240 408L204 416C216 336 206 276 182 240Z', sf) + strokeLine('M210 250C226 300 228 360 220 412', 2, line), 'M240 404L204 412'],
      cross: [shape('M108 206C104 268 186 300 232 268L212 206C190 234 130 234 108 206Z', sf) + shape('M212 206C216 268 134 300 88 268L108 206C130 234 190 234 212 206Z', shade(hair, -.1)), 'M92 266C124 296 196 296 228 266'],
      tails: [shape(SHORT, sf) + shape('M122 240L104 376L140 380L150 252Z', sf) + shape('M198 240L216 376L180 380L170 252Z', sf), 'M104 372L140 376M216 372L180 376'],
      knot: [shape(SHORT, sf) + shape('M148 270L128 372L154 380L160 290Z', sf) + shape('M172 270L192 372L166 380L160 290Z', sf) + `<circle cx="160" cy="266" r="16" fill="${hair}" stroke="${INK}" stroke-width="2.600"/>`, 'M128 368L154 376M192 368L166 376'],
      neck: [shape('M112 200Q160 232 208 200L214 244Q160 272 106 244Z', sf) + strokeLine('M110 216Q160 248 210 216M108 232Q160 262 212 232', 2, line), 'M108 242Q160 270 212 242'],
      layers: [shape('M108 206C70 270 76 340 90 380Q160 404 230 380C244 340 250 270 212 206Z', shade(hair, -.12)) + shape('M108 206C84 250 90 300 104 330Q160 352 216 330C230 300 236 250 212 206Z', sf) + shape(SHORT, shade(hair, .12)), 'M92 376Q160 400 228 376'],
    };
    const [drape, hemD] = drapes[d] || drapes.bib;
    const covered = d === 'short' || d === 'neck' ? 'M160 22C86 22 76 92 84 150C88 190 92 216 100 240Q160 268 220 240C228 216 232 190 236 150C244 92 234 22 160 22Z' : d === 'cape' ? 'M160 22C86 22 76 92 84 150C80 230 50 340 56 440Q160 470 264 440C270 340 240 230 236 150C244 92 234 22 160 22Z' : 'M160 22C86 22 76 92 84 150C88 200 82 244 68 290Q160 326 252 290C238 244 232 200 236 150C244 92 234 22 160 22Z';
    parts.hairBack = (crown === 'volume' ? `<ellipse cx="160" cy="34" rx="70" ry="38" fill="${hair}" stroke="${INK}" stroke-width="2.600"/>` : '') + (scarf.crown === 'bun' ? `<circle cx="160" cy="4" r="30" fill="${hair}" stroke="${INK}" stroke-width="2.600"/>` + strokeLine('M140 -6q20-14 40 0', 2, line) : '') + shape(covered, sf);
    const edges: Record<string, () => string> = {
      lace: () => strokeLine(hemD, 8, '#fff6fb', 'stroke-dasharray="0 10"') + strokeLine(FACE, 3, '#fff6fb', 'stroke-dasharray="1 5"'),
      pearl: () => strokeLine(hemD, 8.400, INK, 'stroke-dasharray="0 12"') + strokeLine(hemD, 6.200, '#fff6fb', 'stroke-dasharray="0 12"') + strokeLine(FACE, 3.400, '#fff6fb', 'stroke-dasharray="0 8"'),
      fringe: () => `<path d="${hemD}" transform="translate(0 8)" fill="none" stroke="${second}" stroke-width="15" stroke-dasharray="2 4"/>`,
      ruffle: () => strokeLine(hemD, 13, INK, 'stroke-dasharray="9 3"') + strokeLine(hemD, 9, shade(hair, .25), 'stroke-dasharray="9 3"') + strokeLine(FACE, 5, shade(hair, .25), 'stroke-dasharray="6 2"'),
      stripe: () => strokeLine(hemD, 6, second) + strokeLine(FACE, 4, second),
    };
    const accs: Record<string, () => string> = {
      pin: () => `<circle cx="210" cy="186" r="7" fill="#f4d35e" stroke="${INK}" stroke-width="2"/><circle cx="210" cy="186" r="2.600" fill="${second}"/>`,
      rose: () => [0, 72, 144, 216, 288].map(a => `<circle cx="212" cy="172" r="9" transform="rotate(${a} 212 184)" fill="${second}" stroke="${INK}" stroke-width="1.800"/>`).join('') + `<circle cx="212" cy="184" r="6" fill="${shade(second, -.25)}" stroke="${INK}" stroke-width="1.600"/>`,
      bow: () => `<path d="M214 196l-24-15v30zM214 196l24-15v30z" fill="${second}" stroke="${INK}" stroke-width="2.200" stroke-linejoin="round"/><circle cx="214" cy="196" r="6" fill="${shade(second, -.2)}" stroke="${INK}" stroke-width="1.800"/>`,
      gem: () => `<path d="M160 256l16 14-16 22-16-22z" fill="${second}" stroke="#f4d35e" stroke-width="3.200" stroke-linejoin="round"/>` + strokeLine('M144 270h32', 1.400, '#f4d35e'),
      chain: () => strokeLine('M108 178C118 214 202 214 212 178', 2.600, '#f4d35e', 'stroke-dasharray="3 3"') + strokeLine('M110 200C128 240 192 240 210 200', 2.600, '#f4d35e', 'stroke-dasharray="3 3"'),
    };
    parts.hairFront = `<path d="M160 26C100 26 88 90 92 140C96 192 118 226 160 236C202 226 224 192 228 140C232 90 220 26 160 26ZM160 56C122 56 106 88 106 122C108 158 130 190 160 204C190 190 212 158 214 122C214 88 198 56 160 56Z" fill="${sf}" fill-rule="evenodd" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>`
      + strokeLine('M112 58C100 84 96 124 106 164M208 58C220 84 224 124 214 164M134 36C118 44 108 58 104 76', 1.8, line)
      + drape
      + (crown === 'band' ? shape('M106 112Q108 58 160 56Q212 58 214 112Q200 78 160 76Q120 78 106 112Z', second) : '')
      + (crown === 'peak' ? shape('M112 76L160 34L208 76Q160 58 112 76Z', sf) + strokeLine('M160 38V62', 2, line) : '')
      + (crown === 'volume' ? strokeLine('M112 48Q160 20 208 48', 2.4, line) : '')
      + (scarf.edge ? edges[scarf.edge]() : '') + (scarf.acc ? accs[scarf.acc]() : '')
      + strokeLine('M130 40Q160 28 190 40', 3, hairL, 'opacity=".8"');
  }

  /* ---------- headwear ---------- */
  parts.headwear = ({
    stunthelmet: '<path d="M96 96C92 28 228 28 224 96C226 110 218 118 214 112C206 78 114 78 106 112C102 118 94 110 96 96Z" fill="' + o.topC + '" stroke="' + INK + '" stroke-width="3"/><path d="M148 33C146 54 146 70 148 86H172C174 70 174 54 172 33Q160 30 148 33Z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="2"/><path d="M112 74C122 54 138 44 150 42" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>',
    stuntstar: '<path d="M96 96C92 28 228 28 224 96C226 110 218 118 214 112C206 78 114 78 106 112C102 118 94 110 96 96Z" fill="' + o.topC + '" stroke="' + INK + '" stroke-width="3"/>' + [[160, 54, 16], [122, 74, 9], [198, 74, 9]].map(([x, y, r]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 ' + -r + 'L' + r * .3 + ' ' + -r * .3 + 'L' + r + ' ' + -r * .2 + 'L' + r * .4 + ' ' + r * .2 + 'L' + r * .6 + ' ' + r + 'L0 ' + r * .5 + 'L' + -r * .6 + ' ' + r + 'L' + -r * .4 + ' ' + r * .2 + 'L' + -r + ' ' + -r * .2 + 'L' + -r * .3 + ' ' + -r * .3 + 'Z" fill="' + o.trim + '" stroke="' + INK + '" stroke-width="1.800"/>').join(''),
    mershell: '<g transform="translate(92 86)"><path d="M26 -30C8 -36 -14 -30 -24 -10C-34 12 -18 34 6 32C24 30 32 12 22 0C14 -8 2 -4 2 6" fill="#f4d35e" stroke="' + INK + '" stroke-width="2.800" stroke-linejoin="round"/><path d="M2 6C2 14 14 16 16 6C18 -6 2 -16 -10 -6C-22 6 -14 26 6 24C20 22 28 8 22 -6C18 -18 8 -24 -2 -24" fill="none" stroke="#b9851f" stroke-width="2.400"/><path d="M-10 -20Q-22 -8 -18 10" fill="none" stroke="#fff3b0" stroke-width="3" stroke-linecap="round"/></g>',
    merflower: '<g transform="translate(212 66) rotate(14)">' + [0, 72, 144, 216, 288].map(a => '<path transform="rotate(' + a + ')" d="M0 -3C-16 -14 -14 -36 0 -40C14 -36 16 -14 0 -3Z" fill="#ff8cc8" stroke="' + INK + '" stroke-width="2.400"/><path transform="rotate(' + a + ')" d="M0 -8V-28" stroke="#ff1f8f" stroke-width="2"/>').join('') + '<circle r="8" fill="#ff1f8f" stroke="' + INK + '" stroke-width="2"/><path d="M0 0L14 14" stroke="#f4d35e" stroke-width="3"/><circle cx="14" cy="14" r="3" fill="#f4d35e" stroke="' + INK + '" stroke-width="1"/></g>',
    merstar: '<g transform="translate(210 62) rotate(-14)"><path d="M0 -32C5 -16 10 -12 30 -10C18 0 15 8 20 26C6 16 -6 16 -20 26C-15 8 -18 0 -30 -10C-10 -12 -5 -16 0 -32Z" fill="#ff7a66" stroke="' + INK + '" stroke-width="2.600" stroke-linejoin="round"/>' + [[0, -18], [0, -8], [14, -6], [8, 2], [10, 14], [-8, 2], [-10, 14], [-14, -6]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="2" fill="#ffd1a8"/>').join('') + '</g>',
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
      crown: `<path d="M114 64L104 16L134 40L160 4L186 40L216 16L206 64Q160 48 114 64Z" fill="#f4d35e" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>` + [[122, 44], [160, 34], [198, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${o.trim}" stroke="${INK}" stroke-width="1.400"/>`).join(''),
    beanie: `<path d="M98 94C94 30 226 30 222 94Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600"/><path d="M92 84Q160 62 228 84L228 108Q160 88 92 108Z" fill="${shade(o.trim, -.2)}" stroke="${INK}" stroke-width="2.600"/><circle cx="160" cy="28" r="14" fill="#fff6fb" stroke="${INK}" stroke-width="2.200"/>` + strokeLine('M112 84v18M136 78v18M160 76v18M184 78v18M208 84v18', 1.600, INK, 'opacity=".5"'),
    bucket: `<path d="M112 72Q118 20 160 20Q202 20 208 72Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600"/><path d="M112 66Q160 54 208 66L232 104Q160 80 88 104Z" fill="${shade(o.trim, -.15)}" stroke="${INK}" stroke-width="2.600" stroke-linejoin="round"/>`,
    cap: `<path d="M104 88C100 22 220 22 216 88Q160 74 104 88Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600"/><path d="M106 86Q160 72 214 86Q212 106 160 102Q108 106 106 86Z" fill="#14101a" stroke="${INK}" stroke-width="2.600"/><circle cx="160" cy="28" r="4" fill="${INK}"/>`,
    tophat: `<ellipse cx="160" cy="58" rx="74" ry="14" fill="#14101a" stroke="${INK}" stroke-width="2.600"/><path d="M114 54V-30Q160 -40 206 -30V54Q160 66 114 54Z" fill="#14101a" stroke="${INK}" stroke-width="2.600"/><path d="M114 32Q160 44 206 32V50Q160 62 114 50Z" fill="${o.trim}"/>`,
    veil: `<path d="M92 66C96 22 224 22 228 66L236 204Q160 230 84 204Z" fill="#fff6fb" fill-opacity=".42" stroke="#fff6fb" stroke-width="2"/>` + strokeLine('M100 62Q160 36 220 62', 7, o.trim),
    bunny: strokeLine('M100 90C116 36 204 36 220 90', 8, '#14101a') + `<path d="M126 52C112 18 116 -28 132 -36C146 -24 148 20 142 48ZM194 52C208 18 204 -28 188 -36C174 -24 172 20 178 48Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600"/><path d="M130 40C122 18 124 -8 132 -20C138 -8 140 18 136 40ZM190 40C198 18 196 -8 188 -20C182 -8 180 18 184 40Z" fill="#f7b8cf"/>`,
    flowers: [[100, 74], [112, 54], [132, 40], [160, 34], [188, 40], [208, 54], [220, 74]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="12" fill="${['#ff1f8f', '#f4d35e', '#19b7e8', '#fff6fb'][i % 4]}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="${i % 2 ? '#ff1f8f' : '#f4d35e'}"/>`).join(''),
    bandana: `<path d="M98 88C100 28 220 28 222 88Q160 68 98 88Z" fill="${o.trim}" stroke="${INK}" stroke-width="2.600"/><path d="M216 70l24-14 2 18 14 6-30 6z" fill="${o.trim}" stroke="${INK}" stroke-width="2.200"/>` + [[130, 58], [160, 48], [190, 58], [146, 70], [176, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${contrast(o.trim)}"/>`).join(''),
    butterflies: [[118, 62, -14], [204, 56, 12], [212, 88, 22]].map(([x, y, a]) => `<path transform="translate(${x} ${y}) rotate(${a})" d="M0 0c-4-10-14-14-18-10-3 5 3 10 10 11-6 1-9 7-6 10 4 3 11-3 14-11 3 8 10 14 14 11 3-3 0-9-6-10 7-1 13-6 10-11-4-4-14 0-18 10z" fill="${o.trim}" stroke="${INK}" stroke-width="1.800"/>`).join(''),
    pearlband: strokeLine('M100 90C116 36 204 36 220 90', 7, '#fff6fb', 'stroke-dasharray="0 10"') + `<circle cx="160" cy="50" r="7" fill="${o.trim}" stroke="${INK}" stroke-width="1.600"/>`,
    antennae: strokeLine('M100 90C116 36 204 36 220 90', 6, '#14101a') + strokeLine('M130 52Q120 20 104 6M190 52Q200 20 216 6', 3, '#14101a') + `<path d="M104 -8l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1zM216 -8l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="${o.trim}" stroke="${INK}" stroke-width="1.800"/>`,
    sunhat: `<ellipse cx="160" cy="68" rx="112" ry="22" fill="#f4e6c3" stroke="${INK}" stroke-width="2.600"/><path d="M104 66C104 16 216 16 216 66Q160 78 104 66Z" fill="#f4e6c3" stroke="${INK}" stroke-width="2.600"/><path d="M104 56Q160 70 216 56V68Q160 80 104 68Z" fill="${o.trim}"/>`,
    dangles: [100, 220].map(x => strokeLine(`M${x} 150v18`, 2, '#f4d35e') + `<path transform="translate(${x} 182)" d="M0-13l3.600 8 9 .8-6.800 6 2 9-7.800-4.700-7.800 4.700 2-9-6.800-6 9-.8z" fill="${o.trim}" stroke="${INK}" stroke-width="1.600"/>`).join(''),
    batears: [100, 220].map(x => strokeLine(`M${x} 150v12`, 2, '#c0c0d8') + `<path transform="translate(${x} 172)" d="M0-2c-3-4-10-6-16-3 4 2 5 5 4 9 4-2 9-2 12 4 3-6 8-6 12-4-1-4 0-7 4-9-6-3-13-1-16 3z" fill="#14101a" stroke="${INK}" stroke-width="1.200"/>`).join(''),
    tikka: strokeLine('M160 42V78', 2.400, '#f4d35e') + strokeLine('M100 90Q130 52 160 44Q190 52 220 90', 1.800, '#f4d35e', 'stroke-dasharray="2 3"') + `<path d="M160 78l9 10-9 12-9-12z" fill="${o.trim}" stroke="#f4d35e" stroke-width="2.200"/><circle cx="160" cy="104" r="2.400" fill="#f4d35e"/>`,
    spider: strokeLine('M186 54l-14-10M186 60h-18M186 66l-14 8M206 54l14-10M206 60h18M206 66l14 8', 2.400, '#14101a') + `<ellipse cx="196" cy="62" rx="14" ry="11" fill="#14101a" stroke="${INK}" stroke-width="1.400"/><circle cx="196" cy="50" r="6" fill="#14101a"/><circle cx="193" cy="49" r="1.200" fill="#c0392b"/><circle cx="199" cy="49" r="1.200" fill="#c0392b"/>`,
} as Record<string, string>)[o.headwear] || '';

  parts.pet = drawPet(o.pet, o.petC);
  if (parts.pet) needsRoom = true;
  /* A mermaid has no hips or legs here: the game draws her tail, and this band hides where it joins. */
  if (opt.merBelt) {
    parts.torso = shape('M148 186L148 232Q160 240 172 232L172 186Z', SD) + shape('M116 244Q138 232 148 232Q160 240 172 232Q182 232 204 244L194 296Q186 318 184 338V352H136V338Q134 318 126 296Z', S);
    parts.top = (parts.top || '') + shape('M130 340Q160 351 190 340L194 358Q160 370 126 358Z', opt.merBelt) + strokeLine('M128 349Q160 361 192 349', 2.4, o.trim);
  }
  const lean = pose.lean || 0, tilt = pose.tilt || 0, lift = pose.lift || 0;
  const LOWER: Layer[] = ['legs', 'legwear', 'pants', 'shoes'];
  const shading = !opt.plain && !opt.head && (!opt.only || !!opt.shaded);
  if (shading) defs += '<filter id="' + uid + 'cel" filterUnits="userSpaceOnUse" x="-150" y="-120" width="620" height="880" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="-7" dy="-3" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="edge"/><feFlood flood-color="#1c0f22" flood-opacity=".3"/><feComposite in2="edge" operator="in" result="sh"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sh"/></feMerge></filter>';
  const SHADED: Layer[] = ['legs', 'pants', 'shoes', 'torso', 'bottom', 'top', 'arms', 'sleeves', 'hairBack'];
  const THIN: Layer[] = ['torso', 'bottom', 'top', 'neck'];
  const placed = (l: Layer): string => {
    let out = parts[l] || '';
    if (!out) return '';
    if (l === 'pet') return out;
    if (THIN.includes(l)) out = '<g transform="translate(160 0) scale(' + SLIM + ' 1) translate(-160 0)">' + out + '</g>';
    if (shading && opt.detail && SHADED.includes(l)) out = '<g filter="url(#' + uid + 'cel)">' + out + '</g>';
    if (l === 'hairBack' && !scarfOn) out = '<g transform="translate(160 110) scale(1.16 1.04) translate(-160 -110)">' + out + '</g>';
    if (l === 'hairFront' && !scarfOn) out = '<g transform="translate(160 0) scale(1.1 1) translate(-160 0)">' + out + '</g>';
    if (HEAD_LAYERS.includes(l)) out = '<g transform="translate(160 205) scale(1.05) translate(-160 -205)">' + out + '</g>';
    /* Swimming hair stays with the head but streams back along the body instead of turning with it. */
    if (opt.stream && l === 'hairBack') {
      const a = tilt * Math.PI / 180;
      out = '<g transform="translate(' + (85 * Math.sin(a)).toFixed(1) + ' ' + (85 - 85 * Math.cos(a)).toFixed(1) + ') rotate(-12 160 110) translate(160 110) scale(.66 1) translate(-160 -110)">' + out + '</g>';
    } else if (tilt && HEAD_LAYERS.includes(l)) out = '<g transform="rotate(' + tilt + ' 160 195)">' + out + '</g>';
    if (lean && !LOWER.includes(l)) out = '<g transform="rotate(' + lean + ' 160 385)">' + out + '</g>';
    return lift ? '<g transform="translate(0 ' + (-lift) + ')">' + out + '</g>' : out;
  };
  /* A head picture draws only the head, and nothing can spill out of it. */
  const showing = opt.only || (opt.head ? HEAD_LAYERS : null);
  /* Everywhere else the whole body shares one shading pass, which is far lighter to paint. */
  const BODY_START = LAYER_ORDER.indexOf('legs'), BODY_END = LAYER_ORDER.indexOf('sleeves');
  const order = LONG_TROUSERS.includes(o.bottom) ? LAYER_ORDER.map(l => (l === 'pants' ? 'shoes' : l === 'shoes' ? 'pants' : l)) : LAYER_ORDER;
  const inner = order.map((l, i) => {
    const drawn = !showing || showing.includes(l) ? placed(l) : '';
    if (!shading || opt.detail) return drawn;
    return (i === BODY_START ? '<g filter="url(#' + uid + 'cel)">' : '') + drawn + (i === BODY_END ? '</g>' : '');
  }).join('');
  const box = opt.box || (opt.head ? HEAD_ONLY_BOX : needsRoom ? WIDE_BOX : '0 0 320 720');
  const label = (opt.label || '').replace(/[&<>"]/g, ch => '&#' + ch.charCodeAt(0) + ';');
  return `<svg viewBox="${box}" style="overflow:${opt.head ? 'hidden' : 'visible'}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs>${defs}</defs>${inner}</svg>`;
}

/* ---------- a ghoul seen from behind, for classrooms and audiences: the same hair, scarves, ears, wings and clothes as the front ---------- */
const BACK_BOX = '-40 -50 400 350';
const BACK_MONSTERS = ['bat', 'wolf', 'horns', 'cat', 'fox', 'bunny', 'dragon', 'fins'];
const NOT_FROM_BEHIND = ['hoops', 'dangles', 'batears', 'tikka', 'band', 'bandana'];
function drawGhoulBack(look: Look): string {
  const o: Look = { ...look, hold: 'none', pose: 'relaxed', eyewear: 'none', mark: 'none', neck: 'none', monster: BACK_MONSTERS.includes(look.monster) ? look.monster : 'none', headwear: NOT_FROM_BEHIND.includes(look.headwear) ? 'none' : look.headwear };
  const inner = (only: Layer[]): string => drawGhoul(o, { only, box: BACK_BOX }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const hairD = shade(o.hair, -.22), hairL = shade(o.hair, .24);
  const body = '<path d="M84 300C84 256 118 234 160 234C202 234 236 256 236 300Z" fill="' + o.topC + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M142 196H178V240Q160 248 142 240Z" fill="' + shade(o.skin, -.14) + '" stroke="' + INK + '" stroke-width="2.600"/><path d="M84 300H236" stroke="' + o.trim + '" stroke-width="6"/>';
  const scalp = '<path d="M92 112C88 40 124 4 160 4C196 4 232 40 228 112C226 170 192 210 160 210C128 210 94 170 92 112Z" fill="' + o.hair + '" stroke="' + INK + '" stroke-width="3"/><path d="M160 10C146 60 146 130 158 204M126 26C112 70 112 130 128 186M194 26C208 70 208 130 192 186" fill="none" stroke="' + hairD + '" stroke-width="3" stroke-linecap="round"/><path d="M116 44C104 72 102 100 106 126" fill="none" stroke="' + hairL + '" stroke-width="5" stroke-linecap="round" opacity=".8"/>';
  return '<svg viewBox="' + BACK_BOX + '" aria-hidden="true">' + inner(['back', 'wings']) + body + scalp + inner(['hairBack']) + inner(['monster', 'headwear']) + '</svg>';
}
/* Real students sit in the seats first, then made-up ghouls fill the rest. */
function schoolCrowd(count: number): Look[] {
  const real = (typeof loadRoster === 'function' ? loadRoster() : []).map(s => s.look).sort(() => Math.random() - .5).slice(0, Math.ceil(count / 2));
  const out = [...real];
  while (out.length < count) out.push(randomLook());
  return out.sort(() => Math.random() - .5);
}
