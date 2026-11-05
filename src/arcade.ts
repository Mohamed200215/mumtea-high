/* ---------- arcade: extra games plus shelf search, filters and favourites ---------- */
const DISPLAY_FONT = '"Breath of the House", Impact, fantasy';
const NEW_GAMES: MenuRow[] = [
  ['riptide', 'Riptide Run', 'Arcade', 'Pick a mermaid outfit and swim the flooded basement. Hold to rise, let go to sink.', '🌊'],
  ['casket', 'Casket Shot', 'Arcade', 'Fire yourself from a coffin cannon into a pot of hot tea. Pick your stunt suit.', '⚰️'],
  ['kick', 'Graveyard Cup', 'Sports', 'Take penalties and free kicks under the floodlights, with a keeper and a wall to beat.', '⚽'],
  ['hoops', 'Slam Dunk Seance', 'Sports', 'Threes, dunks and one shot from half court in a packed arena.', '🏀'],
  ['pageant', 'Ghoul of the Year', 'Dress up', 'Dress for three rounds and face CPU rivals in front of five judges.', '👑'],
  ['booth', 'Say Fangs', 'Camera', 'Take a picture on a pink DS, PSP, iPod, Y2K phone, retro TV and more.', '📸'],
];
MENU.push(...NEW_GAMES);

/* ---------- shared game parts ---------- */
interface Panel { root: HTMLElement; go: HTMLElement; stat: HTMLElement; bestOf(score: number): number }
function makePanel(id: string, title: string, help: string, body: HTMLElement[], goText = 'Start'): Panel {
  const go = el('button', { cls: 'pill', type: 'button' }, goText);
  const stat = el('span', { role: 'status' });
  const root = el('div', { cls: 'panel gpanel', 'data-game': id, hidden: '' },
    el('h3', { text: title }), el('p', { text: help }), ...body, el('div', { cls: 'gamebar' }, go, stat));
  $('#player').append(root);
  const bestOf = (score: number): number => {
    const best = Math.max(store.get<number>(id + 'Best', 0), score);
    store.set(id + 'Best', best);
    renderMenu();
    return best;
  };
  return { root, go, stat, bestOf };
}
function makeCanvas(label: string): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const cv = el('canvas', { width: 480, height: 360, 'aria-label': label }) as HTMLCanvasElement;
  return [cv, cv.getContext('2d') as CanvasRenderingContext2D];
}
const typing = (e: KeyboardEvent): boolean => (e.target as HTMLElement).tagName === 'INPUT';
const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

/* ---------- shelf: search, filters, favourites ---------- */
let shelfGenre = 'All', shelfQuery = '', currentGame = 'closet';
const favourites = (): string[] => store.get<string[]>('favs', []);
const titleOf = (id: string): string => (MENU.find(g => g[0] === id) || MENU[0])[1];
const playerTitle = el('span');
const favBtn = el('button', { cls: 'chip', type: 'button', onclick() { toggleFav(currentGame); } });

function toggleFav(id: string): void {
  const f = favourites();
  store.set('favs', f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  renderMenu(); syncPlayerBar();
}
function renderMenu(): void {
  const s = $('#shelf'); s.textContent = '';
  const q = shelfQuery.toLowerCase(), favs = favourites();
  const rows = MENU.filter(g => (shelfGenre === 'All' || g[2] === shelfGenre || (shelfGenre === 'Favourites' && favs.includes(g[0]))) && (g[1] + ' ' + g[3]).toLowerCase().includes(q));
  if (!rows.length) {
    s.append(el('p', { cls: 'gempty', text: shelfGenre === 'Favourites' && !q ? 'No favourites yet. Tap the star on any game.' : 'No game matches that.' }));
    return;
  }
  rows.forEach(g => {
    const b = el('button', { cls: 'gcard', type: 'button', 'data-game': g[0], 'aria-pressed': g[0] === currentGame, onclick() { openGame(g[0], true); } });
    const art = el('div', { cls: 'gart', 'aria-hidden': 'true' }); if (GAME_ART[g[0]]) art.append(el('img', { src: GAME_ART[g[0]], alt: '', width: 96, height: 96 })); else art.textContent = g[4];
    const best = SCORED_GAMES.includes(g[0]) ? displayBest(g[0]) : 0;
    const body = el('div', { cls: 'gbody' }, el('strong', { text: g[1] }), el('small', { text: g[3] }));
    if (best) body.append(el('span', { cls: 'gbest', text: 'Best: ' + best }));
    body.append(el('em', { text: g[2] }));
    b.append(art, body);
    const on = favs.includes(g[0]);
    const star = el('button', { cls: 'gfav', type: 'button', 'aria-pressed': on, 'aria-label': (on ? 'Remove ' + g[1] + ' from' : 'Add ' + g[1] + ' to') + ' favourites', onclick() { toggleFav(g[0]); } }, on ? '★' : '☆');
    s.append(el('div', { cls: 'gcell' }, b, star));
  });
}
function syncPlayerBar(): void {
  playerTitle.textContent = 'Now playing: ' + titleOf(currentGame);
  const on = favourites().includes(currentGame);
  favBtn.textContent = on ? '★ Favourite' : '☆ Favourite';
  favBtn.setAttribute('aria-pressed', String(on));
}
function arcadeOpened(id: string): void {
  currentGame = id; store.set('lastGame', id); syncPlayerBar();
  if (SCORED_GAMES.includes(id)) { scoreTab = id; renderScores(); }
  if (id === 'closet') mountStudio($('#closetHome'));
  if (!$('.view[data-view="games"]').hidden) musicPlay(id);
}
(function () {
  const chips = el('div', { cls: 'chips', role: 'group', 'aria-label': 'Filter games' });
  ['All', ...Array.from(new Set(MENU.map(g => g[2]))), 'Favourites'].forEach(name => {
    const chip = el('button', { cls: 'chip', type: 'button', 'aria-pressed': name === 'All', onclick() {
      shelfGenre = name; $$('.chip', chips).forEach(k => k.setAttribute('aria-pressed', String(k === chip))); renderMenu();
    } }, name);
    chips.append(chip);
  });
  const search = el('input', { type: 'search', placeholder: 'Search ' + MENU.length + ' games', 'aria-label': 'Search games' }) as HTMLInputElement;
  search.addEventListener('input', () => { shelfQuery = search.value.trim(); renderMenu(); });
  const drawSound = () => { const m = store.get('mute', false); sound.textContent = m ? 'Sound off' : 'Sound on'; sound.setAttribute('aria-pressed', String(!m)); };
  const sound = el('button', { cls: 'chip', type: 'button', onclick() { store.set('mute', !store.get('mute', false)); document.dispatchEvent(new Event('soundchange')); } });
  drawSound();
  document.addEventListener('soundchange', drawSound);
  const random = el('button', { cls: 'chip', type: 'button', onclick() { openGame(pick(MENU)[0], true); } }, 'Random game');
  $('#shelf').before(el('div', { cls: 'arcadebar' }, search, chips, random, sound));
  gameTools($('.gpanel[data-game="closet"]'));

  const player = $('#player');
  const tools = el('div', {}, favBtn, el('button', { cls: 'chip', type: 'button', onclick() { $('.arcadebar').scrollIntoView({ block: 'start' }); } }, 'All games'));
  if (player.requestFullscreen) {
    const full = el('button', { cls: 'chip', type: 'button', onclick() {
      if (document.fullscreenElement) document.exitFullscreen(); else player.requestFullscreen().catch(() => {});
    } }, 'Full screen');
    document.addEventListener('fullscreenchange', () => { full.textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen'; });
    tools.append(full);
  }
  player.prepend(el('div', { cls: 'playerbar' }, playerTitle, tools));
  const last = store.get<string>('lastGame', 'closet');
  if (MENU.some(g => g[0] === last)) currentGame = last;
  syncPlayerBar();
})();
