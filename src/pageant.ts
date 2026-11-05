/* ---------- Ghoul of the Year: a beauty pageant judged by published rules ---------- */
GAME_ART.pageant = iconOf('<path d="M14 92L8 34L36 60L60 18L84 60L112 34L106 92Z" fill="#f4d35e" stroke="#14081a" stroke-width="5" stroke-linejoin="round"/><path d="M14 92H106V106H14Z" fill="#ff1f8f" stroke="#14081a" stroke-width="5" stroke-linejoin="round"/><circle cx="60" cy="18" r="8" fill="#ff1f8f" stroke="#14081a" stroke-width="4"/><circle cx="8" cy="34" r="6" fill="#35dcc8" stroke="#14081a" stroke-width="4"/><circle cx="112" cy="34" r="6" fill="#35dcc8" stroke="#14081a" stroke-width="4"/><ellipse cx="60" cy="68" rx="15" ry="13" fill="#fff6fb" stroke="#14081a" stroke-width="3"/><ellipse cx="54" cy="66" rx="4" ry="5" fill="#14081a"/><ellipse cx="66" cy="66" rx="4" ry="5" fill="#14081a"/>');
type PageantStyle = 'glam' | 'street' | 'monster';
type PageantSlot = 'top' | 'bottom' | 'shoes' | 'legs' | 'headwear' | 'neck' | 'back' | 'gloves';
interface PageantOutfit { top: string; bottom: string; shoes: string; legs: string; headwear: string; neck: string; back: string; gloves: string; topC: string; bottomC: string; shoesC: string; trim: string; topP: string; bottomP: string }
const PAGEANT_ITEMS: Record<PageantSlot, Record<PageantStyle, string[]>> = {
  top: { glam: ['corset', 'lacetop', 'peplum', 'ruffle', 'kimono', 'blazer'], street: ['hoodie', 'varsity', 'tee', 'jersey', 'biker', 'sweater'], monster: ['bat', 'coat', 'vest', 'bolero', 'stripey'] },
  bottom: { glam: ['maxi', 'mermaid', 'tulle', 'pleatmaxi', 'rufflemaxi', 'gypsy'], street: ['cargo', 'ripped', 'joggers', 'flares', 'straight', 'track'], monster: ['shred', 'batwing', 'chains', 'leather', 'corsetskirt', 'hilow'] },
  shoes: { glam: ['heels', 'pumps', 'wedge', 'mary', 'bowflats'], street: ['sneaker', 'chunky', 'slides', 'loafers', 'moon'], monster: ['spike', 'batheels', 'creepers', 'hooves', 'combat'] },
  legs: { glam: ['tights', 'sheer', 'lacetop'], street: ['knee', 'slouch', 'ankle', 'stripes'], monster: ['webs', 'bats', 'skull', 'wraps'] },
  headwear: { glam: ['tiara', 'crown', 'pearlband', 'veil', 'flowers'], street: ['cap', 'beanie', 'bucket', 'clip'], monster: ['witch', 'spider', 'cat', 'antennae', 'batears'] },
  neck: { glam: ['pearls', 'gems', 'cameo', 'lariat', 'boa'], street: ['chain', 'tags', 'layered', 'choker', 'scarf'], monster: ['spikes', 'skull', 'bat', 'coffin', 'bone'] },
  back: { glam: ['shawl', 'peacock', 'angel', 'bigbow', 'sash'], street: ['bag', 'teddy', 'guitar', 'longscarf', 'balloons'], monster: ['demon', 'dragon', 'cloak', 'coffin', 'broom'] },
  gloves: { glam: ['opera', 'satin', 'lace'], street: ['fingerless', 'biker', 'short'], monster: ['claws', 'skeleton', 'batgloves'] },
};
const PAGEANT_ROUNDS: Array<{ name: string; style: PageantStyle; brief: string }> = [
  { name: 'Midnight Gala', style: 'glam', brief: 'The red carpet at midnight. The judges want Glam pieces.' },
  { name: 'Street Haunt', style: 'street', brief: 'Y2K streetwear after dark. The judges want Street pieces.' },
  { name: 'Full Monster', style: 'monster', brief: 'Show your true form. The judges want Monster pieces.' },
];
const PAGEANT_SLOTS: PageantSlot[] = ['top', 'bottom', 'shoes', 'legs', 'headwear', 'neck', 'back', 'gloves'];
const PAGEANT_EXTRAS: PageantSlot[] = ['headwear', 'neck', 'back', 'gloves'];
const PAGEANT_EMPTY = ['none', 'bare'];
const PAGEANT_JUDGES: Array<[name: string, label: string, rule: string]> = [
  ['Ms. Fangtastic', 'THEME', 'Does it fit the round? Worn pieces from the round\'s style score. The top, bottom and shoes count double.'],
  ['Madame Palette', 'COLOUR', 'Do the colours work? Top, bottom, shoes and trim are compared. Black, white and grey go with anything. One colour family, or two that sit close together or opposite on the colour wheel, score highest. One pattern adds a point, two take one away.'],
  ['Count Couture', 'COHESION', 'Is it one clear look? The more pieces that share one style, the higher the score. A full mix of styles scores low.'],
  ['Lady Sparkle', 'EXTRAS', 'Is it finished without being too much? Counts headwear, necklace, back piece and hands. None 3, one 6, two 9, three 10, all four 7.'],
  ['Sir Originality', 'ORIGINAL', 'Is it fresh? Starts at 10. Lose 2 for each piece you already wore this pageant, and 1 for each piece a rival is wearing this round.'],
];
const pageantStyleOf = (slot: PageantSlot, id: string): PageantStyle | '' => (['glam', 'street', 'monster'] as PageantStyle[]).find(s => PAGEANT_ITEMS[slot][s].includes(id)) || '';
function pageantHue(hex: string): number {
  const v = parseInt(hex.slice(1), 16), r = (v >> 16 & 255) / 255, g = (v >> 8 & 255) / 255, b = (v & 255) / 255, top = Math.max(r, g, b), low = Math.min(r, g, b), l = (top + low) / 2, d = top - low;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (s < .18 || l < .15 || l > .93) return -1;
  const h = top === r ? ((g - b) / d + 6) % 6 : top === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return h * 60;
}
function pageantColour(o: PageantOutfit): [number, string] {
  const gap = (a: number, b: number): number => { const d = Math.abs(a - b); return Math.min(d, 360 - d); };
  const hues = [o.topC, o.bottomC, o.shoesC, o.trim].map(pageantHue).filter(h => h >= 0), fams: number[] = [];
  hues.forEach(h => { if (!fams.some(f => gap(f, h) < 28)) fams.push(h); });
  let score = 6, why = 'All neutrals: safe, but quiet.';
  if (fams.length === 1) { score = 9; why = 'One colour family held together well.'; }
  else if (fams.length === 2) { const g = gap(fams[0], fams[1]); if (g < 70) { score = 10; why = 'Two neighbouring colours in harmony.'; } else if (g > 145) { score = 10; why = 'Two opposite colours, a bold pairing.'; } else { score = 7; why = 'Two colours that do not quite speak to each other.'; } }
  else if (fams.length === 3) { score = 5; why = 'Three colour families compete for attention.'; }
  else if (fams.length > 3) { score = 3; why = 'Too many colours at once.'; }
  const patterns = [o.topP, o.bottomP].filter(x => x !== 'solid').length;
  if (patterns === 1) { score += 1; why += ' One pattern adds interest.'; }
  if (patterns === 2) { score -= 1; why += ' Two patterns clash.'; }
  return [Math.max(1, Math.min(10, score)), why];
}
/* Every contestant, the player included, goes through this one function. There is no luck in it and no bonus for anyone. */
function pageantScore(o: PageantOutfit, round: number, worn: string[], rivals: PageantOutfit[]): Array<[number, string]> {
  const want = PAGEANT_ROUNDS[round].style, pieces = PAGEANT_SLOTS.filter(s => !PAGEANT_EMPTY.includes(o[s]));
  let hit = 0, all = 0;
  pieces.forEach(s => { const w = s === 'top' || s === 'bottom' || s === 'shoes' ? 2 : 1; all += w; if (pageantStyleOf(s, o[s]) === want) hit += w; });
  const theme = Math.round(1 + 9 * hit / Math.max(1, all));
  const counts: Record<string, number> = {}; pieces.forEach(s => { const st = pageantStyleOf(s, o[s]); counts[st] = (counts[st] || 0) + 1; });
  const most = Math.max(...Object.values(counts)), cohesion = Math.round(1 + 9 * (most / pieces.length - .25) / .75);
  const extras = PAGEANT_EXTRAS.filter(s => !PAGEANT_EMPTY.includes(o[s])).length, sparkle = [3, 6, 9, 10, 7][extras];
  const key = (s: PageantSlot, id: string): string => s + ':' + id;
  const reused = pieces.filter(s => worn.includes(key(s, o[s]))).length, twins = pieces.filter(s => rivals.some(r => r[s] === o[s])).length;
  const fresh = Math.max(1, Math.min(10, 10 - reused * 2 - twins));
  return [
    [theme, hit + ' of ' + all + ' theme points are ' + want + ' pieces.'],
    pageantColour(o),
    [Math.max(1, Math.min(10, cohesion)), most + ' of ' + pieces.length + ' pieces share one style.'],
    [sparkle, extras + (extras === 1 ? ' finishing piece.' : ' finishing pieces.') + (extras === 3 ? ' Exactly right.' : extras === 4 ? ' A little too much.' : extras < 2 ? ' It needs more.' : '')],
    [fresh, reused + ' repeated from earlier, ' + twins + ' also on a rival.'],
  ];
}
const pageantTotal = (rows: Array<[number, string]>): number => rows.reduce((sum, r) => sum + r[0], 0);
const PAGEANT_COLOURS = ['#14101a', '#fff6fb', '#ff1f8f', '#f08fb4', '#6a1f86', '#19b7e8', '#35dcc8', '#8df04a', '#f4d35e', '#c0392b', '#2c2436', '#9aa0ac', '#1f3a8a', '#0f766e', '#ff8c1a', '#c9a227'];
const PAGEANT_PATTERNS: Array<[string, string]> = [['solid', 'Plain'], ['stripes', 'Stripes'], ['skulls', 'Skulls'], ['stars', 'Stars'], ['hearts', 'Hearts'], ['tartan', 'Tartan']];
/* A CPU tries outfits and keeps what the same rules prefer. A sharper CPU simply tries more outfits. */
function pageantCpu(round: number, worn: string[], tries: number): PageantOutfit {
  const any = <T,>(l: T[]): T => l[Math.floor(Math.random() * l.length)], want = PAGEANT_ROUNDS[round].style;
  const piece = (s: PageantSlot): string => {
    if ((s === 'legs' || PAGEANT_EXTRAS.includes(s)) && Math.random() < .3) return s === 'legs' ? 'bare' : 'none';
    return any(PAGEANT_ITEMS[s][Math.random() < .55 ? want : any(['glam', 'street', 'monster'] as PageantStyle[])]);
  };
  const fresh = (): PageantOutfit => ({ top: piece('top'), bottom: piece('bottom'), shoes: piece('shoes'), legs: piece('legs'), headwear: piece('headwear'), neck: piece('neck'), back: piece('back'), gloves: piece('gloves'), topC: any(PAGEANT_COLOURS), bottomC: any(PAGEANT_COLOURS), shoesC: any(PAGEANT_COLOURS), trim: any(PAGEANT_COLOURS), topP: Math.random() < .25 ? any(PAGEANT_PATTERNS)[0] : 'solid', bottomP: 'solid' });
  let best = fresh(), top = pageantTotal(pageantScore(best, round, worn, []));
  for (let i = 0; i < tries; i++) {
    const next = { ...best }, s = any(PAGEANT_SLOTS);
    if (Math.random() < .7) next[s] = piece(s); else { const k = any(['topC', 'bottomC', 'shoesC', 'trim'] as const); next[k] = any(PAGEANT_COLOURS); }
    const got = pageantTotal(pageantScore(next, round, worn, []));
    if (got >= top) { best = next; top = got; }
  }
  return best;
}
(function () {
  const W = 640, H = 360, ZOOM = 2, BOX = { x: -130, y: -60, w: 580, h: 790 }, TICK = 620;
  const CPUS = [{ name: 'Vexa Nightshade', tries: 7 }, { name: 'Opal Bonewhite', tries: 3 }, { name: 'Lunaria Crypt', tries: 0 }];
  const [cv, c] = makeCanvas('Ghoul of the Year pageant stage');
  cv.width = W * ZOOM; cv.height = H * ZOOM; c.scale(ZOOM, ZOOM);
  const songLabel = el('p', { cls: 'pgsong', role: 'status' });
  const rules = el('details', { cls: 'pgrules', open: '' }, el('summary', { text: 'How the judges score' }),
    el('p', { text: 'Five judges each give 1 to 10, so a round is worth up to 50 and the pageant up to 150. Highest total after three rounds wins. If totals tie, the higher Full Monster score wins. Every contestant is scored by the same rules, with no luck involved.' }),
    el('ul', {}, ...PAGEANT_JUDGES.map(([who, label, rule]) => el('li', {}, el('strong', { text: label + ' (' + who + '): ' }), rule)))) as HTMLDetailsElement;
  const room = el('div', { cls: 'pgroom', hidden: '' }), sheet = el('div', { cls: 'pgsheet', hidden: '' });
  const p = makePanel('pageant', 'Ghoul of the Year', 'Three rounds, three categories, three CPU rivals. Dress your character, walk the runway, and watch the judges hold up their scores.', [songLabel, rules, cv, room, sheet], 'Enter the pageant');
  type Mode = 'idle' | 'curtain' | 'walk' | 'pose' | 'side' | 'score' | 'exit' | 'standings' | 'crown' | 'done';
  interface Contestant { name: string; cpu: boolean; tries: number; look: Look; outfit: PageantOutfit; worn: string[]; rows: Array<[number, string]>; total: number; last: number; art: Record<string, HTMLCanvasElement>; shown: number }
  interface Bit { x: number; y: number; vx: number; vy: number; life: number; col: string; size: number }
  let mode: Mode = 'idle', paused = false, looping = false, last = 0, clock = 0, modeT = 0, round = 0, turn = 0, speed = 1, cards = 0, finalBest = 0, roster: Contestant[] = [], order: number[] = [], bits: Bit[] = [], cheer = 0, flashes: Array<[number, number, number]> = [];
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const tools = gameTools(p.root, togglePause);
  const inShow = () => !['idle', 'done'].includes(mode), running = () => inShow() && !!roster.length;
  const stat = () => { const me = roster[0]; p.stat.textContent = (me && mode !== 'idle' ? 'Round ' + (round + 1) + ' of 3  Your total: ' + me.total + '  ' : '') + 'Best: ' + store.get<number>('pageantBest', 0); tools.show(running() && !room.hidden === false, paused); };
  const go = (m: Mode): void => { mode = m; modeT = 0; };
  const holder = (): HTMLElement => cv.parentElement as HTMLElement;

  /* ---------- the soundtrack: 30-second previews from the free iTunes Search API, in their clean versions ---------- */
  interface Song { trackName: string; artistName: string; previewUrl: string; trackViewUrl: string }
  const song = new Audio(); song.volume = .55; song.preload = 'none';
  let songs: Song[] = [], songAt = 0, songsAsked = false, wantSong = false;
  async function askFor(artist: string): Promise<Song[]> {
    const res = await fetch('https://itunes.apple.com/search?term=' + encodeURIComponent(artist) + '&entity=song&limit=50&explicit=No&country=US');
    if (!res.ok) return [];
    const data = await res.json() as { results: Array<Song & { trackExplicitness: string }> };
    return data.results.filter(r => r.previewUrl && r.artistName.startsWith(artist) && r.trackExplicitness !== 'explicit' && !/\b(wap|interlude|instrumental|intro|skit)\b/i.test(r.trackName));
  }
  function showSong(): void {
    songLabel.textContent = '';
    const now = songs[songAt];
    if (!wantSong) return;
    if (!now) { songLabel.append('Playing the school\'s own beat.'); return; }
    const link = el('a', { href: now.trackViewUrl, target: '_blank', rel: 'noopener' }, now.trackName + ' by ' + now.artistName);
    songLabel.append('Now playing: ', link, '. 30-second preview from Apple Music. ', el('button', { cls: 'linkish', type: 'button', onclick() { nextSong(); } }, 'Next song'));
  }
  function applySong(): void {
    const on = wantSong && musicAllowed() && !paused && !!songs.length && !document.hidden;
    musicHold(!!songs.length && wantSong);
    if (on) { if (!song.src) song.src = songs[songAt].previewUrl; song.play().catch(() => {}); } else song.pause();
    showSong();
  }
  function nextSong(): void { if (!songs.length) return; songAt = (songAt + 1) % songs.length; song.src = songs[songAt].previewUrl; applySong(); }
  song.addEventListener('ended', nextSong);
  song.addEventListener('error', () => { if (songs.length && wantSong && song.src) nextSong(); });
  async function startSongs(): Promise<void> {
    wantSong = true; applySong();
    if (songsAsked) return;
    songsAsked = true;
    try {
      const [a, b] = await Promise.all([askFor('Latto'), askFor('Cardi B')]);
      const mix = (l: Song[]): Song[] => l.map(s => [Math.random(), s] as [number, Song]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
      const one = mix(a), two = mix(b), both: Song[] = [];
      while (one.length || two.length) { const s = one.shift(), t = two.shift(); if (s) both.push(s); if (t) both.push(t); }
      songs = both; songAt = 0; if (songs.length) song.src = songs[0].previewUrl;
    } catch { songs = []; }
    applySong();
  }
  function stopSongs(): void { wantSong = false; song.pause(); musicHold(false); songLabel.textContent = ''; }
  document.addEventListener('soundchange', applySong);
  document.addEventListener('visibilitychange', applySong);

  /* ---------- the dressing room ---------- */
  const SLOT_NAMES: Record<PageantSlot, string> = { top: 'Top', bottom: 'Bottom', shoes: 'Shoes', legs: 'Legs', headwear: 'Headwear', neck: 'Necklace', back: 'Back', gloves: 'Hands' };
  const STYLE_NAMES: Record<PageantStyle, string> = { glam: 'Glam', street: 'Street', monster: 'Monster' };
  const nameOf = (slot: PageantSlot, id: string): string => { for (const page of WARDROBE) if (page.key === slot) { const hit = page.items?.find(i => i[0] === id); if (hit) return hit[1]; } return id; };
  let slotNow: PageantSlot = 'top', draft: PageantOutfit | null = null;
  const dressed = (look: Look, o: PageantOutfit): Look => ({ ...look, ...o, hold: 'none', pet: 'none', pose: 'relaxed', legsC: o.trim, gloveC: o.trim });
  function openRoom(): void {
    const me = roster[0], R = PAGEANT_ROUNDS[round];
    holder().hidden = true; room.hidden = false; rules.open = false; stat();
    if (!draft) draft = { top: 'blazer', bottom: 'straight', shoes: 'flats', legs: 'bare', headwear: 'none', neck: 'none', back: 'none', gloves: 'none', topC: '#6a1f86', bottomC: '#14101a', shoesC: '#14101a', trim: '#ff1f8f', topP: 'solid', bottomP: 'solid' };
    const o = draft;
    room.textContent = '';
    const picture = el('div', { cls: 'pgdoll' }), set = (fn: () => void): void => { fn(); draw(); };
    const tabs = el('div', { cls: 'chips', role: 'group', 'aria-label': 'Choose what to change' }), body = el('div', { cls: 'pgpieces' });
    function draw(): void {
      picture.innerHTML = drawGhoul(dressed(me.look, o), { pose: POSES.find(x => x.id === 'hips'), box: [BOX.x, BOX.y, BOX.w, BOX.h].join(' ') });
      tabs.textContent = '';
      PAGEANT_SLOTS.forEach(s => tabs.append(el('button', { cls: 'chip', type: 'button', 'aria-pressed': s === slotNow, 'data-slot': s, onclick() { slotNow = s; draw(); } }, SLOT_NAMES[s])));
      body.textContent = '';
      if (PAGEANT_EMPTY.length && !['top', 'bottom', 'shoes'].includes(slotNow)) { const none = slotNow === 'legs' ? 'bare' : 'none'; body.append(el('div', { cls: 'wrow' }, el('span', { text: 'Nothing' }), el('button', { cls: 'wchip', type: 'button', 'aria-pressed': o[slotNow] === none, onclick() { set(() => { o[slotNow] = none; }); } }, slotNow === 'legs' ? 'Bare' : 'None'))); }
      (['glam', 'street', 'monster'] as PageantStyle[]).forEach(st => body.append(el('div', { cls: 'wrow' + (st === R.style ? ' pgwant' : '') }, el('span', { text: STYLE_NAMES[st] + (st === R.style ? ' (this round)' : '') }), ...PAGEANT_ITEMS[slotNow][st].map(id => { const worn = me.worn.includes(slotNow + ':' + id); return el('button', { cls: 'wchip' + (worn ? ' pgworn' : ''), type: 'button', title: worn ? 'You wore this earlier. It costs Original points.' : '', 'data-piece': slotNow + ':' + id, 'aria-pressed': o[slotNow] === id, onclick() { set(() => { o[slotNow] = id; }); } }, nameOf(slotNow, id) + (worn ? ' (worn)' : '')); }))));
      const swatch = (label: string, key: 'topC' | 'bottomC' | 'shoesC' | 'trim'): HTMLElement => el('div', { cls: 'wrow' }, el('span', { text: label }), ...PAGEANT_COLOURS.map(col => { const b = el('button', { cls: 'wswatch', type: 'button', 'aria-label': label + ' colour ' + col, 'aria-pressed': o[key] === col, onclick() { set(() => { o[key] = col; }); } }); b.style.background = col; return b; }));
      if (slotNow === 'top') { body.append(swatch('Top colour', 'topC'), swatch('Trim', 'trim'), el('div', { cls: 'wrow' }, el('span', { text: 'Pattern' }), ...PAGEANT_PATTERNS.map(([id, name]) => el('button', { cls: 'wchip', type: 'button', 'aria-pressed': o.topP === id, onclick() { set(() => { o.topP = id; }); } }, name)))); }
      if (slotNow === 'bottom') { body.append(swatch('Bottom colour', 'bottomC'), el('div', { cls: 'wrow' }, el('span', { text: 'Pattern' }), ...PAGEANT_PATTERNS.map(([id, name]) => el('button', { cls: 'wchip', type: 'button', 'aria-pressed': o.bottomP === id, onclick() { set(() => { o.bottomP = id; }); } }, name)))); }
      if (slotNow === 'shoes') body.append(swatch('Shoe colour', 'shoesC'));
    }
    const walk = el('button', { cls: 'pill pgwalk', type: 'button', onclick() { startRound(); } }, 'Walk the runway');
    room.append(el('h4', { text: 'Round ' + (round + 1) + ': ' + R.name }), el('p', { text: R.brief }), el('div', { cls: 'pgdress' }, picture, el('div', { cls: 'pgside' }, tabs, body, walk)));
    draw(); room.scrollIntoView({ block: 'nearest' });
  }

  /* ---------- the stage ---------- */
  const faces: HTMLCanvasElement[] = [], backs: HTMLCanvasElement[] = [];
  let stage: HTMLCanvasElement | null = null, asked = false;
  function askCrowd(): void {
    if (asked) return;
    asked = true;
    schoolCrowd(12).forEach(person => spriteFromSvg(drawGhoul(person, { head: true }), 60, 60, a => { faces.push(a); stage = null; }));
    schoolCrowd(10).forEach(person => spriteFromSvg(drawGhoulBack(person), 192, 168, a => { backs.push(a); stage = null; }));
  }
  function buildStage(): void {
    const s = document.createElement('canvas'); s.width = W * ZOOM; s.height = H * ZOOM;
    const t = s.getContext('2d') as CanvasRenderingContext2D; t.scale(ZOOM, ZOOM);
    t.fillStyle = '#0a0416'; t.fillRect(0, 0, W, H);
    /* the balconies on each side */
    for (let row = 0; row < 5; row++) for (let i = 0; i < 6; i++) for (const side of [0, 1]) {
      const x = side ? W - 26 - i * 22 : 4 + i * 22, y = 56 + row * 22 + i * 3, a = faces[(i * 3 + row * 5 + side * 7) % Math.max(1, faces.length)];
      if (a) { t.globalAlpha = .75; t.drawImage(a, x, y, 22, 22); t.globalAlpha = 1; }
    }
    /* velvet curtains behind the stage */
    for (let i = 0; i < 22; i++) { t.fillStyle = i % 2 ? '#52112f' : '#3a0c28'; t.fillRect(142 + i * 16, 40, 16, 140); }
    t.fillStyle = '#2c1140'; t.fillRect(142, 40, 356, 10);
    /* the marquee */
    t.fillStyle = '#14081a'; t.fillRect(150, 4, 340, 40); t.strokeStyle = '#ff1f8f'; t.lineWidth = 3; t.strokeRect(150, 4, 340, 40);
    t.font = '30px ' + DISPLAY_FONT; t.textAlign = 'center'; t.fillStyle = '#ff8cc8'; t.fillText('GHOUL OF THE YEAR', W / 2, 35);
    /* the stage floor and runway */
    t.fillStyle = '#1b0c28'; t.fillRect(0, 178, W, H - 178);
    t.fillStyle = '#2c1140'; t.fillRect(128, 172, 384, 14);
    t.fillStyle = '#ff1f8f'; t.beginPath(); t.moveTo(278, 172); t.lineTo(362, 172); t.lineTo(450, 300); t.lineTo(190, 300); t.closePath(); t.fill();
    t.strokeStyle = '#f4d35e'; t.lineWidth = 2.5; t.stroke();
    t.fillStyle = '#c80f72'; for (let i = 1; i < 6; i++) t.fillRect(278 - i * 15, 172 + i * 21, 84 + i * 30, 2);
    /* the judges' table */
    t.fillStyle = '#14081a'; t.fillRect(196, 312, 444, 48);
    t.fillStyle = '#ff1f8f'; t.fillRect(196, 310, 444, 6);
    for (let i = 0; i < 5; i++) { t.fillStyle = '#fff6fb'; t.fillRect(judgeX(i) - 37, 328, 74, 16); t.fillStyle = '#14081a'; t.font = '800 10px Nunito, sans-serif'; t.textAlign = 'center'; t.fillText(PAGEANT_JUDGES[i][1], judgeX(i), 340); }
    /* the front row, on the left of the table */
    for (let i = 0; i < 3; i++) { const a = backs[i % Math.max(1, backs.length)]; if (a) t.drawImage(a, i * 64 - 18, 286, 96, 84); }
    const v = t.createRadialGradient(W / 2, H / 2, H * .46, W / 2, H / 2, W * .68); v.addColorStop(0, 'rgba(6,0,14,0)'); v.addColorStop(1, 'rgba(6,0,14,.6)'); t.fillStyle = v; t.fillRect(0, 0, W, H);
    stage = s;
  }
  const judgeX = (i: number): number => 244 + i * 84;
  function bake(person: Contestant, ready?: () => void): void {
    const look = dressed(person.look, person.outfit), box = [BOX.x, BOX.y, BOX.w, BOX.h].join(' ');
    let left = 2;
    const one = (name: string, pose: string): void => spriteFromSvg(drawGhoul(look, { pose: POSES.find(x => x.id === pose), box }), 290, 395, a => { person.art[name] = a; if (--left === 0) ready?.(); });
    one('walk', 'hips'); one('pose', 'wave');
  }
  function sprite(a: HTMLCanvasElement | undefined, x: number, feet: number, tall: number, rot = 0): void {
    if (!a) return;
    const s = tall / 720;
    c.save(); c.translate(x, feet - tall * .5); c.rotate(rot); c.drawImage(a, (BOX.x - 160) * s, (BOX.y - 360) * s, BOX.w * s, BOX.h * s); c.restore();
  }

  /* ---------- running a round ---------- */
  function startRound(): void {
    const me = roster[0];
    me.outfit = { ...(draft as PageantOutfit) }; room.hidden = true; holder().hidden = false; sheet.hidden = true;
    roster.slice(1).forEach(r => { r.outfit = pageantCpu(round, r.worn, r.tries); });
    roster.forEach(r => { r.rows = pageantScore(r.outfit, round, r.worn, roster.filter(x => x !== r).map(x => x.outfit)); r.shown = 0; });
    order = [1, 2, 3].sort(() => Math.random() - .5).concat(0); turn = 0; speed = 1;
    let waiting = roster.length;
    roster.forEach(r => bake(r, () => { if (--waiting === 0) { go('curtain'); stat(); kick(); } }));
    cv.scrollIntoView({ block: 'nearest' });
  }
  const now = (): Contestant => roster[order[turn]];
  function finishTurn(): void {
    const r = now();
    r.last = pageantTotal(r.rows); r.total += r.last;
    PAGEANT_SLOTS.forEach(s => { if (!PAGEANT_EMPTY.includes(r.outfit[s])) { const k = s + ':' + r.outfit[s]; if (!r.worn.includes(k)) r.worn.push(k); } });
    stat();
  }
  function showSheet(): void {
    const head = el('tr', {}, el('th', { text: 'Contestant' }), ...PAGEANT_JUDGES.map(j => el('th', { text: j[1] })), el('th', { text: 'Round' }), el('th', { text: 'Total' }));
    const rows = [...roster].sort((a, b) => b.total - a.total).map(r => el('tr', { cls: r.cpu ? '' : 'pgme' }, el('td', { text: r.name }), ...r.rows.map(x => el('td', { text: String(x[0]) })), el('td', { text: String(r.last) }), el('td', { text: String(r.total) })));
    const why = el('ul', {}, ...roster[0].rows.map((row, i) => el('li', {}, el('strong', { text: PAGEANT_JUDGES[i][1] + ' ' + row[0] + '/10: ' }), row[1])));
    sheet.textContent = '';
    sheet.append(el('h4', { text: PAGEANT_ROUNDS[round].name + ': the score sheet' }), el('div', { cls: 'pgtable' }, el('table', {}, el('thead', {}, head), el('tbody', {}, ...rows))), el('p', { cls: 'pgwhy', text: 'Why your outfit got those scores:' }), why);
    const more = el('button', { cls: 'pill', type: 'button', onclick() { if (round < 2) { round++; draft = null; sheet.hidden = true; slotNow = 'top'; openRoom(); } else { sheet.hidden = true; crown(); } } }, round < 2 ? 'Next round: ' + PAGEANT_ROUNDS[round + 1].name : 'Crown the winner');
    sheet.append(more);
    sheet.hidden = false;
  }
  function ranked(): Contestant[] { return [...roster].sort((a, b) => b.total - a.total || b.last - a.last); }
  function crown(): void {
    go('crown');
    const win = ranked()[0], me = roster[0];
    if (win === me) award(me.total >= 120 ? 40 : 25); else award(5);
    finalBest = p.bestOf(me.total); cheer = 6000;
    for (let i = 0; i < (calm ? 60 : 220); i++) bits.push({ x: Math.random() * W, y: -Math.random() * 240, vx: (Math.random() - .5) * 1.4, vy: 1 + Math.random() * 2, life: 5200, col: pick(['#ff1f8f', '#f4d35e', '#fff6fb', '#35dcc8']), size: 3 + Math.random() * 3 });
    [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, .2), i * 120));
    p.go.textContent = 'Enter again'; stat(); kick();
  }
  function step(dt: number): void {
    clock += dt; const fast = dt * speed; modeT += fast;
    bits = bits.filter(b => { b.life -= dt; b.x += b.vx * dt * .06; b.y += b.vy * dt * .06; return b.life > 0 && b.y < H + 10; });
    cheer = Math.max(0, cheer - dt);
    flashes = flashes.filter(f => { f[2] -= dt; return f[2] > 0; });
    if ((mode === 'pose' || mode === 'walk' || mode === 'crown') && !calm && Math.random() < dt * .006) flashes.push([60 + Math.random() * 520, 60 + Math.random() * 100, 110]);
    if (mode === 'curtain' && modeT > 1700) go('walk');
    if (mode === 'walk' && modeT > 2600) { go('pose'); tone(880, .1); cheer = 700; }
    if (mode === 'pose' && modeT > 1300) go('side');
    if (mode === 'side' && modeT > 600) { go('score'); cards = 0; }
    if (mode === 'score') {
      const should = Math.min(5, Math.floor(modeT / TICK));
      if (should > cards) { const n = now().rows[cards][0]; tone(300 + n * 70, .14); cards = should; now().shown = pageantTotal(now().rows.slice(0, cards)); if (n >= 9) cheer = 900; }
      if (modeT > TICK * 5 + 1500) { finishTurn(); go('exit'); cheer = pageantTotal(now().rows) >= 38 ? 1200 : 0; }
    }
    if (mode === 'exit' && modeT > 500) {
      turn++;
      if (turn >= order.length) { go('standings'); speed = 1; showSheet(); stat(); }
      else { go('walk'); speed = speed > 1 ? speed : 1; cards = 0; }
    }
    if (mode === 'crown' && modeT > 6500) { go('done'); holdEnd(); }
  }
  function holdEnd(): void { rules.open = true; stat(); }
  function paint(): void {
    if (!stage) buildStage();
    c.drawImage(stage as HTMLCanvasElement, 0, 0, W, H);
    /* the spotlights follow whoever is walking */
    const r = roster.length ? (mode === 'crown' || mode === 'done' ? ranked()[0] : order.length && turn < order.length ? now() : null) : null;
    let x = W / 2, feet = 190, tall = 96, pose = 'walk', tilt = 0;
    if (mode === 'walk') { const k = Math.min(1, modeT / 2600); x = W / 2; feet = 182 + k * 76; tall = 96 + k * 76; tilt = Math.sin(modeT * .009) * .035; }
    if (mode === 'pose') { feet = 258; tall = 172; pose = 'pose'; }
    if (mode === 'side' || mode === 'score') { const k = mode === 'side' ? Math.min(1, modeT / 600) : 1; x = W / 2 + (98 - W / 2) * k; feet = 262; tall = 172; pose = mode === 'score' ? 'pose' : 'walk'; }
    if (mode === 'exit') { x = 98 - modeT * .4; feet = 262; tall = 172; }
    if (mode === 'crown' || mode === 'done') { feet = 262; tall = 180; pose = 'pose'; }
    c.save(); c.globalCompositeOperation = 'lighter';
    [[120, 1], [320, 0], [520, -1]].forEach(([sx]) => { const g = c.createLinearGradient(0, 0, 0, feet); g.addColorStop(0, 'rgba(255,240,210,.24)'); g.addColorStop(1, 'rgba(255,240,210,.03)'); c.fillStyle = g; c.beginPath(); c.moveTo(sx - 5, 0); c.lineTo(sx + 5, 0); c.lineTo(x + tall * .3, feet); c.lineTo(x - tall * .3, feet); c.closePath(); c.fill(); });
    c.restore();
    if (mode === 'curtain') { const open = Math.min(1, modeT / 1400); for (const side of [0, 1]) { c.fillStyle = '#6d1140'; const wide = (W / 2) * (1 - open); c.fillRect(side ? W - wide : 0, 0, wide, 300); c.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < wide; i += 22) c.fillRect((side ? W - wide : 0) + i, 0, 9, 300); } if (open < 1) gameWrite(c, PAGEANT_ROUNDS[round].name.toUpperCase(), W / 2, 150, 44, '#f4d35e'); }
    if (r && mode !== 'curtain' && mode !== 'idle' && mode !== 'standings') { c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x, feet + 2, tall * .18, 6, 0, 0, 7); c.fill(); sprite(r.art[pose] || r.art.walk, x, feet, tall, tilt); }
    /* the crowd rises for a big score */
    if (cheer > 0) for (let i = 0; i < 3; i++) { const a = backs[i % Math.max(1, backs.length)]; if (a) c.drawImage(a, i * 64 - 18, 280 - Math.abs(Math.sin(clock / 110 + i)) * 10, 96, 84); }
    /* the judges and their paddles */
    for (let i = 0; i < 5; i++) {
      const jx = judgeX(i), a = backs[(i + 4) % Math.max(1, backs.length)];
      if (a) c.drawImage(a, jx - 42, 248, 84, 74);
      const up = mode === 'score' && cards > i;
      if (up && r) {
        const lift = Math.min(1, (modeT - (i + 1) * TICK) / 160 + 1), y = 200 + (1 - lift) * 44, n = r.rows[i][0];
        c.strokeStyle = '#14081a'; c.lineWidth = 6; c.beginPath(); c.moveTo(jx, y + 40); c.lineTo(jx, 292); c.stroke(); c.strokeStyle = '#d9b48a'; c.lineWidth = 3; c.stroke();
        c.fillStyle = '#fff6fb'; c.fillRect(jx - 28, y - 18, 56, 58); c.strokeStyle = n >= 8 ? '#ff1f8f' : n >= 5 ? '#14081a' : '#6a1f86'; c.lineWidth = 4; c.strokeRect(jx - 28, y - 18, 56, 58);
        c.font = '40px ' + DISPLAY_FONT; c.textAlign = 'center'; c.fillStyle = n >= 8 ? '#ff1f8f' : '#14081a'; c.fillText(String(n), jx, y + 26);
      }
    }
    flashes.forEach(f => { c.fillStyle = 'rgba(255,255,255,' + f[2] / 110 + ')'; c.beginPath(); c.arc(f[0], f[1], 7, 0, 7); c.fill(); });
    bits.forEach(b => { c.fillStyle = b.col; c.fillRect(b.x, b.y, b.size, b.size * .6); });
    overlay(r);
  }
  function overlay(r: Contestant | null): void {
    if (mode === 'idle') { c.fillStyle = 'rgba(16,6,24,.55)'; c.fillRect(0, 0, W, H); gameWrite(c, 'GHOUL OF THE YEAR', W / 2, 130, 50, '#ff1f8f'); gameLine(c, 'Press Enter the pageant to begin', W / 2, 160, '#fff6fb', 15); return; }
    if ((mode === 'walk' || mode === 'pose' || mode === 'side') && r) { c.fillStyle = 'rgba(16,6,24,.86)'; c.fillRect(0, 54, 196, 40); c.fillStyle = '#ff1f8f'; c.fillRect(0, 54, 6, 40); c.font = '20px ' + DISPLAY_FONT; c.textAlign = 'left'; c.fillStyle = '#fff6fb'; c.fillText(r.name, 14, 76, 178); c.font = '800 11px Nunito, sans-serif'; c.fillStyle = '#f4d35e'; c.fillText(PAGEANT_ROUNDS[round].name + (r.cpu ? '' : '  (you)'), 14, 90); }
    if (mode === 'score' && r) { gameWrite(c, r.name, 98, 72, 20, '#fff6fb'); gameWrite(c, r.shown + ' / 50', 98, 100, 28, '#f4d35e'); }
    if (mode === 'walk' || mode === 'score') gameLine(c, 'Click the stage to speed up', 92, 350, '#ffd3e8', 11);
    if (['walk', 'pose', 'side', 'score', 'exit'].includes(mode)) {
      c.fillStyle = 'rgba(16,6,24,.86)'; c.fillRect(W - 142, 54, 136, 76); c.strokeStyle = '#ff1f8f'; c.lineWidth = 2; c.strokeRect(W - 142, 54, 136, 76);
      [...roster].sort((a, b) => b.total - a.total).forEach((x, i) => { c.font = '800 11px Nunito, sans-serif'; c.textAlign = 'left'; c.fillStyle = x.cpu ? '#fff6fb' : '#35dcc8'; c.fillText(x.name.split(' ')[0], W - 136, 70 + i * 17); c.textAlign = 'right'; c.fillText(String(x.total), W - 12, 70 + i * 17); });
    }
    if (mode === 'standings') { c.fillStyle = 'rgba(16,6,24,.72)'; c.fillRect(0, 0, W, H); gameWrite(c, 'THE SCORES ARE IN', W / 2, 150, 42, '#f4d35e'); gameLine(c, 'See the score sheet below', W / 2, 178, '#fff6fb', 15); }
    if (mode === 'crown' || mode === 'done') {
      const win = ranked()[0], me = roster[0], place = ranked().indexOf(me) + 1;
      c.fillStyle = 'rgba(16,6,24,.86)'; c.fillRect(0, 64, 214, 74); c.fillStyle = '#ff1f8f'; c.fillRect(0, 64, 6, 74); gameWrite(c, win.name.toUpperCase(), 110, 96, 24, '#f4d35e'); gameLine(c, 'Ghoul of the Year', 110, 114, '#fff6fb', 14); gameLine(c, win.total + ' points', 110, 130, '#35dcc8', 13);
      if (r) { c.fillStyle = '#f4d35e'; c.strokeStyle = '#14081a'; c.lineWidth = 2.5; const tx = W / 2, ty = 262 - 180 - 6 + Math.sin(clock / 300) * 2; c.beginPath(); c.moveTo(tx - 20, ty + 14); c.lineTo(tx - 24, ty - 6); c.lineTo(tx - 10, ty + 4); c.lineTo(tx, ty - 12); c.lineTo(tx + 10, ty + 4); c.lineTo(tx + 24, ty - 6); c.lineTo(tx + 20, ty + 14); c.closePath(); c.fill(); c.stroke(); }
      if (mode === 'done') gameLine(c, win === me ? 'You won! Best: ' + finalBest : 'You placed ' + ['1st', '2nd', '3rd', '4th'][place - 1] + ' with ' + me.total + '. Best: ' + finalBest, W / 2, 40, '#35dcc8', 15);
    }
  }
  function pauseCover(): void { c.fillStyle = 'rgba(10,2,16,.6)'; c.fillRect(0, 0, W, H); gameWrite(c, 'PAUSED', W / 2, H / 2, 50); }
  function frame(when: number): void {
    looping = false;
    if (!p.root.getClientRects().length) { if (roster.length) quit(); return; }
    if (paused || !cv.getClientRects().length) return;
    const dt = Math.min(40, when - last); last = when;
    step(dt); paint();
    if (!['idle', 'standings', 'done'].includes(mode) || bits.length) { looping = true; requestAnimationFrame(frame); }
  }
  function kick(): void { if (looping || paused || !cv.getClientRects().length) return; looping = true; last = performance.now(); requestAnimationFrame(frame); }
  function togglePause(): void { if (!running() || !room.hidden) return; paused = !paused; applySong(); if (paused) { paint(); pauseCover(); } else kick(); stat(); }
  function quit(): void {
    go('idle'); paused = false; roster = []; order = []; bits = []; draft = null; round = 0; stopSongs();
    room.hidden = true; sheet.hidden = true; holder().hidden = false; rules.open = true; p.go.textContent = 'Enter the pageant'; stat(); kick();
  }
  p.go.addEventListener('click', () => {
    askCrowd(); p.go.blur();
    const me = (!isAdmin() && currentStudent()?.look) || DOLLS.mumtea.look, name = (!isAdmin() && currentStudent()?.name) || 'You';
    const blank = (who: string, cpu: boolean, tries: number, look: Look): Contestant => ({ name: who, cpu, tries, look, outfit: {} as PageantOutfit, worn: [], rows: [], total: 0, last: 0, art: {}, shown: 0 });
    roster = [blank(name, false, 0, me), ...CPUS.map(x => blank(x.name, true, x.tries, randomLook()))];
    round = 0; bits = []; draft = null; slotNow = 'top'; paused = false; sheet.hidden = true; go('standings'); p.go.textContent = 'Start over';
    startSongs(); openRoom();
  });
  cv.addEventListener('click', () => { if (['walk', 'pose', 'side', 'score', 'exit', 'curtain'].includes(mode) && !paused) speed = speed === 1 ? 3 : 1; });
  addEventListener('keydown', e => { if (isPauseKey(e) && running() && room.hidden) { togglePause(); e.preventDefault(); } });
  stops.push(() => { if (roster.length) quit(); });
  new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { askCrowd(); kick(); } }).observe(cv);
  /* Leaving the Games page altogether stops the show and its song. */
  window.setInterval(() => { if (roster.length && !p.root.getClientRects().length) quit(); }, 700);
  stat();
})();
