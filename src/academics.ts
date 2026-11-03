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
const classKey = (): string => 'classes.' + (isAdmin() ? 'fang' : signedInId() || 'guest');
const classesDone = (): Record<string, number> => store.get<Record<string, number>>(classKey(), {});
function classRoomFocus(): void {
  const room = $('#classRoom');
  room.querySelector<HTMLElement>('h3')?.focus();
  room.scrollIntoView({ block: 'start' });
}
function renderClasses(): void {
  const room = $('#classRoom'), done = classesDone(), finished = CLASSES.filter(c => c.id in done).length;
  room.textContent = '';
  room.append(el('p', { cls: 'classtally', text: finished + ' of ' + CLASSES.length + ' classes finished' }));
  room.append(el('div', { cls: 'classgrid' }, ...CLASSES.map(c => el('button', { cls: 'classcard' + (c.id in done ? ' classdone' : ''), type: 'button', onclick() { openLesson(c, 0); } },
    el('small', { text: c.period === 'Lunch' ? 'Lunch' : c.period + ' period' }), el('strong', { text: c.name }), el('span', { text: c.blurb }),
    el('em', { text: c.id in done ? 'Finished: ' + done[c.id] + ' of ' + c.quiz.length : 'Start the lesson' })))));
}
function classHeader(c: SchoolClass, step: string): HTMLElement {
  return el('div', { cls: 'classhead' }, el('button', { cls: 'linkish', type: 'button', onclick() { renderClasses(); classRoomFocus(); } }, 'All classes'), el('small', { text: c.name + ': ' + step }));
}
/* The quiz only opens from the last page of the lesson. */
function openLesson(c: SchoolClass, page: number): void {
  const room = $('#classRoom'), [title, text] = c.lesson[page], last = page === c.lesson.length - 1;
  room.textContent = '';
  const row = el('div', { cls: 'row' });
  if (page) row.append(el('button', { cls: 'pill ghost', type: 'button', onclick() { openLesson(c, page - 1); } }, 'Back'));
  row.append(el('button', { cls: 'pill', type: 'button', onclick() { if (last) openQuiz(c); else openLesson(c, page + 1); } }, last ? 'Take the quiz' : 'Next'));
  room.append(el('section', { cls: 'panel classpanel' }, classHeader(c, 'lesson ' + (page + 1) + ' of ' + c.lesson.length),
    el('div', { cls: 'progress' }, el('i', { style: 'width:' + ((page + 1) / c.lesson.length * 100) + '%' })),
    el('h3', { tabindex: '-1', text: title }), el('p', { cls: 'classtext', text }), row));
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
      feedback.append(el('p', { text: (isRight ? 'Correct! ' : 'Not quite. ') + q.why }), el('button', { cls: 'pill', type: 'button', onclick() { if (final) finish(); else { at++; ask(); } } }, final ? 'See my result' : 'Next question'));
      feedback.querySelector('button')?.focus();
    } }, t)));
    room.append(el('section', { cls: 'panel classpanel' }, classHeader(c, 'quiz question ' + (at + 1) + ' of ' + c.quiz.length),
      el('div', { cls: 'progress' }, el('i', { style: 'width:' + (at / c.quiz.length * 100) + '%' })),
      el('h3', { cls: 'q', tabindex: '-1', text: q.q }), opts, feedback));
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
    room.append(el('section', { cls: 'panel classpanel' }, classHeader(c, 'result'),
      el('h3', { tabindex: '-1', text: passed ? 'Class finished!' : 'Not quite there' }),
      el('p', { cls: 'classtext', text: 'You got ' + right + ' out of ' + c.quiz.length + '. ' + (passed ? (firstTime ? 'You earned ' + CLASS_BONES + ' bones.' : 'Nicely done.') : 'You need ' + PASS_MARK + ' to finish this class.') }), row));
    classRoomFocus();
  };
  ask();
}
