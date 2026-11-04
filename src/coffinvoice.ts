/* ---------- the iCoffin: a voice in a coffin that tells scary stories and talks back ---------- */
(function () {
  const VOICE_NAME = 'The Voice', OPENER = "You opened the lid. Most people don't. Do you want a story, or do you want to tell me what you're afraid of?";
  const input = $<HTMLInputElement>('#coffinWords'), send = $<HTMLButtonElement>('#coffinSend'), form = $<HTMLFormElement>('#coffinForm');
  const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  let waiting = false;
  say(VOICE_NAME, OPENER);
  const setWaiting = (on: boolean): void => { waiting = on; send.disabled = on; };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const words = input.value.trim();
    if (!words || waiting) return;
    if (!signedInId() && !isAdmin()) { say(VOICE_NAME, 'Log in first, so I know who is listening.'); return; }
    input.value = '';
    say('You', words);
    history.push({ role: 'user', content: words });
    setWaiting(true);
    const dots = el('div', { cls: 'msg coffindots' }, 'The Voice is thinking...');
    $('#screen').append(dots); $('#screen').scrollTop = $('#screen').scrollHeight;
    let out = 'The lid is stuck. Try again in a moment.', keep = false;
    try {
      const { data, error } = await sb.functions.invoke('coffin-voice', { body: { messages: history, token: isAdmin() ? adminPass : null } });
      if (error) out = 'The Voice is not awake yet. Try again later.';
      else if (data.text) { out = data.text; keep = true; }
      else if (data.limit) out = 'That is enough for one night. Come back tomorrow, if you still want to.';
      else if (data.denied) out = 'I cannot hear you yet. Check that your email is verified, then come back.';
      else if (data.asleep) out = 'The Voice is not awake yet. Try again later.';
    } catch { /* the message above is already right */ }
    dots.remove();
    /* A word that got no answer comes off the history, so the conversation stays in turn. */
    if (keep) history.push({ role: 'assistant', content: out }); else history.pop();
    say(VOICE_NAME, out);
    setWaiting(false);
    input.focus();
  });
})();
