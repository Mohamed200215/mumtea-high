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
/* Each class gets its own picture and colours, printed with the same dotted look as the school's other art. */
const INKED = 'stroke="#14101a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
function classScene(id: string, top: string, low: string, body: string): string {
  return '<svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="cg' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + low + '"/></linearGradient><pattern id="cd' + id + '" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4.500" cy="4.500" r="1.900" fill="#fff" opacity=".2"/></pattern></defs><rect width="320" height="150" fill="url(#cg' + id + ')"/><rect width="320" height="150" fill="url(#cd' + id + ')"/>' + body + '</svg>';
}
const CLASS_LOOKS: Record<string, { a: string; b: string; art: string }> = {
  biteology: { a: '#ff5c86', b: '#3a0716', art: classScene('bite', '#5c0822', '#e0245e',
    '<g class="cabob"><path d="M78 48Q160 8 242 48Q238 128 160 138Q82 128 78 48Z" fill="#2b0512" ' + INKED + '/><path d="M78 48Q160 8 242 48Q236 66 228 60Q160 34 92 60Q84 66 78 48Z" fill="#ff8fab" ' + INKED + '/><path d="M112 54L118 92L128 50ZM208 54L202 92L192 50Z" fill="#fff6fb" ' + INKED + '/>' + [136, 151, 166].map(x => '<rect x="' + x + '" y="44" width="15" height="20" rx="3" fill="#fff6fb" ' + INKED + '/>').join('') + [108, 128, 148, 168, 188].map(x => '<rect x="' + x + '" y="108" width="20" height="17" rx="4" fill="#fff6fb" ' + INKED + '/>').join('') + '<path d="M128 104Q160 80 192 104Q160 118 128 104Z" fill="#e0245e" ' + INKED + '/><path d="M118 92C114 98 113 104 118 106C123 104 122 98 118 92Z" fill="#ff1f3d" ' + INKED + '/></g><path d="M18 22C30 14 42 18 46 30C52 18 66 16 78 24C68 26 62 34 62 44C56 36 50 36 46 44C42 36 36 36 30 44C30 34 26 26 18 22Z" fill="#14101a"/><path d="M244 112C256 104 268 108 272 120C278 108 292 106 304 114C294 116 288 124 288 134C282 126 276 126 272 134C268 126 262 126 256 134C256 124 252 116 244 112Z" fill="#14101a"/>') },
  clawculus: { a: '#3fe0cf', b: '#07302d', art: classScene('claw', '#0a4a46', '#1fbcab',
    '<g class="cabob"><rect x="54" y="16" width="212" height="112" rx="5" fill="#8a5a2b" ' + INKED + '/><rect x="64" y="26" width="192" height="92" fill="#123c33" ' + INKED + '/><text x="160" y="66" text-anchor="middle" font-size="34" fill="#f6fff8" font-family="Comic Sans MS, Segoe Print, cursive">x + 2 = 5</text><text x="160" y="100" text-anchor="middle" font-size="22" fill="#ffd0e8" font-family="Comic Sans MS, Segoe Print, cursive">so x = 3!</text><path d="M196 30L168 112M212 30L184 114M228 32L200 116" stroke="#dff" stroke-width="3.500" stroke-linecap="round" opacity=".55"/><rect x="50" y="128" width="220" height="9" rx="3" fill="#6d4420" ' + INKED + '/><rect x="74" y="122" width="34" height="7" rx="3" fill="#fff6fb" stroke="#14101a" stroke-width="2"/></g><g ' + INKED + '><path d="M276 112L294 104L310 112L292 121Z" fill="#fff"/><path d="M276 112V130L292 139V121Z" fill="#dfe6ea"/><path d="M310 112V130L292 139V121Z" fill="#b9c6cc"/></g><g ' + INKED + '><path d="M12 124L26 118L38 124L24 131Z" fill="#fff"/><path d="M12 124V138L24 145V131Z" fill="#dfe6ea"/><path d="M38 124V138L24 145V131Z" fill="#b9c6cc"/></g>') },
  tealeaf: { a: '#ffd76a', b: '#26093a', art: classScene('leaf', '#2c0b49', '#8a2be2',
    '<g fill="none" stroke="#fff6fb" stroke-width="4" stroke-linecap="round" opacity=".85"><path class="casteam" d="M136 44C126 32 146 24 136 8"/><path class="casteam two" d="M160 44C150 30 170 22 160 4"/><path class="casteam" d="M184 44C174 32 194 24 184 8"/></g><g class="cabob"><ellipse cx="160" cy="130" rx="86" ry="13" fill="#f7dc6f" ' + INKED + '/><path d="M96 58C98 104 122 126 160 126C198 126 222 104 224 58Z" fill="#fff6fb" ' + INKED + '/><path d="M222 72C248 66 254 96 212 104" fill="none" stroke="#14101a" stroke-width="10" stroke-linecap="round"/><path d="M222 72C248 66 254 96 212 104" fill="none" stroke="#fff6fb" stroke-width="5" stroke-linecap="round"/><ellipse cx="160" cy="58" rx="64" ry="15" fill="#f4c23e" ' + INKED + '/><ellipse cx="160" cy="59" rx="55" ry="10" fill="#7a3f12"/><path d="M122 58Q136 50 140 60Q130 66 122 58ZM150 62Q162 52 170 60Q160 68 150 62ZM178 56Q190 52 196 60Q186 66 178 56Z" fill="#14310f"/><path d="M104 82Q160 100 216 82" fill="none" stroke="#ff1f8f" stroke-width="3"/></g><path d="M52 32A20 20 0 1 0 66 62A16 16 0 1 1 52 32Z" fill="#f7dc6f" ' + INKED + '/>' + [[270, 30, 11], [292, 66, 7], [28, 100, 8], [250, 62, 5]].map(([x, y, r]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 ' + -r + 'L' + r * .28 + ' ' + -r * .28 + 'L' + r + ' 0L' + r * .28 + ' ' + r * .28 + 'L0 ' + r + 'L' + -r * .28 + ' ' + r * .28 + 'L' + -r + ' 0L' + -r * .28 + ' ' + -r * .28 + 'Z" fill="#fff3b0"/>').join('')) },
  creepateria: { a: '#a6f04a', b: '#132b08', art: classScene('lunch', '#17380c', '#6fc22e',
    '<g class="cabob"><path d="M88 62H232C236 104 222 132 200 138H120C98 132 84 104 88 62Z" fill="#231a2c" ' + INKED + '/><path d="M84 52Q160 34 236 52Q240 66 228 66Q226 86 216 82Q210 70 204 68Q198 92 188 86Q184 72 176 70Q166 70 160 72Q154 102 142 92Q140 74 126 72Q116 72 112 80Q104 86 100 66Q80 68 84 52Z" fill="#a6f04a" ' + INKED + '/><circle cx="182" cy="50" r="14" fill="#fff" ' + INKED + '/><circle cx="178" cy="50" r="7" fill="#ff1f8f" stroke="#14101a" stroke-width="2"/><circle cx="176" cy="50" r="3" fill="#14101a"/><path d="M78 72H64M242 72H256" stroke="#14101a" stroke-width="9" stroke-linecap="round"/></g><path d="M122 58L92 10" stroke="#14101a" stroke-width="11" stroke-linecap="round"/><path d="M122 58L92 10" stroke="#c0c6d8" stroke-width="5" stroke-linecap="round"/><g fill="#d6ff9c" stroke="#14101a" stroke-width="2.500"><circle class="cabubble" cx="146" cy="36" r="7"/><circle class="cabubble two" cx="214" cy="30" r="5"/><circle class="cabubble three" cx="232" cy="42" r="8"/></g><path d="M0 150L0 136Q40 124 70 142Q60 148 50 150ZM320 150V132Q282 124 256 144Q266 148 276 150Z" fill="#14101a"/>') },
  madscience: { a: '#6fe3ff', b: '#0c0b3a', art: classScene('lab', '#14124f', '#19b7e8',
    '<path d="M40 14L22 56H38L24 92L66 44H48L62 14Z" fill="#fff06a" ' + INKED + '/><path d="M272 34L258 66H272L260 96L296 56H280L292 34Z" fill="#fff06a" ' + INKED + '/><g class="cabob"><path d="M142 14H178V52C206 66 222 86 220 106C218 128 194 140 160 140C126 140 102 128 100 106C98 86 114 66 142 52Z" fill="#eafcff" fill-opacity=".85" ' + INKED + '/><path d="M104 96Q132 84 160 96T216 96C220 124 196 136 160 136C124 136 100 124 104 96Z" fill="#ff4fa8" stroke="#14101a" stroke-width="2.500"/><rect x="136" y="8" width="48" height="11" rx="4" fill="#fff" ' + INKED + '/><path d="M122 80C126 72 132 66 140 62" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/></g><g fill="#ffd0e8" stroke="#14101a" stroke-width="2"><circle class="cabubble" cx="146" cy="112" r="7"/><circle class="cabubble two" cx="176" cy="118" r="5"/><circle class="cabubble three" cx="160" cy="100" r="4"/></g>') },
  casketball: { a: '#ffa04d', b: '#2c1004', art: classScene('ball', '#3b1606', '#f2761b',
    '<g ' + INKED + '><path d="M206 8H262L284 40L268 112H200L184 40Z" fill="#ff1f8f"/><path d="M212 18H256L272 42L258 102H210L196 42Z" fill="#b80e63"/><path d="M212 74H256V96H212Z" fill="none" stroke="#fff6fb" stroke-width="3"/><path d="M204 96H264" fill="none" stroke="#ff8c1a" stroke-width="7"/><path d="M210 100L220 134H248L258 100M222 100L228 134M246 100L240 134M214 116H254" fill="none" stroke="#fff6fb" stroke-width="2.200"/></g><path d="M36 136Q72 40 150 40" fill="none" stroke="#fff3b0" stroke-width="4" stroke-dasharray="3 11" stroke-linecap="round"/><g class="cabob"><circle cx="134" cy="66" r="34" fill="#ff8c1a" ' + INKED + '/><path d="M100 66H168M134 32V100M110 42Q126 66 110 90M158 42Q142 66 158 90" fill="none" stroke="#14101a" stroke-width="3"/><path d="M114 48Q120 40 128 38" fill="none" stroke="#ffd9a8" stroke-width="4" stroke-linecap="round"/></g>') },
};
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
    art.innerHTML = look.art;
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
const CLASS_KIDS = [['#17101c', ''], ['#f08fb4', 'scarf'], ['#35dcc8', 'horns'], ['#a0392a', ''], ['#6a1f86', 'ears'], ['#f4d35e', 'bow'], ['#19b7e8', ''], ['#5a2c17', 'scarf']];
const classKids = (): string => '<svg viewBox="0 0 900 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect y="88" width="900" height="32" fill="#7a4a21"/><rect y="88" width="900" height="6" fill="#a8703a"/>' + CLASS_KIDS.map(([hair, extra], i) => {
  const x = 62 + i * 112, line = 'stroke="#14101a" stroke-width="3" stroke-linejoin="round"';
  const add = extra === 'horns' ? '<path d="M-24 -30L-34 -56L-12 -42ZM24 -30L34 -56L12 -42Z" fill="#fff6e6" ' + line + '/>' : extra === 'ears' ? '<path d="M-24 -30L-30 -60L-8 -42ZM24 -30L30 -60L8 -42Z" fill="' + hair + '" ' + line + '/>' : '';
  const top = extra === 'bow' ? '<path d="M0 -46L-22 -60V-34ZM0 -46L22 -60V-34Z" fill="#ff1f8f" ' + line + '/>' : '';
  const raised = i === 2 ? '<g class="kidhand"><path d="M34 40L52 -38" stroke="#14101a" stroke-width="16" stroke-linecap="round"/><path d="M34 40L52 -38" stroke="#c9f4d8" stroke-width="10" stroke-linecap="round"/></g>' : '';
  const head = extra === 'scarf' ? '<path d="M-31 40C-36 -30 -22 -50 0 -50C22 -50 36 -30 31 40Z" fill="' + hair + '" ' + line + '/><path d="M-18 -36C-8 -42 8 -42 18 -36M-24 -10C-10 -2 10 -2 24 -10" fill="none" stroke="#14101a" stroke-opacity=".35" stroke-width="2"/>' : '<circle cy="-10" r="33" fill="' + hair + '" ' + line + '/><path d="M-14 -34C-8 -18 -12 6 -18 16M6 -38C12 -18 10 6 14 18" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="3"/>';
  return '<g transform="translate(' + x + ' 64)"><g class="kid" style="animation-delay:' + (i * .45) + 's">' + raised + '<path d="M-44 60C-44 26 -24 18 0 18C24 18 44 26 44 60Z" fill="' + ['#2c2436', '#6a1f86', '#14101a', '#b80e63'][i % 4] + '" ' + line + '/>' + add + head + top + '</g></g>';
}).join('') + '<rect y="104" width="900" height="16" fill="#5e3616"/></svg>';
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
  const poster = el('div', { cls: 'roomposter', 'aria-hidden': 'true' }); poster.innerHTML = look.art;
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
