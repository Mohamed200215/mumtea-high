/* ---------- Spill the Tea: the shared timeline of what people have posted ---------- */
interface TeaPost { id: string; authorId: string | null; title: string; body: string; at: string; editedAt: string | null }
const POST_LIMIT = 10000;
let allPosts: TeaPost[] = [];

async function refreshPosts(): Promise<void> {
  const { data, error } = await sb.from('posts').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw error;
  const photos = await sb.from('post_photos').select('post_id');
  laughReady = !photos.error;
  photoIds = new Set(photos.error ? [] : (photos.data || []).map((row: any) => row.post_id));
  allPosts = data.map((row: any): TeaPost => ({ id: row.id, authorId: row.author_id, title: row.title, body: row.body, at: row.created_at, editedAt: row.edited_at || null }));
}
function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + (mins === 1 ? ' minute ago' : ' minutes ago');
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
  const days = Math.floor(hours / 24);
  return days < 7 ? days + (days === 1 ? ' day ago' : ' days ago') : new Date(iso).toLocaleDateString();
}
const authorOf = (post: TeaPost): Student | undefined => everyone.find(s => s.id === post.authorId);
/* A post with no author is from Ms. Fangtastic. */
const authorName = (post: TeaPost): string => (post.authorId === null ? DOLLS.mumtea.name : authorOf(post)?.name || 'A ghoul');

/* compact shows a post away from the timeline: its comments stay on the timeline. */
function postCard(post: TeaPost, highlight: boolean, compact = false): HTMLElement {
  const face = faceFor(post.authorId);
  const who = el('div', { cls: 'teawho' }, el('strong', {}, personButton(post.authorId, authorName(post))));
  if (post.authorId === null) who.append(el('span', { cls: 'teabadge', text: 'Headghoul' }));
  who.append(el('time', { datetime: post.at, title: new Date(post.at).toLocaleString(), text: timeAgo(post.at) + (post.editedAt ? ', edited' : '') }));
  /* The post itself is the page it was written on, taped to the timeline. */
  const paper = el('div', { cls: 'teanote' });
  const card = el('div', { cls: 'teacard' }, who, paper);
  if (post.title) paper.append(el('h3', {}, ...emojiText(post.title)));
  if (photoIds.has(post.id)) paper.append(postPhoto(post));
  const long = post.body.length > SHORT_POST, showAll = openPosts.has(post.id);
  (long && !showAll ? post.body.slice(0, SHORT_POST).trimEnd() + '...' : post.body).split(/\n+/).forEach(line => paper.append(el('p', {}, ...emojiText(line))));
  if (long) paper.append(el('button', { cls: 'linkish readmore', type: 'button', 'aria-expanded': showAll, onclick() {
    if (showAll) openPosts.delete(post.id); else openPosts.add(post.id);
    redrawPosts();
  } }, showAll ? 'Read less' : 'Read more'));
  card.append(reactionBar(post));
  const tools = el('div', { cls: 'teatools' });
  const mine = isAdmin() ? post.authorId === null : post.authorId !== null && post.authorId === signedInId();
  if (mine) tools.append(el('button', { cls: 'linkish', type: 'button', onclick() { openComposer(post); } }, 'Edit'));
  if (mine || isAdmin()) {
    const del = el('button', { cls: 'linkish', type: 'button', async onclick() {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Click again to delete'; return; }
      const { error } = isAdmin() ? await sb.rpc('admin_delete_post', { token: adminPass, target: post.id }) : await sb.from('posts').delete().eq('id', post.id);
      if (error) { del.textContent = 'That did not work. Try again.'; return; }
      await refreshPosts();
      renderBlog(); fillSlide(); renderBoss();
    } }, mine ? 'Delete my post' : 'Delete this post');
    tools.append(del);
  }
  if (!mine && !isAdmin() && post.authorId !== null) tools.append(reportButton({ post_id: post.id }, 'this post'));
  card.append(tools);
  if (compact) {
    const count = allComments.filter(c => c.postId === post.id).length;
    card.append(el('button', { cls: 'linkish', type: 'button', onclick() { openComments.add(post.id); go('tea', post.id); } }, count ? count + (count === 1 ? ' comment' : ' comments') : 'Comment'));
  } else card.append(commentsBlock(post));
  return el('article', { cls: 'teapost' + (highlight ? ' teanew' : ''), id: 'post-' + post.id }, face, card);
}
function flyNote(flying: HTMLElement, from: DOMRect, id: string): void {
  const paperOf = (): HTMLElement | null => document.querySelector<HTMLElement>('#post-' + CSS.escape(id) + ' .teanote');
  const stick = (): void => {
    const paper = paperOf();
    if (paper) { paper.style.visibility = ''; paper.classList.remove('notestick'); void paper.offsetWidth; paper.classList.add('notestick'); }
  };
  if (matchMedia('(prefers-reduced-motion:reduce)').matches || !paperOf()) { stick(); return; }
  Object.assign(flying.style, { position: 'fixed', left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px', margin: '0', zIndex: '2000', transformOrigin: '0 0', pointerEvents: 'none', overflow: 'hidden' });
  flying.setAttribute('aria-hidden', 'true');
  document.body.append(flying);
  const start = performance.now(), LONG = 1450, ease = (k: number): number => (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
  tone(520, .08);
  const frame = (now: number): void => {
    const paper = paperOf();
    if (!paper) { flying.remove(); return; }
    paper.style.visibility = 'hidden';
    const k = Math.min(1, (now - start) / LONG), to = paper.getBoundingClientRect(), sx = to.width / from.width, sy = to.height / from.height;
    /* First the page tears up and away, then it swoops in on a curve, spinning as it goes. */
    const lift = Math.min(1, k / .22), fly = ease(Math.max(0, (k - .16) / .84)), bump = Math.sin(lift * Math.PI);
    const x = (to.left - from.left) * fly, y = (to.top - from.top) * fly - Math.sin(fly * Math.PI) * 90 - bump * 26;
    const spin = (fly < 1 ? Math.sin(fly * Math.PI * 2) * 11 : 0) - bump * 5, grow = 1 + bump * .06;
    flying.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + spin + 'deg) scale(' + (1 + (sx - 1) * fly) * grow + ',' + (1 + (sy - 1) * fly) * grow + ')';
    flying.style.boxShadow = (8 + Math.sin(fly * Math.PI) * 26) + 'px ' + (8 + Math.sin(fly * Math.PI) * 30) + 'px 0 rgba(0,0,0,.5)';
    if (k < 1) { requestAnimationFrame(frame); return; }
    flying.remove(); stick(); tone(190, .12); tone(130, .1);
  };
  requestAnimationFrame(frame);
}
function renderBlog(id?: string): void {
  const main = $('#blogMain');
  /* A reload can arrive while someone is typing a comment, so they keep their place. */
  const typing = document.activeElement as HTMLTextAreaElement | null, typingIn = main.contains(typing) ? typing?.dataset?.cmt : undefined, caret = typingIn ? typing?.selectionStart : 0;
  main.textContent = ''; blogCount.textContent = '';
  if (dataState !== 'ready') {
    main.append(el('div', { cls: 'teaempty' }, el('h3', { text: dataState === 'loading' ? 'Brewing...' : 'The kettle is off' }), el('p', { text: dataState === 'loading' ? 'Fetching the latest tea.' : backendReady ? 'Could not reach the school database. Try refreshing.' : OFFLINE_NOTE })));
    return;
  }
  if (!allPosts.length) {
    main.append(el('div', { cls: 'teaempty' }, el('h3', { text: 'No tea yet' }), el('p', { text: 'Nobody has posted anything. Go on, be the first.' }), composeButton('Write the first post')));
    return;
  }
  const shown = searchPosts(allPosts, blogQuery);
  if (blogQuery.trim()) blogCount.textContent = shown.length + (shown.length === 1 ? ' post matches' : ' posts match');
  if (!shown.length) { main.append(el('div', { cls: 'teaempty' }, el('h3', { text: 'No tea found' }), el('p', { text: 'Nothing starts with that yet. Try different letters, or spill some yourself.' }))); return; }
  main.append(el('div', { cls: 'timeline' }, ...shown.map(p => postCard(p, p.id === id))));
  if (typingIn) { const back = main.querySelector<HTMLTextAreaElement>('[data-cmt="' + typingIn + '"]'); if (back) { back.focus(); back.setSelectionRange(caret || 0, caret || 0); } }
  if (id) document.getElementById('post-' + id)?.scrollIntoView({ block: 'center' });
}
function composeButton(label: string): HTMLElement {
  return el('button', { cls: 'pill', type: 'button', onclick() { openComposer(); } }, label);
}
function fillSlide(): void {
  const latest = allPosts[0], read = $('#slideRead');
  if (!latest) {
    $('#slideTitle').textContent = 'Fresh tea';
    $('#slideText').textContent = 'The timeline is empty. Somebody has to say something first.';
    read.textContent = 'Spill the first tea';
    read.onclick = () => openComposer();
    return;
  }
  $('#slideTitle').textContent = latest.title || authorName(latest) + ' says';
  $('#slideText').replaceChildren(...emojiText(latest.body.split('\n')[0].slice(0, 170)));
  read.textContent = 'Read the timeline';
  read.onclick = () => go('tea', latest.id);
}

/* ---------- the pop-up for writing a post ---------- */
const POST_TOPICS = ['Samoan men', 'Gingers', 'Politics', 'Femboys', 'Outrageous comments', 'Neurodivergent', 'DC Comics', 'Anime', 'Marvel Comics'];
const NOTE_STAR ='M0-9Q1-1 9 0Q1 1 0 9Q-1 1-9 0Q-1-1 0-9z';
const NOTE_SKULL = '<svg viewBox="0 0 90 90" width="100%" height="100%"><g fill="none" stroke="#2a1430" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round"><path d="M40 24C22 24 14 38 15 51c1 9 7 14 13 17l1 10 24 1 1-11c7-3 13-9 14-18C68 37 58 24 40 24z" fill="#fdf0e6"/><path d="M34 72v6M42 72v7M50 72v6M38 58l3-5 3 5"/></g><circle cx="30" cy="46" r="6" fill="#2a1430"/><circle cx="52" cy="46" r="6" fill="#2a1430"/><path d="M41 22L26 12q-4 10 2 15zM41 22l15-10q4 10-2 15z" fill="#ff1f8f" stroke="#2a1430" stroke-width="2.600" stroke-linejoin="round"/><path transform="translate(77 30)" d="' + NOTE_STAR + '" fill="none" stroke="#2a1430" stroke-width="2.600"/><path transform="translate(80 58) scale(.7)" d="' + NOTE_STAR + '" fill="none" stroke="#2a1430" stroke-width="3"/></svg>';
const NOTE_CAT = '<svg viewBox="0 0 112 96" width="100%" height="100%"><path transform="translate(16 28)" d="' + NOTE_STAR + '" fill="none" stroke="#14101a" stroke-width="2.600"/><path transform="translate(26 70) scale(.75)" d="' + NOTE_STAR + '" fill="none" stroke="#14101a" stroke-width="3"/><path d="M40 96C40 76 36 58 40 44L34 6L58 24Q72 20 86 24L108 6L104 44C108 58 106 76 106 96Z" fill="#14101a"/><path d="M47 42Q56 34 66 44Q56 52 47 42zM80 44Q90 34 99 42Q90 52 80 44z" fill="#fff6fb"/><ellipse cx="57" cy="43" rx="2.600" ry="6" fill="#ff1f8f"/><ellipse cx="89" cy="43" rx="2.600" ry="6" fill="#ff1f8f"/><path d="M69 56h8l-4 4z" fill="#ff1f8f"/><path d="M64 62l3 7 3-5zM82 62l-3 7-3-5z" fill="#fff6fb"/><path d="M44 54L28 50M44 60H26M102 54l10-4M102 60h10" stroke="#14101a" stroke-width="1.600" stroke-linecap="round"/></svg>';
const composer = el('dialog', { cls: 'composer', 'aria-labelledby': 'composerTitle' }) as HTMLDialogElement;
function openComposer(editing?: TeaPost): void {
  composer.textContent = '';
  const close = () => composer.close();
  const heading = el('h3', { id: 'composerTitle', text: editing ? 'Edit your post' : isAdmin() ? 'Spill the tea as Ms. Fangtastic' : 'Spill the tea' });
  if (!signedInId() && !isAdmin()) {
    composer.append(heading, el('p', { text: 'Register or log in first, so everyone knows whose tea this is.' }),
      el('div', { cls: 'row' },
        el('button', { cls: 'pill', type: 'button', onclick() { close(); go('registration'); $('#signName').focus(); } }, 'Register or log in'),
        el('button', { cls: 'pill ghost', type: 'button', onclick: close }, 'Cancel')));
    composer.showModal();
    return;
  }
  if (myRecord()?.muted && !isAdmin()) {
    composer.append(heading, el('p', { text: 'Ms. Fangtastic has taken away your posting privileges.' }), el('div', { cls: 'row' }, el('button', { cls: 'pill ghost', type: 'button', onclick: close }, 'Close')));
    composer.showModal();
    return;
  }
  const title = el('input', { id: 'teaTitle', maxlength: 100, placeholder: 'Title', 'aria-label': 'Title (optional)' }) as HTMLInputElement;
  const body = el('textarea', { id: 'teaBody', maxlength: POST_LIMIT, required: '', placeholder: 'What are you thinking?', 'aria-label': 'What are you thinking?' }) as HTMLTextAreaElement;
  const count = el('span', { cls: 'teacount' }), note = el('p', { cls: 'accountnote', role: 'status' });
  const submit = el('button', { cls: 'pill', type: 'submit' }, editing ? 'Save changes' : 'Post it');
  const draft = store.get<{ t: string; b: string } | null>('draft', null);
  title.value = editing ? editing.title : draft?.t || ''; body.value = editing ? editing.body : draft?.b || '';
  const update = () => { count.textContent = body.value.length + ' / ' + POST_LIMIT; if (!editing) store.set('draft', { t: title.value, b: body.value }); };
  title.addEventListener('input', update); body.addEventListener('input', update); update();
  const doodle = el('span', { cls: 'notedoodle', 'aria-hidden': 'true' }), cat = el('span', { cls: 'notecat', 'aria-hidden': 'true' });
  doodle.innerHTML = NOTE_SKULL; cat.innerHTML = NOTE_CAT;
  /* Picking a topic always makes it the title. */
  const topicList = el('div', { cls: 'topiclist', id: 'teaTopics', role: 'group', 'aria-label': 'Topic ideas', hidden: '' });
  const topicsBtn = el('button', { cls: 'pill ghost', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'teaTopics', onclick() {
    topicList.hidden = !topicList.hidden;
    topicsBtn.setAttribute('aria-expanded', String(!topicList.hidden));
  } }, 'Topics');
  POST_TOPICS.forEach(topic => topicList.append(el('button', { cls: 'chip', type: 'button', onclick() {
    title.value = topic; note.textContent = '';
    update(); topicList.hidden = true; topicsBtn.setAttribute('aria-expanded', 'false'); body.focus();
  } }, topic)));
  const form = el('form', { cls: 'stack' },
    el('div', { cls: 'notepaper' }, title, doodle, body, el('div', { cls: 'notefoot' }, count, cat)), emojiRow(body),
    topicList,
    el('div', { cls: 'row' }, submit, topicsBtn, el('button', { cls: 'pill ghost', type: 'button', onclick: close }, 'Not yet')), note);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = body.value.trim();
    if (!text) { note.textContent = 'Write something first.'; return; }
    submit.setAttribute('disabled', '');
    if (editing) {
      const saved = isAdmin() ? await sb.rpc('admin_edit_post', { token: adminPass, target: editing.id, title: title.value.trim(), body: text }) : await sb.from('posts').update({ title: title.value.trim(), body: text }).eq('id', editing.id);
      submit.removeAttribute('disabled');
      if (saved.error) { note.textContent = 'That did not save. Your words are still here, so try again.'; return; }
      await refreshPosts();
      close(); fillSlide(); redrawPosts();
      return;
    }
    /* With the code you are her. Without it the database refuses to post as her at all. */
    const postingAsBoss = isAdmin();
    const result = postingAsBoss ? await sb.rpc('admin_post', { token: adminPass, title: title.value.trim(), body: text }) : await sb.from('posts').insert({ title: title.value.trim(), body: text }).select().single();
    const { data, error } = result;
    submit.removeAttribute('disabled');
    if (error) { note.textContent = /a day/.test(error.message || '') ? 'That is 50 posts today. Your words are saved here, so post them tomorrow.' : 'That did not post. Your words are still here, so try again.'; return; }
    store.set('draft', null);
    award(2);
    await refreshPosts();
    /* The page you wrote on tears off and flies to its place on the timeline. */
    const page = form.querySelector('.notepaper') as HTMLElement, from = page.getBoundingClientRect(), flying = page.cloneNode(true) as HTMLElement;
    flying.querySelector('input')?.replaceWith(el('div', { cls: 'noteflytitle', text: title.value.trim() }));
    flying.querySelector('textarea')?.replaceWith(el('div', { cls: 'noteflybody', text: text }));
    flying.querySelector('.teacount')?.remove();
    close(); fillSlide(); renderBoss(); go('tea', postingAsBoss ? data : data.id);
    flyNote(flying, from, postingAsBoss ? data : data.id);
  });
  composer.append(heading, form);
  composer.showModal();
  (title.value ? body : title).focus();
}
(function () {
  $('#root').append(composer);
  composer.addEventListener('click', e => { if (e.target === composer) composer.close(); });
  $('#homeSpill').addEventListener('click', () => openComposer());
  $('#teaWrite').addEventListener('click', () => openComposer());
})();
