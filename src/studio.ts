/* ---------- the wardrobe: used by the Profile page and Scream Queen Closet ---------- */
let studioLook: Look = randomLook(), studioSaved: Look = studioLook, studioPage = 0, studioDirty = false, studioForFang = false;
const studioRoot = el('div', { cls: 'studio' });
const studioTitle = el('h4', { cls: 'wtitle', 'aria-live': 'polite' });
const studioCount = el('span', { cls: 'wcount' });
const studioTiles = el('div', { cls: 'wtiles' });
const studioSwatches = el('div', { cls: 'wswatches' });
const studioStage = el('div', { cls: 'lockerdoll' });
const studioName = el('div', { cls: 'nametag' });
const studioMsg = el('p', { cls: 'studiomsg', role: 'status' });

function changeLook(key: keyof Look, value: string): void {
  studioLook = { ...studioLook, [key]: value };
  studioDirty = true;
  studioMsg.textContent = signedInId() || studioForFang ? 'Not saved yet.' : 'Register to keep this look.';
  drawStudio();
}
function drawStudioStage(): void {
  const owner = studioForFang ? DOLLS.mumtea.name : currentStudent()?.name || 'New ghoul';
  studioName.textContent = owner;
  studioStage.innerHTML = drawGhoul(studioLook, { label: owner, box: WIDE_BOX });
}
/* Widens the view so the whole drawing sits inside its box. Sizes are only known once the box is on screen. */
function fitInBox(svg: SVGSVGElement | null, box: string): void {
  if (!svg) return;
  try {
    const b = svg.getBBox(), [x, y, w, h] = box.split(' ').map(Number), pad = 8;
    if (!b.width) return;
    const left = Math.min(x, b.x - pad), top = Math.min(y, b.y - pad);
    svg.setAttribute('viewBox', [left, top, Math.max(x + w, b.x + b.width + pad) - left, Math.max(y + h, b.y + b.height + pad) - top].join(' '));
  } catch { /* not on screen yet: the observer below comes back to it */ }
}
function fitStudio(): void {
  fitInBox(studioStage.querySelector('svg'), WIDE_BOX);
  studioTiles.querySelectorAll<HTMLElement>('.wpic[data-box]').forEach(pic => fitInBox(pic.querySelector('svg'), pic.dataset.box as string));
}
function drawStudio(): void {
  const page = WARDROBE[studioPage];
  const focused = (document.activeElement as HTMLElement | null)?.dataset?.w;
  studioTitle.textContent = page.title;
  studioCount.textContent = (studioPage + 1) + ' of ' + WARDROBE.length;
  studioTiles.textContent = ''; studioSwatches.textContent = '';
  (page.items || []).forEach(([id, label]) => {
    const pic = el('span', { cls: 'wpic' });
    const isPose = page.key === 'pose';
    /* Clothes are shown laid flat in the classic pose, so only the Poses page shows the whole figure moving. */
    pic.innerHTML = drawGhoul({ ...studioLook, pose: 'classic', [page.key as keyof Look]: id }, isPose ? { box: page.box } : { only: page.layers, box: page.box });
    if (!page.crop) pic.dataset.box = page.box;
    studioTiles.append(el('button', { cls: 'wtile', type: 'button', 'data-w': page.key + ':' + id, 'aria-pressed': studioLook[page.key as keyof Look] === id, onclick() { changeLook(page.key as keyof Look, id); } }, pic, el('small', { text: label })));
  });
  studioTiles.hidden = !page.items;
  const row = (label: string, buttons: HTMLElement[]) => studioSwatches.append(el('div', { cls: 'wrow' }, el('span', { text: label }), ...buttons));
  page.colours.forEach(([key, label, values]) => row(label, values.map(c => {
    const b = el('button', { cls: 'wswatch', type: 'button', 'data-w': key + ':' + c, 'aria-label': label + ' ' + c, 'aria-pressed': studioLook[key] === c, onclick() { changeLook(key, c); } });
    b.style.background = c;
    return b;
  })));
  if (page.pattern) {
    const key = page.pattern;
    row('Pattern', PATTERNS.map(([id, label]) => el('button', { cls: 'wchip', type: 'button', 'data-w': key + ':' + id, 'aria-pressed': studioLook[key] === id, onclick() { changeLook(key, id); } }, label)));
  }
  drawStudioStage();
  fitStudio();
  if (focused) (studioRoot.querySelector('[data-w="' + focused + '"]') as HTMLElement | null)?.focus();
}
function syncStudio(): void {
  studioForFang = isAdmin();
  const me = currentStudent();
  if (studioForFang) studioLook = DOLLS.mumtea.look;
  else if (me) studioLook = me.look;
  else if (!studioDirty) studioLook = randomLook();
  studioSaved = studioLook;
  if (signedInId() || studioForFang) studioDirty = false;
  studioMsg.textContent = '';
  drawStudio();
}
async function saveStudio(): Promise<void> {
  if (studioForFang) {
    studioMsg.textContent = 'Saving...';
    const { error } = await sb.rpc('admin_set_fang_look', { token: adminPass, look: studioLook });
    if (error) { studioMsg.textContent = 'That did not save. Please try again.'; return; }
    DOLLS.mumtea.look = studioLook;
    studioSaved = studioLook; studioDirty = false;
    paintDolls(); renderStudents();
    studioMsg.textContent = 'Ms. Fangtastic is dressed. Everyone sees this look now.';
    return;
  }
  const me = currentStudent();
  if (me) {
    studioMsg.textContent = 'Saving...';
    if (!(await updateMe({ look: studioLook, styled: true }))) { studioMsg.textContent = 'That did not save. Please try again.'; return; }
    if (!me.styled) award(10);
  } else {
    studioMsg.textContent = 'Register on the Registration page to save your ghoul.';
    return;
  }
  studioSaved = studioLook; studioDirty = false;
  renderStudents(); renderID();
  studioMsg.textContent = 'Look saved. It shows on the Students page and your student ID.' + (me && !me.styled ? ' +10 bones' : '');
}
function mountStudio(parent: Element): void {
  if (studioRoot.parentElement !== parent) parent.append(studioRoot);
}
/* Called whenever the page changes view. */
function viewOpened(v: string): void {
  if (v === 'admin') { renderAdmin(); if (isAdmin()) mountStudio($('#adminStudio')); }
  if (v === 'profile') { renderProfile(); if (signedInId() || isAdmin()) mountStudio($('#profileStudio')); }
  if (v === 'games' && currentGame === 'closet') mountStudio($('#closetHome'));
}
function renderProfile(): void {
  const box = $('#profileBox'); box.textContent = '';
  const me = currentStudent();
  $('#profileStudio').hidden = !me && !isAdmin();
  if (isAdmin()) {
    $('#profileLede').textContent = 'You are Ms. Fangtastic. Change her look here and everyone sees it. Press Save to keep it.';
    box.append(el('h3', { cls: 'profilename', text: DOLLS.mumtea.name }), el('p', { cls: 'profilefact', text: 'Headghoul and boss of Mumtea High' }));
    return;
  }
  if (!me) {
    $('#profileLede').textContent = 'Your character lives here once you have registered.';
    box.append(el('div', { cls: 'row' }, el('button', { cls: 'pill', type: 'button', 'data-go': 'registration' }, 'Register or log in')));
    return;
  }
  $('#profileLede').textContent = 'Change your clothes and your whole aesthetic whenever you like. Press Save to keep it.';
  const facts = [(MONSTER_NAMES[me.look.monster] || 'Monster') + ', joined ' + new Date(me.joined).toLocaleDateString(), me.blend ? 'Blend: ' + me.blend : 'Blend: take the quiz on the Registration page'];
  box.append(el('h3', { cls: 'profilename', text: me.name }), ...facts.map(text => el('p', { cls: 'profilefact', text })));
}
(function () {
  const nav = (dir: number) => el('button', { cls: 'wnav', type: 'button', onclick() { studioPage = (studioPage + dir + WARDROBE.length) % WARDROBE.length; drawStudio(); } }, dir < 0 ? 'Back' : 'Next');
  const left = el('div', { cls: 'wardrobe' }, el('div', { cls: 'wbar' }, nav(-1), el('div', { cls: 'wribbon' }, studioTitle, studioCount), nav(1)), el('div', { cls: 'wframe' }, studioTiles, studioSwatches));
  const buttons = el('div', { cls: 'stagebtns' },
    el('button', { cls: 'wnav', type: 'button', onclick() { studioLook = studioSaved; studioDirty = false; studioMsg.textContent = 'Back to your last saved look.'; drawStudio(); } }, 'Restart'),
    el('button', { cls: 'wnav', type: 'button', onclick() { studioLook = randomLook(); studioDirty = true; studioMsg.textContent = signedInId() || studioForFang ? 'Not saved yet.' : 'Register to keep this look.'; drawStudio(); } }, 'Surprise me'),
    el('button', { cls: 'wnav wsave', type: 'button', onclick() { saveStudio(); } }, 'Save'));
  const right = el('div', { cls: 'wstage' }, el('div', { cls: 'locker' }, el('div', { cls: 'lockerinside' }, studioStage)), studioName, buttons, studioMsg);
  studioRoot.append(left, right);
  new ResizeObserver(() => fitStudio()).observe(studioTiles);
})();
