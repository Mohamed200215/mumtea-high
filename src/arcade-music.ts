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
function musicApply(): void {
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
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInterval(musicTimer); if (musicOut && musicCtx) musicOut.gain.setTargetAtTime(0, musicCtx.currentTime, .05); } else musicApply(); });

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
interface GameTools { show(running: boolean, paused: boolean): void }
function gameTools(panel: Element, pause?: () => void): GameTools {
  const stop = pause ? el('button', { cls: 'chip gametool gamepause', type: 'button', hidden: '', onclick() { pause(); } }, 'Pause') : null;
  const row = el('div', { cls: 'gametools' }, ...(stop ? [stop] : []), ...soundButtons());
  (panel.querySelector('p') as Element).after(row);
  return { show(running, paused) { if (stop) { stop.hidden = !running; stop.textContent = paused ? 'Resume' : 'Pause'; stop.setAttribute('aria-pressed', String(paused)); } } };
}
const isPauseKey = (e: KeyboardEvent): boolean => (e.key === 'p' || e.key === 'P' || e.key === 'Escape') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
