/* ---------- comments, reactions, reports, student pages, search and saved bones ---------- */
interface TeaComment { id: string; postId: string; authorId: string | null; body: string; at: string }
interface TeaReaction { postId: string; userId: string | null; kind: string }
const REACTIONS: Array<[string, string, string]> = [['fang', '🦇', 'Fangtastic'], ['tea', '🍵', 'Spilled'], ['skull', '💀', 'Dead'], ['heart', '🖤', 'Love'], ['fire', '🔥', 'Hot']];
const COMMENT_LIMIT = 1000, SHORT_POST = 600;
let allComments: TeaComment[] = [], allReactions: TeaReaction[] = [], allBones: Array<{ user_id: string; bones: number }> = [];
let blogQuery = '', profileId: string | null = null, bonesOwner: string | null = null, bonesTimer = 0;
const openComments = new Set<string>(), openPosts = new Set<string>(), commentDrafts: Record<string, string> = {};

async function refreshCommunity(): Promise<void> {
  const [c, r, b] = await Promise.all([
    sb.from('comments').select('*').order('created_at').limit(3000),
    sb.from('post_reactions').select('post_id, user_id, kind').limit(10000),
    sb.from('player_progress').select('user_id, bones'),
  ]);
  if (c.error || r.error || b.error) throw c.error || r.error || b.error;
  allComments = c.data.map((row: any): TeaComment => ({ id: row.id, postId: row.post_id, authorId: row.author_id, body: row.body, at: row.created_at }));
  allReactions = r.data.map((row: any): TeaReaction => ({ postId: row.post_id, userId: row.user_id, kind: row.kind }));
  allBones = b.data;
}
function redrawPosts(): void { renderBlog(); renderBoss(); renderStudentPage(); }
/* With the code on, everything is done as Ms. Fangtastic. */
const actorIs = (id: string | null): boolean => (isAdmin() ? id === null : id !== null && id === signedInId());
const canAct = (): boolean => isAdmin() || !!signedInId();
const nameOf = (id: string | null): string => (id === null ? DOLLS.mumtea.name : everyone.find(s => s.id === id)?.name || 'A ghoul');
function personButton(id: string | null, label = nameOf(id)): HTMLElement {
  return el('button', { cls: 'personlink', type: 'button', onclick() { openProfile(id); } }, label);
}
function faceFor(id: string | null, cls = 'teaface'): HTMLElement {
  const look = id === null ? DOLLS.mumtea.look : everyone.find(s => s.id === id)?.look;
  const face = el('span', { cls, 'aria-hidden': 'true' });
  if (look) face.innerHTML = drawGhoul(look, { only: HEAD_LAYERS, box: HEAD_ONLY_BOX, head: true });
  return face;
}

/* ---------- reactions ---------- */
function reactionBar(post: TeaPost): HTMLElement {
  const bar = el('div', { cls: 'reactbar', role: 'group', 'aria-label': 'React to this post' });
  REACTIONS.forEach(([kind, icon, label]) => {
    const here = allReactions.filter(r => r.postId === post.id && r.kind === kind);
    const mine = here.some(r => actorIs(r.userId));
    bar.append(el('button', { cls: 'reactbtn', type: 'button', title: label, 'aria-label': label + ', ' + here.length, 'aria-pressed': mine, async onclick() {
      if (!canAct()) { go('registration'); return; }
      const { error } = isAdmin() ? await sb.rpc('admin_toggle_reaction', { token: adminPass, target: post.id, which: kind })
        : mine ? await sb.from('post_reactions').delete().eq('post_id', post.id).eq('kind', kind).eq('user_id', signedInId())
        : await sb.from('post_reactions').insert({ post_id: post.id, kind });
      if (error) return;
      await refreshCommunity().catch(() => {});
      redrawPosts();
    } }, icon, el('span', { text: here.length ? String(here.length) : '' })));
  });
  return bar;
}

/* ---------- comments ---------- */
function commentRow(c: TeaComment): HTMLElement {
  const tools = el('div', { cls: 'cmttools' });
  if (actorIs(c.authorId) || isAdmin()) {
    const del = el('button', { cls: 'linkish', type: 'button', async onclick() {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Click again to delete'; return; }
      const { error } = isAdmin() ? await sb.rpc('admin_delete_comment', { token: adminPass, target: c.id }) : await sb.from('comments').delete().eq('id', c.id);
      if (error) { del.textContent = 'That did not work. Try again.'; return; }
      await refreshCommunity().catch(() => {});
      redrawPosts();
    } }, 'Delete');
    tools.append(del);
  }
  if (!actorIs(c.authorId) && !isAdmin() && c.authorId !== null) tools.append(reportButton({ comment_id: c.id }, 'this comment'));
  return el('div', { cls: 'cmtrow' }, faceFor(c.authorId, 'cmtface'), el('div', { cls: 'cmtbody' },
    el('div', { cls: 'cmtwho' }, personButton(c.authorId), el('time', { datetime: c.at, text: timeAgo(c.at) })), el('p', { text: c.body }), tools));
}
function commentsBlock(post: TeaPost): HTMLElement {
  const here = allComments.filter(c => c.postId === post.id), isOpen = openComments.has(post.id);
  const label = here.length ? here.length + (here.length === 1 ? ' comment' : ' comments') : 'Comment';
  const box = el('div', { cls: 'cmtbox' }, el('button', { cls: 'linkish cmttoggle', type: 'button', 'aria-expanded': isOpen, onclick() {
    if (isOpen) openComments.delete(post.id); else openComments.add(post.id);
    renderBlog();
  } }, isOpen ? 'Hide comments' : label));
  if (!isOpen) return box;
  here.forEach(c => box.append(commentRow(c)));
  if (!canAct()) { box.append(el('button', { cls: 'pill ghost', type: 'button', 'data-go': 'registration' }, 'Log in to comment')); return box; }
  if (myRecord()?.muted && !isAdmin()) { box.append(el('p', { cls: 'cmtnote', text: 'Ms. Fangtastic has taken away your posting privileges.' })); return box; }
  const area = el('textarea', { 'data-cmt': post.id, maxlength: COMMENT_LIMIT, rows: 2, required: '', placeholder: 'Write a comment', 'aria-label': 'Write a comment' }) as HTMLTextAreaElement;
  area.value = commentDrafts[post.id] || '';
  area.addEventListener('input', () => { commentDrafts[post.id] = area.value; });
  const note = el('p', { cls: 'cmtnote', role: 'status' });
  const send = el('button', { cls: 'pill', type: 'submit' }, 'Comment');
  const form = el('form', { cls: 'cmtform' }, area, el('div', { cls: 'row' }, send), note);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = area.value.trim();
    if (!text) { note.textContent = 'Write something first.'; return; }
    send.setAttribute('disabled', '');
    const { error } = isAdmin() ? await sb.rpc('admin_comment', { token: adminPass, target: post.id, body: text }) : await sb.from('comments').insert({ post_id: post.id, body: text });
    send.removeAttribute('disabled');
    if (error) { note.textContent = 'That did not post. Your words are still here, so try again.'; return; }
    delete commentDrafts[post.id];
    await refreshCommunity().catch(() => {});
    redrawPosts();
  });
  box.append(form);
  return box;
}

/* ---------- reports: only whoever has the admin code can read them ---------- */
const reportDialog = el('dialog', { cls: 'composer', 'aria-labelledby': 'reportTitle' }) as HTMLDialogElement;
function reportButton(target: Record<string, string>, what: string): HTMLElement {
  return el('button', { cls: 'linkish', type: 'button', onclick() { openReport(target, what); } }, 'Report');
}
function openReport(target: Record<string, string>, what: string): void {
  reportDialog.textContent = '';
  const close = () => reportDialog.close(), heading = el('h3', { id: 'reportTitle', text: 'Report ' + what });
  if (!signedInId()) {
    reportDialog.append(heading, el('p', { text: 'Log in first, so Ms. Fangtastic knows the report is real.' }), el('div', { cls: 'row' },
      el('button', { cls: 'pill', type: 'button', onclick() { close(); go('registration'); } }, 'Register or log in'), el('button', { cls: 'pill ghost', type: 'button', onclick: close }, 'Cancel')));
    reportDialog.showModal();
    return;
  }
  const reasons = ['Mean or bullying', 'Spam', 'Not appropriate', 'Something else'];
  const group = el('fieldset', { cls: 'reportreasons' }, el('legend', { text: 'What is wrong?' }), ...reasons.map((reason, i) => {
    const radio = el('input', { type: 'radio', name: 'reportReason', value: reason }) as HTMLInputElement;
    if (!i) radio.checked = true;
    return el('label', {}, radio, reason);
  }));
  const extra = el('textarea', { maxlength: 200, rows: 2, placeholder: 'Anything to add? (optional)', 'aria-label': 'Anything to add?' }) as HTMLTextAreaElement;
  const note = el('p', { cls: 'accountnote', role: 'status' }), send = el('button', { cls: 'pill', type: 'submit' }, 'Send report');
  const form = el('form', { cls: 'stack' }, group, extra, el('p', { cls: 'cmtnote', text: 'Only Ms. Fangtastic sees reports, including who sent them.' }), el('div', { cls: 'row' }, send, el('button', { cls: 'pill ghost', type: 'button', onclick: close }, 'Cancel')), note);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const picked = (group.querySelector('input:checked') as HTMLInputElement).value;
    send.setAttribute('disabled', '');
    const { error } = await sb.from('reports').insert({ ...target, reason: picked + (extra.value.trim() ? ': ' + extra.value.trim() : '') });
    if (error && error.code !== '23505') { send.removeAttribute('disabled'); note.textContent = 'That did not send. Please try again.'; return; }
    reportDialog.textContent = '';
    reportDialog.append(heading, el('p', { text: error ? 'You have already reported this. Ms. Fangtastic has it.' : 'Thank you. Ms. Fangtastic will take a look.' }), el('div', { cls: 'row' }, el('button', { cls: 'pill', type: 'button', onclick: close }, 'Close')));
  });
  reportDialog.append(heading, form);
  reportDialog.showModal();
}

/* ---------- a student's own page ---------- */
function openProfile(id: string | null): void {
  if (id === null) { go('fangtastic'); return; }
  profileId = id;
  go('student');
  try { history.replaceState(null, '', '#student-' + id); } catch (e) { /* the page still works */ }
}
function renderStudentPage(): void {
  const page = $('#studentPage'); page.textContent = '';
  const s = loadRoster().find(x => x.id === profileId);
  const back = el('button', { cls: 'pill ghost', type: 'button', 'data-go': 'students' }, 'All students');
  if (!s) { page.append(el('h2', { cls: 'sec-h', text: 'Student not found' }), el('p', { cls: 'lede', text: 'This ghoul may have left the school.' }), back); return; }
  const pic = el('span', { cls: 'doll' }); pic.innerHTML = drawGhoul(s.look, { label: s.name });
  const mine = s.id === signedInId() && !isAdmin();
  const bones = allBones.find(b => b.user_id === s.id)?.bones || 0;
  const facts = el('dl', { cls: 'studentfacts' });
  ([['Monster', MONSTER_NAMES[s.look.monster] || 'Monster'], ['Joined', new Date(s.joined).toLocaleDateString()], ['Blend', s.blend || 'Not yet steeped'], ['Bones', String(bones)]] as Array<[string, string]>).forEach(([k, v]) => facts.append(el('dt', { text: k }), el('dd', { text: v })));
  const scores = SCORED_GAMES.map(game => { const rows = boardFor(game), i = rows.findIndex(r => r.user_id === s.id); return i < 0 ? null : el('li', {}, el('strong', { text: titleOf(game) }), el('span', { text: rows[i].score.toLocaleString() + ' (number ' + (i + 1) + ')' })); }).filter(Boolean) as HTMLElement[];
  const posts = allPosts.filter(p => p.authorId === s.id);
  const actions = el('div', { cls: 'row' }, back);
  if (mine) actions.append(el('button', { cls: 'pill', type: 'button', 'data-go': 'profile' }, 'Change my look'));
  else if (!isAdmin()) actions.append(reportButton({ target_user: s.id }, s.name));
  page.append(el('div', { cls: 'studentpage' }, pic, el('div', { cls: 'studentinfo' }, el('h2', { cls: 'sec-h', text: s.name }), facts, actions)),
    el('section', { cls: 'panel' }, el('h3', { text: 'High scores' }), scores.length ? el('ul', { cls: 'studentscores' }, ...scores) : el('p', { text: 'No scores yet.' })),
    el('section', { cls: 'panel' }, el('h3', { text: 'Their tea' }), posts.length ? el('div', { cls: 'timeline' }, ...posts.map(p => { const card = postCard(p, false, true); card.removeAttribute('id'); return card; })) : el('p', { text: 'Nothing spilled yet.' })));
}

/* ---------- search: narrows with every letter, matching the start of a word ---------- */
function searchPosts(list: TeaPost[], query: string): TeaPost[] {
  const parts = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!parts.length) return list;
  const wordsOf = (text: string): string[] => text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const inside = (text: string): boolean => { const words = wordsOf(text); return parts.every(part => words.some(w => w.startsWith(part))); };
  return list.filter(p => inside(p.title + ' ' + p.body + ' ' + authorName(p))).sort((a, b) => Number(inside(b.title)) - Number(inside(a.title)));
}
const blogCount = el('p', { cls: 'teacountline', role: 'status' });
(function () {
  const input = el('input', { type: 'search', id: 'teaSearch', placeholder: 'Search the tea, like politics or anime', 'aria-label': 'Search posts', autocomplete: 'off' }) as HTMLInputElement;
  input.addEventListener('input', () => { blogQuery = input.value; renderBlog(); });
  $('.blog').before(el('div', { cls: 'teasearch' }, input, blogCount));
  $('#root').append(reportDialog);
  reportDialog.addEventListener('click', e => { if (e.target === reportDialog) reportDialog.close(); });
})();

/* ---------- bones follow the account ---------- */
function saveBonesSoon(): void {
  clearTimeout(bonesTimer);
  bonesTimer = window.setTimeout(() => { if (signedInId() && signedInId() === bonesOwner) sb.rpc('save_bones', { total: bones }).then(() => {}, () => {}); }, 800);
}
async function syncProgress(): Promise<void> {
  const me = signedInId();
  if (!backendReady || me === bonesOwner) return;
  bonesOwner = me;
  if (!me) { bones = 0; store.set('bones', 0); drawBones(); return; }
  const { data, error } = await sb.from('player_progress').select('bones').eq('user_id', me).maybeSingle();
  if (error) return;
  /* A first login keeps what this device earned as a guest. */
  if (data) { bones = data.bones; store.set('bones', bones); drawBones(); } else saveBonesSoon();
}

/* ---------- keep every character inside its space, without changing the space's shape ---------- */
function fitDolls(): void {
  document.querySelectorAll<SVGSVGElement>('.doll svg:not([data-fit])').forEach(svg => {
    if (!svg.getBoundingClientRect().width) return;
    try {
      const b = svg.getBBox(), v = svg.viewBox.baseVal, pad = 8;
      if (!b.width) return;
      const x0 = Math.min(v.x, b.x - pad), y0 = Math.min(v.y, b.y - pad), x1 = Math.max(v.x + v.width, b.x + b.width + pad), y1 = Math.max(v.y + v.height, b.y + b.height + pad);
      let w = x1 - x0, h = y1 - y0, x = x0, y = y0;
      const ratio = v.width / v.height;
      if (w / h > ratio) { const grown = w / ratio; y -= (grown - h) / 2; h = grown; } else { const grown = h * ratio; x -= (grown - w) / 2; w = grown; }
      svg.setAttribute('viewBox', [x, y, w, h].join(' '));
      svg.dataset.fit = '1';
    } catch (e) { /* not on screen yet: the next change comes back to it */ }
  });
}
let fitQueued = false;
function queueFit(): void {
  if (fitQueued) return;
  fitQueued = true;
  requestAnimationFrame(() => { fitQueued = false; fitDolls(); });
}
new MutationObserver(queueFit).observe(document.body, { childList: true, subtree: true });
