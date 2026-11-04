/* ---------- the wardrobe: used by the Profile page and Scream Queen Closet ---------- */
let studioLook: Look = randomLook(), studioSaved: Look = studioLook, studioPage = 0, studioDirty = false, studioForFang = false, studioStale = true;
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
  /* Picking an item only moves the highlight and redresses the big figure. The previews stay as they are. */
  if (key === WARDROBE[studioPage].key && !studioStale) {
    studioTiles.querySelectorAll<HTMLElement>('.wtile').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.w === key + ':' + value)));
    drawStudioStage();
    fitStudio();
    bakeInBackground();
    return;
  }
  drawStudio();
}
function drawStudioStage(): void {
  const owner = studioForFang ? DOLLS.mumtea.name : currentStudent()?.name || 'New ghoul';
  studioName.textContent = owner;
  studioStage.innerHTML = drawGhoul(studioLook, { label: owner, box: WIDE_BOX, detail: true });
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
  const figure = studioStage.querySelector('svg');
  if (!figure) return;
  fitInBox(figure, WIDE_BOX);
  const view = figure.viewBox.baseVal;
  figure.setAttribute('width', String(view.width));
  figure.setAttribute('height', String(view.height));
  bakeSvg(figure);
}
/* Every page's previews are prepared in the background as finished pictures, so Next shows them at once. */
const FACE_PARTS: Array<keyof Look> = ['skin', 'eye', 'lip', 'shadow', 'hair', 'hairStyle', 'eyeStyle', 'brow', 'browC', 'nose', 'lipSize'];
const TILE_PARTS: Record<string, Array<keyof Look>> = {
  hairStyle: ['hair', 'streak', 'skin'], lipSize: FACE_PARTS, eyeStyle: FACE_PARTS, brow: [...FACE_PARTS, 'trim'], nose: [...FACE_PARTS, 'trim'], mark: [...FACE_PARTS, 'trim'],
  eyewear: ['skin', 'trim'], monster: [...FACE_PARTS, 'trim', 'streak'], top: ['topC', 'topP', 'trim'], bottom: ['bottomC', 'bottomP', 'trim', 'skin'], legs: ['legsC', 'trim', 'skin'], shoes: ['shoesC', 'trim', 'skin'],
  headwear: ['trim', 'topC', 'skin'], neck: ['trim', 'skin'], gloves: ['gloveC', 'trim', 'skin'], wrist: ['trim', 'skin', 'gloves', 'gloveC', 'top', 'topC', 'topP'], back: ['trim', 'topC'], hold: ['trim'], pet: ['petC'],
};
interface TileStore { sig: string; fresh: Record<string, string>; art: Record<string, HTMLCanvasElement> }
const tileStores: Record<string, TileStore> = {};
const measureHost = el('div', { style: 'position:fixed;left:-3000px;top:0;width:120px;height:120px;visibility:hidden' });
const measureRoot = measureHost.attachShadow({ mode: 'open' });
const tileSig = (page: WardrobePage): string => {
  const parts = page.key === 'pose' ? (Object.keys(studioLook) as Array<keyof Look>).filter(k => k !== 'pose') : TILE_PARTS[page.key as string] || (Object.keys(studioLook) as Array<keyof Look>).filter(k => k !== page.key);
  return parts.map(k => studioLook[k]).join('|');
};
function storeFor(page: WardrobePage): TileStore {
  const store = tileStores[page.title] || (tileStores[page.title] = { sig: '', fresh: {}, art: {} });
  const sig = tileSig(page);
  if (store.sig !== sig) { store.sig = sig; store.fresh = {}; }
  return store;
}
function bakeTile(page: WardrobePage, id: string): string {
  const look = { ...studioLook, pose: 'classic', [page.key as keyof Look]: id };
  measureRoot.innerHTML = page.key === 'pose' ? drawGhoul({ ...look, pose: id }, { box: page.box, plain: true }) : drawGhoul(look, { only: page.layers, box: page.box, plain: true });
  const svg = measureRoot.querySelector('svg') as SVGSVGElement;
  if (page.crop) {
    /* A zoomed-in preview: widen its short side, so the picture fills the square tile. */
    const [x, y, w, h] = page.box.split(' ').map(Number), side = Math.max(w, h);
    svg.setAttribute('viewBox', [x - (side - w) / 2, y - (side - h) / 2, side, side].join(' '));
  } else fitInBox(svg, page.box);
  const view = svg.viewBox.baseVal, tall = 224;
  svg.setAttribute('height', String(tall));
  svg.setAttribute('width', String(Math.round(tall * view.width / view.height)));
  const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  measureRoot.innerHTML = '';
  return src;
}
/* Each preview ends up as a ready-made image, which the browser can show without any drawing work. */
function keepTile(page: WardrobePage, store: TileStore, id: string, done?: () => void): string {
  const src = store.fresh[id] = bakeTile(page, id);
  const picture = new Image();
  picture.onload = () => {
    if (store.fresh[id] === src) {
      const art = document.createElement('canvas');
      art.width = picture.naturalWidth || 224; art.height = picture.naturalHeight || 224;
      art.getContext('2d')?.drawImage(picture, 0, 0, art.width, art.height);
      store.art[id] = art;
      if (WARDROBE[studioPage] === page) studioTiles.querySelector('[data-w="' + page.key + ':' + id + '"] .wpic')?.replaceChildren(art);
    }
    done?.();
  };
  picture.onerror = () => done?.();
  picture.src = src;
  return src;
}
let bakingNow = 0;
function bakeInBackground(): void {
  clearTimeout(bakingNow);
  const order = WARDROBE.map((_, i) => (studioPage + i) % WARDROBE.length);
  const step = () => {
    for (const index of order) {
      const page = WARDROBE[index];
      if (!page.items) continue;
      const store = storeFor(page), todo = page.items.find(([id]) => !store.fresh[id]);
      if (!todo) continue;
      /* One at a time, staying out of the way of whatever the visitor is doing. */
      keepTile(page, store, todo[0], () => { bakingNow = window.setTimeout(step, index === studioPage ? 0 : 6); });
      return;
    }
  };
  bakingNow = window.setTimeout(step, 0);
}
const page0 = (): TileStore | null => { const p = WARDROBE[studioPage]; return p.items ? storeFor(p) : null; };
function drawStudio(redress = true): void {
  /* Nobody can see it on another page. It draws when it comes into view. */
  if (!studioRoot.getClientRects().length) { studioStale = true; return; }
  studioStale = false;
  const tiles = page0();
  const page = WARDROBE[studioPage];
  const focused = (document.activeElement as HTMLElement | null)?.dataset?.w;
  studioTitle.textContent = page.title;
  studioCount.textContent = (studioPage + 1) + ' of ' + WARDROBE.length;
  studioTiles.textContent = ''; studioSwatches.textContent = '';
  (page.items || []).forEach(([id, label]) => {
    const pic = el('span', { cls: 'wpic' });
    /* Finished already if the background got here first, otherwise it is made now, so a tile is never empty. */
    const art = tiles?.art[id];
    if (art) pic.append(art);
    else { const img = el('img', { alt: '', draggable: 'false' }) as HTMLImageElement; img.src = tiles?.fresh[id] || keepTile(page, tiles as TileStore, id); pic.append(img); }
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
  if (redress || !studioStage.firstChild) { drawStudioStage(); fitStudio(); }
  bakeInBackground();
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
  if (v === 'student') renderStudentPage();
  if (v === 'academics') renderClasses();
  if (v === 'games') musicPlay(currentGame); else if (v !== 'academics') musicStop();
  queueFit();
  if (v === 'admin') {
    renderAdmin();
    if (isAdmin()) { mountStudio($('#adminStudio')); refreshAdminStudents().then(renderAdmin, () => {}); }
  }
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
  const nav = (dir: number) => el('button', { cls: 'wnav', type: 'button', onclick() { studioPage = (studioPage + dir + WARDROBE.length) % WARDROBE.length; drawStudio(false); } }, dir < 0 ? 'Back' : 'Next');
  const left = el('div', { cls: 'wardrobe' }, el('div', { cls: 'wbar' }, nav(-1), el('div', { cls: 'wribbon' }, studioTitle, studioCount), nav(1)), el('div', { cls: 'wframe' }, studioTiles, studioSwatches));
  const buttons = el('div', { cls: 'stagebtns' },
    el('button', { cls: 'wnav', type: 'button', onclick() { studioLook = studioSaved; studioDirty = false; studioMsg.textContent = 'Back to your last saved look.'; drawStudio(); } }, 'Restart'),
    el('button', { cls: 'wnav', type: 'button', onclick() { studioLook = randomLook(); studioDirty = true; studioMsg.textContent = signedInId() || studioForFang ? 'Not saved yet.' : 'Register to keep this look.'; drawStudio(); } }, 'Surprise me'),
    el('button', { cls: 'wnav wsave', type: 'button', onclick() { saveStudio(); } }, 'Save'));
  const right = el('div', { cls: 'wstage' }, el('div', { cls: 'locker' }, el('div', { cls: 'lockerinside' }, studioStage)), studioName, buttons, studioMsg);
  studioRoot.append(left, right);
  document.body.append(measureHost);
  new ResizeObserver(() => { if (!studioRoot.getClientRects().length) return; if (studioStale) drawStudio(); else fitStudio(); }).observe(studioRoot);
})();
