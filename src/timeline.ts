/* ---------- Spill the Tea: the shared timeline of what people have posted ---------- */
interface TeaPost { id: string; authorId: string | null; title: string; body: string; at: string }
const POST_LIMIT = 1000;
let allPosts: TeaPost[] = [];

async function refreshPosts(): Promise<void> {
  const { data, error } = await sb.from('posts').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw error;
  allPosts = data.map((row: any): TeaPost => ({ id: row.id, authorId: row.author_id, title: row.title, body: row.body, at: row.created_at }));
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

function postCard(post: TeaPost, highlight: boolean): HTMLElement {
  const author = authorOf(post);
  const face = el('span', { cls: 'teaface', 'aria-hidden': 'true' });
  face.innerHTML = post.authorId === null ? doll(DOLLS.mumtea, { head: true }) : author ? drawGhoul(author.look, { head: true }) : '';
  const who = el('div', { cls: 'teawho' }, el('strong', { text: authorName(post) }));
  if (post.authorId === null) who.append(el('span', { cls: 'teabadge', text: 'Headghoul' }));
  who.append(el('time', { datetime: post.at, title: new Date(post.at).toLocaleString(), text: timeAgo(post.at) }));
  const card = el('div', { cls: 'teacard' }, who);
  if (post.title) card.append(el('h3', { text: post.title }));
  post.body.split(/\n+/).forEach(line => card.append(el('p', { text: line })));
  const mine = isAdmin() ? post.authorId === null : post.authorId !== null && post.authorId === signedInId();
  if (mine || isAdmin()) {
    const del = el('button', { cls: 'linkish', type: 'button', async onclick() {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Click again to delete'; return; }
      const { error } = isAdmin() ? await sb.rpc('admin_delete_post', { token: adminPass, target: post.id }) : await sb.from('posts').delete().eq('id', post.id);
      if (error) { del.textContent = 'That did not work. Try again.'; return; }
      await refreshPosts();
      renderBlog(); fillSlide(); renderBoss();
    } }, mine ? 'Delete my post' : 'Delete this post');
    card.append(del);
  }
  return el('article', { cls: 'teapost' + (highlight ? ' teanew' : ''), id: 'post-' + post.id }, face, card);
}
function renderBlog(id?: string): void {
  const main = $('#blogMain'); main.textContent = '';
  if (dataState !== 'ready') {
    main.append(el('div', { cls: 'teaempty' }, el('h3', { text: dataState === 'loading' ? 'Brewing...' : 'The kettle is off' }), el('p', { text: dataState === 'loading' ? 'Fetching the latest tea.' : backendReady ? 'Could not reach the school database. Try refreshing.' : OFFLINE_NOTE })));
    return;
  }
  if (!allPosts.length) {
    main.append(el('div', { cls: 'teaempty' }, el('h3', { text: 'No tea yet' }), el('p', { text: 'Nobody has posted anything. Go on, be the first.' }), composeButton('Write the first post')));
    return;
  }
  main.append(el('div', { cls: 'timeline' }, ...allPosts.map(p => postCard(p, p.id === id))));
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
  $('#slideText').textContent = latest.body.split('\n')[0].slice(0, 170);
  read.textContent = 'Read the timeline';
  read.onclick = () => go('tea', latest.id);
}

/* ---------- the pop-up for writing a post ---------- */
const POST_TOPICS = ['Samoan men', 'Gingers', 'Politics', 'Femboys', 'Outrageous comments', 'Neurodivergent', 'DC Comics', 'Anime', 'Marvel Comics'];
const NOTE_STAR ='M0-9Q1-1 9 0Q1 1 0 9Q-1 1-9 0Q-1-1 0-9z';
const NOTE_SKULL = '<svg viewBox="0 0 90 90" width="100%" height="100%"><g fill="none" stroke="#2a1430" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round"><path d="M40 24C22 24 14 38 15 51c1 9 7 14 13 17l1 10 24 1 1-11c7-3 13-9 14-18C68 37 58 24 40 24z" fill="#fdf0e6"/><path d="M34 72v6M42 72v7M50 72v6M38 58l3-5 3 5"/></g><circle cx="30" cy="46" r="6" fill="#2a1430"/><circle cx="52" cy="46" r="6" fill="#2a1430"/><path d="M41 22L26 12q-4 10 2 15zM41 22l15-10q4 10-2 15z" fill="#ff1f8f" stroke="#2a1430" stroke-width="2.600" stroke-linejoin="round"/><path transform="translate(77 30)" d="' + NOTE_STAR + '" fill="none" stroke="#2a1430" stroke-width="2.600"/><path transform="translate(80 58) scale(.7)" d="' + NOTE_STAR + '" fill="none" stroke="#2a1430" stroke-width="3"/></svg>';
const NOTE_CAT = '<svg viewBox="0 0 112 96" width="100%" height="100%"><path transform="translate(16 28)" d="' + NOTE_STAR + '" fill="none" stroke="#14101a" stroke-width="2.600"/><path transform="translate(26 70) scale(.75)" d="' + NOTE_STAR + '" fill="none" stroke="#14101a" stroke-width="3"/><path d="M40 96C40 76 36 58 40 44L34 6L58 24Q72 20 86 24L108 6L104 44C108 58 106 76 106 96Z" fill="#14101a"/><path d="M47 42Q56 34 66 44Q56 52 47 42zM80 44Q90 34 99 42Q90 52 80 44z" fill="#fff6fb"/><ellipse cx="57" cy="43" rx="2.600" ry="6" fill="#ff1f8f"/><ellipse cx="89" cy="43" rx="2.600" ry="6" fill="#ff1f8f"/><path d="M69 56h8l-4 4z" fill="#ff1f8f"/><path d="M64 62l3 7 3-5zM82 62l-3 7-3-5z" fill="#fff6fb"/><path d="M44 54L28 50M44 60H26M102 54l10-4M102 60h10" stroke="#14101a" stroke-width="1.600" stroke-linecap="round"/></svg>';
const composer = el('dialog', { cls: 'composer', 'aria-labelledby': 'composerTitle' }) as HTMLDialogElement;
function openComposer(): void {
  composer.textContent = '';
  const close = () => composer.close();
  const heading = el('h3', { id: 'composerTitle', text: isAdmin() ? 'Spill the tea as Ms. Fangtastic' : 'Spill the tea' });
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
  const submit = el('button', { cls: 'pill', type: 'submit' }, 'Post it');
  const draft = store.get<{ t: string; b: string } | null>('draft', null);
  title.value = draft?.t || ''; body.value = draft?.b || '';
  const update = () => { count.textContent = body.value.length + ' / ' + POST_LIMIT; store.set('draft', { t: title.value, b: body.value }); };
  title.addEventListener('input', update); body.addEventListener('input', update); update();
  const doodle = el('span', { cls: 'notedoodle', 'aria-hidden': 'true' }), cat = el('span', { cls: 'notecat', 'aria-hidden': 'true' });
  doodle.innerHTML = NOTE_SKULL; cat.innerHTML = NOTE_CAT;
  /* A topic becomes the title, but never replaces a title someone typed themselves. */
  let pickedTopic = '';
  const topicList = el('div', { cls: 'topiclist', id: 'teaTopics', role: 'group', 'aria-label': 'Topic ideas', hidden: '' });
  const topicsBtn = el('button', { cls: 'pill ghost', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'teaTopics', onclick() {
    topicList.hidden = !topicList.hidden;
    topicsBtn.setAttribute('aria-expanded', String(!topicList.hidden));
  } }, 'Topics');
  POST_TOPICS.forEach(topic => topicList.append(el('button', { cls: 'chip', type: 'button', onclick() {
    if (title.value.trim() && title.value !== pickedTopic) { note.textContent = 'You already have a title. Clear it to use this topic.'; return; }
    title.value = pickedTopic = topic; note.textContent = '';
    update(); topicList.hidden = true; topicsBtn.setAttribute('aria-expanded', 'false'); body.focus();
  } }, topic)));
  const form = el('form', { cls: 'stack' },
    el('div', { cls: 'notepaper' }, title, doodle, body, el('div', { cls: 'notefoot' }, count, cat)),
    topicList,
    el('div', { cls: 'row' }, submit, topicsBtn, el('button', { cls: 'pill ghost', type: 'button', onclick: close }, 'Not yet')), note);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = body.value.trim();
    if (!text) { note.textContent = 'Write something first.'; return; }
    submit.setAttribute('disabled', '');
    /* With the code you are her. Without it the database refuses to post as her at all. */
    const postingAsBoss = isAdmin();
    const result = postingAsBoss ? await sb.rpc('admin_post', { token: adminPass, title: title.value.trim(), body: text }) : await sb.from('posts').insert({ title: title.value.trim(), body: text }).select().single();
    const { data, error } = result;
    submit.removeAttribute('disabled');
    if (error) { note.textContent = 'That did not post. Your words are still here, so try again.'; return; }
    store.set('draft', null);
    award(2);
    await refreshPosts();
    close(); fillSlide(); renderBoss(); go('tea', postingAsBoss ? data : data.id);
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
