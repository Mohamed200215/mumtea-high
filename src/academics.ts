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
/* Each class gets a still from a film that was never made: only places and objects, lit by moon, slime and lightning. */
const BAT_MARK = (x: number, y: number, s: number, col = '#050104'): string => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-5L-4-12L-7-6C-16-13-30-13-40-3C-32-4-28 0-27 6C-22 1-16 2-13 8C-10 3-5 3 0 10C5 3 10 3 13 8C16 2 22 1 27 6C28 0 32-4 40-3C30-13 16-13 7-6L4-12Z" fill="' + col + '"/>';
const STILL_GLOW = (d: string, id: string, blur: 'soft' | 'wide' = 'soft'): string => '<g filter="url(#' + blur + id + ')">' + d + '</g>';
interface ClassStill { a: string; b: string; word: string; art(id: string): string }
const CLASS_LOOKS: Record<string, ClassStill> = {
  biteology: { a: '#ff5c86', b: '#3a0716', word: 'BITE', art: id =>
    '<rect width="320" height="220" fill="#14030a"/>'
    + STILL_GLOW('<circle cx="212" cy="112" r="92" fill="#d3123f" opacity=".75"/>', id, 'wide')
    + '<circle cx="212" cy="112" r="66" fill="#e8264f"/><circle cx="190" cy="94" r="13" fill="#b80f38" opacity=".7"/><circle cx="234" cy="128" r="19" fill="#b80f38" opacity=".55"/><circle cx="226" cy="84" r="7" fill="#b80f38" opacity=".6"/><circle cx="184" cy="136" r="8" fill="#b80f38" opacity=".5"/>'
    + BAT_MARK(168, 84, .62) + BAT_MARK(232, 62, .9) + BAT_MARK(262, 112, .5) + BAT_MARK(120, 66, .42) + BAT_MARK(70, 98, .3) + BAT_MARK(296, 66, .34) + BAT_MARK(200, 124, .38)
    + '<path d="M0 220V168L18 160V128L24 104L30 128V150L46 142V112L54 80L62 112V136L78 146V120L84 100L90 120V152L112 160L134 150V132L142 116L150 132V158L176 172L208 164L240 176L270 160V140L278 122L286 140V166L320 158V220Z" fill="#050104"/>'
    + '<g fill="#ff5c86"><rect x="52" y="116" width="3" height="7"/><rect x="82" y="128" width="3" height="7"/><rect x="141" y="138" width="3" height="6"/><rect x="277" y="146" width="3" height="6"/></g>'
    + '<rect y="150" width="320" height="70" fill="#ff5c86" opacity=".3" filter="url(#fog' + id + ')"/>' },
  clawculus: { a: '#3fe0cf', b: '#07302d', word: 'CLAW', art: id =>
    '<rect width="320" height="220" fill="#03120f"/><rect x="-6" y="62" width="332" height="170" fill="#0c3a31"/>'
    + '<rect x="-6" y="62" width="332" height="6" fill="#5c3a1b"/>'
    + '<g font-family="\'Segoe Print\',\'Comic Sans MS\',cursive" fill="#d9fff8" opacity=".5"><text x="14" y="98" font-size="19">a²+b²=c²</text><text x="20" y="136" font-size="16">π≈3.14159</text><text x="12" y="172" font-size="18">y=mx+b</text><text x="212" y="94" font-size="15">√144=12</text><text x="118" y="196" font-size="15">∑ x÷13</text></g>'
    + '<path d="M120-20L280-20L330 230L60 230Z" fill="#bff7ee" opacity=".12"/>'
    + STILL_GLOW('<g fill="#3fe0cf"><path d="M180 66L200 62L176 208L168 212Z"/><path d="M216 64L238 66L216 216L206 216Z"/><path d="M254 72L274 76L258 212L248 212Z"/></g>', id, 'wide')
    + '<g fill="#eafffb"><path d="M183 70L197 66L174 204L170 208Z"/><path d="M219 68L235 70L214 212L208 212Z"/><path d="M257 76L271 80L256 208L250 208Z"/></g>'
    + '<g fill="#d9fff8"><circle cx="150" cy="106" r="1.500"/><circle cx="162" cy="146" r="1"/><circle cx="288" cy="120" r="1.500"/><circle cx="130" cy="176" r="1"/><circle cx="292" cy="172" r="1"/><circle cx="196" cy="186" r="1"/></g>'
    + '<rect y="204" width="320" height="16" fill="#2a1a0d"/><rect x="40" y="200" width="24" height="5" rx="2" fill="#f6fff8"/><rect x="72" y="201" width="14" height="4" rx="2" fill="#3fe0cf"/>' },
  tealeaf: { a: '#ffd76a', b: '#26093a', word: 'FATE', art: id =>
    '<rect width="320" height="220" fill="#0e0320"/><rect width="320" height="220" fill="#7a2bc4" opacity=".55" filter="url(#fog' + id + ')"/>'
    + '<path d="M262 56A30 30 0 1 0 286 104A25 25 0 0 1 262 56Z" fill="#ffe9a8"/>'
    + '<g fill="#fff6d8"><circle cx="34" cy="74" r="1.500"/><circle cx="70" cy="62" r="1"/><circle cx="92" cy="96" r="1.500"/><circle cx="20" cy="118" r="1"/><circle cx="232" cy="66" r="1"/><circle cx="300" cy="130" r="1.500"/><circle cx="128" cy="70" r="1"/></g>'
    + STILL_GLOW('<ellipse cx="160" cy="146" rx="62" ry="30" fill="#ffb84a" opacity=".85"/>', id, 'wide')
    + '<g fill="none" stroke="#fff3d0" stroke-linecap="round" filter="url(#soft' + id + ')" opacity=".75"><path d="M146 138C132 118 160 106 146 82" stroke-width="6"/><path d="M174 138C188 114 160 100 176 70" stroke-width="7"/></g>'
    + '<path d="M208 158C238 152 240 190 206 186" fill="none" stroke="#1a0730" stroke-width="9" stroke-linecap="round"/>'
    + '<path d="M104 146H216C216 186 192 204 160 204C128 204 104 186 104 146Z" fill="#1a0730"/><ellipse cx="160" cy="146" rx="56" ry="11" fill="#ffc861"/><ellipse cx="160" cy="147" rx="46" ry="7" fill="#a8622a"/><path d="M144 147Q152 141 158 147Q150 152 144 147ZM168 145Q176 140 182 146Q174 150 168 145ZM156 151Q160 148 165 151Q160 154 156 151Z" fill="#14060a"/>'
    + '<path d="M108 158C112 182 130 198 150 202" fill="none" stroke="#ffd76a" stroke-width="2" opacity=".75"/>'
    + '<path d="M60 212C90 202 230 202 260 212V220H60Z" fill="#05010c"/>'
    + '<rect x="30" y="170" width="12" height="44" fill="#05010c"/>' + STILL_GLOW('<ellipse cx="36" cy="160" rx="9" ry="14" fill="#ffb84a"/>', id) + '<path d="M36 148C42 158 40 168 36 170C32 168 30 158 36 148Z" fill="#fff3d0"/>' },
  creepateria: { a: '#a6f04a', b: '#132b08', word: 'GRUEL', art: id =>
    '<rect width="320" height="220" fill="#040b02"/>'
    + '<g fill="#0c1c07"><rect x="0" y="62" width="44" height="120"/><rect x="276" y="62" width="44" height="120"/></g><g fill="#a6f04a" opacity=".25"><rect x="10" y="74" width="24" height="34"/><rect x="286" y="74" width="24" height="34"/></g>'
    + STILL_GLOW('<ellipse cx="160" cy="118" rx="96" ry="58" fill="#7ad61d" opacity=".72"/>', id, 'wide')
    + '<g fill="none" stroke="#c9ff8a" stroke-linecap="round" opacity=".55" filter="url(#soft' + id + ')"><path d="M126 112C112 92 136 80 124 58" stroke-width="7"/><path d="M196 112C210 90 186 78 198 56" stroke-width="7"/></g>'
    + '<path d="M78 128H242C252 176 226 212 198 214H122C94 212 68 176 78 128Z" fill="#030701"/><ellipse cx="160" cy="128" rx="86" ry="17" fill="#030701"/>'
    + '<ellipse cx="160" cy="127" rx="74" ry="11" fill="#a6f04a"/><path d="M92 128C92 150 98 166 104 160C110 154 106 138 112 132H208C214 140 212 170 220 170C228 170 230 142 228 128Z" fill="#a6f04a"/>'
    + '<g fill="#e4ffb8"><circle cx="134" cy="124" r="6"/><circle cx="178" cy="128" r="4"/><circle cx="154" cy="120" r="3"/><circle cx="198" cy="123" r="3"/></g><circle cx="142" cy="96" r="4" fill="none" stroke="#c9ff8a" stroke-width="1.500"/><circle cx="182" cy="82" r="3" fill="none" stroke="#c9ff8a" stroke-width="1.500"/>'
    + '<path d="M212 40L190 122" stroke="#050b03" stroke-width="7" stroke-linecap="round"/>'
    + '<path d="M60 220L72 204H248L260 220Z" fill="#010300"/>' },
  madscience: { a: '#6fe3ff', b: '#0c0b3a', word: 'SPARK', art: id => {
    const bolt = 'M50 96L82 112L96 92L124 122L146 96L168 120L198 90L222 118L240 96L270 96';
    return '<rect width="320" height="220" fill="#03031a"/>'
    + STILL_GLOW('<ellipse cx="160" cy="108" rx="150" ry="52" fill="#1466c8" opacity=".85"/>', id, 'wide')
    + '<g fill="#02020e"><path d="M42 220V116H58V220Z"/><path d="M28 220L36 196H64L72 220Z"/><ellipse cx="50" cy="100" rx="24" ry="13"/><path d="M262 220V116H278V220Z"/><path d="M248 220L256 196H284L292 220Z"/><ellipse cx="270" cy="100" rx="24" ry="13"/></g>'
    + '<g fill="#1e6fb2"><rect x="38" y="130" width="24" height="3"/><rect x="38" y="144" width="24" height="3"/><rect x="38" y="158" width="24" height="3"/><rect x="38" y="172" width="24" height="3"/><rect x="258" y="130" width="24" height="3"/><rect x="258" y="144" width="24" height="3"/><rect x="258" y="158" width="24" height="3"/><rect x="258" y="172" width="24" height="3"/></g>'
    + STILL_GLOW('<path d="' + bolt + '" fill="none" stroke="#6fe3ff" stroke-width="9" stroke-linejoin="round"/>', id)
    + '<path d="' + bolt + '" fill="none" stroke="#f4feff" stroke-width="2.500" stroke-linejoin="round"/><path d="M124 122L116 148L132 140M198 90L208 70M222 118L232 146" fill="none" stroke="#c7f5ff" stroke-width="1.500"/>'
    + STILL_GLOW('<ellipse cx="160" cy="184" rx="40" ry="26" fill="#8df04a" opacity=".8"/>', id)
    + '<path d="M148 138H172V164C192 176 202 196 196 208C194 214 126 214 124 208C118 196 128 176 148 164Z" fill="#050920" stroke="#a7ecff" stroke-width="2"/><path d="M130 196C146 188 174 202 190 194C198 202 194 208 192 210C180 213 140 213 128 210C126 206 127 200 130 196Z" fill="#8df04a"/><rect x="144" y="132" width="32" height="7" rx="2" fill="#a7ecff"/><circle cx="150" cy="184" r="3" fill="#e4ffb8"/><circle cx="168" cy="176" r="2" fill="#e4ffb8"/>'
    + '<rect y="212" width="320" height="8" fill="#010109"/>'; } },
  casketball: { a: '#ffa04d', b: '#2c1004', word: 'SLAM', art: id =>
    '<rect width="320" height="220" fill="#0a0402"/>'
    + '<g fill="#1a0a04"><rect y="62" width="320" height="110"/></g>'
    + '<g fill="#ffa04d" opacity=".32">' + Array.from({ length: 34 }, (_, i) => '<circle cx="' + (6 + (i % 17) * 19 + (i > 16 ? 9 : 0)) + '" cy="' + (i > 16 ? 142 : 124) + '" r="5"/>').join('') + '</g>'
    + '<path d="M196-20H244L300 188H110Z" fill="#ffe2bf" opacity=".26"/>'
    + '<rect y="172" width="320" height="48" fill="#6e3610"/><g fill="#552809"><rect y="182" width="320" height="1"/><rect y="194" width="320" height="1"/><rect y="208" width="320" height="1"/></g><ellipse cx="206" cy="188" rx="96" ry="16" fill="#ffc98a" opacity=".55"/>'
    + '<path d="M292 66H312V190H292Z" fill="#050201"/><path d="M296 70L262 78" stroke="#050201" stroke-width="8"/>'
    + '<rect x="256" y="58" width="10" height="56" fill="#fff" opacity=".82"/><path d="M216 102H256" stroke="#ff4f2e" stroke-width="5" stroke-linecap="round"/><path d="M220 106L226 134M236 106V136M252 106L246 134M228 120H246" fill="none" stroke="#fff0dc" stroke-width="1.500"/>'
    + '<path d="M150 84C140 84 118 92 92 112" fill="none" stroke="#ffa04d" stroke-width="16" stroke-linecap="round" opacity=".2"/>'
    + STILL_GLOW('<circle cx="172" cy="78" r="26" fill="#ff8c1a" opacity=".65"/>', id)
    + '<circle cx="172" cy="78" r="20" fill="#e8690f"/><path d="M152 78H192M172 58V98M158 64C168 72 168 86 158 94M186 64C176 72 176 86 186 94" fill="none" stroke="#2a1004" stroke-width="2"/>'
    + '<path d="M38 188L26 124L42 86H74L90 124L78 188Z" fill="#050201"/><path d="M42 86H74L90 124" fill="none" stroke="#ffa04d" stroke-width="1.500" opacity=".85"/><path d="M58 104V150M46 120H70" stroke="#ffa04d" stroke-width="3" opacity=".65"/><ellipse cx="58" cy="192" rx="40" ry="6" fill="#000" opacity=".6"/>' },
};
const posterArt: Record<string, string> = {};
function classPoster(id: string): string {
  if (posterArt[id]) return posterArt[id];
  const p = CLASS_LOOKS[id], W = 320, H = 220;
  /* The word sits across the top like a film title, on top of everything. */
  const title = '<text x="' + W / 2 + '" y="50" text-anchor="middle" textLength="' + (W - 28) + '" lengthAdjust="spacingAndGlyphs" font-family="\'Breath of the House\',Impact,fantasy" font-size="58" fill="' + p.a + '" stroke="#050206" stroke-width="5" paint-order="stroke">' + p.word + '</text>';
  posterArt[id] = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="soft' + id + '" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter><filter id="wide' + id + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="17"/></filter>'
    + '<filter id="fog' + id + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.700 -.65"/><feComposite in="SourceGraphic" operator="in"/></filter>'
    + '<filter id="grain' + id + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 -.16"/></filter>'
    + '<radialGradient id="pv' + id + '" cx="50%" cy="52%" r="72%"><stop offset="52%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".82"/></radialGradient></defs>'
    + p.art(id) + '<rect width="' + W + '" height="' + H + '" filter="url(#grain' + id + ')" opacity=".4"/><rect width="' + W + '" height="' + H + '" fill="url(#pv' + id + ')"/>' + title + '</svg>';
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
