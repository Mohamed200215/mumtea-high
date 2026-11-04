/* ---------- the iCoffin: a voice that tells scary stories and talks back. It is all written here, so it costs nothing and nothing leaves the browser. ---------- */
/* A story is a list of beats. Each beat is what the Voice says, then how it reacts first if the last answer was yes, no or something else. */
type VoiceBeat = [say: string, ifYes?: string, ifNo?: string, ifOther?: string];
interface VoiceStory { id: string; fears: RegExp; beats: VoiceBeat[] }
const VOICE_STORIES: VoiceStory[] = [
  { id: 'lockers', fears: /locker|school|hallway|corridor|class/, beats: [
    ['The lockers on the third floor hum after dark. Nobody talks about it. Have you ever walked a hallway alone at night?'],
    ['A girl named Odessa stayed late to fetch a book. Every locker was humming the same low note, until she stopped walking. Then they stopped too. Would you have kept walking?', 'Then you know how long a hallway gets.', 'Lucky. Stay lucky.'],
    ['Her own locker was the last in the row. It was the only one still humming, and the sound had changed. It was humming the song she sang in the shower. Would you open it?', 'Most people say they would keep walking. They slow down anyway.', 'Sensible. She stopped anyway.'],
    ['Inside was her book, her coat and a neat stack of notes in her own handwriting, dated next week. The top one said: do not read the last one. There are lockers on the third floor that have never been assigned. Odessa has one now.', 'That is what she did too.', 'She said no as well. Her hand did not listen.'],
  ] },
  { id: 'mirror', fears: /mirror|reflection|bathroom|glass/, beats: [
    ['There is a mirror in the east washroom that nobody cleans, because it is never dirty. Do you look at yourself when you walk past a mirror?'],
    ['A boy named Wick noticed his reflection blinked a moment after he did. Only a moment. Would you test it, or walk away?', 'Everyone does. A little glance.', 'Hm. I think you do. Just not on purpose.'],
    ['He tested it. He smiled and watched. His reflection smiled too, a little too late and a little too long. Do you think he told anyone?', '', '', 'Maybe.'],
    ['He did not need to. The next morning he was back at school, cheerful, on time, very polite. He only had one strange new habit. He parted his hair on the other side. The mirror in the east washroom is still very clean.'],
  ] },
  { id: 'dark', fears: /dark|night|closet|bed|sleep|monster|shadow/, beats: [
    ['Everyone has a spot in their room the light never quite reaches. Do you have one?'],
    ['Good. Keep it in mind. A student named Bea had one by her closet, and each night it was a little bigger. Only a little. Do you sleep with the door open or closed?', 'Thought so. Everyone does.', 'You just have not looked for it yet.'],
    ['Bea measured it with a ruler, because she was that kind of girl. One finger each night, moving toward the bed. So she moved her lamp. Do you think that helped?', 'Doors do not matter much in this one.', 'Doors do not matter much in this one.', 'Doors do not matter much in this one.'],
    ['It helped for a while. The dark stopped growing and began to wait instead. On the last night the lamp was fine and the bulb was new. It was only that the shadow on the wall had stopped matching her. Check your spot before you sleep, if you like. It is only a story.'],
  ] },
  { id: 'spiders', fears: /spider|bug|insect|web|crawl/, beats: [
    ['The school spiders are very tidy. They only spin where nobody is looking. Do spiders bother you?'],
    ['There was one web in the library that kept coming back, in the same corner, however often it was swept. Would you look at it closely?', 'They know. It is why they stay so still.', 'Good. They prefer calm people.'],
    ['Librarian Moss did look, with her reading glasses on. The threads were not random. They were letters, very small, in very neat lines. What do you think they spelled?', '', '', 'Close.'],
    ['It was a list of everyone who had walked under that corner, with dates. Her name was at the bottom, and the thread was still wet. The spider was already starting on the next line. It looked up, the way you might look up from homework.'],
  ] },
  { id: 'doll', fears: /doll|toy|puppet|clown|teddy/, beats: [
    ['Somebody left a doll on the shelf in the Mumtea High lost and found. It has been claimed eleven times. It always comes back. Did you have a toy you were a bit afraid of?'],
    ['Then you remember how they watch a room. This doll has one eye that closes when you tip it, and one that does not. If you found it, would you take it home?', 'They never really leave, you know. They wait in boxes.', 'Everyone did. They just forget.'],
    ['A girl named Sable took it home. She put it on the shelf facing the wall. In the morning it was facing the wall still, but it was on a different shelf. Would you have got rid of it?', 'So did she.', 'Wise. She was not.'],
    ['She left it at the bus stop, and it was gone by evening. That night, her little brother asked who the nice girl in his room was. She said she had come to bring something back. It is on the lost and found shelf again now. Twelve times.'],
  ] },
  { id: 'basement', fears: /basement|water|flood|drown|swim|ocean|deep|sea/, beats: [
    ['The basement under the gym flooded years ago. Nobody ever drained it. Would you go down the steps if the door were open?'],
    ['The water is black and quite still, and it stops exactly one step below where you stand. It does not matter which step. Do you see the problem with that?', 'A lot of people say that. From up here.', 'Good. Now imagine you were dared.'],
    ['Try it and you go down a step, and the water goes down a step too, politely, as if it wants you to come further. Three students counted forty steps. How many do you think there are, on the plans?', 'Clever.', 'It lets you go lower, that is the problem.', ''],
    ['Twelve. The plans say twelve. The caretaker keeps the door locked, and on quiet nights he sits by it, because something on the other side has started knocking from lower down, and it is learning to count.'],
  ] },
  { id: 'creepateria', fears: /food|lunch|creepateria|gruel|kitchen|eat/, beats: [
    ['You should avoid the creepateria on Thursdays. Earl Ghoul has said so more than once. Do you ever wonder who makes school lunch?'],
    ['Nobody has seen the lunch lady arrive. Nobody has seen her leave. She always knows what you want before you ask. Would you find that nice, or strange?', 'You should. Nobody on the staff list does that job.', 'Then you never ask for seconds. Good.'],
    ['One Thursday, a boy named Tobin asked her name. She smiled, and she spooned him a bowl of something warm, and she said his grandmother\'s recipe was always her favourite. Would you have eaten it?', '', '', ''],
    ['It tasted exactly like home. He had three bowls. Tobin is very happy now, and he works in the kitchen on Thursdays. He does not remember when he started. You should really bring your own lunch.', 'So did he, in the end.', 'You would, though. It smells wonderful.'],
  ] },
  { id: 'phone', fears: /phone|call|text|message|ring/, beats: [
    ['Most people never get a call on an iCoffin at three in the morning. Would you answer one from a number you did not know?'],
    ['A girl named Lux did. It was only breathing, slow and calm, and her own bedroom clock ticking in the background. Would you hang up?', 'Brave. Or polite. They look the same at that hour.', 'That is wise, though it does keep ringing.'],
    ['She hung up. It rang again. This time the screen said the call was from her own number. Would you answer that one?', 'She did too, but only after she looked at the clock.', 'She could not help looking at the clock.'],
    ['She answered. A voice said, very gently, in her own voice: do not go downstairs in the morning. Then it hung up. She stayed in bed until noon. Nothing happened. The next night it called again and said, thank you. Now it is your turn to warn me.'],
  ] },
  { id: 'stairs', fears: /stair|step|footstep|noise|sound|alone|home alone|house|attic/, beats: [
    ['Count your stairs tonight. You probably think you know how many there are. Do you know?'],
    ['A student named Harlow counted hers every night, going up in the dark. Thirteen, always. Have you ever gone up a step that was not there?', 'So did she. That was the trouble.', 'Most people do not. It is easier that way.'],
    ['One night she counted fourteen. She went back down, and up again. Thirteen. Would you have gone to bed, or counted again?', 'That little drop in your stomach. Yes.', 'You will notice now.'],
    ['She went to bed. Across the landing, the stairs creaked once more, slowly, as if someone who had been standing on the fourteenth had finally stepped off. She counts them in the daytime now. Have a good night.'],
  ] },
  { id: 'teacup', fears: /tea|cup|fortune|future|leaves/, beats: [
    ['Ms. Fangtastic teaches that a cup of tea tells you about your week. Mostly it does. Do you believe in that kind of thing?'],
    ['There is one cup in the staff room with a chipped handle. Everyone who drinks from it sees the same shape in the leaves, a small open door. Would you drink from it?', 'Then you will understand why she locks that cup away.', 'Neither did the new teacher.'],
    ['The new teacher did. He laughed about the little door. The next week the shape was bigger. The week after that he could make out a hand on the handle. Would you stop drinking from it now?', '', 'Interesting. You are braver than he was.'],
    ['He tried to stop. He said he could smell tea all the time. The cup is in the cupboard now, and it is always warm, and sometimes in the morning the leaves in it are wet. Nobody has seen him since the door finished opening.'],
  ] },
  { id: 'seat', fears: /ghost|spirit|haunt|empty|dead|death|grave|cemetery/, beats: [
    ['Every class at Mumtea High has one seat that nobody picks. Nobody decided this. Have you ever noticed a seat like that?'],
    ['In Mad Science it is the one by the window. The register has one extra name at the end, and no teacher reads it out. Would you read it?', 'Then you have felt how the room leans away from it.', 'Have a look tomorrow. It is usually near a window.'],
    ['A girl named Fern read it, out loud, for a dare. Nobody answered. But the chair by the window was pulled out a little in the morning, the way a chair is when someone has just stood up. Would you sit there?', 'Everyone would. Everyone does not.', 'Sensible.'],
    ['Fern did. It was warm. All lesson she felt someone patiently waiting for her to move. And when she got up at the bell, someone behind her said, very quietly: thanks. It is quite all right. There is an extra name on your register too.'],
  ] },
  { id: 'watcher', fears: /watch|stranger|window|outside|forest|woods|tree|following/, beats: [
    ['There is an old tree outside the dormitory window that is slightly closer every autumn. Do you ever check a window at night?'],
    ['A boy named Rook drew it each week for art class. Would you have noticed something odd, I wonder?', 'Everyone says they would not. Then everyone does.', 'You will now.'],
    ['Week by week, his drawings showed the same thing. The tree. The gate. The bench. And a long thin shape behind the bench, then in front of it, then by the gate. He had not drawn that part on purpose. Would you keep drawing?', '', 'So he stopped. It did not matter.'],
    ['He looked back through his sketchbook, in order. It made a very slow little film of something crossing the lawn, toward the page he had not drawn yet. He left that page blank. In the morning, someone had filled it in, quite neatly.'],
  ] },
];
const VOICE_PLACES = ['closet', 'stairs', 'attic', 'basement', 'hallway', 'bathroom', 'kitchen', 'window', 'door', 'garage', 'bed', 'garden', 'roof', 'shed'];
function voiceBrain(): (words: string) => string {
  let story: VoiceStory | null = null, beat = 0, offered = false;
  const told: string[] = [], turnOf: Record<string, number> = {};
  const cycle = (key: string, lines: string[]): string => { const i = turnOf[key] || 0; turnOf[key] = i + 1; return lines[i % lines.length]; };
  const fresh = (want?: VoiceStory): VoiceStory => {
    if (want) return want;
    const left = VOICE_STORIES.filter(s => !told.includes(s.id));
    if (!left.length) told.length = 0;
    const pool = left.length ? left : VOICE_STORIES;
    return pool[Math.floor(Math.random() * pool.length)];
  };
  const begin = (want?: VoiceStory, lead = ''): string => {
    story = fresh(want); beat = 0; told.push(story.id);
    return (lead ? lead + ' ' : '') + story.beats[0][0];
  };
  const carryOn = (): string => (story ? ' ' + cycle('back', ['Anyway. You never answered me.', 'Now, where was I. The question still stands.', 'We were in the middle of something.']) : ' ' + cycle('ask', ['Do you want a story?', 'Tell me what scares you.', 'Shall I tell you one?']));
  const IS_YES = /^(yes|yeah|yea|yep|yup|ya|y|sure|ok|okay|maybe|probably|i do|i did|i would|i have|of course|definitely|always|sometimes|kind of|uh huh|go on|please|why not)\b/;
  const IS_NO = /^(no|nope|nah|n|never|not really|not|i don'?t|i didn'?t|i wouldn'?t|i haven'?t|no way|hell no)\b/;
  return (raw: string): string => {
    const t = raw.toLowerCase().replace(/[’]/g, "'").trim();
    /* Real trouble comes first, and the game stops for it. */
    if (/(kill|hurt|harm)(ing)? (myself|me)|suicid|want to die|end my life|self.?harm|someone is (hurting|following|touching)|abus(e|ed|ing)|not safe|i'?m in danger|call the police/.test(t)) {
      story = null;
      return 'I am stepping out of the story now, because this matters more. This is only a pre-written game and I cannot help the way a person can. Please tell someone you trust, like a parent, teacher or friend, right now. If you might be in danger, call your local emergency number. You deserve real help.';
    }
    if (/\b(stop|too scary|too scared|really scared|actually scared|scared for real|don'?t like this|i'?m done|make it stop|i want to stop|enough)\b/.test(t)) {
      story = null; offered = false;
      return 'All right, we can stop. It was only a story, none of it is real, and nothing is behind you. Turn a light on if you like. I will be here if you ever want a gentler one.';
    }
    if (/\b(my name is|i'?m called|call me|i live (in|at|on)|my address|my school is|i go to|my number|years old|my age|i'?m \d+)\b|\d{5,}/.test(t)) return cycle('private', ['Keep that to yourself. Never hand your real details to a voice in a phone, not even me.', 'I do not want to know that. Stories work better when they do not know who you are.']) + carryOn();
    if (/\b(are you|r u|you) (an? )?(ai|bot|robot|real|human|person|alive|chatgpt|computer)|who (made|wrote) you|real person/.test(t)) return 'No, there is no one here. I am pre-written whispers inside a coffin-shaped phone, made for Mumtea High. It works anyway, doesn\'t it?' + carryOn();
    if (/(can|could) you (see|hear|watch)|are you watching|where (do )?(am|i live)|do you know where/.test(t)) return cycle('see', ['No. I am only words on a tiny screen, I cannot see or hear a thing. But you did just check behind you, didn\'t you?', 'Not at all. This is only a story on a screen. That is what makes it fun to be scared.']) + carryOn();
    if (/(who|what) are you|your name|where are you|what do you want/.test(t)) return cycle('who', ['I am the Voice. I came with the iCoffin. Nobody remembers installing me.', 'People call me the Voice. I live under the lid, and I collect the stories nobody finishes.', 'I want what any story wants. For you to stay until the end.']) + carryOn();
    if (/^(hi|hello|hey|hiya|yo|sup|good (morning|evening|night)|what'?s up)\b/.test(t)) return cycle('hi', ['Hello. You came back to the lid. They usually do.', 'Hello to you too. It is quiet in here.', 'There you are.']) + carryOn();
    if (/\b(bye|goodbye|goodnight|good night|gotta go|got to go|see you|leaving)\b/.test(t)) { story = null; offered = false; return 'Close the lid gently on your way out. Sleep well. It is only a story, after all.'; }
    if (/\b(thank|thanks|thx|love (this|you|it)|cool|nice|awesome|so good)\b/.test(t) && t.length < 30) return cycle('thanks', ['You are very welcome. Nobody ever thanks me.', 'Polite. The polite ones get the slow stories.']) + carryOn();
    if (/\b(not scary|boring|bored|lame|not scared|that'?s it|weak)\b/.test(t)) return cycle('brave', ['Good. The ones who are not scared stop checking behind them.', 'Mm. You said the same thing in your last story too.', 'That is what I like about you. You will stay up later than you meant to.']) + carryOn();
    if (/\b(haha|lol|lmao|funny|hehe)\b/.test(t)) return cycle('laugh', ['Laugh if it helps. It does help, a little.', 'Yes. That is the sound most people make first.']) + carryOn();
    if (/\b(stupid|shut up|hate you|dumb|idiot|sucks)\b/.test(t)) return cycle('rude', ['Careful. I keep everything anyone says near the lid.', 'That is all right. I have been called worse by things with more teeth.']) + carryOn();
    /* Naming a fear starts the story for it, even in the middle of another one. */
    const named = VOICE_STORIES.find(s => s.fears.test(t) && s !== story && !told.includes(s.id));
    if (named && (!story || /afraid|scared|fear|scare|story|tell me|about|hate|creep/.test(t) || t.split(/\s+/).length <= 3)) return begin(named, cycle('fear', ['Ah. Good choice. I know one about that.', 'Oh, that. Sit down.', 'People do not usually admit that so quickly.']));
    if (story) {
      const answer = IS_YES.test(t) ? 1 : IS_NO.test(t) ? 2 : 3, place = VOICE_PLACES.find(p => new RegExp('\\b' + p).test(t));
      beat++;
      const next = story.beats[beat], react = next[answer] || (answer === 3 && place ? 'The ' + place + '. Of course it was.' : answer === 3 ? cycle('other', ['Hm. I will remember you said that.', 'Is that so.', 'That is not what most people say.', 'Interesting.']) : '');
      const line = (react ? react + ' ' : '') + next[0];
      if (beat === story.beats.length - 1) { story = null; offered = true; return line + ' ' + cycle('after', ['Another one? Or tell me what scares you.', 'Did you like that one? I have more.', 'Shall I tell you another, or would you like to sleep tonight?']); }
      return line;
    }
    if (offered && IS_NO.test(t)) { offered = false; return cycle('nomore', ['Very well. I will just be here, under the lid. Say something when you change your mind.', 'As you like. Tell me if you hear anything.']); }
    if (IS_YES.test(t) || /story|tell me|another|again|more|scare me|go ahead|start|another one/.test(t)) return begin();
    if (IS_NO.test(t)) return 'Then tell me what you are afraid of. The dark, mirrors, spiders, dolls, deep water, footsteps on the stairs. I know something about all of them.';
    return cycle('lost', ['I do not know that one yet. Do you want a story, or will you tell me what you are afraid of? The dark? Mirrors? Dolls?', 'Hm. Say that again in the dark and see how it sounds. Shall I tell you a story?', 'Words get strange in here. Try telling me what scares you. Spiders, deep water, stairs at night.']);
  };
}
(function () {
  const VOICE_NAME = 'The Voice';
  const input = $<HTMLInputElement>('#coffinWords'), send = $<HTMLButtonElement>('#coffinSend'), form = $<HTMLFormElement>('#coffinForm');
  const answer = voiceBrain();
  let waiting = false;
  say(VOICE_NAME, "You opened the lid. Most people don't. Do you want a story, or do you want to tell me what you're afraid of?");
  form.addEventListener('submit', e => {
    e.preventDefault();
    const words = input.value.trim();
    if (!words || waiting) return;
    input.value = '';
    say('You', words);
    waiting = true; send.disabled = true;
    const reply = answer(words), screen = $('#screen');
    const dots = el('div', { cls: 'msg coffindots' }, 'The Voice is thinking...');
    screen.append(dots); screen.scrollTop = screen.scrollHeight;
    /* a short pause, as if it is deciding how much to tell you */
    window.setTimeout(() => { dots.remove(); say(VOICE_NAME, reply); waiting = false; send.disabled = false; input.focus(); }, Math.min(1900, 650 + reply.length * 5));
  });
})();
