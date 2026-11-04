/* ---------- accounts and the student roster, shared through Supabase ---------- */
interface Student { id: string; name: string; look: Look; joined: string; blend?: string; styled?: boolean; muted?: boolean; verified?: boolean; card?: IdCard }

const FANG_NAMES = ['mumtea', 'mumtas', 'fangtastic', 'msfangtastic', 'ms.fangtastic', 'msfantastic', 'ms.fantastic'];
const USERNAME_RULE = /^[A-Za-z0-9_.-]{3,20}$/;
const PASSWORD_MIN = 8;
const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OFFLINE_NOTE = 'The school database is not connected yet. Accounts and posts will open soon.';
const MONSTER_NAMES: Record<string, string> = { none: 'Monster in training', fangs: 'Vampire', bat: 'Vampire', wolf: 'Werewolf', fins: 'Sea monster', bolts: 'Stitched together', wraps: 'Mummy', horns: 'Little devil', stitches: 'Stitched together', cat: 'Were-cat', fox: 'Fox spirit', bunny: 'Were-bunny', dragon: 'Dragon', ghost: 'Ghost', zombie: 'Zombie', scales: 'Sea monster', elf: 'Elf', alien: 'Alien', cyclops: 'Third eye', snakes: 'Gorgon', pumpkin: 'Pumpkin kid', skeleton: 'Skeleton', antlers: 'Forest spirit', unicorn: 'Unicorn', spidereyes: 'Spider', gills: 'Sea monster', tentacles: 'Deep sea monster', tusks: 'Ogre', ram: 'Little devil', shark: 'Were-shark' };
const STUDENT_LINES = [
  'Fresh off the hearse and already late for Biteology.',
  'Has opinions about the creepateria and will share them.',
  'Sat at the wrong table on day one and stayed anyway.',
  'Keeps a spare pair of platforms in their locker.',
  'Heard the gossip before the tea finished steeping.',
  'Claims to have read the school rules. Nobody believes it.',
];
DOLLS.mumtea.look = FANG_LOOK;

let everyone: Student[] = [], sessionId: string | null = null, dataState: 'loading' | 'ready' | 'failed' = backendReady ? 'loading' : 'failed';

const toStudent = (row: any): Student => ({ id: row.id, name: row.username, look: normalizeLook(row.look), joined: row.joined_at, blend: row.blend || undefined, styled: row.styled, muted: row.muted, verified: row.verified, card: row.look && row.look.card ? normalizeCard(row.look.card) : undefined });
const loadRoster = (): Student[] => everyone.filter(s => s.verified);
const signedInId = (): string | null => sessionId;
const myRecord = (): Student | null => everyone.find(s => s.id === sessionId) || null;
const currentStudent = myRecord;
const hashOf = (text: string): number => { let h = 0; for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 9000; return h; };
const newestStudent = (): Student | null => loadRoster().slice(-1)[0] || null;
const photoKey = (): string => 'photo.' + sessionId;

async function refreshRoster(): Promise<void> {
  const { data, error } = await sb.from('profiles').select('*').order('joined_at');
  if (error) throw error;
  everyone = data.map(toStudent);
}
/* Saves columns on the signed-in person's profile, and reports whether it worked. */
async function updateMe(change: { look?: Look; blend?: string | null; styled?: boolean }): Promise<boolean> {
  /* The ID card travels inside the saved look, so saving a new outfit must carry it along. */
  const card = myRecord()?.card;
  const { error } = await sb.from('profiles').update(change.look && card ? { ...change, look: { ...change.look, card } } : change).eq('id', sessionId);
  if (error) return false;
  await refreshRoster();
  return true;
}
function setMyPhoto(photo: string): void {
  store.set(photoKey(), photo);
  renderID();
}

async function register(rawName: string, rawEmail: string, password: string, confirm: string): Promise<string> {
  const name = rawName.trim(), email = rawEmail.trim();
  if (!EMAIL_RULE.test(email)) return 'Please enter a real email address. You will need it if you ever forget your password.';
  if (!USERNAME_RULE.test(name)) return 'Usernames are 3 to 20 letters or numbers, and can use _ . or -. No spaces.';
  if (FANG_NAMES.includes(name.toLowerCase())) return 'That username is taken. Pick another, or log in.';
  if (password.length < PASSWORD_MIN) return 'Your password needs at least ' + PASSWORD_MIN + ' characters.';
  if (password !== confirm) return 'Those two passwords do not match.';
  await refreshRoster();
  if (everyone.some(s => s.name.toLowerCase() === name.toLowerCase())) return 'That username is taken. Pick another, or log in.';
  const look = studioDirty ? studioLook : randomLook();
  const { data, error } = await sb.auth.signUp({ email, password, options: { data: { username: name, look }, emailRedirectTo: location.origin + location.pathname } });
  if (error) {
    if (/registered|already exists/i.test(error.message)) return 'That email already has an account. Log in, or reset your password.';
    if (/database error/i.test(error.message)) return 'That username is taken. Pick another, or log in.';
    if (/password/i.test(error.message)) return error.message;
    if (/email/i.test(error.message)) return 'Please enter a real email address.';
    return 'Registering did not work. Please try again.';
  }
  if (!data.session) {
    pendingEmail = email;
    accountMode = 'verify';
    return '';
  }
  sessionId = data.session.user.id;
  await refreshRoster();
  const blend = store.get<string | null>('blend', null);
  if (blend) await updateMe({ blend });
  award(10);
  say('Earl Ghoul', name + ' just enrolled. New ghoul in the hallway!');
  return 'Welcome to Mumtea High, ' + name + '. Dress your new ghoul and press Save.';
}
/* The server function finds the email for this username, so the browser never sees anyone's address. */
async function logIn(rawName: string, password: string): Promise<string> {
  const { data, error } = await sb.functions.invoke('login', { body: { username: rawName.trim(), password } });
  if (error) throw error;
  if (data?.unverified) return 'Please verify your email first. We just sent a new link to the address you registered with. Check your spam folder too.';
  if (!data?.ok) return 'That username and password do not match.';
  const session = await sb.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
  if (session.error) throw session.error;
  sessionId = session.data.user.id;
  await refreshRoster();
  const me = myRecord();
  store.set('blend', me?.blend || null);
  return 'Welcome back, ' + me?.name + '.';
}
async function sendResetEmail(rawEmail: string): Promise<string> {
  const email = rawEmail.trim();
  if (!EMAIL_RULE.test(email)) return 'Please enter the email address you registered with.';
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
  if (error && error.status === 429) return 'Too many reset requests. Please wait a while and try again.';
  if (error && (error.status || 500) >= 500) return 'The reset email could not be sent. Please try again later.';
  /* The same answer either way, so this form cannot be used to find out who has an account. */
  return 'If that email has an account, a message is on its way telling you how to reset your password. Check your spam folder too.';
}
async function signOut(): Promise<void> {
  await sb.auth.signOut();
  sessionId = null;
  store.set('blend', null);
}
async function deleteMe(): Promise<boolean> {
  const { error } = await sb.rpc('delete_me');
  if (error) return false;
  store.set(photoKey(), null);
  await signOut();
  await refreshRoster();
  await refreshPosts();
  return true;
}

/* ---------- everything that shows students ---------- */
function studentCard(s: Student, mine: boolean): HTMLElement {
  const role = (MONSTER_NAMES[s.look.monster] || 'Monster') + (mine ? ' (you)' : '') + ', joined ' + new Date(s.joined).toLocaleDateString();
  const line = STUDENT_LINES[hashOf(s.id) % STUDENT_LINES.length] + (s.blend ? ' Blend: ' + s.blend + '.' : '');
  const pic = el('span', { cls: 'doll' }); pic.innerHTML = drawGhoul(s.look, { label: s.name });
  return el('article', { cls: 'student' }, pic, el('div', {}, el('h3', {}, personButton(s.id, s.name)), el('small', { text: role }), el('p', { text: line })));
}
function lineupButton(name: string, art: string, target: string | null): HTMLElement {
  const pic = el('span', { cls: 'doll' }); pic.innerHTML = art;
  return target === 'fangtastic' ? el('button', { type: 'button', 'data-go': target }, pic, name) : el('button', { type: 'button', onclick() { openProfile(target); } }, pic, name);
}
function renderStudents(): void {
  const roster = loadRoster(), me = currentStudent();
  const list = $('#students'), lineup = $('#lineup'), latest = $('#castNew');
  list.textContent = ''; lineup.textContent = ''; latest.textContent = '';

  const fang = el('span', { cls: 'doll' }); fang.innerHTML = doll(DOLLS.mumtea, { label: 'Ms. Fangtastic' });
  list.append(el('article', { cls: 'student' }, fang, el('div', {}, el('h3', { text: DOLLS.mumtea.name }), el('small', { text: 'Headghoul and boss of this school' }), el('p', { text: 'Runs the school, the blog and the group chat. Never seen without a cup.' }))));
  roster.forEach(s => list.append(studentCard(s, !!me && s.id === me.id)));
  $('#studentCount').textContent = dataState === 'loading' ? 'Taking attendance...'
    : dataState === 'failed' ? (backendReady ? 'Could not reach the school database. Try refreshing.' : OFFLINE_NOTE)
    : roster.length === 0 ? 'Ms. Fangtastic is waiting on her first student.'
    : roster.length + (roster.length === 1 ? ' student has' : ' students have') + ' enrolled so far.';

  lineup.append(lineupButton(DOLLS.mumtea.name, doll(DOLLS.mumtea), 'fangtastic'));
  roster.slice(-3).reverse().forEach(s => lineup.append(lineupButton(s.name, drawGhoul(s.look), s.id)));
  if (!signedInId() && !isAdmin()) {
    list.append(el('button', { cls: 'student seat', type: 'button', 'data-go': 'registration' }, 'This seat is empty. Register and your ghoul sits here.'));
    lineup.append(el('button', { cls: 'seatbtn', type: 'button', 'data-go': 'registration' }, 'Register to join'));
  }
  const newest = newestStudent();
  if (newest) {
    const pic = el('span', { cls: 'doll' }); pic.innerHTML = drawGhoul(newest.look, { label: 'Newest student: ' + newest.name });
    latest.append(pic);
  }
}
function renderID(): void {
  const boss = isAdmin(), me = boss ? null : currentStudent();
  const name = boss ? DOLLS.mumtea.name : me ? me.name : '';
  const blend = store.get<string | null>('blend', null) || undefined;
  if (me && me.blend !== blend) {
    me.blend = blend;
    updateMe({ blend: blend || null }).catch(() => {});
  }
  $('#idName').textContent = name || 'Not signed in';
  $('#idBlend').textContent = blend || 'Not yet steeped';
  $('#idNo').textContent = name ? 'MH-' + (1000 + hashOf(name)) : 'None yet';
  $('#hello').textContent = 'Hello, ' + (name || 'Ghoul') + '!';
  $('#idForm').hidden = !me;
  const box = $('#idPhoto'); box.textContent = '';
  const photo = me ? store.get<string | null>(photoKey(), null) : null;
  if (photo) box.append(el('img', { cls: 'idphoto', alt: 'Student photo', src: photo }));
  else if (me) { box.innerHTML = drawGhoul(me.look, { head: true }); (box.firstChild as Element).setAttribute('class', 'idphoto'); }
  else if (boss) { box.innerHTML = doll(DOLLS.mumtea, { head: true }); (box.firstChild as Element).setAttribute('class', 'idphoto'); }
  else box.append(el('div', { cls: 'idphoto idempty', text: '?' }));
  paintCard();
  idMakerRedraw();
  renderAccount();
}

/* ---------- account panel and header button ---------- */
const accountBox = el('div', { cls: 'account panel', id: 'account' });
const accountNote = el('p', { cls: 'accountnote', role: 'status' });
let accountMode: 'register' | 'login' | 'forgot' | 'verify' = 'register';
let pendingEmail = '';
function refreshAll(message: string): void {
  accountNote.textContent = message;
  paintDolls(); renderStudents(); renderID(); syncStudio(); renderProfile(); renderBlog(); fillSlide(); renderBoss(); renderAdmin(); renderScores(); renderStudentPage(); syncProgress();
}
function renderAccount(): void {
  const signed = !!signedInId();
  accountBox.textContent = '';
  $('#signBtn').textContent = isAdmin() ? 'Leave admin' : signed ? 'Log out' : 'Log in';
  if (isAdmin()) {
    accountBox.append(el('h3', { text: 'You are Ms. Fangtastic' }), el('p', { text: 'The code made you the boss. Everything you post and do here is as her.' }),
      el('div', { cls: 'row' }, el('button', { cls: 'pill', type: 'button', 'data-go': 'admin' }, 'Open the office'), el('button', { cls: 'pill ghost', type: 'button', onclick() { leaveAdmin(); } }, 'Leave admin mode')), accountNote);
    return;
  }
  if (!signed) {
    const modeButton = (mode: 'register' | 'login' | 'forgot', label: string) => el('button', { cls: 'linkish', type: 'button', onclick() { accountMode = mode; accountNote.textContent = ''; renderAccount(); } }, label);
    if (accountMode === 'verify') {
      const resend = el('button', { cls: 'pill', type: 'button', async onclick() {
        resend.setAttribute('disabled', '');
        const { error } = await sb.auth.resend({ type: 'signup', email: pendingEmail, options: { emailRedirectTo: location.origin + location.pathname } });
        resend.removeAttribute('disabled');
        accountNote.textContent = error ? 'Please wait a minute before asking for another email.' : 'Sent. Check your inbox and spam folder.';
      } }, 'Send the email again');
      accountBox.append(el('h3', { text: 'Check your email' }), el('p', { text: 'We sent a link to ' + pendingEmail + '. Click it to finish registering and meet your ghoul. If that address already has an account, log in instead.' }), el('div', { cls: 'row' }, resend), modeButton('login', 'Back to log in'), accountNote);
      return;
    }
    if (accountMode === 'forgot') {
      const email = el('input', { id: 'resetEmail', type: 'email', autocomplete: 'email', required: '' }) as HTMLInputElement;
      const send = el('button', { cls: 'pill', type: 'submit' }, 'Send reset email');
      const form = el('form', { cls: 'stack' }, el('label', { for: 'resetEmail' }, 'The email you registered with', email), el('div', { cls: 'row' }, send));
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!backendReady) { accountNote.textContent = OFFLINE_NOTE; return; }
        send.setAttribute('disabled', '');
        try { accountNote.textContent = await sendResetEmail(email.value); } catch (err) { accountNote.textContent = 'Could not reach the school database. Please try again.'; }
        send.removeAttribute('disabled');
      });
      accountBox.append(el('h3', { text: 'Forgot your password?' }), el('p', { text: 'Enter your email and we will send you a link to choose a new password.' }), form, modeButton('login', 'Back to log in'), accountNote);
      return;
    }
    const registering = accountMode === 'register';
    const name = el('input', { id: 'signName', maxlength: 20, autocomplete: 'username', required: '', autocapitalize: 'none', spellcheck: 'false' }) as HTMLInputElement;
    const email = el('input', { id: 'signEmail', type: 'email', autocomplete: 'email', required: '' }) as HTMLInputElement;
    const pass = el('input', { id: 'signPass', type: 'password', autocomplete: registering ? 'new-password' : 'current-password', required: '' }) as HTMLInputElement;
    const again = el('input', { id: 'signAgain', type: 'password', autocomplete: 'new-password', required: '' }) as HTMLInputElement;
    const submit = el('button', { cls: 'pill', type: 'submit' }, registering ? 'Register' : 'Log in');
    const form = el('form', { cls: 'stack' });
    if (registering) form.append(el('label', { for: 'signEmail' }, 'Email (kept private, only used to reset your password)', email));
    form.append(el('label', { for: 'signName' }, 'Username', name), el('label', { for: 'signPass' }, 'Password' + (registering ? ' (at least ' + PASSWORD_MIN + ' characters)' : ''), pass));
    if (registering) form.append(el('label', { for: 'signAgain' }, 'Password again', again));
    form.append(el('div', { cls: 'row' }, submit));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!backendReady) { accountNote.textContent = OFFLINE_NOTE; return; }
      submit.setAttribute('disabled', '');
      const before = loadRoster().length;
      let message = 'Could not reach the school database. Please try again.';
      try { message = registering ? await register(name.value, email.value, pass.value, again.value) : await logIn(name.value, pass.value); } catch (err) { /* the message above covers it */ }
      submit.removeAttribute('disabled');
      if (accountMode === 'verify') { accountNote.textContent = ''; renderAccount(); return; }
      if (!signedInId()) { accountNote.textContent = message; pass.value = ''; again.value = ''; pass.focus(); return; }
      refreshAll(message);
      if (loadRoster().length > before) { go('profile'); studioMsg.textContent = message; }
    });
    accountBox.append(el('h3', { text: registering ? 'Register' : 'Log in' }), el('p', { text: registering ? 'We will email you a link to verify your address. After that you only need your username and password.' : 'Welcome back. Your ghoul missed you.' }), form);
    if (registering) accountBox.append(modeButton('login', 'Already registered? Log in'));
    else accountBox.append(el('div', { cls: 'accountlinks' }, modeButton('forgot', 'Forgot your password?'), modeButton('register', 'New here? Register')));
    accountBox.append(accountNote);
    return;
  }
  const me = currentStudent();
  const buttons = el('div', { cls: 'row' },
    el('button', { cls: 'pill', type: 'button', 'data-go': 'profile' }, 'Change my look'),
    el('button', { cls: 'pill', type: 'button', async onclick() { await signOut(); refreshAll('Logged out. See you in the hallway.'); } }, 'Log out'));
  if (me) {
    const del = el('button', { cls: 'linkish', type: 'button', async onclick() {
      if (!del.dataset.sure) { del.dataset.sure = '1'; del.textContent = 'Click again to delete'; return; }
      refreshAll((await deleteMe()) ? 'Your ghoul and posts have left the school.' : 'That did not work. Please try again.');
    } }, 'Delete my ghoul and posts');
    buttons.append(del);
  }
  accountBox.append(el('h3', { text: 'Signed in as ' + (me ? me.name : 'a ghoul') }), buttons, accountNote);
}
(function () {
  $('#hello').after(el('button', { cls: 'pill', id: 'signBtn', type: 'button', async onclick() {
    if (isAdmin()) await leaveAdmin();
    else if (signedInId()) { await signOut(); refreshAll('Logged out. See you in the hallway.'); }
    else { accountMode = 'login'; accountNote.textContent = ''; renderAccount(); go('registration'); }
  } }, 'Log in'));
  $('#idcard').before(accountBox);
})();

/* ---------- choosing a new password after following the emailed link ---------- */
const passwordDialog = el('dialog', { cls: 'composer', 'aria-labelledby': 'newPassTitle' }) as HTMLDialogElement;
$('#root').append(passwordDialog);
function openNewPassword(): void {
  passwordDialog.textContent = '';
  const pass = el('input', { id: 'newPass', type: 'password', autocomplete: 'new-password', required: '' }) as HTMLInputElement;
  const again = el('input', { id: 'newPassAgain', type: 'password', autocomplete: 'new-password', required: '' }) as HTMLInputElement;
  const note = el('p', { cls: 'accountnote', role: 'status' }), save = el('button', { cls: 'pill', type: 'submit' }, 'Save new password');
  const form = el('form', { cls: 'stack' }, el('label', { for: 'newPass' }, 'New password (at least ' + PASSWORD_MIN + ' characters)', pass), el('label', { for: 'newPassAgain' }, 'New password again', again), el('div', { cls: 'row' }, save), note);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (pass.value.length < PASSWORD_MIN) { note.textContent = 'Your password needs at least ' + PASSWORD_MIN + ' characters.'; return; }
    if (pass.value !== again.value) { note.textContent = 'Those two passwords do not match.'; return; }
    save.setAttribute('disabled', '');
    const { error } = await sb.auth.updateUser({ password: pass.value });
    save.removeAttribute('disabled');
    if (error) { note.textContent = /different|same/i.test(error.message) ? 'That is your old password. Choose a different one.' : 'That did not work. Your link may have expired, so ask for a new one.'; return; }
    passwordDialog.close();
    refreshAll('Your password has been changed.');
    go('registration');
  });
  passwordDialog.append(el('h3', { id: 'newPassTitle', text: 'Choose a new password' }), form);
  passwordDialog.showModal();
  pass.focus();
}

/* ---------- connecting: runs once when the page has booted ---------- */
async function startBackend(): Promise<void> {
  if (!backendReady) { refreshAll(''); return; }
  let timer = 0;
  const reloadSoon = () => {
    clearTimeout(timer);
    timer = window.setTimeout(async () => {
      try {
        const scrollY = window.scrollY;
        await Promise.all([refreshRoster(), refreshPosts(), refreshNote(), refreshAdminStudents(), refreshScores().catch(() => {}), refreshCommunity().catch(() => {})]);
        paintDolls(); renderStudents(); renderBlog(); fillSlide(); renderBoss(); renderAdmin(); renderScores(); renderStudentPage();
        window.scrollTo(0, scrollY);
      } catch (err) { /* the next change tries again */ }
    }, 300);
  };
  try {
    const { data } = await sb.auth.getSession();
    sessionId = data.session ? data.session.user.id : null;
    if (adminPass) {
      const stillGood = await sb.rpc('admin_check', { token: adminPass });
      if (stillGood.data !== true) setPass(null);
    }
    await Promise.all([refreshRoster(), refreshPosts(), refreshNote(), refreshAdminStudents(), refreshScores().catch(() => {}), refreshCommunity().catch(() => {})]);
    dataState = 'ready';
    startScores();
    if (sessionId && !myRecord()) { await signOut(); }
    if (myRecord()) store.set('blend', myRecord()?.blend || null);
    sb.channel('school').on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, reloadSoon).on('postgres_changes', { event: '*', schema: 'public', table: 'post_reactions' }, reloadSoon).on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, reloadSoon).on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, reloadSoon).on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, reloadSoon).subscribe();
  } catch (err) {
    dataState = 'failed';
  }
  refreshAll('');
  const linked = /^#student-([0-9a-f-]{36})$/.exec(location.hash);
  if (linked) openProfile(linked[1]);
  if (cameFromVerifyLink && sessionId) {
    const blend = store.get<string | null>('blend', null);
    if (blend) await updateMe({ blend });
    award(10);
    say('Earl Ghoul', (myRecord()?.name || 'Someone') + ' just enrolled. New ghoul in the hallway!');
    refreshAll('');
    history.replaceState(null, '', '#profile');
    go('profile');
    studioMsg.textContent = 'Email verified. Welcome to Mumtea High! Dress your new ghoul and press Save.';
  }
  if (cameFromResetLink && sessionId) openNewPassword();
  if (resetLinkFailed) {
    accountMode = 'login';
    renderAccount();
    accountNote.textContent = 'That email link has expired or was already used. To get a new verification link, just log in. To reset your password, use Forgot your password.';
    history.replaceState(null, '', '#registration');
    go('registration');
  }
}
