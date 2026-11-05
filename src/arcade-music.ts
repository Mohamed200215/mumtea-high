/* ---------- soundtracks: every game has its own little song, played live by the browser so nothing needs downloading ---------- */
interface MusicVoice { wave: OscillatorType; gain: number; decay: number; notes: string; echo?: boolean; drums?: boolean }
interface MusicTrack { bpm: number; steps: number; voices: MusicVoice[] }
const MUSIC_TRACKS: Record<string, MusicTrack> = {
  /* dreamy and underwater */
  riptide: { bpm: 70, steps: 2, voices: [
    { wave: 'sine', gain: .5, decay: .9, echo: true, notes: 'D4 A4 D5 F5 A5 F5 D5 A4 A#3 F4 A#4 D5 F5 D5 A#4 F4 F3 C4 F4 A4 C5 A4 F4 C4 C4 G4 C5 E5 G5 E5 C5 G4' },
    { wave: 'triangle', gain: .55, decay: 3, notes: 'D2 . . . . . . . A#1 . . . . . . . F2 . . . . . . . C2 . . . . . . .' },
    { wave: 'sine', gain: .4, decay: 1.6, echo: true, notes: 'A5 . . . . . F5 . . . D5 . . . . . D6 . . . C6 . A5 . . . G5 . . . . . .' },
  ] },
  /* a music box waltz at a midnight tea party */
  spill: { bpm: 138, steps: 1, voices: [
    { wave: 'triangle', gain: .5, decay: .7, notes: 'A2 . . E2 . . F2 . . C3 . . D3 . . A2 . . E2 . . E3 . .' },
    { wave: 'sine', gain: .22, decay: .45, notes: '. C4+E4 C4+E4 . B3+E4 B3+E4 . A3+C4 A3+C4 . G3+C4 G3+C4 . F3+A3 F3+A3 . C4+E4 C4+E4 . B3+D4 B3+D4 . G#3+D4 G#3+D4' },
    { wave: 'sine', gain: .55, decay: 1.1, echo: true, notes: 'E5 A5 C6 B5 G#5 E5 F5 A5 C6 G5 E5 C5 D5 F5 A5 E5 C5 A4 B4 E5 G#5 B5 . .' },
  ] },
  /* a minor-key circus band for the stunt show */
  casket: { bpm: 158, steps: 2, voices: [
    { wave: 'triangle', gain: .6, decay: .22, notes: 'A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 . E2 . B2 . E2 . G#2 .' },
    { wave: 'square', gain: .1, decay: .16, notes: '. A3+C4 . A3+C4 . A3+C4 . A3+C4 . A3+C4 . A3+C4 . F3+C4 . F3+C4 . G3+B3 . G3+D4 . G3+B3 . G3+D4 . G#3+B3 . G#3+D4 . G#3+B3 . G#3+E4' },
    { wave: 'square', gain: .17, decay: .2, notes: 'E5 F5 E5 D#5 E5 . C5 . F5 G5 F5 E5 D5 . A4 . G4 A4 B4 C5 D5 E5 F5 D5 E5 . G#4 . B4 . E5 .' },
    { wave: 'square', gain: .25, decay: .05, drums: true, notes: 'k . h . s . h . k . h . s . h . k . h . s . h . k k h . s s s s' },
  ] },
  /* a strutting goth pop beat for the wardrobe */
  closet: { bpm: 108, steps: 2, voices: [
    { wave: 'sawtooth', gain: .2, decay: .24, notes: 'E2 E2 . E2 G2 . A2 . E2 E2 . E2 D2 . B1 . C2 C2 . C2 E2 . G2 . D2 D2 . D2 B1 . D2 .' },
    { wave: 'triangle', gain: .22, decay: .3, notes: 'E4+G4+B4 . . . . E4+G4+B4 . . E4+G4+B4 . . . . D4+G4+B4 . . C4+E4+G4 . . . . C4+E4+G4 . . D4+F#4+A4 . . . D4+F#4+B4 . . .' },
    { wave: 'sine', gain: .42, decay: .5, echo: true, notes: 'B5 . G5 . E5 . . G5 A5 . G5 . E5 . . . G5 . E5 . C5 . . E5 F#5 . E5 . D5 . . .' },
    { wave: 'square', gain: .3, decay: .05, drums: true, notes: 'k h . h s h . h k h k h s h . h k h . h s h . h k h k h s h s s' },
  ] },
  /* a sleepy early-2000s photo booth */
  booth: { bpm: 90, steps: 2, voices: [
    { wave: 'triangle', gain: .45, decay: .7, notes: 'F2 . . F2 . . C3 . D2 . . D2 . . A2 . A#1 . . A#1 . . F2 . C2 . . C2 . . E2 .' },
    { wave: 'sine', gain: .25, decay: 1, notes: 'F4+A4+C5+E5 . . . . . . . D4+F4+A4+C5 . . . . . . . A#3+D4+F4+A4 . . . . . . . C4+E4+G4+A#4 . . . . . . .' },
    { wave: 'triangle', gain: .28, decay: .4, echo: true, notes: '. . C6 . A5 . . G5 . . A5 . F5 . . . . . D6 . A#5 . . F5 . . G5 . E5 . C5 .' },
    { wave: 'square', gain: .15, decay: .04, drums: true, notes: 'k . h . s . h h k . h k s . h . k . h . s . h h k . h k s . s h' },
  ] },
  /* a stadium stomp for the football */
  kick: { bpm: 128, steps: 2, voices: [
    { wave: 'sawtooth', gain: .2, decay: .2, notes: 'A1 . A1 . C2 . A1 . G1 . G1 . E1 . G1 . F1 . F1 . A1 . F1 . E1 . E1 . G#1 . B1 .' },
    { wave: 'square', gain: .12, decay: .24, notes: 'A4 . C5 E5 . C5 A4 . G4 . B4 D5 . B4 G4 . F4 . A4 C5 . A4 F4 . E4 . G#4 B4 . G#4 E4 .' },
    { wave: 'square', gain: .3, decay: .05, drums: true, notes: 'k . . . s . k . k . . . s . h h k . . . s . k . k . k . s s s s' },
  ] },
  /* a heavy arena beat for the basketball */
  hoops: { bpm: 96, steps: 2, voices: [
    { wave: 'sawtooth', gain: .24, decay: .3, notes: 'D2 . . D2 . . F2 . D2 . . D2 . C2 . . A#1 . . A#1 . . D2 . A1 . . A1 . C2 . .' },
    { wave: 'triangle', gain: .28, decay: .3, echo: true, notes: 'D5 . . F5 . . A5 . . . G5 . F5 . . . D5 . . F5 . . A#5 . A5 . . G5 . E5 . .' },
    { wave: 'square', gain: .32, decay: .05, drums: true, notes: 'k . h . s . h k . k h . s . h h k . h . s . h k . k h k s h s s' },
  ] },
  /* a trap beat for when the song previews cannot load */
  pageant: { bpm: 74, steps: 4, voices: [
    { wave: 'sine', gain: .7, decay: .6, notes: 'C2 . . . . . . . . . C2 . . . . . D#2 . . . . . . . G1 . . . . . . .' },
    { wave: 'triangle', gain: .22, decay: .25, echo: true, notes: 'G5 . D#5 . C5 . . . G5 . D#5 . C5 . D5 . D#5 . C5 . G4 . . . A#4 . C5 . D5 . . .' },
    { wave: 'square', gain: .25, decay: .05, drums: true, notes: 'k . h h h . h h s . h h h h h k k . h h h . h h s . h h h h s s' },
  ] },
  /* a polite, slightly spooky harpsichord for lessons */
  class: { bpm: 84, steps: 2, voices: [
    { wave: 'sawtooth', gain: .1, decay: .34, notes: 'A3 C4 E4 A4 E4 C4 A3 C4 F3 A3 C4 F4 C4 A3 F3 A3 C3 E3 G3 C4 G3 E3 C3 E3 E3 G#3 B3 E4 B3 G#3 E3 G#3' },
    { wave: 'triangle', gain: .45, decay: .9, notes: 'A2 . . . E2 . . . F2 . . . C3 . . . C3 . . . G2 . . . E2 . . . E3 . . .' },
    { wave: 'triangle', gain: .3, decay: .7, echo: true, notes: 'E5 . . D5 C5 . . B4 A4 . . C5 F5 . . E5 G5 . . F5 E5 . . D5 B4 . . C5 D5 . E5 .' },
  ] },
};
let musicCtx: AudioContext | null = null, musicOut: GainNode | null = null, musicEcho: DelayNode | null = null, musicNoise: AudioBuffer | null = null;
let musicNow = '', musicHeld = false, musicTimer = 0, musicNext = 0, musicStep = 0;
const soundMuted = (): boolean => store.get<boolean>('mute', false);
const musicAllowed = (): boolean => store.get<boolean>('musicOn', true) && !soundMuted();
const MUSIC_LEVEL = .2;
function midiOf(note: string): number {
  const m = /^([A-G])(#?)(\d)$/.exec(note);
  return m ? ({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 } as Record<string, number>)[m[1]] + (m[2] ? 1 : 0) + (Number(m[3]) + 1) * 12 : 0;
}
function musicSetUp(): void {
  if (musicCtx) return;
  const Maker = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Maker) return;
  const ac = new Maker();
  musicCtx = ac;
  musicOut = ac.createGain(); musicOut.gain.value = 0; musicOut.connect(ac.destination);
  musicEcho = ac.createDelay(1); musicEcho.delayTime.value = .32;
  const back = ac.createGain(); back.gain.value = .35;
  musicEcho.connect(back).connect(musicEcho); musicEcho.connect(musicOut);
  const noise = ac.createBuffer(1, ac.sampleRate * .3, ac.sampleRate), d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  musicNoise = noise;
}
function musicPluck(ac: AudioContext, midi: number, at: number, v: MusicVoice): void {
  const osc = ac.createOscillator(), amp = ac.createGain();
  osc.type = v.wave; osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
  amp.gain.setValueAtTime(0, at); amp.gain.linearRampToValueAtTime(v.gain, at + .012); amp.gain.exponentialRampToValueAtTime(.0001, at + v.decay);
  osc.connect(amp); amp.connect(musicOut as GainNode);
  if (v.echo) amp.connect(musicEcho as DelayNode);
  osc.start(at); osc.stop(at + v.decay + .05);
}
function musicHit(ac: AudioContext, kind: string, at: number, v: MusicVoice): void {
  if (kind === 'k') {
    const osc = ac.createOscillator(), amp = ac.createGain();
    osc.frequency.setValueAtTime(130, at); osc.frequency.exponentialRampToValueAtTime(45, at + .12);
    amp.gain.setValueAtTime(v.gain * 2.2, at); amp.gain.exponentialRampToValueAtTime(.0001, at + .16);
    osc.connect(amp); amp.connect(musicOut as GainNode); osc.start(at); osc.stop(at + .18);
    return;
  }
  const src = ac.createBufferSource(), amp = ac.createGain(), filter = ac.createBiquadFilter();
  src.buffer = musicNoise; filter.type = 'highpass'; filter.frequency.value = kind === 'h' ? 7000 : 1800;
  const len = kind === 'h' ? .04 : .12;
  amp.gain.setValueAtTime(v.gain * (kind === 'h' ? .6 : 1.3), at); amp.gain.exponentialRampToValueAtTime(.0001, at + len);
  src.connect(filter).connect(amp); amp.connect(musicOut as GainNode); src.start(at); src.stop(at + len + .02);
}
function musicTick(): void {
  const ac = musicCtx, track = MUSIC_TRACKS[musicNow];
  if (!ac || !track || ac.state !== 'running') return;
  const stepLong = 60 / track.bpm / track.steps;
  if (musicNext < ac.currentTime) musicNext = ac.currentTime + .05;
  while (musicNext < ac.currentTime + .3) {
    for (const v of track.voices) {
      const notes = v.notes.split(' '), one = notes[musicStep % notes.length];
      if (one === '.') continue;
      if (v.drums) musicHit(ac, one, musicNext, v);
      else one.split('+').forEach(n => musicPluck(ac, midiOf(n), musicNext, v));
    }
    musicStep++; musicNext += stepLong;
  }
}
/* ---------- the website's theme song: it plays wherever no game or class has its own music ---------- */
const THEME_PEAK = 26, THEME_LEVEL = .4;
const themeSong = new Audio('sounds/mixkit-spooky-night-1120.mp3');
themeSong.loop = true; themeSong.preload = 'auto'; themeSong.volume = THEME_LEVEL;
let themeOpen = false, themeInIntro = false, themeFade = 0;
function themeApply(): void {
  if (themeInIntro) { if (!musicAllowed()) themeSong.pause(); else if (themeSong.paused) themeSong.play().catch(() => {}); return; }
  if (themeOpen && !musicNow && musicAllowed() && !document.hidden) themeSong.play().catch(() => {}); else themeSong.pause();
}
function themeRamp(to: number, ms: number, done?: () => void): void {
  clearInterval(themeFade);
  const from = themeSong.volume, start = performance.now();
  themeFade = window.setInterval(() => {
    const k = Math.min(1, (performance.now() - start) / ms);
    themeSong.volume = from + (to - from) * k;
    if (k >= 1) { clearInterval(themeFade); done?.(); }
  }, 40);
}
/* The intro gets the loudest part of the song. */
function themeForIntro(): Promise<void> {
  themeInIntro = true; themeSong.currentTime = THEME_PEAK; themeSong.volume = THEME_LEVEL;
  return themeSong.play();
}
/* When the intro fades, the song fades too, then starts again from the beginning for the website itself. */
function themeForSite(): void {
  const open = (): void => { themeInIntro = false; themeOpen = true; themeSong.currentTime = 0; themeSong.volume = 0; themeApply(); themeRamp(THEME_LEVEL, 1500); };
  if (themeInIntro && !themeSong.paused) themeRamp(0, 1200, open); else open();
}
/* Browsers keep a page silent until the first tap or key, so the song waits for it if it has to. */
const themeWake = (): void => { if (themeInIntro || themeOpen) themeApply(); };
addEventListener('pointerdown', themeWake); addEventListener('keydown', themeWake);
function musicApply(): void {
  themeApply();
  const ac = musicCtx;
  if (!ac || !musicOut) return;
  const on = !!musicNow && !musicHeld && musicAllowed();
  musicOut.gain.cancelScheduledValues(ac.currentTime);
  musicOut.gain.setTargetAtTime(on ? MUSIC_LEVEL : 0, ac.currentTime, .12);
  clearInterval(musicTimer);
  if (on) { if (ac.state !== 'running') ac.resume().catch(() => {}); musicTimer = window.setInterval(musicTick, 90); musicTick(); }
}
function musicPlay(track: string): void {
  if (!MUSIC_TRACKS[track]) { musicStop(); return; }
  musicSetUp();
  if (track !== musicNow) { musicNow = track; musicStep = 0; musicNext = 0; }
  musicHeld = false; musicApply();
}
function musicStop(): void { musicNow = ''; musicHeld = false; musicApply(); }
function musicHold(on: boolean): void { musicHeld = on; musicApply(); }
/* Browsers only let sound start after a tap or click, so the song waits for the next one if it has to. */
addEventListener('pointerdown', () => { if (musicNow && musicCtx && musicCtx.state !== 'running') { musicCtx.resume().then(musicApply, () => {}); } });
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInterval(musicTimer); if (musicOut && musicCtx) musicOut.gain.setTargetAtTime(0, musicCtx.currentTime, .05); } else musicApply(); themeApply(); });

/* ---------- the sting when a game ends: the song steps aside for it, then comes back ---------- */
const gameOverSting = new Audio('sounds/spooky-game-over.mp3');
gameOverSting.preload = 'auto'; gameOverSting.volume = .8;
let gameOverAfter: (() => void) | null = null;
function gameOverDone(): void { const after = gameOverAfter; gameOverAfter = null; after?.(); }
function gameOverSound(after: () => void = () => musicHold(false)): void {
  gameOverAfter = null;
  if (soundMuted()) { after(); return; }
  gameOverAfter = after;
  musicHold(true); gameOverSting.currentTime = 0;
  gameOverSting.play().catch(gameOverDone);
}
function gameOverStop(): void { gameOverSting.pause(); gameOverAfter = null; }
gameOverSting.addEventListener('ended', gameOverDone);
document.addEventListener('soundchange', () => { if (soundMuted() && !gameOverSting.paused) { gameOverSting.pause(); gameOverDone(); } });
stops.push(gameOverStop);

/* ---------- the buttons every game gets ---------- */
function soundButtons(): HTMLElement[] {
  const music = el('button', { cls: 'chip gametool', type: 'button', 'data-tool': 'music', onclick() { store.set('musicOn', !store.get<boolean>('musicOn', true)); document.dispatchEvent(new Event('soundchange')); } });
  const sound = el('button', { cls: 'chip gametool', type: 'button', 'data-tool': 'sound', onclick() { store.set('mute', !soundMuted()); document.dispatchEvent(new Event('soundchange')); } });
  const draw = (): void => {
    const on = store.get<boolean>('musicOn', true);
    music.textContent = on ? 'Music on' : 'Music off'; music.setAttribute('aria-pressed', String(on));
    sound.textContent = soundMuted() ? 'Sound muted' : 'Sound on'; sound.setAttribute('aria-pressed', String(!soundMuted()));
  };
  draw();
  document.addEventListener('soundchange', draw);
  return [music, sound];
}
document.addEventListener('soundchange', musicApply);
/* The pause button sits inside the game's own frame, dressed for that game. */
const PAUSE_ART: Record<string, string> = {
  riptide: '<path d="M32 58C20 58 10 50 6 38C3 28 6 18 13 13C17 7 25 4 32 8C39 4 47 7 51 13C58 18 61 28 58 38C54 50 44 58 32 58Z" fill="#35dcc8" stroke="#0a3f4a" stroke-width="3" stroke-linejoin="round"/><path d="M32 56V10M32 56L18 13M32 56L46 13M32 56L8 28M32 56L56 28" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><ellipse cx="22" cy="17" rx="7" ry="3" fill="#fff" fill-opacity=".7" transform="rotate(-25 22 17)"/>',
  spill: '<path d="M47 26C60 22 62 42 44 43" fill="none" stroke="#1c0a1c" stroke-width="8" stroke-linecap="round"/><path d="M47 26C60 22 62 42 44 43" fill="none" stroke="#ff9ccb" stroke-width="4" stroke-linecap="round"/><ellipse cx="29" cy="55" rx="24" ry="5" fill="#ff9ccb" stroke="#1c0a1c" stroke-width="2.500"/><path d="M6 15H52C52 38 44 54 29 54C14 54 6 38 6 15Z" fill="#ff7ab8" stroke="#1c0a1c" stroke-width="3" stroke-linejoin="round"/><ellipse cx="29" cy="15" rx="23" ry="6" fill="#b5651d" stroke="#1c0a1c" stroke-width="2.500"/><path d="M12 28C14 38 18 44 24 47" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>',
  casket: '<path d="M32 3L40 21L60 20L47 35L55 54L34 49L17 60L18 39L4 25L24 21Z" fill="#f7dc6f" stroke="#14081a" stroke-width="3" stroke-linejoin="round"/><circle cx="31" cy="32" r="15" fill="#ff1f8f" stroke="#14081a" stroke-width="2.500"/>',
  kick: '<circle cx="32" cy="32" r="28" fill="#fff6fb" stroke="#14081a" stroke-width="3"/><path d="M32 4L24 12L32 18L40 12ZM4 28L12 22L16 32L8 38ZM60 28L52 22L48 32L56 38ZM18 56L22 46L32 50L28 60ZM46 56L42 46L32 50L36 60Z" fill="#14081a"/>',
  hoops: '<circle cx="32" cy="32" r="28" fill="#f2761b" stroke="#14081a" stroke-width="3"/><path d="M4 32H60M32 4V60M12 12C22 22 22 42 12 52M52 12C42 22 42 42 52 52" fill="none" stroke="#14081a" stroke-width="2"/>',
  pageant: '<path d="M8 52L4 16L20 30L32 6L44 30L60 16L56 52Z" fill="#f4d35e" stroke="#14081a" stroke-width="3" stroke-linejoin="round"/>',
};
const PAUSE_MARK: Record<string, [number, number, string]> = { riptide: [32, 34, '#0a3f4a'], spill: [29, 36, '#fff6fb'], casket: [31, 32, '#fff6fb'], kick: [32, 33, '#ff1f8f'], hoops: [32, 32, '#fff6fb'], pageant: [32, 36, '#ff1f8f'] };
function pauseIcon(game: string, paused: boolean): string {
  const [x, y, col] = PAUSE_MARK[game];
  const mark = paused ? '<path d="M' + (x - 6) + ' ' + (y - 9) + 'L' + (x + 9) + ' ' + y + 'L' + (x - 6) + ' ' + (y + 9) + 'Z" fill="' + col + '"/>'
    : '<rect x="' + (x - 8) + '" y="' + (y - 9) + '" width="6" height="18" rx="2" fill="' + col + '"/><rect x="' + (x + 2) + '" y="' + (y - 9) + '" width="6" height="18" rx="2" fill="' + col + '"/>';
  return '<svg viewBox="0 0 64 64" aria-hidden="true">' + PAUSE_ART[game] + mark + '</svg>';
}
interface GameTools { show(running: boolean, paused: boolean): void }
function gameTools(panel: Element, pause?: () => void): GameTools {
  const row = el('div', { cls: 'gametools' }, ...soundButtons());
  (panel.querySelector('p') as Element).after(row);
  if (!pause) return { show() {} };
  const game = (panel as HTMLElement).dataset.game as string, canvas = panel.querySelector('canvas') as HTMLCanvasElement;
  const stop = el('button', { cls: 'gamepause', type: 'button', hidden: '', 'data-theme': game, 'aria-label': 'Pause', title: 'Pause (P)', onclick() { pause(); } });
  stop.innerHTML = pauseIcon(game, false);
  /* The riptide canvas already has a frame to sit in. The others get a holder the same size as the game. */
  let home = canvas.parentElement as HTMLElement;
  if (!home.classList.contains('merframe')) { home = el('div', { cls: 'gameholder' }); canvas.before(home); home.append(canvas); }
  home.append(stop);
  return { show(running, paused) {
    stop.hidden = !running;
    const word = paused ? 'Resume' : 'Pause';
    if (stop.getAttribute('aria-label') !== word) { stop.setAttribute('aria-label', word); stop.title = word + ' (P)'; stop.innerHTML = pauseIcon(game, paused); }
  } };
}
const isPauseKey = (e: KeyboardEvent): boolean => (e.key === 'p' || e.key === 'P' || e.key === 'Escape') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
