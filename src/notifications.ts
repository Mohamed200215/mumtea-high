/* ---------- the bell: who commented, reacted or beat your score ---------- */
interface SchoolNote { id: string; actorId: string | null; kind: string; postId: string | null; detail: string; read: boolean; at: string }
(function () {
  let notes: SchoolNote[] = [], who = '', channel: any = null, loading = false;
  const count = el('b', { cls: 'bellcount', hidden: '' });
  const bell = el('button', { cls: 'bellbtn', type: 'button', hidden: '', 'aria-expanded': 'false', 'aria-controls': 'bellPanel', 'aria-label': 'Notifications', onclick(e: Event) { e.stopPropagation(); toggle(); } });
  bell.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 2.500a2 2 0 0 1 2 2v.7c3 .9 5 3.600 5 7v3.300l2 2.500v1H3v-1l2-2.500v-3.300c0-3.400 2-6.100 5-7v-.7a2 2 0 0 1 2-2Z" fill="currentColor"/><path d="M9.500 20.500a2.500 2.500 0 0 0 5 0Z" fill="currentColor"/></svg>';
  bell.append(count);
  const list = el('div', { cls: 'belllist' }), panel = el('section', { cls: 'bellpanel', id: 'bellPanel', hidden: '', 'aria-label': 'Notifications' },
    el('div', { cls: 'bellhead' }, el('h3', { text: 'Notifications' }), el('button', { cls: 'linkish', type: 'button', onclick() { panel.hidden = true; bell.setAttribute('aria-expanded', 'false'); bell.focus(); } }, 'Close')), list);
  panel.addEventListener('click', e => e.stopPropagation());
  $('#hello').after(bell);
  document.body.append(panel);

  const myKey = (): string => (isAdmin() ? 'fang' : signedInId() || '');
  const postName = (id: string | null): string => { const p = allPosts.find(x => x.id === id); return p ? (p.title || p.body).slice(0, 34) + ((p.title || p.body).length > 34 ? '...' : '') : 'your post'; };
  const reactionName = (kind: string): string => (REACTIONS.find(r => r[0] === kind) || [])[3] || 'a reaction';
  function words(n: SchoolNote): string {
    const name = nameOf(n.actorId);
    if (n.kind === 'comment') return name + ' commented on your post: ' + postName(n.postId);
    if (n.kind === 'reply') return name + ' also commented on: ' + postName(n.postId);
    if (n.kind === 'reaction') return name + ' reacted "' + reactionName(n.detail) + '" to your post: ' + postName(n.postId);
    return name + ' beat your score in ' + titleOf(n.detail);
  }
  function badge(): void {
    const unread = notes.filter(n => !n.read).length;
    count.hidden = !unread; count.textContent = unread > 99 ? '99+' : String(unread);
    bell.setAttribute('aria-label', unread ? 'Notifications, ' + unread + ' new' : 'Notifications');
  }
  function draw(): void {
    list.textContent = '';
    if (!notes.length) { list.append(el('p', { cls: 'bellempty', text: 'Nothing yet. When someone comments on your posts, reacts to them or beats your score, it shows up here.' })); return; }
    notes.forEach(n => {
      const row = el('button', { cls: 'bellrow' + (n.read ? '' : ' bellnew'), type: 'button', onclick() {
        panel.hidden = true; bell.setAttribute('aria-expanded', 'false');
        if (n.kind === 'score') { go('games'); openGame(n.detail, true); } else go('tea', n.postId ?? undefined);
      } }, faceFor(n.actorId, 'cmtface'));
      const icon = n.kind === 'reaction' ? (REACTIONS.find(r => r[0] === n.detail) || [])[1] : '';
      row.append(el('span', { cls: 'belltext' }, el('span', { text: words(n) }), el('time', { datetime: n.at, text: timeAgo(n.at) })));
      if (icon) row.append(el('img', { src: icon, alt: '', width: 34, height: 34 }));
      list.append(row);
    });
  }
  async function load(): Promise<void> {
    if (!backendReady || loading || !myKey()) return;
    loading = true;
    try {
      const { data, error } = isAdmin() ? await sb.rpc('admin_notifications', { token: adminPass }) : await sb.from('notifications').select('id, actor_id, kind, post_id, detail, read_at, created_at').order('created_at', { ascending: false }).limit(60);
      if (error) return;
      notes = ((data || []) as any[]).map(r => ({ id: r.id, actorId: r.actor_id, kind: r.kind, postId: r.post_id, detail: r.detail, read: !!r.read_at, at: r.created_at }));
      badge(); if (!panel.hidden) draw();
    } finally { loading = false; }
  }
  async function markRead(): Promise<void> {
    if (!notes.some(n => !n.read)) return;
    const { error } = isAdmin() ? await sb.rpc('admin_read_notifications', { token: adminPass }) : await sb.from('notifications').update({ read_at: new Date().toISOString() }).is('read_at', null).eq('user_id', signedInId());
    if (error) return;
    notes.forEach(n => { n.read = true; });
    badge();
  }
  function toggle(): void {
    panel.hidden = !panel.hidden; bell.setAttribute('aria-expanded', String(!panel.hidden));
    if (panel.hidden) { draw(); return; }
    /* New ones stay highlighted while the list is open, and count as seen straight away. */
    draw(); const r = bell.getBoundingClientRect(); panel.style.top = Math.round(r.bottom + 8) + 'px';
    markRead();
  }
  document.addEventListener('click', () => { if (!panel.hidden) { panel.hidden = true; bell.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; bell.setAttribute('aria-expanded', 'false'); bell.focus(); } });
  /* Whoever is logged in can change at any moment, so this keeps checking. */
  function watch(): void {
    const key = myKey();
    if (key === who) return;
    who = key; notes = []; badge(); panel.hidden = true;
    bell.hidden = !key;
    if (channel) { sb.removeChannel(channel); channel = null; }
    if (!key) return;
    load();
    if (backendReady && key !== 'fang') channel = sb.channel('notes-' + key).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: 'user_id=eq.' + key }, () => { tone(880, .08); load(); }).subscribe();
  }
  window.setInterval(watch, 2500);
  window.setInterval(() => { if (!document.hidden) load(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); });
  window.setTimeout(watch, 300);
})();
