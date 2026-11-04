/* ---------- Ms. Fangtastic is always on show. Whoever enters the admin code runs the school. ----------
   The code is never in this file. The database checks it and hands back a pass that lasts 12 hours,
   and it checks that pass again on every action (supabase/schema.sql). The buttons here only ask. */
const DEFAULT_NOTE = 'Everyone is welcome at Mumtea High. Sit down, pour a cup, say what you actually think.';
const ADMIN_PASS_KEY = 'mh.adminPass';
let siteNote = '', adminStudents: Student[] = [], adminReports: any[] = [];

const readPass = (): string | null => { try { return sessionStorage.getItem(ADMIN_PASS_KEY); } catch (e) { return null; } };
let adminPass: string | null = readPass();
const isAdmin = (): boolean => !!adminPass;
function setPass(pass: string | null): void {
  adminPass = pass;
  try { if (pass) sessionStorage.setItem(ADMIN_PASS_KEY, pass); else sessionStorage.removeItem(ADMIN_PASS_KEY); } catch (e) { /* the pass still lasts until the page closes */ }
}

async function refreshNote(): Promise<void> {
  const { data, error } = await sb.from('site_settings').select('note, fang_look').eq('id', 1).maybeSingle();
  if (error) throw error;
  siteNote = data?.note || '';
  DOLLS.mumtea.look = data?.fang_look ? normalizeLook({ ...FANG_LOOK, ...data.fang_look }) : FANG_LOOK;
}
async function refreshAdminStudents(): Promise<void> {
  if (!isAdmin()) { adminStudents = []; adminReports = []; return; }
  const { data, error } = await sb.rpc('admin_students', { token: adminPass });
  if (error) { adminEnded(); return; }
  adminStudents = data.map(toStudent);
  const reports = await sb.rpc('admin_reports', { token: adminPass });
  adminReports = reports.error ? [] : reports.data;
}
/* The pass expired, or the code was changed. */
function adminEnded(): void {
  setPass(null);
  adminStudents = [];
}
/* From the "Got a code?" box on the main page. Returns what the box should say. */
async function tryAdminCode(code: string): Promise<string | null> {
  if (!backendReady) return null;
  const { data, error } = await sb.rpc('admin_enter', { code });
  if (error) return 'Could not check that code. Please try again.';
  if (data?.locked) return 'Too many wrong codes. Try again in 15 minutes.';
  if (!data?.ok) return null;
  setPass(data.token);
  await refreshAdminStudents();
  refreshAll('');
  go('admin');
  return 'Welcome, Ms. Fangtastic.';
}
async function leaveAdmin(): Promise<void> {
  const pass = adminPass;
  setPass(null);
  adminStudents = [];
  if (pass) await sb.rpc('admin_leave', { token: pass });
  refreshAll('');
}

/* Her note and latest posts, on the main page and her own page. */
function renderBoss(): void {
  const note = siteNote || DEFAULT_NOTE;
  $$('[data-boss-note]').forEach(n => { n.textContent = note; });
  const list = $('#fangPosts'); list.textContent = '';
  const hers = allPosts.filter(p => p.authorId === null).slice(0, 3);
  $('#fangPostsBox').hidden = !hers.length;
  hers.forEach(p => { const card = postCard(p, false, true); card.removeAttribute('id'); list.append(card); });
  $('#navAdmin').hidden = !isAdmin();
  if (!isAdmin() && !$('[data-view="admin"]').hidden) go('home');
}

function renderAdmin(): void {
  const box = $('#adminBox'); box.textContent = '';
  $('#adminStudioBox').hidden = !isAdmin();
  if (!isAdmin()) {
    box.append(el('p', { text: 'Only someone with the admin code can come in here.' }));
    return;
  }
  const status = el('p', { cls: 'accountnote', role: 'status' });
  const run = async (name: string, args: Record<string, unknown>, done: string): Promise<void> => {
    status.textContent = 'Working...';
    const { error } = await sb.rpc(name, { token: adminPass, ...args });
    if (error) {
      if (/admin access/i.test(error.message || '')) { adminEnded(); refreshAll(''); return; }
      status.textContent = 'That did not work. Please try again.';
      return;
    }
    await Promise.all([refreshRoster(), refreshPosts(), refreshNote(), refreshAdminStudents(), refreshCommunity().catch(() => {}), refreshScores().catch(() => {})]);
    paintDolls(); renderStudents(); renderBlog(); fillSlide(); renderBoss(); renderAdmin(); renderScores();
    $('#adminBox .accountnote').textContent = done;
  };

  const noteInput = el('textarea', { id: 'noteInput', maxlength: 300, rows: 3 }) as HTMLTextAreaElement;
  noteInput.value = siteNote || DEFAULT_NOTE;
  const noteForm = el('form', { cls: 'stack' }, el('label', { for: 'noteInput' }, 'The note on the main page', noteInput), el('div', { cls: 'row' }, el('button', { cls: 'pill', type: 'submit' }, 'Save note')));
  noteForm.addEventListener('submit', e => {
    e.preventDefault();
    run('admin_set_note', { note: noteInput.value.trim() }, 'Note saved.');
  });

  const reports = el('div', { cls: 'adminlist' });
  if (!adminReports.length) reports.append(el('p', { text: 'Nothing has been reported. The halls are quiet.' }));
  adminReports.forEach(r => {
    const sure = (label: string, name: string, args: Record<string, unknown>, done: string) => {
      const b = el('button', { cls: 'pill danger', type: 'button', onclick() {
        if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'Click again to confirm'; return; }
        run(name, args, done);
      } }, label);
      return b;
    };
    const kind = r.post_id ? 'Post' : r.comment_id ? 'Comment' : 'Account';
    const author = r.author_id ? nameOf(r.author_id) : DOLLS.mumtea.name;
    const buttons = el('div', { cls: 'row' });
    if (r.in_post) buttons.append(el('button', { cls: 'pill ghost', type: 'button', onclick() { if (r.comment_id) openComments.add(r.in_post); blogQuery = ''; go('tea', r.in_post); } }, 'See it'));
    if (r.target_user) buttons.append(el('button', { cls: 'pill ghost', type: 'button', onclick() { openProfile(r.target_user); } }, 'See profile'));
    if (r.post_id) buttons.append(sure('Delete post', 'admin_delete_post', { target: r.post_id }, 'Post deleted.'));
    if (r.comment_id) buttons.append(sure('Delete comment', 'admin_delete_comment', { target: r.comment_id }, 'Comment deleted.'));
    if (r.author_id) buttons.append(sure('Delete ' + author + "'s account", 'admin_delete_user', { target: r.author_id }, author + ' has been removed from the school.'));
    buttons.append(el('button', { cls: 'pill ghost', type: 'button', onclick() { run('admin_dismiss_report', { target: r.id }, 'Report dismissed.'); } }, 'Dismiss'));
    const said = kind === 'Account' ? '' : (r.title ? r.title + ': ' : '') + r.body;
    reports.append(el('div', { cls: 'adminrow reportrow' }, el('div', { cls: 'adminwho' },
      el('strong', { text: kind + ' by ' + author }), el('small', { text: 'Reported by ' + (r.reporter || 'a former student') + ', ' + timeAgo(r.at) }), el('p', { cls: 'reportwhy', text: r.reason }), said ? el('p', { text: said.slice(0, 280) + (said.length > 280 ? '...' : '') }) : ''), buttons));
  });

  const people = el('div', { cls: 'adminlist' });
  if (!adminStudents.length) people.append(el('p', { text: 'No students have registered yet.' }));
  adminStudents.slice().reverse().forEach(s => {
    const face = el('span', { cls: 'teaface', 'aria-hidden': 'true' }); face.innerHTML = drawGhoul(s.look, { head: true });
    const count = allPosts.filter(p => p.authorId === s.id).length;
    const mute = el('button', { cls: 'pill ghost', type: 'button', onclick() {
      run('admin_set_muted', { target: s.id, value: !s.muted }, s.name + (s.muted ? ' can post again.' : ' can no longer post.'));
    } }, s.muted ? 'Unmute' : 'Mute');
    const del = el('button', { cls: 'pill danger', type: 'button', onclick() {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Click again to delete'; return; }
      run('admin_delete_user', { target: s.id }, s.name + ' has been removed from the school.');
    } }, 'Delete member');
    people.append(el('div', { cls: 'adminrow' }, face,
      el('div', { cls: 'adminwho' }, el('strong', { text: s.name }), el('small', { text: count + (count === 1 ? ' post' : ' posts') + ', joined ' + new Date(s.joined).toLocaleDateString() + (s.muted ? ', muted' : '') + (s.verified ? '' : ', email not verified') })),
      el('div', { cls: 'row' }, mute, del)));
  });

  const posts = el('div', { cls: 'adminlist' });
  if (!allPosts.length) posts.append(el('p', { text: 'Nobody has posted yet.' }));
  allPosts.forEach(p => {
    const del = el('button', { cls: 'pill danger', type: 'button', onclick() {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Click again to delete'; return; }
      run('admin_delete_post', { target: p.id }, 'Post deleted.');
    } }, 'Delete post');
    posts.append(el('div', { cls: 'adminrow' },
      el('div', { cls: 'adminwho' }, el('strong', { text: authorName(p) }), el('small', { text: timeAgo(p.at) }), el('p', { text: (p.title ? p.title + ': ' : '') + p.body.slice(0, 160) + (p.body.length > 160 ? '...' : '') })), del));
  });

  box.append(status,
    el('div', { cls: 'adminbar' },
      el('div', { cls: 'adminstats' }, el('div', {}, el('strong', { text: String(adminStudents.length) }), el('span', { text: adminStudents.length === 1 ? 'member' : 'members' })), el('div', {}, el('strong', { text: String(allPosts.length) }), el('span', { text: allPosts.length === 1 ? 'post' : 'posts' }))),
      el('div', { cls: 'row' }, composeButton('Write a post'), el('button', { cls: 'pill ghost', type: 'button', onclick() { leaveAdmin(); } }, 'Leave admin mode'))),
    el('section', { cls: 'panel' }, el('h3', { text: 'Reports (' + adminReports.length + ')' }), reports),
    el('section', { cls: 'panel' }, el('h3', { text: 'Your note' }), noteForm),
    el('section', { cls: 'panel' }, el('h3', { text: 'Members' }), people),
    el('section', { cls: 'panel' }, el('h3', { text: 'Posts' }), posts));
}
