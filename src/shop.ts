/* ---------- the Bank of Bones card and the Bone Boutique: bones earned in games are spent on things that show on your ghoul ---------- */
const SHOP_TABS: Array<[string, string, string]> = [['cars', 'Cars', 'Parked right beside your ghoul. They do not drive, they just look expensive.'], ['hats', 'Hats', 'Nike, Puma and Prada.'], ['shoes', 'Shoes', 'Nike, Puma and ASICS.'], ['dior', 'Dior', 'Tops and bottoms from the house of Dior.'], ['jewels', 'Jewellery', 'Real diamonds, Rolex, Audemars Piguet and Patek Philippe.']];
const SHOP_PLAIN: Record<string, string> = { car: 'none', headwear: 'none', neck: 'none', wrist: 'none', shoes: 'sneaker', top: 'tee', bottom: 'straight' };
const SHOP_BOXES: Record<string, string> = { car: '40 520 400 215', headwear: '30 -50 260 270', shoes: '60 560 200 170', top: '40 215 240 225', bottom: '40 340 240 380', neck: '95 195 130 100', wrist: '10 300 130 170' };
let shopTab = 'cars', shopNote = '', shopOwnerSeen: string | null | undefined, shopPrices: Record<string, { price: number; at: string }> = {};
const boneLogKey = (): string => 'boneLog.' + (signedInId() || 'guest');
/* The statement remembers earnings on this device, and purchases come from the account. */
function logBones(n: number): void {
  const why = !$('.view[data-view="games"]').hidden ? titleOf(currentGame) : !$('.view[data-view="academics"]').hidden ? 'Class passed' : 'School reward';
  const log = store.get<Array<{ n: number; why: string; at: string }>>(boneLogKey(), []);
  log.unshift({ n, why, at: new Date().toISOString() });
  store.set(boneLogKey(), log.slice(0, 30));
  if (!$('.view[data-view="profile"]').hidden) drawBank();
}
async function loadOwned(): Promise<void> {
  shopOwned = new Set(); shopPrices = {};
  if (!backendReady || !signedInId()) return;
  const { data, error } = await sb.from('shop_owned').select('item, price, bought_at');
  if (error) return;
  (data as Array<{ item: string; price: number; bought_at: string }>).forEach(r => { shopOwned.add(r.item); shopPrices[r.item] = { price: r.price, at: r.bought_at }; });
}
const shopLook = (): Look => (isAdmin() ? DOLLS.mumtea.look : currentStudent()?.look || DOLLS.mumtea.look);
const boneMark = (): HTMLElement => { const m = el('span', { cls: 'bonemark', 'aria-hidden': 'true' }); m.innerHTML = '<svg viewBox="0 0 24 14" width="20" height="12"><path d="M5 1a3 3 0 0 1 3 3h8a3 3 0 1 1 3 3 3 3 0 1 1-3 3H8a3 3 0 1 1-3-3 3 3 0 1 1 0-6Z" fill="currentColor"/></svg>'; return m; };

/* ---------- how the card looks: saved with the account, the same way as the student ID ---------- */
interface BankStyle { colour: string; pattern: string; shine: string; metal: string; emblem: string; title: string }
const BANK_COLOURS: Array<[string, string]> = [['Midnight', '#0c0710'], ['Hot pink', '#d10f73'], ['Royal purple', '#3a1250'], ['Deep teal', '#0a4f4a'], ['Blood red', '#5c0a1e'], ['Navy', '#12204d'], ['Rose gold', '#b76e79'], ['Gold', '#b8860b'], ['Silver', '#8d93a3'], ['Bone white', '#f4efe6']];
const BANK_PATTERNS: Array<[string, string]> = [['skulls', 'Skulls'], ['none', 'Plain'], ['leopard', 'Leopard'], ['zebra-pink', 'Pink zebra'], ['zebra-purple', 'Purple zebra'], ['plaid', 'Plaid']];
const BANK_SHINES: Array<[string, string]> = [['fang', 'Pink and teal'], ['gold', 'Gold'], ['holo', 'Holographic'], ['ice', 'Icy'], ['none', 'No shine']];
const BANK_TITLES = ['Black Card', 'Platinum Card', 'Diamond Card', 'Scream Queen Card', 'Headghoul Card', 'Boneyard Elite'];
function normalizeBank(raw: Partial<BankStyle> | null | undefined): BankStyle {
  const r = raw || {}, oneOf = (v: unknown, ok: string[], d: string): string => (typeof v === 'string' && ok.includes(v) ? v : d);
  return { colour: oneOf(r.colour, BANK_COLOURS.map(c => c[1]), '#0c0710'), pattern: oneOf(r.pattern, BANK_PATTERNS.map(p => p[0]), 'skulls'), shine: oneOf(r.shine, BANK_SHINES.map(p => p[0]), 'fang'), metal: oneOf(r.metal, ID_METALS.map(m => m[0]), 'gold'), emblem: oneOf(r.emblem, ID_EMBLEMS.map(e => e[0]), 'h'), title: oneOf(r.title, BANK_TITLES, 'Black Card') };
}
const bankKey = (): string => 'bankcard.' + (isAdmin() ? 'fang' : signedInId() || 'guest');
const bankStyle = (): BankStyle => { const me = isAdmin() ? null : currentStudent(); return normalizeBank(me?.bank || store.get<Partial<BankStyle> | null>(bankKey(), null)); };
let bankMakerOpen = false, bankNote = '', bankSaveTimer = 0;
function changeBank(key: keyof BankStyle, value: string): void {
  const style = { ...bankStyle(), [key]: value }, me = isAdmin() ? null : currentStudent();
  store.set(bankKey(), style);
  if (me) me.bank = style;
  bankNote = me ? 'Saving...' : 'Saved on this device.';
  drawBank();
  if (!me) return;
  clearTimeout(bankSaveTimer);
  bankSaveTimer = window.setTimeout(async () => {
    const fresh = currentStudent();
    const done = fresh ? await updateMe({ look: fresh.look }).catch(() => false) : false;
    const say = $('#bankCol .banksaid');
    bankNote = done ? 'Saved to your account.' : 'Saved on this device. It did not reach your account, so try again later.';
    if (say) say.textContent = bankNote;
  }, 700);
}
function bankMaker(style: BankStyle): HTMLElement {
  const row = (label: string, ...kids: HTMLElement[]) => el('div', { cls: 'wrow' }, el('span', { text: label }), ...kids);
  const chip = (key: keyof BankStyle, id: string, name: string) => el('button', { cls: 'wchip', type: 'button', 'data-bank': key + ':' + id, 'aria-pressed': style[key] === id, onclick() { changeBank(key, id); } }, name);
  const swatches = BANK_COLOURS.map(([name, col]) => { const b = el('button', { cls: 'wswatch', type: 'button', 'data-bank': 'colour:' + col, title: name, 'aria-label': 'Card colour ' + name, 'aria-pressed': style.colour === col, onclick() { changeBank('colour', col); } }); b.style.background = col; return b; });
  const tiles = el('div', { cls: 'idtiles' }, ...ID_EMBLEMS.map(([id, name]) => el('button', { cls: 'idtile', type: 'button', 'data-bank': 'emblem:' + id, title: name, 'aria-label': 'Emblem ' + name, 'aria-pressed': style.emblem === id, onclick() { changeBank('emblem', id); } }, emblemEl(id, style.metal, 'emblem', false))));
  return el('div', { cls: 'idmaker wframe bankmaker' }, el('h4', { text: 'Customize your card' }), el('div', { cls: 'merrows' },
    row('Card colour', ...swatches), row('Pattern', ...BANK_PATTERNS.map(([id, name]) => chip('pattern', id, name))), row('Shine', ...BANK_SHINES.map(([id, name]) => chip('shine', id, name))),
    row('Chip and emblem metal', ...ID_METALS.map(m => chip('metal', m[0], m[1]))), row('Card title', ...BANK_TITLES.map(t => chip('title', t, t))), row('Emblem', tiles)),
    el('button', { cls: 'pill', type: 'button', onclick() { bankMakerOpen = false; drawBank(); $('#bankCol .bonecard').scrollIntoView({ block: 'nearest' }); } }, 'Done'));
}
function drawBank(): void {
  const box = $('#bankCol'); box.textContent = '';
  const me = currentStudent(), fang = isAdmin();
  if (!me && !fang) return;
  const name = fang ? DOLLS.mumtea.name : (me as Student).name, seed = (fang ? 'fangtastic' : (me as Student).id).replace(/-/g, '');
  let digits = '';
  for (let i = 0; digits.length < 12; i++) digits += String((seed.charCodeAt(i % seed.length) * (i + 7)) % 10);
  const number = '6666 ' + digits.slice(0, 4) + ' ' + digits.slice(4, 8) + ' ' + digits.slice(8, 12);
  const joined = me ? new Date(me.joined) : new Date();
  const style = bankStyle(), n = parseInt(style.colour.slice(1), 16), light = (n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11 > 150;
  const card = el('div', { cls: 'bonecard' + (light ? ' bclight' : ''), 'data-shine': style.shine, 'data-pattern': style.pattern, role: 'group', 'aria-label': 'Bank of Bones card for ' + name + ', ' + (fang ? 'unlimited' : bones) + ' bones' });
  card.style.backgroundColor = style.colour;
  card.style.backgroundImage = style.pattern === 'none' ? 'none' : 'url(backgrounds/' + style.pattern + '.webp)';
  const chip = el('i', { cls: 'bcchip', 'aria-hidden': 'true' });
  chip.style.background = 'linear-gradient(135deg,' + (ID_METALS.find(m => m[0] === style.metal) || ID_METALS[0])[2].join(',') + ')';
  const wave = el('span', { cls: 'bcwave', 'aria-hidden': 'true' }); wave.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"><path d="M7 8a8 8 0 0 1 0 8M11 5a13 13 0 0 1 0 14M15 2.500a18 18 0 0 1 0 19"/></svg>';
  const crest = emblemEl(style.emblem, style.metal, 'emblem bccrest', false);
  const balance = el('strong', { cls: 'bcbalance' }, el('span', { 'data-bones': '', text: fang ? 'Unlimited' : String(bones) }), el('small', { text: ' bones' }));
  card.append(el('div', { cls: 'bctop' }, el('div', {}, el('b', { text: 'BANK OF BONES' }), el('small', { text: 'Mumtea High ' + style.title })), crest),
    el('div', { cls: 'bcmid' }, chip, wave, el('div', { cls: 'bcbal' }, el('small', { text: 'Balance' }), balance)),
    el('p', { cls: 'bcnumber', text: number }),
    el('div', { cls: 'bcfoot' }, el('div', {}, el('small', { text: 'Card holder' }), el('b', { text: name.toUpperCase() })), el('div', {}, el('small', { text: 'Member since' }), el('b', { text: String(joined.getMonth() + 1).padStart(2, '0') + '/' + String(joined.getFullYear()).slice(2) })), el('div', {}, el('small', { text: 'Expires' }), el('b', { text: 'Never' }))));
  const earned = store.get<Array<{ n: number; why: string; at: string }>>(boneLogKey(), []).map(r => ({ text: r.why, n: r.n, at: r.at }));
  const spent = Object.keys(shopPrices).map(id => ({ text: SHOP_BY_ID[id] ? (SHOP_BY_ID[id].brand === 'Fine jewellery' ? '' : SHOP_BY_ID[id].brand + ' ') + SHOP_BY_ID[id].name : id, n: -shopPrices[id].price, at: shopPrices[id].at }));
  const rows = [...earned, ...spent].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
  const statement = el('div', { cls: 'bcstatement' }, el('h4', { text: 'Recent activity' }));
  if (!rows.length) statement.append(el('p', { text: fang ? 'The headghoul does not pay for things.' : 'Nothing yet. Finish games and pass classes to earn bones.' }));
  rows.forEach(r => statement.append(el('div', { cls: 'bcrow' }, el('span', { text: r.text }), el('time', { datetime: r.at, text: timeAgo(r.at) }), el('b', { cls: r.n < 0 ? 'bcout' : 'bcin', text: (r.n < 0 ? '−' : '+') + Math.abs(r.n) }))));
  const customize = el('button', { cls: 'pill ghost idopen', type: 'button', 'aria-expanded': bankMakerOpen, onclick() { bankMakerOpen = !bankMakerOpen; bankNote = ''; drawBank(); } }, bankMakerOpen ? 'Hide card options' : 'Customize card');
  box.append(card, el('div', { cls: 'row bankbtns' }, el('button', { cls: 'pill', type: 'button', 'data-go': 'shop' }, 'Spend it at the Bone Boutique'), customize), el('p', { cls: 'banksaid', role: 'status', text: bankNote }));
  if (bankMakerOpen) box.append(bankMaker(style));
  box.append(statement);
}
async function wearItem(id: string, on: boolean): Promise<void> {
  const item = SHOP_BY_ID[id], next: Look = { ...shopLook(), [item.slot]: on ? id : SHOP_PLAIN[item.slot] };
  shopNote = 'Getting dressed...'; renderShop();
  if (isAdmin()) {
    const { error } = await sb.rpc('admin_set_fang_look', { token: adminPass, look: next });
    if (error) { shopNote = 'That did not save. Please try again.'; renderShop(); return; }
    DOLLS.mumtea.look = next; paintDolls();
  } else if (!(await updateMe({ look: next }))) { shopNote = 'That did not save. Please try again.'; renderShop(); return; }
  shopNote = on ? 'Your ghoul has it on. See it on My Ghoul.' : 'Taken off.';
  syncStudio(); renderStudents(); renderID(); renderProfile(); renderShop();
}
async function buyItem(id: string): Promise<void> {
  const item = SHOP_BY_ID[id];
  shopNote = 'Paying...'; renderShop();
  await flushBones();
  const { data, error } = await sb.rpc('buy_shop_item', { which: id });
  if (error) {
    shopNote = /not enough/.test(error.message || '') ? 'Not enough bones on your card.' : /verify/.test(error.message || '') ? 'Verify your email first, then you can shop.' : /already/.test(error.message || '') ? 'You already own that.' : 'That did not go through, so nothing was charged. Please try again.';
    await refreshBones(); await loadOwned(); renderShop(); return;
  }
  bones = data as number; store.set('bones', bones); drawBones();
  shopOwned.add(id); shopPrices[id] = { price: item.price, at: new Date().toISOString() };
  shopNote = (item.brand === 'Fine jewellery' ? '' : item.brand + ' ') + item.name + ' is yours. Press Wear to put it on.';
  tone(880, .1); drawStudio(); renderShop();
}
function renderShop(): void {
  const box = $('#shopBox'); box.textContent = '';
  const me = currentStudent(), fang = isAdmin();
  const purse = el('div', { cls: 'shoppurse' }, el('span', { text: 'On your card' }), boneMark(), el('strong', { 'data-bones': '', text: fang ? 'Unlimited' : me ? String(bones) : '0' }), el('button', { cls: 'linkish', type: 'button', 'data-go': 'profile' }, 'See my card'));
  const tabs = el('div', { cls: 'chips', role: 'group', 'aria-label': 'Shop departments' }, ...SHOP_TABS.map(([id, name]) => el('button', { cls: 'chip', type: 'button', 'data-tab': id, 'aria-pressed': shopTab === id, onclick() { shopTab = id; shopNote = ''; renderShop(); } }, name)));
  const tab = SHOP_TABS.find(t => t[0] === shopTab) as [string, string, string];
  box.append(purse, tabs, el('p', { cls: 'shopblurb', text: tab[2] }));
  if (fang) box.append(el('p', { cls: 'shopnote', text: 'You run the school. Everything here is on the house.' }));
  else if (!me) box.append(el('div', { cls: 'row shopguest' }, el('span', { text: 'Window shopping is free. Log in to buy.' }), el('button', { cls: 'pill', type: 'button', 'data-go': 'registration' }, 'Register or log in')));
  if (shopNote) box.append(el('p', { cls: 'shopnote', role: 'status', text: shopNote }));
  const look = shopLook(), grid = el('div', { cls: 'shopgrid' });
  SHOP_ITEMS.filter(i => i.cat === shopTab).forEach(item => {
    const owned = fang || shopOwned.has(item.id), on = look[item.slot] === item.id;
    const pic = el('div', { cls: 'shoppic', 'aria-hidden': 'true' });
    pic.innerHTML = drawGhoul({ ...look, [item.slot]: item.id }, item.slot === 'car' ? { only: ['car'], box: SHOP_BOXES.car, plain: true } : { box: SHOP_BOXES[item.slot], plain: true });
    const left = item.price - bones;
    const action = !me && !fang ? el('button', { cls: 'pill ghost', type: 'button', 'data-go': 'registration' }, 'Log in to buy')
      : owned ? el('button', { cls: on ? 'pill ghost' : 'pill', type: 'button', 'data-buy': item.id, onclick() { wearItem(item.id, !on); } }, on ? 'Take off' : 'Wear')
      : left > 0 ? el('button', { cls: 'pill ghost', type: 'button', 'data-buy': item.id, disabled: '' }, left + ' more bones')
      : el('button', { cls: 'pill', type: 'button', 'data-buy': item.id, onclick() { buyItem(item.id); } }, 'Buy');
    grid.append(el('article', { cls: 'shopcard' + (owned ? ' shopowned' : '') }, pic, el('small', { text: item.brand }), el('strong', { text: item.name }),
      el('p', { cls: 'shopprice' }, fang ? 'On the house' : owned ? 'Yours' : '', ...(fang || owned ? [] : [boneMark(), String(item.price)])), action));
  });
  box.append(grid);
}
/* The account can change at any moment, so this keeps an eye on it. */
window.setInterval(() => {
  const who = signedInId();
  if (who === shopOwnerSeen) return;
  shopOwnerSeen = who;
  loadOwned().then(() => { drawStudio(); if (!$('.view[data-view="shop"]').hidden) renderShop(); if (!$('.view[data-view="profile"]').hidden) drawBank(); });
}, 2000);
