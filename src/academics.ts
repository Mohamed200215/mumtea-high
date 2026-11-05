/* ---------- Academics: every subject teaches a short lesson, then a quiz to finish it ---------- */
interface ClassQuestion { q: string; a: string; wrong: string[]; why: string }
interface SchoolClass { id: string; period: string; name: string; blurb: string; lesson: Array<[string, string]>; quiz: ClassQuestion[] }
const PASS_MARK = 4, CLASS_BONES = 10;
const CLASSES: SchoolClass[] = [
  { id: 'biteology', period: '1st', name: 'Biteology', blurb: 'Real vampires and how teeth work', lesson: [
    ['Meet the real vampires', 'There are three species of vampire bat, and they live in Central and South America. They are the only mammals that feed only on blood.'],
    ['They lick, they don\'t suck', 'A vampire bat makes a tiny cut with its razor-sharp front teeth, then laps up the blood with its tongue. Heat sensors on its nose help it find blood vessels close to the skin.'],
    ['Why the blood keeps flowing', 'Vampire bat saliva contains a substance that stops blood from clotting. Scientists named one of these substances draculin. Yes, really.'],
    ['Your own bite', 'Human teeth do different jobs. Incisors at the front cut, pointy canines tear, and molars at the back grind. A full adult set has 32 teeth.'],
  ], quiz: [
    { q: 'How many species of vampire bat are there?', a: 'Three', wrong: ['One', 'Twelve', 'Thirty'], why: 'There are three species, all in Central and South America.' },
    { q: 'How does a vampire bat drink?', a: 'It laps blood with its tongue', wrong: ['It sucks through its fangs', 'It bites and swallows', 'It drinks through its nose'], why: 'It makes a small cut, then laps with its tongue.' },
    { q: 'What does the substance in vampire bat saliva do?', a: 'Stops blood from clotting', wrong: ['Turns blood blue', 'Puts the animal to sleep', 'Heats the blood up'], why: 'It keeps the blood flowing. One such substance is called draculin.' },
    { q: 'Which human teeth are the pointy ones used for tearing?', a: 'Canines', wrong: ['Incisors', 'Molars', 'Wisdom teeth'], why: 'Canines tear, incisors cut and molars grind.' },
    { q: 'How many teeth are in a full adult set?', a: '32', wrong: ['20', '28', '40'], why: 'A full adult set has 32 teeth, counting wisdom teeth.' },
  ] },
  { id: 'clawculus', period: '2nd', name: 'Clawculus', blurb: 'Sugar cubes per cup, solved for x', lesson: [
    ['What x means', 'In algebra, a letter like x stands for a number you don\'t know yet. If x + 2 = 5, you are asking: what number plus 2 makes 5? Here, x is 3.'],
    ['The golden rule', 'An equation is a balance. Whatever you do to one side, you must do to the other. To solve x + 2 = 5, take 2 from both sides, which leaves x = 3.'],
    ['Undoing things', 'Each step has an opposite. Subtraction undoes addition, and division undoes multiplication. To solve 3x = 12, where 3x means 3 times x, divide both sides by 3 to get x = 4.'],
    ['Two steps at once', 'For 2x + 3 = 11, deal with the plain number first. Subtract 3 to get 2x = 8. Then divide by 2 to get x = 4. Check it: 2 times 4, plus 3, is 11.'],
  ], quiz: [
    { q: 'Solve for x: x + 4 = 9', a: '5', wrong: ['4', '13', '36'], why: 'Take 4 from both sides: x = 5.' },
    { q: 'Solve for x: 3x = 12', a: '4', wrong: ['3', '9', '36'], why: 'Divide both sides by 3: x = 4.' },
    { q: 'What should you do first to solve 2x + 3 = 11?', a: 'Subtract 3 from both sides', wrong: ['Add 3 to both sides', 'Multiply both sides by 2', 'Subtract 2 from both sides'], why: 'Deal with the plain number first, by subtracting 3 from both sides.' },
    { q: 'Solve for x: 2x + 1 = 9', a: '4', wrong: ['5', '8', '10'], why: 'Subtract 1 to get 2x = 8, then divide by 2: x = 4.' },
    { q: 'Five cups hold 15 sugar cubes, with x cubes in each. What is x?', a: '3', wrong: ['5', '10', '75'], why: '5x = 15, so divide both sides by 5: x = 3.' },
  ] },
  { id: 'tealeaf', period: '3rd', name: 'Tea Leaf Reading', blurb: 'The old art of finding shapes in your cup', lesson: [
    ['It has a name', 'Reading tea leaves is called tasseography. The word comes from the French tasse, meaning cup. It became popular in Europe after tea arrived through trade.'],
    ['How it\'s done', 'Use loose leaf tea with no strainer. Drink until a little is left, swirl the cup, then turn it upside down on the saucer to drain. The leaves that stay form the shapes you read.'],
    ['Where the shapes sit', 'Traditionally, the handle stands for the drinker. Shapes near the rim mean things happening soon, and shapes near the bottom mean the distant future.'],
    ['Common symbols', 'In tradition, a heart means love, a bird means good news, an anchor means stability, and a snake warns of an enemy. This is a fun custom, and there is no scientific evidence that it predicts anything.'],
  ], quiz: [
    { q: 'What is reading tea leaves called?', a: 'Tasseography', wrong: ['Teaology', 'Phrenology', 'Astrography'], why: 'It is tasseography, from the French word tasse.' },
    { q: 'What does the French word tasse mean?', a: 'Cup', wrong: ['Leaf', 'Future', 'Witch'], why: 'Tasse means cup.' },
    { q: 'What kind of tea do you need?', a: 'Loose leaf tea', wrong: ['A tea bag', 'Iced tea', 'Instant tea powder'], why: 'You need loose leaves, so they can settle into shapes.' },
    { q: 'In tradition, what do shapes near the rim mean?', a: 'Things happening soon', wrong: ['The distant future', 'Things from your past', 'Nothing at all'], why: 'Near the rim means soon, and near the bottom means far away.' },
    { q: 'Has science shown that tea leaves predict the future?', a: 'No, there is no evidence', wrong: ['Yes, it is proven', 'Only with black tea', 'Only on full moons'], why: 'It is a fun tradition, with no scientific evidence behind it.' },
  ] },
  { id: 'creepateria', period: 'Lunch', name: 'Creepateria', blurb: 'Food safety, so the gruel stays harmless', lesson: [
    ['Clean hands first', 'Wash your hands with soap for at least 20 seconds before handling food, and again after touching raw meat.'],
    ['The danger zone', 'Bacteria grow fastest between about 5°C and 60°C (40°F to 140°F). Keep cold food cold and hot food hot.'],
    ['The two hour rule', 'Perishable food should not sit out for more than two hours. Put leftovers in the fridge before then.'],
    ['Keep raw meat apart', 'Germs can move from raw meat to other food on hands, knives and boards. This is called cross-contamination. Use separate boards, and cook poultry to 74°C (165°F).'],
  ], quiz: [
    { q: 'How long should you wash your hands with soap?', a: 'At least 20 seconds', wrong: ['About 3 seconds', 'Exactly 1 minute', 'Rinsing is enough'], why: 'At least 20 seconds, with soap.' },
    { q: 'What is the food danger zone?', a: 'About 5°C to 60°C', wrong: ['Below 0°C', 'Above 100°C', 'About 60°C to 100°C'], why: 'Bacteria grow fastest between about 5°C and 60°C (40°F to 140°F).' },
    { q: 'How long can perishable food safely sit out?', a: 'No more than two hours', wrong: ['All day', 'Up to eight hours', 'Until it smells bad'], why: 'No more than two hours. Smell is not a reliable test.' },
    { q: 'What is cross-contamination?', a: 'Germs moving from one food to another', wrong: ['Mixing two sauces', 'Cooking food twice', 'Food going cold'], why: 'Germs can travel from raw meat to other food on hands, knives and boards.' },
    { q: 'What temperature should poultry be cooked to?', a: '74°C (165°F)', wrong: ['40°C (104°F)', '55°C (131°F)', '60°C (140°F)'], why: 'Poultry should reach 74°C (165°F).' },
  ] },
  { id: 'madscience', period: '4th', name: 'Mad Science', blurb: 'The science of the perfect steep', lesson: [
    ['Why hot water works', 'Heat makes water molecules move faster, so flavour moves out of the leaves more quickly. This spreading out is called diffusion. It is why hot tea brews much faster than cold.'],
    ['Boiling point', 'At sea level, water boils at 100°C (212°F). Higher up a mountain, the air pressure is lower and water boils at a lower temperature.'],
    ['Different teas, different heat', 'Black tea likes water close to boiling, about 90°C to 100°C. Green tea is more delicate, and suits about 70°C to 80°C.'],
    ['Why tea turns bitter', 'Tea contains compounds called tannins. Steeping too long or too hot pulls out more of them, which makes the cup bitter. Black tea usually needs 3 to 5 minutes, and green tea 1 to 3.'],
  ], quiz: [
    { q: 'What is the spreading of flavour out of the leaves called?', a: 'Diffusion', wrong: ['Evaporation', 'Freezing', 'Gravity'], why: 'Diffusion. Heat speeds it up.' },
    { q: 'At what temperature does water boil at sea level?', a: '100°C (212°F)', wrong: ['85°C (185°F)', '120°C (248°F)', '60°C (140°F)'], why: 'Water boils at 100°C at sea level, and lower on a mountain.' },
    { q: 'Which water suits green tea best?', a: 'About 70°C to 80°C', wrong: ['Fully boiling', 'About 30°C', 'Ice cold only'], why: 'Green tea is delicate, so cooler water suits it.' },
    { q: 'What makes over-steeped tea taste bitter?', a: 'Tannins', wrong: ['Salt', 'Sugar', 'Oxygen'], why: 'Too long or too hot pulls out more tannins.' },
    { q: 'How long does black tea usually steep?', a: '3 to 5 minutes', wrong: ['10 seconds', '30 minutes', 'Overnight'], why: 'Usually 3 to 5 minutes, while green tea takes 1 to 3.' },
  ] },
  { id: 'casketball', period: '5th', name: 'Casketball', blurb: 'The basics of basketball, coffin optional', lesson: [
    ['Where it began', 'Basketball was invented in 1891 by James Naismith, a teacher in Springfield, Massachusetts. The first hoops were peach baskets.'],
    ['The court', 'Each team has five players on the court. A regulation hoop is 10 feet high, which is about 3.05 metres.'],
    ['Scoring', 'A free throw is worth 1 point. A normal basket is worth 2. A shot from behind the three-point line is worth 3.'],
    ['Moving the ball', 'You must bounce the ball as you move, which is called dribbling. Walking with the ball without dribbling is a foul called travelling.'],
  ], quiz: [
    { q: 'Who invented basketball?', a: 'James Naismith', wrong: ['Michael Jordan', 'Thomas Edison', 'Babe Ruth'], why: 'James Naismith invented it in 1891.' },
    { q: 'What were the first hoops?', a: 'Peach baskets', wrong: ['Metal rings', 'Bicycle wheels', 'Buckets of tea'], why: 'They were peach baskets.' },
    { q: 'How many players per team are on the court?', a: 'Five', wrong: ['Three', 'Seven', 'Eleven'], why: 'Five per team.' },
    { q: 'How many points is a shot from behind the three-point line?', a: '3', wrong: ['1', '2', '5'], why: 'Three points, as the name says.' },
    { q: 'What is walking with the ball without dribbling called?', a: 'Travelling', wrong: ['Fouling out', 'Double jumping', 'Offside'], why: 'It is called travelling.' },
  ] },
];
/* Each class gets a movie poster: a doll-faced school star lit from behind, with the subject's word huge behind them. */
const INKED = 'stroke="#14101a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const BLING = (x: number, y: number, r: number, col = '#fff6fb'): string => '<path d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z" fill="' + col + '"/>';
const BAT_MARK = (x: number, y: number, s: number, col: string): string => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-5L-4-12L-7-6C-16-13-30-13-40-3C-32-4-28 0-27 6C-22 1-16 2-13 8C-10 3-5 3 0 10C5 3 10 3 13 8C16 2 22 1 27 6C28 0 32-4 40-3C30-13 16-13 7-6L4-12Z" fill="' + col + '"/>';
interface ClassPoster { a: string; b: string; word: string; mid: string; x: number; pose: string; look: Partial<Look>; behind: string; front: string }
const STAR_FACE: Partial<Look> = { eyeStyle: 'doll', lipSize: 'big', brow: 'high', nose: 'button', mark: 'gems', pet: 'none', hold: 'none' };
const CLASS_LOOKS: Record<string, ClassPoster> = {
  biteology: { a: '#ff5c86', b: '#3a0716', word: 'BITE', mid: '#c4123f', x: 150, pose: 'hips',
    look: { skin: '#f4e4ee', eye: '#ff1f8f', lip: '#b3002d', shadow: '#6a1f86', hairStyle: 'long', hair: '#14101a', streak: '#ff1f8f', monster: 'fangs', headwear: 'none', neck: 'choker', top: 'corset', topC: '#a50e38', topP: 'solid', trim: '#14101a', back: 'cape', gloves: 'stilettos', gloveC: '#b3002d' },
    behind: '<circle cx="160" cy="112" r="84" fill="#ff5c86"/><circle cx="160" cy="112" r="84" fill="none" stroke="#fff6fb" stroke-opacity=".45" stroke-width="4"/>' + BAT_MARK(46, 46, .9, '#0c0206') + BAT_MARK(272, 34, 1.15, '#0c0206') + BAT_MARK(284, 106, .6, '#0c0206') + BAT_MARK(26, 112, .55, '#0c0206'),
    front: '<path d="M0 0H320V10C312 26 304 28 300 12C292 44 280 44 276 12C264 30 256 26 250 10H70C64 28 54 40 48 14C40 30 28 34 22 12C14 22 6 22 0 12Z" fill="#7a0620" stroke="#14101a" stroke-width="2.500"/>' + BLING(256, 148, 12) + BLING(58, 152, 8) },
  clawculus: { a: '#3fe0cf', b: '#07302d', word: 'CLAW', mid: '#0f8f82', x: 168, pose: 'peace',
    look: { skin: '#e8b48a', eye: '#f4d35e', lip: '#c2185b', shadow: '#0f766e', hairStyle: 'curls', hair: '#5a2c17', streak: '#35dcc8', monster: 'cat', eyewear: 'cat', headwear: 'none', neck: 'chain', top: 'varsity', topC: '#0f766e', topP: 'solid', trim: '#fff6fb', gloves: 'claws', gloveC: '#14101a', back: 'none' },
    behind: '<g font-family="\'Segoe Print\',\'Comic Sans MS\',cursive" font-size="20" fill="#d9fff8" opacity=".62"><text x="14" y="50">a²+b²=c²</text><text x="10" y="92">π≈3.14</text><text x="16" y="136">y=mx+b</text><text x="236" y="58">√144</text><text x="246" y="104">∑n</text><text x="232" y="146">x÷13</text></g>',
    front: '<g fill="none" stroke="#fff6fb" stroke-width="6" stroke-linecap="round"><path d="M250 124L298 196"/><path d="M270 116L316 182"/><path d="M230 136L276 208"/></g>' + BLING(50, 170, 11) + BLING(28, 24, 7) },
  tealeaf: { a: '#ffd76a', b: '#26093a', word: 'FATE', mid: '#7a2bc4', x: 140, pose: 'wave',
    look: { skin: '#fbe3d0', eye: '#8a2be2', lip: '#d81b78', shadow: '#c9a227', hairStyle: 'gempin', hair: '#6a1f86', streak: '#f4d35e', monster: 'none', headwear: 'none', neck: 'moon', top: 'kimono', topC: '#3a1250', topP: 'stars', trim: '#f4d35e', back: 'none', gloves: 'french', gloveC: '#f4d35e' },
    behind: '<path d="M276 18A46 46 0 1 0 306 92A38 38 0 0 1 276 18Z" fill="#ffd76a"/>' + BLING(36, 42, 11, '#ffd76a') + BLING(68, 22, 6) + BLING(20, 102, 7) + BLING(232, 34, 6),
    front: '<g ' + INKED + '><path d="M284 160C308 156 312 186 284 186" fill="none"/><path d="M216 150H288C288 186 272 204 252 204C232 204 216 186 216 150Z" fill="#ff7ab8"/><ellipse cx="252" cy="150" rx="36" ry="9" fill="#a8622a"/><ellipse cx="252" cy="208" rx="42" ry="7" fill="#ff9ccb"/></g><g fill="none" stroke="#fff6fb" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M238 136C232 126 244 120 238 108"/><path d="M258 136C252 124 266 118 258 102"/></g><path d="M240 151Q246 145 250 151Q244 155 240 151ZM258 149Q264 144 268 150Q262 154 258 149Z" fill="#2f8f4e"/>' },
  creepateria: { a: '#a6f04a', b: '#132b08', word: 'GRUEL', mid: '#4d9a17', x: 172, pose: 'hips',
    look: { skin: '#b8f0d0', eye: '#ff1f8f', lip: '#6a1f86', shadow: '#2f8f4e', hairStyle: 'buns', hair: '#ff1f8f', streak: '#8df04a', monster: 'stitches', headwear: 'none', neck: 'bone', top: 'tee', topC: '#14101a', topP: 'skulls', trim: '#8df04a', back: 'none', gloves: 'gothnails', gloveC: '#6a1f86' },
    behind: '<g fill="#8df04a" opacity=".55"><circle cx="30" cy="62" r="9"/><circle cx="56" cy="104" r="5"/><circle cx="286" cy="76" r="11"/><circle cx="262" cy="46" r="5"/></g>',
    front: '<path d="M0 0H320V16C308 44 300 44 296 18C286 62 270 62 266 18C254 36 246 32 240 14H104C96 42 84 66 78 18C68 40 58 36 52 14C42 34 22 44 16 18C10 26 4 24 0 16Z" fill="#6fc22e" stroke="#14101a" stroke-width="2.500"/><g ' + INKED + '><path d="M14 176H116L104 208H26Z" fill="#9aa0ac"/><path d="M20 176C28 154 44 166 56 156C70 146 88 160 110 176Z" fill="#a6f04a"/></g><ellipse cx="42" cy="162" rx="5" ry="3" fill="#fff6fb"/><circle cx="74" cy="160" r="4" fill="#fff6fb"/>' + BLING(272, 170, 11) },
  madscience: { a: '#6fe3ff', b: '#0c0b3a', word: 'SPARK', mid: '#1466c8', x: 150, pose: 'peace',
    look: { skin: '#c7c9d3', eye: '#19b7e8', lip: '#ff1f8f', shadow: '#19b7e8', hairStyle: 'crimped', hair: '#f6f0ff', streak: '#19b7e8', monster: 'bolts', eyewear: 'none', headwear: 'none', neck: 'tags', top: 'coat', topC: '#fff6fb', topP: 'solid', trim: '#19b7e8', back: 'none', gloves: 'short', gloveC: '#14101a' },
    behind: '<g ' + INKED + ' fill="#fff06a"><path d="M42 8L14 74H38L18 132L78 52H50L72 8Z"/><path d="M286 14L256 66H280L260 124L314 54H290L308 14Z"/></g>',
    front: '<g ' + INKED + '><path d="M232 118H272V152C296 168 306 188 300 204C296 214 208 214 204 204C198 188 208 168 232 152Z" fill="#fff6fb" fill-opacity=".92"/><path d="M212 182C232 172 272 192 294 180C302 196 298 204 296 206C280 212 224 212 208 206C206 200 208 190 212 182Z" fill="#8df04a"/><rect x="226" y="108" width="52" height="12" rx="4" fill="#ff1f8f"/></g><g fill="#fff6fb"><circle cx="238" cy="166" r="4"/><circle cx="262" cy="152" r="3"/><circle cx="254" cy="134" r="2.500"/></g>' + BLING(46, 166, 12, '#6fe3ff') },
  casketball: { a: '#ffa04d', b: '#2c1004', word: 'SLAM', mid: '#d9560f', x: 150, pose: 'hips',
    look: { skin: '#5b3522', eye: '#f4d35e', lip: '#ff4fa8', shadow: '#ff8c1a', hairStyle: 'puffs', hair: '#14101a', streak: '#ff1f8f', monster: 'none', headwear: 'band', neck: 'chain', top: 'jersey', topC: '#ff1f8f', topP: 'solid', trim: '#fff6fb', back: 'none', gloves: 'nails', gloveC: '#ff1f8f' },
    behind: '<g ' + INKED + '><rect x="234" y="10" width="78" height="56" fill="#fff6fb"/><rect x="258" y="28" width="30" height="24" fill="none" stroke="#ff1f8f"/></g><g fill="none" stroke="#fff6fb" stroke-width="2"><path d="M246 76L254 108H284L292 76M254 76L262 108M270 76V108M286 76L278 108M250 92H288"/></g><ellipse cx="269" cy="74" rx="26" ry="7" fill="none" stroke="#14101a" stroke-width="7"/><ellipse cx="269" cy="74" rx="26" ry="7" fill="none" stroke="#ff1f8f" stroke-width="4"/>',
    front: '<g ' + INKED + '><circle cx="58" cy="172" r="36" fill="#f2761b"/><path d="M22 172H94M58 136V208M32 146C46 160 46 184 32 198M84 146C70 160 70 184 84 198" fill="none"/></g><path d="M34 164C34 158 42 156 46 160M70 160C74 156 82 158 82 164M56 174L58 178L60 174" fill="none" stroke="#14101a" stroke-width="3" stroke-linecap="round"/>' + BLING(112, 150, 8) + BLING(292, 170, 12) },
};
const posterArt: Record<string, string> = {};
function classPoster(id: string): string {
  if (posterArt[id]) return posterArt[id];
  const p = CLASS_LOOKS[id], W = 320, H = 220, cx = p.x + 10, cy = 112;
  let rays = '';
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, b = a + .17, far = 420; rays += '<path d="M' + cx + ' ' + cy + 'L' + (cx + Math.cos(a) * far).toFixed(0) + ' ' + (cy + Math.sin(a) * far).toFixed(0) + 'L' + (cx + Math.cos(b) * far).toFixed(0) + ' ' + (cy + Math.sin(b) * far).toFixed(0) + 'Z" fill="' + p.mid + '" opacity=".5"/>'; }
  const star = normalizeLook({ ...FANG_LOOK, ...STAR_FACE, ...p.look, pose: p.pose });
  const scale = .56, boxX = -60, boxY = -44, boxW = 440, boxH = 420;
  const body = drawGhoul(star, { pose: POSES.find(x => x.id === p.pose), box: boxX + ' ' + boxY + ' ' + boxW + ' ' + boxH }).replace('<svg ', '<svg x="' + (p.x - boxW * scale / 2 + 10) + '" y="36" width="' + boxW * scale + '" height="' + boxH * scale + '" ');
  /* The word sits across the top like a magazine title, on top of everything. */
  const title = '<text x="' + W / 2 + '" y="50" text-anchor="middle" textLength="' + (W - 28) + '" lengthAdjust="spacingAndGlyphs" font-family="\'Breath of the House\',Impact,fantasy" font-size="58" fill="' + p.a + '" stroke="#14101a" stroke-width="5" paint-order="stroke">' + p.word + '</text>';
  posterArt[id] = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="pv' + id + '" cx="50%" cy="46%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".72"/></radialGradient><linearGradient id="pf' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="66%" stop-color="' + p.b + '" stop-opacity="0"/><stop offset="100%" stop-color="' + p.b + '"/></linearGradient></defs>'
    + '<rect width="' + W + '" height="' + H + '" fill="' + p.b + '"/>' + rays + p.behind
    + '<g class="posterstar" style="color:' + p.a + '">' + body + '</g><rect width="' + W + '" height="' + H + '" fill="url(#pf' + id + ')"/>' + p.front
    + '<rect width="' + W + '" height="' + H + '" fill="url(#pv' + id + ')"/>' + title + '</svg>';
  return posterArt[id];
}
const classKey = (): string => 'classes.' + (isAdmin() ? 'fang' : signedInId() || 'guest');
const classesDone = (): Record<string, number> => store.get<Record<string, number>>(classKey(), {});
function classRoomFocus(): void {
  const room = $('#classRoom');
  room.querySelector<HTMLElement>('h3')?.focus();
  room.scrollIntoView({ block: 'start' });
}
function renderClasses(): void {
  musicStop();
  const room = $('#classRoom'), done = classesDone(), finished = CLASSES.filter(c => c.id in done).length;
  room.textContent = '';
  room.append(el('p', { cls: 'classtally', text: finished + ' of ' + CLASSES.length + ' classes finished' }));
  room.append(el('div', { cls: 'classgrid' }, ...CLASSES.map(c => {
    const look = CLASS_LOOKS[c.id], art = el('div', { cls: 'classart' });
    art.innerHTML = classPoster(c.id);
    if (c.id in done) art.append(el('b', { cls: 'classstamp', text: 'Passed ' + done[c.id] + '/' + c.quiz.length }));
    const card = el('button', { cls: 'classcard' + (c.id in done ? ' classdone' : ''), type: 'button', onclick() { openLesson(c, 0); } }, art,
      el('small', { text: c.period === 'Lunch' ? 'Lunch' : c.period + ' period' }), el('strong', { text: c.name }), el('span', { text: c.blurb }),
      el('em', { text: c.id in done ? 'Take it again' : 'Start the lesson' }));
    card.style.setProperty('--ca', look.a); card.style.setProperty('--cb', look.b);
    return card;
  })));
}
function classHeader(c: SchoolClass, step: string): HTMLElement {
  return el('div', { cls: 'classhead' }, el('button', { cls: 'linkish', type: 'button', onclick() { renderClasses(); classRoomFocus(); } }, 'All classes'), el('small', { text: c.name + ': ' + step }));
}
/* ---------- the classroom: it is always Ms. Fangtastic at the chalkboard, whoever is logged in ---------- */
let classKidsArt = '';
/* The same classmates stay in their seats for the whole visit. */
const classKids = (): string => {
  if (classKidsArt) return classKidsArt;
  const seats = schoolCrowd(7).map((look, i) => {
    const x = 6 + i * 127, hand = i === 2 ? '<g class="kidhand"><path d="M' + (x + 104) + ' 96L' + (x + 124) + ' 6" stroke="#14101a" stroke-width="17" stroke-linecap="round"/><path d="M' + (x + 104) + ' 96L' + (x + 124) + ' 6" stroke="' + look.skin + '" stroke-width="11" stroke-linecap="round"/></g>' : '';
    return '<g class="kid" style="animation-delay:' + (i * .45) + 's">' + hand + drawGhoulBack(look).replace('<svg ', '<svg x="' + x + '" y="-8" width="150" height="131" ') + '</g>';
  }).join('');
  classKidsArt = '<svg viewBox="0 0 900 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + seats + '<rect y="100" width="900" height="20" fill="#7a4a21"/><rect y="100" width="900" height="5" fill="#a8703a"/></svg>';
  return classKidsArt;
};
const CLASS_TALK: Record<string, string[]> = {
  teach: ['Eyes on the board, ghouls.', 'Write this one down.', 'This will be on the test.', 'No talking in the back row.', 'Keep up. I only say it once.'],
  ask: ['Pencils out.', 'No peeking at your neighbour.', 'Think before you answer.', 'Well? We are waiting.'],
  right: ['Fangtastic!', 'Exactly right.', 'See? You were listening.'],
  wrong: ['Nice try, ghoul.', 'Not quite. Look at the board.', 'We will work on that.'],
  pass: ['Top of the class.'], fail: ['Back to your books. You can do this.'],
};
const classPick = (key: string): string => { const list = CLASS_TALK[key]; return list[Math.floor(Math.random() * list.length)]; };
function classTeacher(holder: HTMLElement, pose: string, line: string): void {
  holder.textContent = '';
  const figure = el('div', { cls: 'teacherart' });
  figure.innerHTML = drawGhoul(DOLLS.mumtea.look, { label: DOLLS.mumtea.name + ' teaching', pose: poseOf(pose), box: WIDE_BOX });
  holder.append(el('p', { cls: 'teacherbubble', text: line }), figure);
}
function classroomScene(c: SchoolClass, step: string, pose: string, line: string, asking: boolean, ...board: Node[]): { scene: HTMLElement; teacher: HTMLElement } {
  const look = CLASS_LOOKS[c.id], teacher = el('div', { cls: 'teacher' });
  classTeacher(teacher, pose, line);
  const poster = el('div', { cls: 'roomposter', 'aria-hidden': 'true' }); poster.innerHTML = classPoster(c.id);
  const kids = el('div', { cls: 'roomkids' + (asking ? ' asking' : ''), 'aria-hidden': 'true' }); kids.innerHTML = classKids();
  musicPlay('class');
  const sound = el('div', { cls: 'roomsound' }, ...soundButtons());
  const scene = el('section', { cls: 'classroom' }, classHeader(c, step), sound,
    el('div', { cls: 'roomwall' }, el('div', { cls: 'chalkboard' }, el('div', { cls: 'chalkface' }, ...board), el('div', { cls: 'chalktray', 'aria-hidden': 'true' }, el('i'), el('i'), el('b'))), poster, teacher), kids);
  scene.style.setProperty('--ca', look.a);
  return { scene, teacher };
}
/* The quiz only opens from the last page of the lesson. */
function openLesson(c: SchoolClass, page: number): void {
  const room = $('#classRoom'), [title, text] = c.lesson[page], last = page === c.lesson.length - 1;
  room.textContent = '';
  const row = el('div', { cls: 'row' });
  if (page) row.append(el('button', { cls: 'pill ghost', type: 'button', onclick() { openLesson(c, page - 1); } }, 'Back'));
  row.append(el('button', { cls: 'pill', type: 'button', onclick() { if (last) openQuiz(c); else openLesson(c, page + 1); } }, last ? 'Take the quiz' : 'Next'));
  room.append(classroomScene(c, 'lesson ' + (page + 1) + ' of ' + c.lesson.length, 'pointyou', classPick('teach'), false,
    el('h3', { tabindex: '-1', text: title }), el('p', { cls: 'classtext', text }),
    el('div', { cls: 'progress' }, el('i', { style: 'width:' + ((page + 1) / c.lesson.length * 100) + '%' })), row).scene);
  classRoomFocus();
}
function openQuiz(c: SchoolClass): void {
  const room = $('#classRoom');
  let at = 0, right = 0;
  const ask = (): void => {
    const q = c.quiz[at];
    room.textContent = '';
    const answers = [q.a, ...q.wrong].map(t => ({ t, r: Math.random() })).sort((x, y) => x.r - y.r).map(x => x.t);
    const feedback = el('div', { cls: 'classfeedback', role: 'status' });
    const opts = el('div', { cls: 'opts' }, ...answers.map(t => el('button', { type: 'button', onclick(e: Event) {
      const isRight = t === q.a;
      if (isRight) right++;
      opts.querySelectorAll<HTMLButtonElement>('button').forEach(b => { b.disabled = true; if (b.textContent === q.a) b.classList.add('rightanswer'); });
      if (!isRight) (e.currentTarget as HTMLElement).classList.add('wronganswer');
      const final = at === c.quiz.length - 1;
      classTeacher(room.querySelector('.teacher') as HTMLElement, isRight ? 'cheer' : 'shrug', classPick(isRight ? 'right' : 'wrong'));
      feedback.append(el('p', { text: (isRight ? 'Correct! ' : 'Not quite. ') + q.why }), el('button', { cls: 'pill', type: 'button', onclick() { if (final) finish(); else { at++; ask(); } } }, final ? 'See my result' : 'Next question'));
      feedback.querySelector('button')?.focus();
    } }, t)));
    room.append(classroomScene(c, 'quiz question ' + (at + 1) + ' of ' + c.quiz.length, 'pointyou', classPick('ask'), true,
      el('h3', { cls: 'q', tabindex: '-1', text: q.q }), opts, feedback,
      el('div', { cls: 'progress' }, el('i', { style: 'width:' + (at / c.quiz.length * 100) + '%' }))).scene);
    classRoomFocus();
  };
  const finish = (): void => {
    const passed = right >= PASS_MARK, done = classesDone(), firstTime = !(c.id in done);
    if (passed) {
      store.set(classKey(), { ...done, [c.id]: Math.max(done[c.id] || 0, right) });
      if (firstTime) award(CLASS_BONES);
    }
    room.textContent = '';
    const row = el('div', { cls: 'row' });
    if (passed) row.append(el('button', { cls: 'pill', type: 'button', onclick() { renderClasses(); classRoomFocus(); } }, 'Back to classes'));
    else row.append(el('button', { cls: 'pill', type: 'button', onclick() { openLesson(c, 0); } }, 'Read the lesson again'), el('button', { cls: 'pill ghost', type: 'button', onclick() { openQuiz(c); } }, 'Try the quiz again'));
    room.append(classroomScene(c, 'result', passed ? 'y' : 'shrug', classPick(passed ? 'pass' : 'fail'), false,
      el('h3', { tabindex: '-1', text: passed ? 'Class finished!' : 'Not quite there' }),
      el('p', { cls: 'classtext', text: 'You got ' + right + ' out of ' + c.quiz.length + '. ' + (passed ? (firstTime ? 'You earned ' + CLASS_BONES + ' bones.' : 'Nicely done.') : 'You need ' + PASS_MARK + ' to finish this class.') }), row).scene);
    classRoomFocus();
  };
  ask();
}
