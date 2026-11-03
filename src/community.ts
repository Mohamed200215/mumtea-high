/* ---------- comments, reactions, reports, student pages, search and saved bones ---------- */
interface TeaComment { id: string; postId: string; authorId: string | null; body: string; at: string }
interface TeaReaction { postId: string; userId: string | null; kind: string }
// Pictures are Microsoft Fluent Emoji (MIT licence), kept inside the page so they appear at once.
const REACTIONS: Array<[string, string, string]> = [
  ['fang', 'data:image/webp;base64,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', 'Fangtastic'],
  ['tea', 'data:image/webp;base64,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', 'Spilled'],
  ['skull', 'data:image/webp;base64,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', 'Dead'],
  ['heart', 'data:image/webp;base64,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', 'Love'],
  ['fire', 'data:image/webp;base64,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', 'Hot'],
];
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
    } }, el('img', { src: icon, alt: '', width: 26, height: 26, draggable: false }), el('span', { text: here.length ? String(here.length) : '' })));
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

/* ---------- finished characters become one picture, so scrolling doesn't repaint hundreds of shapes ---------- */
function bakeSvg(svg: Element | null): void {
  if (!svg) return;
  const img = document.createElement('img');
  img.decoding = 'sync';
  img.alt = svg.getAttribute('aria-label') || '';
  img.draggable = false;
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  svg.replaceWith(img);
}
/* ---------- keep every character inside its space, without changing the space's shape ---------- */
function fitDolls(): void {
  document.querySelectorAll('.teaface svg,.cmtface svg,.lbface svg').forEach(bakeSvg);
  document.querySelectorAll<SVGSVGElement>('.doll svg').forEach(svg => {
    if (!svg.getBoundingClientRect().width) return;
    try {
      const b = svg.getBBox(), v = svg.viewBox.baseVal, pad = 8;
      if (!b.width) return;
      const x0 = Math.min(v.x, b.x - pad), y0 = Math.min(v.y, b.y - pad), x1 = Math.max(v.x + v.width, b.x + b.width + pad), y1 = Math.max(v.y + v.height, b.y + b.height + pad);
      let w = x1 - x0, h = y1 - y0, x = x0, y = y0;
      const ratio = v.width / v.height;
      if (w / h > ratio) { const grown = w / ratio; y -= (grown - h) / 2; h = grown; } else { const grown = h * ratio; x -= (grown - w) / 2; w = grown; }
      svg.setAttribute('viewBox', [x, y, w, h].join(' '));
      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));
      bakeSvg(svg);
    } catch (e) { /* not on screen yet: the next change comes back to it */ }
  });
}
let fitQueued = false;
function queueFit(): void {
  if (fitQueued) return;
  fitQueued = true;
  requestAnimationFrame(() => { fitQueued = false; fitDolls(); });
}
new MutationObserver(queueFit).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
