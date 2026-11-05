/* ---------- comments, reactions, reports, student pages, search and saved bones ---------- */
interface TeaComment { id: string; postId: string; authorId: string | null; body: string; at: string }
interface TeaReaction { postId: string; userId: string | null; kind: string }
const REACTIONS: Array<[string, string, string, string]> = [
  ['fang', 'emoji/1f9db.webp', 'Fangtastic', 'Fangtastic'],
  ['tea', 'emoji/1f375.webp', 'Spilled', 'Spilled'],
  ['skull', 'emoji/1f480.webp', 'Dead', 'Dead'],
  ['heart', 'emoji/2764.webp', 'Love', 'Love'],
  ['fire', 'emoji/1f525.webp', 'Hot', 'Hot'],
  ['laugh', 'emoji/1f602.webp', 'Dead funny', 'Dead funny'],
  ['love', 'emoji/1f60d.webp', 'In love', 'In love'],
  ['queen', 'emoji/1f451.webp', 'Queen', 'Queen'],
  ['aww', 'emoji/1f97a.webp', 'Aww', 'Aww'],
  ['giggle', 'emoji/1f606.webp', 'Giggle', 'Giggle'],
  ['shades', 'emoji/1f60e.webp', 'Cool', 'Cool'],
  ['cap', 'emoji/1f9e2.webp', 'Bet', 'Bet'],
  ['mic', 'emoji/1f3a4.webp', 'Mic drop', 'Mic drop'],
  ['bored', 'emoji/1f971.webp', 'Bored', 'Bored'],
  ['flat', 'emoji/1f611.webp', 'Over it', 'Over it'],
  ['feet', 'emoji/1f9b6.webp', 'Feet', 'Feet'],
  ['dizzy', 'emoji/1f635.webp', 'Done', 'Done'],
];
// Set once the Polaroid database change is in, which is also what allows the laughing reaction.
let laughReady = false;
// Emojis people type become the same 3D pictures on every device. Each one is fetched from emoji/ only when it is used; if there is no picture the device's own emoji stays.
const TYPED_EMOJI = /\p{RI}\p{RI}|[0-9#*]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\p{EMod})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{EMod})?)*/gu;
/* A strip you can swipe, or move along with the arrows, so a long set of emojis never fills the page. */
function emojiStrip(row: HTMLElement, remember?: { at: number }): HTMLElement {
  const move = (dir: number): void => row.scrollBy({ left: dir * Math.max(120, row.clientWidth * .8), behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  const back = el('button', { cls: 'striparrow', type: 'button', 'aria-label': 'Earlier emojis', onclick() { move(-1); } }, '◀') as HTMLButtonElement;
  const more = el('button', { cls: 'striparrow', type: 'button', 'aria-label': 'More emojis', onclick() { move(1); } }, '▶') as HTMLButtonElement;
  const mark = (): void => { back.disabled = row.scrollLeft < 4; more.disabled = row.scrollLeft + row.clientWidth > row.scrollWidth - 4; if (remember) remember.at = row.scrollLeft; };
  row.addEventListener('scroll', mark, { passive: true });
  new ResizeObserver(() => { if (remember && remember.at && row.scrollLeft !== remember.at) row.scrollLeft = remember.at; mark(); }).observe(row);
  return el('div', { cls: 'emojistrip' }, back, row, more);
}
function emojiRow(area: HTMLTextAreaElement): HTMLElement {
  return emojiStrip(el('div', { cls: 'glamrow', role: 'group', 'aria-label': 'Add an emoji' }, ...REACTIONS.map(([, icon, label]) => el('button', { cls: 'glamadd', type: 'button', title: label, 'aria-label': 'Add emoji: ' + label, onclick() {
    const ch = String.fromCodePoint(parseInt(icon.slice(6, -5), 16)), at = area.selectionStart ?? area.value.length, end = area.selectionEnd ?? at;
    if (area.maxLength > 0 && area.value.length - (end - at) + ch.length > area.maxLength) return;
    area.setRangeText(ch, at, end, 'end'); area.dispatchEvent(new Event('input', { bubbles: true })); area.focus();
  } }, el('img', { src: icon, alt: '', width: 36, height: 36, loading: 'lazy' })))));
}
function emojiText(text: string): Array<Node | string> {
  const out: Array<Node | string> = [];
  let from = 0;
  for (const m of text.matchAll(TYPED_EMOJI)) {
    if (/^[\u00A9\u00AE\u2122]/.test(m[0])) continue;
    const code = Array.from(m[0]).map(ch => ch.codePointAt(0)!.toString(16)).filter(hex => hex !== 'fe0f').join('-');
    if (m.index! > from) out.push(text.slice(from, m.index));
    const img = el('img', { cls: 'typedemoji', src: 'emoji/' + code + '.webp', alt: m[0], draggable: false, loading: 'lazy' });
    img.addEventListener('error', () => img.replaceWith(m[0]));
    out.push(img);
    from = m.index! + m[0].length;
  }
  if (from < text.length) out.push(text.slice(from));
  return out;
}
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
const reactionScroll: Record<string, { at: number }> = {};
function reactionBar(post: TeaPost): HTMLElement {
  const bar = el('div', { cls: 'reactbar', role: 'group', 'aria-label': 'React to this post' });
  const used = (kind: string): number => allReactions.filter(r => r.postId === post.id && r.kind === kind).length;
  [...REACTIONS].sort((a, b) => Number(used(b[0]) > 0) - Number(used(a[0]) > 0)).forEach(([kind, icon, label]) => {
    if (kind === 'laugh' && !laughReady) return;
    const here = allReactions.filter(r => r.postId === post.id && r.kind === kind);
    const mine = here.some(r => actorIs(r.userId));
    bar.append(el('button', { cls: 'reactbtn glamreact', type: 'button', title: label, 'aria-label': label + ', ' + here.length, 'aria-pressed': mine, async onclick() {
      if (!canAct()) { go('registration'); return; }
      const { error } = isAdmin() ? await sb.rpc('admin_toggle_reaction', { token: adminPass, target: post.id, which: kind })
        : mine ? await sb.from('post_reactions').delete().eq('post_id', post.id).eq('kind', kind).eq('user_id', signedInId())
        : await sb.from('post_reactions').insert({ post_id: post.id, kind });
      if (error) return;
      await refreshCommunity().catch(() => {});
      redrawPosts();
    } }, el('img', { src: icon, alt: '', width: 36, height: 36, draggable: false }), el('span', { text: here.length ? String(here.length) : '' })));
  });
  return emojiStrip(bar, reactionScroll[post.id] || (reactionScroll[post.id] = { at: 0 }));
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
    el('div', { cls: 'cmtwho' }, personButton(c.authorId), el('time', { datetime: c.at, text: timeAgo(c.at) })), el('p', {}, ...emojiText(c.body)), tools));
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
  const form = el('form', { cls: 'cmtform' }, area, emojiRow(area), el('div', { cls: 'row' }, send), note);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = area.value.trim();
    if (!text) { note.textContent = 'Write something first.'; return; }
    send.setAttribute('disabled', '');
    const { error } = isAdmin() ? await sb.rpc('admin_comment', { token: adminPass, target: post.id, body: text }) : await sb.from('comments').insert({ post_id: post.id, body: text });
    send.removeAttribute('disabled');
    if (error) { note.textContent = /a day/.test(error.message || '') ? 'That is 50 comments today. Come back tomorrow.' : 'That did not post. Your words are still here, so try again.'; return; }
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
  if (s.card && s.card.emblem !== 'none') facts.append(el('dt', { text: 'Emblem' }), el('dd', {}, emblemEl(s.card.emblem, s.card.metal, 'emblem studentemblem')));
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
/* The browser only says how many bones were just earned. The server adds them on, up to a daily limit. */
let bonesDirty = false, bonesPending = 0;
function saveBonesSoon(earned: number): void {
  clearTimeout(bonesTimer);
  bonesPending += earned; bonesDirty = bonesPending > 0;
  bonesTimer = window.setTimeout(() => { flushBones().catch(() => {}); }, 800);
}
async function flushBones(): Promise<void> {
  clearTimeout(bonesTimer);
  if (!bonesDirty || !signedInId() || signedInId() !== bonesOwner) return;
  const amount = bonesPending;
  const { data, error } = await sb.rpc('earn_bones', { amount });
  if (error) return;
  bonesPending -= amount; bonesDirty = bonesPending > 0;
  if (!bonesDirty) { bones = data as number; store.set('bones', bones); drawBones(); }
}
/* The account is the bank: a purchase on another device must show here too. */
async function refreshBones(): Promise<void> {
  const me = signedInId();
  if (!backendReady || !me || bonesDirty || me !== bonesOwner) return;
  const { data, error } = await sb.from('player_progress').select('bones').eq('user_id', me).maybeSingle();
  if (error || !data) return;
  bones = data.bones; store.set('bones', bones); drawBones();
}
async function syncProgress(): Promise<void> {
  const me = signedInId();
  if (!backendReady || me === bonesOwner) return;
  bonesOwner = me;
  bonesPending = 0; bonesDirty = false;
  if (!me) { bones = 0; store.set('bones', 0); drawBones(); return; }
  const { data, error } = await sb.from('player_progress').select('bones').eq('user_id', me).maybeSingle();
  if (error) return;
  /* A first login keeps what this device earned as a guest. */
  if (data) { bones = data.bones; store.set('bones', bones); drawBones(); } else saveBonesSoon(bones);
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
