/* ---------- the leaderboard: best score per person, per game ---------- */
/* A row with no user_id is Ms. Fangtastic's: she plays on the admin code, not an account. */
interface ScoreRow { user_id: string | null; game: string; score: number }
const SCORED_GAMES = ['riptide', 'spill', 'casket', 'kick', 'hoops', 'pageant'];
const BOARD_SIZE = 10;
let allScores: ScoreRow[] = [], scoresLoaded = false, scoreTab = 'riptide', scoreNote = '';
const announced = new Set<string>();
const scoreBoard = el('section', { cls: 'panel lboard', 'aria-labelledby': 'lboardTitle' });
const playerOf = (id: string | null): Student | undefined => (id === null ? { id: '', name: DOLLS.mumtea.name, look: DOLLS.mumtea.look, joined: '' } : loadRoster().find(s => s.id === id));
/* With the code on, you are her, even if an account is also logged in. */
const isMine = (id: string | null): boolean => (isAdmin() ? id === null : id !== null && id === signedInId());
const headOf = (who: Student): HTMLElement => {
  const face = el('span', { cls: 'lbface', 'aria-hidden': 'true' });
  face.innerHTML = drawGhoul(who.look, { only: HEAD_LAYERS, box: HEAD_ONLY_BOX, head: true });
  return face;
};
/* Only people the site can show: a deleted or unverified account never appears. */
const boardFor = (game: string): Array<ScoreRow & { who: Student }> => allScores
  .filter(r => r.game === game)
  .map(r => ({ ...r, who: playerOf(r.user_id) as Student }))
  .filter(r => r.who)
  .sort((a, b) => b.score - a.score);

async function refreshScores(): Promise<void> {
  if (!backendReady) return;
  const { data, error } = await sb.from('game_scores').select('user_id, game, score');
  if (error) throw error;
  allScores = data as ScoreRow[];
  scoresLoaded = true;
}
const roundBest: Record<string, number> = {};
/* A logged-in player's best comes from their account; a guest's stays on this device. */
function displayBest(game: string): number {
  /* The games draw their labels while the page is still loading, before accounts are ready. */
  try {
    if (isAdmin() || signedInId()) return Math.max(allScores.find(r => r.game === game && isMine(r.user_id))?.score || 0, roundBest[game] || 0);
  } catch (e) { /* still loading */ }
  return store.get<number>(game + 'Best', 0);
}
function renderScores(): void {
  scoreBoard.textContent = '';
  /* If the scores can't be read, the games carry on without a board. */
  scoreBoard.hidden = !scoresLoaded;
  renderMenu();
  SCORED_GAMES.forEach(game => { const label = document.querySelector('.gpanel[data-game="' + game + '"] [role=status]'); if (label && /^Best:/.test(label.textContent || '')) label.textContent = 'Best: ' + displayBest(game); });
  if (!scoresLoaded) return;
  const tabs = el('div', { cls: 'chips', role: 'group', 'aria-label': 'Choose a game' }, ...SCORED_GAMES.map(game => el('button', { cls: 'chip', type: 'button', 'aria-pressed': game === scoreTab, onclick() { scoreTab = game; renderScores(); } }, titleOf(game))));
  scoreBoard.append(el('h3', { id: 'lboardTitle', text: 'Leaderboard' }), tabs);
  const rows = boardFor(scoreTab);
  if (!rows.length) scoreBoard.append(el('p', { cls: 'lbempty', text: 'No scores yet. The top spot is wide open.' }));
  else {
    const list = el('ol', { cls: 'lblist' });
    rows.slice(0, BOARD_SIZE).forEach((r, i) => {
      const line = el('li', { cls: 'lbrow' + (isMine(r.user_id) ? ' lbme' : '') }, el('span', { cls: 'lbrank', text: String(i + 1) }), headOf(r.who), el('strong', { cls: 'lbname' }, personButton(r.user_id, r.who.name + (isMine(r.user_id) ? ' (you)' : ''))), el('span', { cls: 'lbscore', text: r.score.toLocaleString() }));
      if (isAdmin()) line.append(el('button', { cls: 'linkish', type: 'button', 'aria-label': 'Remove the score of ' + r.who.name, async onclick() {
        const { error } = await sb.rpc('admin_delete_score', { token: adminPass, target: r.user_id, which: r.game });
        scoreNote = error ? 'That score was not removed. Try again.' : '';
        if (!error) allScores = allScores.filter(x => !(x.user_id === r.user_id && x.game === r.game));
        renderScores();
      } }, 'Remove'));
      list.append(line);
    });
    scoreBoard.append(list);
    const mine = rows.findIndex(r => isMine(r.user_id));
    if (mine >= BOARD_SIZE) scoreBoard.append(el('p', { cls: 'lbnote', text: 'You are number ' + (mine + 1) + ' with ' + rows[mine].score.toLocaleString() + '.' }));
  }
  if (!signedInId() && !isAdmin()) scoreBoard.append(el('p', { cls: 'lbnote', text: 'Log in to put your name and your ghoul on this board.' }));
  if (scoreNote) scoreBoard.append(el('p', { cls: 'lbnote', role: 'status', text: scoreNote }));
}
/* The pop-up everyone on the site sees when someone takes first place. */
function showHighScore(who: Student, game: string, score: number, mine: boolean): void {
  const key = who.id + game + score;
  if (announced.has(key)) return;
  announced.add(key);
  const close = () => toast.remove();
  const toast = el('div', { cls: 'hitoast', role: 'status' }, headOf(who),
    el('div', { cls: 'hitext' }, el('small', { text: 'New high score!' }), el('strong', { text: mine ? 'You took first place' : who.name }), el('span', { text: titleOf(game) + ': ' + score.toLocaleString() })),
    el('button', { cls: 'hiclose', type: 'button', 'aria-label': 'Close', onclick: close }, '×'));
  ($('dialog[open]') as HTMLElement | null || document.body).append(toast);
  tone(880, .12);
  setTimeout(close, 7000);
}
function takeScore(row: ScoreRow): void {
  const top = boardFor(row.game)[0];
  const known = allScores.find(r => r.user_id === row.user_id && r.game === row.game);
  if (known) known.score = Math.max(known.score, row.score); else allScores.push({ user_id: row.user_id, game: row.game, score: row.score });
  const who = playerOf(row.user_id);
  if (who && scoresLoaded && (!top || row.score > top.score)) showHighScore(who, row.game, row.score, isMine(row.user_id));
  renderScores();
}
/* Called when a round ends. */
async function submitScore(game: string, score: number): Promise<void> {
  const asFang = isAdmin();
  if (!backendReady || !scoresLoaded || score < 1 || (!asFang && !signedInId())) return;
  scoreTab = game;
  roundBest[game] = Math.max(roundBest[game] || 0, score);
  const before = boardFor(game).find(r => isMine(r.user_id))?.score || 0;
  const { data, error } = asFang ? await sb.rpc('admin_submit_score', { token: adminPass, which: game, points: score }) : await sb.rpc('submit_score', { which: game, points: score });
  scoreNote = error ? 'Your score did not save. It will count next round if you beat it again.' : score > before ? 'New personal best saved: ' + score.toLocaleString() + '.' : '';
  if (!error) takeScore({ user_id: asFang ? null : signedInId(), game, score: data });
  renderScores();
}
function startScores(): void {
  if (!scoresLoaded) return;
  sb.channel('scores').on('postgres_changes', { event: '*', schema: 'public', table: 'game_scores' }, async (change: any) => {
    if (change.eventType === 'DELETE') { await refreshScores().catch(() => {}); renderScores(); return; }
    takeScore(change.new as ScoreRow);
  }).subscribe();
}
$('#player').after(scoreBoard);
