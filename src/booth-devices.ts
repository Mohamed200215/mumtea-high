/* ---------- Say Fangs: the devices you can shoot on, and what each one gives you back ---------- */
interface ShotWords { caption: string; name: string; date: string }
interface CamDevice {
  id: string; name: string; noun: string; hint: string;
  w: number; h: number; s: number;
  sx: number; sy: number; sw: number; sh: number; sr: number;
  develop?: boolean; polaroid?: boolean;
  /* Where stickers can go without sitting under the device's own words: top and bottom as parts of the screen, then how much to shrink them. */
  clear?: [top: number, bottom: number, size: number];
  body(c: CanvasRenderingContext2D): void;
  after?(c: CanvasRenderingContext2D, words: ShotWords): void;
}
function devPath(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const q = Math.min(r, w / 2, h / 2);
  c.beginPath(); c.moveTo(x + q, y); c.arcTo(x + w, y, x + w, y + h, q); c.arcTo(x + w, y + h, x, y + h, q); c.arcTo(x, y + h, x, y, q); c.arcTo(x, y, x + w, y, q); c.closePath();
}
function devFill(c: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, ...stops: Array<[number, string]>): CanvasGradient {
  const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([at, col]) => g.addColorStop(at, col)); return g;
}
function devRound(c: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string | CanvasGradient, line = '', width = 2): void {
  c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = fill; c.fill();
  if (line) { c.strokeStyle = line; c.lineWidth = width; c.stroke(); }
}
function devText(c: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, fill: string, align: CanvasTextAlign = 'center', most?: number): void {
  c.font = font; c.textAlign = align; c.fillStyle = fill; c.fillText(text, x, y, most);
}
function devLines(c: CanvasRenderingContext2D, text: string, most: number, rows: number): string[] {
  const out: string[] = []; let row = '';
  text.split(/\s+/).forEach(word => {
    const next = row ? row + ' ' + word : word;
    if (c.measureText(next).width <= most || !row) row = next; else { out.push(row); row = word; }
  });
  if (row) out.push(row);
  if (out.length > rows) { out.length = rows; out[rows - 1] = out[rows - 1].replace(/.{0,2}$/, '') + '...'; }
  return out;
}
function devHeart(c: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string | CanvasGradient, line = '', width = 2): void {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(0, 18); c.bezierCurveTo(-30, -4, -24, -26, -10, -24); c.bezierCurveTo(-4, -24, 0, -18, 0, -13); c.bezierCurveTo(0, -18, 5, -24, 11, -24); c.bezierCurveTo(25, -26, 30, -4, 0, 18); c.closePath();
  c.fillStyle = fill; c.fill();
  if (line) { c.strokeStyle = line; c.lineWidth = width / s; c.stroke(); }
  c.restore();
}
function devStar(c: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, turn = .2): void {
  c.save(); c.translate(x, y); c.rotate(turn); c.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * .46 : r; c.lineTo(Math.cos(a) * d, Math.sin(a) * d); }
  c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = 'rgba(60,20,60,.35)'; c.lineWidth = 1.5; c.stroke(); c.restore();
}
/* a raised round button with a letter on it */
function devButton(c: CanvasRenderingContext2D, x: number, y: number, r: number, text: string, face: string, edge: string, ink: string, size = r * .8): void {
  c.save(); c.shadowColor = 'rgba(90,20,50,.4)'; c.shadowBlur = r * .3; c.shadowOffsetY = r * .1;
  devRound(c, x, y, r, devFill(c, x, y - r, x, y + r, [0, shade(face, .2)], [1, face]), edge, Math.max(1.5, r * .07));
  c.restore();
  if (text) devText(c, text, x, y + size * .36, '700 ' + size + 'px Nunito, sans-serif', ink);
}
function devPill(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, text: string, face: string, edge: string, ink: string, size: number): void {
  devPath(c, x, y, w, h, h / 2); c.fillStyle = devFill(c, x, y, x, y + h, [0, shade(face, .2)], [1, face]); c.fill(); c.strokeStyle = edge; c.lineWidth = 2; c.stroke();
  if (text) devText(c, text, x + w / 2, y + h / 2 + size * .36, '700 ' + size + 'px Nunito, sans-serif', ink);
}
function devSparkle(c: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  devRound(c, x, y, r, 'rgba(255,255,255,.95)');
  devRound(c, x + r * 2.2, y + r * 1.3, r * .55, 'rgba(255,255,255,.8)');
}
function gemHeart(c: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  devHeart(c, x, y, s, devFill(c, x - 20 * s, y - 24 * s, x + 20 * s, y + 18 * s, [0, '#ffb6dd'], [.5, '#f05bab'], [1, '#c22c85']), '#a81f6e', 3);
  c.fillStyle = 'rgba(255,255,255,.75)'; [[-9, -12, 5], [6, -12, 4], [-1, -2, 5], [9, -4, 3]].forEach(([dx, dy, r]) => { c.beginPath(); c.moveTo(x + dx * s, y + (dy - r) * s); c.lineTo(x + (dx + r) * s, y + dy * s); c.lineTo(x + dx * s, y + (dy + r) * s); c.lineTo(x + (dx - r) * s, y + dy * s); c.closePath(); c.fill(); });
}

const CAM_DEVICES: CamDevice[] = [
  {
    id: 'fangcam', name: 'FangCam', noun: 'Polaroid', hint: 'The classic. Prints a Polaroid in the school colours.', polaroid: true,
    w: 640, h: 480, s: 1, sx: 150, sy: 92, sw: 300, sh: 280, sr: 12,
    body(c) {
      devPath(c, 40, 60, 560, 370, 44); c.fillStyle = devFill(c, 0, 60, 0, 430, [0, '#ff8cc6'], [1, '#d40f72']); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 8; c.stroke();
      devPath(c, 140, 82, 320, 300, 16); c.fillStyle = '#08050b'; c.fill();
      devRound(c, 524, 236, 46, '#efe9f3', '#000', 6); devRound(c, 524, 236, 18, '#ff1f8f', '#000', 5);
      devRound(c, 96, 112, 14, '#35dcc8', '#000', 4);
    },
  },
  {
    id: 'fluffy', name: 'Fluffy Polaroid', noun: 'fluffy Polaroid', hint: 'Prints your picture in a soft pink fur frame with cherries and a butterfly.', develop: true,
    w: 965, h: 1135, s: .75, sx: 100, sy: 105, sw: 760, sh: 750, sr: 6,
    body(c) {
      let seed = 4242; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      c.save(); c.shadowColor = 'rgba(150,60,90,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 12;
      devPath(c, 22, 24, 921, 1087, 26); c.fillStyle = '#f7bfcb'; c.fill(); c.restore();
      const shades = ['#f8c3cf', '#f4aebf', '#fbd6de', '#fde6eb', '#eea0b5', '#f9ccd6'];
      c.lineCap = 'round';
      for (let i = 0; i < 16000; i++) {
        const x = 18 + rnd() * 929, y = 20 + rnd() * 1095, flow = Math.sin(x / 150 + y / 210) * 1.1 + Math.cos(y / 90) * .35 + .7, len = 12 + rnd() * 18;
        c.strokeStyle = shades[Math.floor(rnd() * shades.length)]; c.globalAlpha = .3 + rnd() * .45; c.lineWidth = 1 + rnd() * 1.5;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(flow) * len, y + Math.sin(flow) * len); c.stroke();
      }
      /* a touch of softness turns the strokes into fluff */
      c.globalAlpha = 1; c.filter = 'blur(1.4px)'; c.drawImage(c.canvas, 0, 0, 965, 1135); c.filter = 'none';
      c.fillStyle = '#2a1420'; c.fillRect(100, 105, 760, 750);
    },
    after(c, words) {
      /* the fur throws a soft shadow onto the picture */
      c.save(); devPath(c, 100, 105, 760, 750, 6); c.clip();
      c.shadowColor = 'rgba(120,40,70,.75)'; c.shadowBlur = 30; c.strokeStyle = '#d98aa0'; c.lineWidth = 12; devPath(c, 94, 99, 772, 762, 8); c.stroke();
      c.restore();
      /* gingham bow and cherries */
      const bow = (dir: number) => {
        c.save(); c.translate(150, 915); c.scale(dir, 1);
        c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(30, -60, 88, -74, 104, -48); c.bezierCurveTo(112, -18, 60, 10, 0, 0); c.closePath(); c.save(); c.clip();
        c.fillStyle = '#fff4f6'; c.fillRect(-10, -90, 140, 120);
        c.fillStyle = 'rgba(232,110,140,.55)'; for (let i = -10; i < 130; i += 20) c.fillRect(i, -90, 10, 120); for (let i = -90; i < 30; i += 20) c.fillRect(-10, i, 140, 10);
        c.restore(); c.strokeStyle = '#cf6d88'; c.lineWidth = 3; c.stroke();
        c.restore();
      };
      c.lineJoin = 'round';
      [[-1, 1], [1, 1]].forEach(([dir]) => {
        c.save(); c.translate(150 + dir * 40, 1040); c.rotate(dir * .22);
        c.beginPath(); c.rect(-13, -115, 28, 120); c.save(); c.clip(); c.fillStyle = '#fff4f6'; c.fillRect(-20, -120, 40, 130); c.fillStyle = 'rgba(232,110,140,.55)'; for (let i = -20; i < 20; i += 14) c.fillRect(i, -120, 7, 130); for (let i = -120; i < 10; i += 14) c.fillRect(-20, i, 40, 7); c.restore(); c.strokeStyle = '#cf6d88'; c.lineWidth = 2.5; c.stroke();
        c.restore();
      });
      c.strokeStyle = '#7d8a3c'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(152, 915); c.quadraticCurveTo(130, 950, 108, 1000); c.moveTo(152, 915); c.quadraticCurveTo(180, 950, 195, 1000); c.stroke();
      bow(-1); bow(1);
      c.save(); c.translate(235, 925); c.rotate(.12); c.beginPath(); c.moveTo(-70, 0); c.quadraticCurveTo(-20, -44, 74, -4); c.quadraticCurveTo(-4, 40, -70, 0); c.closePath(); c.fillStyle = devFill(c, -70, 0, 74, 0, [0, '#7d9648'], [1, '#b6c97e']); c.fill(); c.strokeStyle = '#51622c'; c.lineWidth = 2.5; c.stroke(); c.beginPath(); c.moveTo(-68, 0); c.lineTo(70, -3); c.stroke(); c.restore();
      devRound(c, 150, 912, 14, '#ff9db8', '#cf6d88', 2.5);
      [[103, 1032], [200, 1032]].forEach(([x, y]) => {
        const g = c.createRadialGradient(x - 14, y - 16, 4, x, y, 48); g.addColorStop(0, '#ff9fa8'); g.addColorStop(.5, '#dc3a55'); g.addColorStop(1, '#94122f');
        devRound(c, x, y, 44, g, '#7a0f26', 2.5);
        c.fillStyle = 'rgba(255,255,255,.82)'; c.beginPath(); c.ellipse(x - 14, y - 18, 13, 8, -.5, 0, 7); c.fill();
      });
      /* a glassy butterfly */
      c.save(); c.translate(860, 62); c.rotate(.08);
      for (const dir of [-1, 1]) {
        c.save(); c.scale(dir, 1);
        c.beginPath(); c.moveTo(0, -10); c.bezierCurveTo(26, -66, 100, -64, 100, -24); c.bezierCurveTo(100, 2, 44, 14, 0, 6); c.closePath(); c.fillStyle = devFill(c, 0, -60, 90, 10, [0, 'rgba(255,240,246,.95)'], [1, 'rgba(250,200,218,.95)']); c.fill(); c.strokeStyle = '#d99ab1'; c.lineWidth = 2.5; c.stroke();
        c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(44, 14, 74, 34, 62, 60); c.bezierCurveTo(46, 82, 10, 56, 0, 18); c.closePath(); c.fill(); c.stroke();
        c.restore();
      }
      c.strokeStyle = '#c98aa2'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -18); c.lineTo(0, 40); c.stroke();
      c.lineWidth = 2; c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(-16, -48, -32, -54); c.moveTo(0, -20); c.quadraticCurveTo(16, -48, 32, -54); c.stroke();
      c.restore();
      const line = words.caption || 'Mumtea High';
      c.font = '700 40px "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive';
      devLines(c, line, 560, 2).forEach((row, i) => devText(c, row, 590, 965 + i * 48, c.font, '#a33a5e'));
      devText(c, words.date, 590, 1068, '700 26px "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive', '#b9607f');
    },
  },
  {
    id: 'ds', name: 'Pink DS', noun: 'DS picture', hint: 'Your picture goes on the top screen. Your caption turns into a chat message on the touch screen.',
    w: 1025, h: 1367, s: .7, sx: 235, sy: 120, sw: 556, sh: 417, sr: 2,
    body(c) {
      const lid = devFill(c, 0, 0, 0, 660, [0, '#f8d4dc'], [1, '#f3c0cc']), low = devFill(c, 0, 700, 0, 1367, [0, '#f6ccd6'], [1, '#efb9c7']);
      devPath(c, 2, 2, 1021, 660, 26); c.fillStyle = lid; c.fill(); c.strokeStyle = '#d58d9f'; c.lineWidth = 3; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.moveTo(20, 20); c.lineTo(980, 20); c.lineTo(20, 400); c.closePath(); c.fill();
      devPath(c, 2, 690, 1021, 675, 26); c.fillStyle = low; c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.moveTo(1000, 720); c.lineTo(1000, 900); c.lineTo(800, 720); c.closePath(); c.fill();
      /* hinge */
      c.fillStyle = '#1a0d14'; c.fillRect(0, 636, 200, 20); c.fillRect(826, 636, 199, 20);
      const hinge = devFill(c, 0, 648, 0, 718, [0, '#fbdde4'], [.5, '#f3c1cd'], [1, '#dd9cad']);
      devPath(c, 196, 648, 632, 70, 6); c.fillStyle = hinge; c.fill(); c.strokeStyle = '#c98799'; c.lineWidth = 2; c.stroke();
      devPath(c, 2, 648, 198, 70, 32); c.fill(); c.stroke();
      devPath(c, 826, 648, 197, 70, 32); c.fill(); c.stroke();
      devText(c, 'L', 100, 694, '700 26px Nunito, sans-serif', '#d99eae'); devText(c, 'R', 924, 694, '700 26px Nunito, sans-serif', '#d99eae');
      c.fillStyle = '#1a0d14'; c.fillRect(486, 672, 5, 24);
      devText(c, 'MIC.', 502, 692, '700 18px Nunito, sans-serif', '#b9808f', 'left');
      c.fillStyle = '#8f8f94'; c.fillRect(790, 668, 6, 32); c.fillStyle = '#2bd13f'; c.fillRect(802, 668, 6, 32);
      /* speakers */
      for (const sx of [68, 868]) for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) devRound(c, sx + i * 45, 308 + j * 40, 6, '#1a0d14');
      devPath(c, 210, 95, 605, 465, 12); c.fillStyle = '#f2bcc9'; c.fill(); c.strokeStyle = '#d98ea2'; c.lineWidth = 3; c.stroke();
      devPath(c, 232, 117, 562, 423, 3); c.fillStyle = '#000'; c.fill();
      /* direction pad */
      c.save(); c.shadowColor = 'rgba(90,20,50,.5)'; c.shadowBlur = 10; c.shadowOffsetY = 4;
      devPath(c, 98, 868, 60, 172, 8); c.fillStyle = '#f7ccd7'; c.fill(); devPath(c, 42, 925, 172, 60, 8); c.fill(); c.restore();
      c.strokeStyle = '#7d3b4f'; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath(); c.moveTo(98, 925); c.lineTo(98, 876); c.quadraticCurveTo(98, 868, 106, 868); c.lineTo(150, 868); c.quadraticCurveTo(158, 868, 158, 876); c.lineTo(158, 925); c.lineTo(206, 925); c.quadraticCurveTo(214, 925, 214, 933); c.lineTo(214, 977); c.quadraticCurveTo(214, 985, 206, 985); c.lineTo(158, 985); c.lineTo(158, 1032); c.quadraticCurveTo(158, 1040, 150, 1040); c.lineTo(106, 1040); c.quadraticCurveTo(98, 1040, 98, 1032); c.lineTo(98, 985); c.lineTo(50, 985); c.quadraticCurveTo(42, 985, 42, 977); c.lineTo(42, 933); c.quadraticCurveTo(42, 925, 50, 925); c.closePath(); c.stroke();
      c.strokeStyle = '#fff'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(128, 888); c.lineTo(128, 916); c.moveTo(128, 992); c.lineTo(128, 1020); c.moveTo(64, 955); c.lineTo(92, 955); c.moveTo(166, 955); c.lineTo(194, 955); c.stroke();
      devPath(c, 250, 838, 525, 405, 12); c.fillStyle = '#f2bcc9'; c.fill(); c.strokeStyle = '#c67d93'; c.lineWidth = 4; c.stroke();
      devPath(c, 272, 859, 480, 360, 3); c.fillStyle = '#3d1f2c'; c.fill();
      devButton(c, 897, 900, 31, 'X', '#f4c0cd', '#a65e74', '#fff', 30); devButton(c, 833, 962, 31, 'Y', '#f4c0cd', '#a65e74', '#fff', 30);
      devButton(c, 960, 962, 31, 'A', '#f4c0cd', '#a65e74', '#fff', 30); devButton(c, 897, 1025, 31, 'B', '#f4c0cd', '#a65e74', '#fff', 30);
      ([['MENU', 1127], ['START', 1179], ['SELECT', 1231]] as Array<[string, number]>).forEach(([t, y]) => { devButton(c, 812, y, 12, '', '#f4c0cd', '#a65e74', '#fff'); devText(c, t, 834, y + 6, '700 17px Nunito, sans-serif', '#fff', 'left'); });
    },
    after(c, words) {
      /* a chat message on the touch screen */
      c.save(); devPath(c, 276, 863, 472, 352, 2); c.clip();
      c.fillStyle = '#fbfbff'; c.fillRect(276, 863, 472, 352);
      c.strokeStyle = '#cfe0ff'; c.lineWidth = 2; for (let y = 915; y < 1215; y += 38) { c.beginPath(); c.moveTo(276, y); c.lineTo(748, y); c.stroke(); }
      c.font = '800 26px Nunito, sans-serif'; const tag = words.name.slice(0, 18), wide = c.measureText(tag).width + 28;
      c.fillStyle = '#ff7ac0'; devPath(c, 286, 873, wide, 40, 8); c.fill(); c.strokeStyle = '#a81f6e'; c.lineWidth = 2; c.stroke();
      devText(c, tag, 300, 902, '800 26px Nunito, sans-serif', '#fff', 'left');
      c.font = '800 30px Nunito, sans-serif';
      devLines(c, words.caption || 'Say fangs!', 440, 4).forEach((row, i) => devText(c, row, 292, 948 + i * 38, c.font, '#2a1420', 'left'));
      devHeart(c, 690, 1160, 1.1, '#ff1f8f', '#2a1420', 2.5);
      c.strokeStyle = '#2a1420'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(600, 1178); c.quadraticCurveTo(620, 1150, 638, 1172); c.quadraticCurveTo(648, 1150, 664, 1176); c.stroke();
      devText(c, words.date, 292, 1200, '700 18px Nunito, sans-serif', '#7b6f8c', 'left');
      c.restore();
    },
  },
  {
    id: 'psp', name: 'Pink PSP', noun: 'PSP screenshot', hint: 'Your picture fills the big wide screen, like a saved screenshot.',
    w: 1170, h: 540, s: .95, sx: 258, sy: 58, sw: 643, sh: 368, sr: 2, clear: [.08, 1, .92],
    body(c) {
      c.save(); c.shadowColor = 'rgba(150,70,110,.45)'; c.shadowBlur = 14; c.shadowOffsetY = 5;
      c.beginPath(); c.moveTo(180, 26); c.lineTo(990, 26); c.quadraticCurveTo(1124, 34, 1142, 262); c.quadraticCurveTo(1148, 458, 1010, 494); c.lineTo(160, 494); c.quadraticCurveTo(22, 458, 28, 262); c.quadraticCurveTo(46, 34, 180, 26); c.closePath();
      c.fillStyle = devFill(c, 0, 26, 0, 494, [0, '#fbd5e4'], [.5, '#f7c2d6'], [1, '#efaec9']); c.fill(); c.restore();
      c.strokeStyle = '#d58cac'; c.lineWidth = 2.5; c.stroke();
      c.fillStyle = '#f2dcef'; c.beginPath(); c.moveTo(180, 26); c.quadraticCurveTo(100, 30, 66, 110); c.quadraticCurveTo(120, 50, 230, 40); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(990, 26); c.quadraticCurveTo(1070, 30, 1104, 110); c.quadraticCurveTo(1050, 50, 940, 40); c.closePath(); c.fill();
      c.fillStyle = '#100a18'; devPath(c, 256, 56, 647, 372, 3); c.fill();
      devText(c, 'MUMTEA', 176, 98, '700 22px Georgia, serif', '#fff8fc');
      for (const sx of [204, 942]) { devPath(c, sx, 122, 22, 13, 5); c.fillStyle = '#100a18'; c.fill(); }
      devRound(c, 145, 228, 88, 'rgba(255,255,255,.2)', 'rgba(190,110,150,.4)', 1.5);
      const petal = (x: number, y: number, a: number, arrow: string) => { c.save(); c.translate(x, y); c.rotate(a); devPath(c, -29, -33, 58, 66, 16); c.fillStyle = devFill(c, 0, -33, 0, 33, [0, '#fbdbe7'], [1, '#eeaac5']); c.fill(); c.strokeStyle = '#9a3e66'; c.lineWidth = 4; c.stroke(); c.restore(); devText(c, arrow, x, y + 7, '700 20px Nunito, sans-serif', '#c37b9c'); };
      petal(145, 172, 0, '▲'); petal(145, 284, 0, '▼'); petal(90, 228, 0, '◀'); petal(200, 228, 0, '▶');
      devRound(c, 1022, 228, 88, 'rgba(255,255,255,.2)', 'rgba(190,110,150,.4)', 1.5);
      ([[1022, 165, '△'], [1088, 228, '○'], [1022, 295, '✕'], [956, 228, '□']] as Array<[number, number, string]>).forEach(([x, y, t]) => devButton(c, x, y, 31, t, '#f3bdd2', '#9a3e66', '#c37b9c', 28));
      devRound(c, 148, 378, 40, devFill(c, 148, 338, 148, 418, [0, '#f9d3e2'], [1, '#eeaac5']), '#b5688c', 3);
      c.fillStyle = 'rgba(160,80,120,.45)'; for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (i * i + j * j <= 10) devRound(c, 148 + i * 9, 378 + j * 9, 1.5, 'rgba(160,80,120,.5)');
      devRound(c, 52, 342, 4, '#ffb85c'); devRound(c, 71, 394, 4, '#3fe0a0');
      devText(c, 'POWER', 1094, 348, '700 13px Nunito, sans-serif', '#d58cac', 'right'); devRound(c, 1108, 343, 4, '#3fe0a0');
      devText(c, 'HOLD', 1076, 399, '700 13px Nunito, sans-serif', '#d58cac', 'right'); devRound(c, 1088, 394, 4, '#ff8c3a');
      devPill(c, 234, 449, 66, 28, '', '#f8cde0', '#9a3e66', '#b5688c', 13); devHeart(c, 267, 464, .36, '#9a3e66');
      devPill(c, 330, 451, 36, 26, '−', '#f8cde0', '#9a3e66', '#b5688c', 18); devText(c, 'VOL', 386, 469, '700 13px Nunito, sans-serif', '#b5688c'); devPill(c, 406, 451, 36, 26, '+', '#f8cde0', '#9a3e66', '#b5688c', 18);
      devPath(c, 472, 460, 9, 8, 3); c.fillStyle = '#100a18'; c.fill();
      devText(c, 'MUMTEA', 582, 475, '700 30px Nunito, sans-serif', '#fdeaf2');
      devPill(c, 684, 451, 36, 26, '', '#f8cde0', '#9a3e66', '#b5688c', 13); devPill(c, 734, 451, 36, 26, '♪', '#f8cde0', '#9a3e66', '#b5688c', 16);
      devPill(c, 790, 451, 62, 26, 'SELECT', '#f8cde0', '#9a3e66', '#b5688c', 11); devPill(c, 862, 451, 64, 26, 'START', '#f8cde0', '#9a3e66', '#b5688c', 11);
    },
    after(c, words) {
      c.save(); devPath(c, 258, 58, 643, 368, 2); c.clip();
      c.fillStyle = 'rgba(10,6,20,.55)'; c.fillRect(258, 58, 643, 28);
      devText(c, 'SAVED TO MEMORY', 270, 78, '800 15px Nunito, sans-serif', '#fff', 'left');
      devText(c, words.date, 889, 78, '700 14px Nunito, sans-serif', '#ffd0e8', 'right');
      c.fillStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.moveTo(258, 58); c.lineTo(560, 58); c.lineTo(258, 300); c.closePath(); c.fill();
      c.restore();
    },
  },
  {
    id: 'ipod', name: 'Pink iPod', noun: 'iPod photo', hint: 'Your picture shows up in the Photos screen, ready to carry in your pocket.',
    w: 736, h: 410, s: 1.45, sx: 57, sy: 81, sw: 330, sh: 248, sr: 3, clear: [.09, .93, .9],
    body(c) {
      c.save(); c.shadowColor = 'rgba(120,70,110,.35)'; c.shadowBlur = 10; c.shadowOffsetY = 4;
      devPath(c, 16, 40, 704, 330, 44); c.fillStyle = '#f2b6d2'; c.fill(); c.restore();
      const g = c.createRadialGradient(368, 205, 90, 368, 205, 400); g.addColorStop(0, '#f9d0e3'); g.addColorStop(.75, '#f6c1da'); g.addColorStop(1, '#e695bd');
      devPath(c, 16, 40, 704, 330, 44); c.fillStyle = g; c.fill();
      devPath(c, 53, 77, 338, 256, 6); c.fillStyle = '#0d0810'; c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke();
      c.save(); c.shadowColor = 'rgba(190,110,150,.5)'; c.shadowBlur = 8;
      devRound(c, 557, 205, 119, '#fbf5f8', '#f2c2d9', 2); c.restore();
      devRound(c, 557, 205, 44, devFill(c, 557, 161, 557, 249, [0, '#fbe1ec'], [1, '#efb5d0']), '#efbcd6', 2);
      devText(c, 'MENU', 557, 136, '500 21px Nunito, sans-serif', '#eda6c8');
      c.fillStyle = '#eda6c8';
      const tri = (x: number, y: number, dir: number) => { c.beginPath(); c.moveTo(x - 8 * dir, y); c.lineTo(x + 8 * dir, y - 9); c.lineTo(x + 8 * dir, y + 9); c.closePath(); c.fill(); };
      tri(483, 205, 1); c.fillRect(472, 196, 3, 18); tri(632, 205, -1); c.fillRect(640, 196, 3, 18);
      tri(553, 281, -1); c.fillRect(566, 272, 3, 18); c.fillRect(572, 272, 3, 18);
    },
    after(c, words) {
      c.save(); devPath(c, 57, 81, 330, 248, 3); c.clip();
      c.fillStyle = devFill(c, 0, 81, 0, 103, [0, '#fff'], [1, '#d9dbe6']); c.fillRect(57, 81, 330, 22);
      devText(c, 'Photos', 222, 97, '800 13px Nunito, sans-serif', '#1a1a22');
      c.strokeStyle = '#1a1a22'; c.lineWidth = 1.2; c.strokeRect(360, 87, 20, 10); c.fillStyle = '#35c85f'; c.fillRect(362, 89, 13, 6);
      c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(57, 309, 330, 20);
      devText(c, words.caption || words.name, 222, 324, '700 13px Nunito, sans-serif', '#fff', 'center', 310);
      c.restore();
    },
  },
  {
    id: 'phone', name: 'Y2K phone', noun: 'picture message', hint: 'Your picture arrives as a picture message, with your caption underneath it.',
    w: 1152, h: 2048, s: .46, sx: 200, sy: 295, sw: 785, sh: 975, sr: 8,
    body(c) {
      c.save(); c.shadowColor = 'rgba(70,70,90,.45)'; c.shadowBlur = 26; c.shadowOffsetY = 8;
      devPath(c, 50, 22, 1085, 2000, 90); c.fillStyle = devFill(c, 50, 0, 1135, 0, [0, '#52525e'], [.05, '#8b8b96'], [.12, '#b3b3bd'], [.88, '#b3b3bd'], [.95, '#8b8b96'], [1, '#52525e']); c.fill(); c.restore();
      devPath(c, 130, 190, 925, 1730, 40); c.fillStyle = devFill(c, 0, 190, 0, 1920, [0, '#d5d8df'], [1, '#c2c6d0']); c.fill(); c.strokeStyle = '#3a3a46'; c.lineWidth = 5; c.stroke();
      devRound(c, 592, 100, 32, devFill(c, 592, 68, 592, 132, [0, '#c7c7cf'], [1, '#8d8d97']), '#74747e', 3);
      devPath(c, 496, 198, 192, 18, 9); c.fillStyle = '#a8abb4'; c.fill(); c.strokeStyle = '#6f7078'; c.lineWidth = 2; c.stroke();
      devText(c, 'mumtea', 592, 258, 'italic 700 36px Georgia, serif', '#4f4f5b');
      /* glued-on charms */
      gemHeart(c, 845, 200, 1.5); gemHeart(c, 952, 200, 1.5);
      c.save(); c.translate(165, 210); for (let i = 0; i < 5; i++) { c.rotate(Math.PI * 2 / 5); c.beginPath(); c.ellipse(0, -30, 21, 30, 0, 0, 7); c.fillStyle = '#ee9dbb'; c.fill(); c.strokeStyle = '#a8486f'; c.lineWidth = 3; c.stroke(); } devRound(c, 0, 0, 12, '#f8cfde', '#a8486f', 3); c.restore();
      devStar(c, 258, 150, 24, '#d9dbe2'); devStar(c, 138, 318, 20, '#e8e9ee');
      /* screen */
      devPath(c, 183, 280, 820, 1078, 24); c.fillStyle = '#090909'; c.fill();
      c.fillStyle = '#fbfbfb'; devPath(c, 198, 1272, 790, 74, 14); c.fill();
      devText(c, 'Option', 340, 1326, '800 40px Nunito, sans-serif', '#111');
      c.fillStyle = '#111'; c.beginPath(); c.moveTo(578, 1296); c.lineTo(616, 1296); c.lineTo(597, 1322); c.closePath(); c.fill();
      devText(c, 'Send', 835, 1326, '800 40px Nunito, sans-serif', '#111');
      /* keypad */
      const key = (x: number, y: number, w: number, h: number, big: string, small: string, side: 'l' | 'r' = 'l') => {
        devPath(c, x, y, w, h, 12); c.fillStyle = devFill(c, 0, y, 0, y + h, [0, '#eceef2'], [1, '#c8ccd5']); c.fill(); c.strokeStyle = '#2d2d38'; c.lineWidth = 4; c.stroke();
        if (side === 'l') { devText(c, big, x + 50, y + h * .68, '500 58px Nunito, sans-serif', '#222', 'center'); devText(c, small, x + 82, y + h * .66, '500 36px Nunito, sans-serif', '#444', 'left'); }
        else { devText(c, big, x + w - 50, y + h * .68, '500 58px Nunito, sans-serif', '#222', 'center'); devText(c, small, x + w - 82, y + h * .66, '500 36px Nunito, sans-serif', '#444', 'right'); }
      };
      devPath(c, 225, 1405, 735, 200, 18); c.fillStyle = devFill(c, 0, 1405, 0, 1605, [0, '#e9ebef'], [1, '#d0d4dc']); c.fill(); c.strokeStyle = '#2d2d38'; c.lineWidth = 4; c.stroke();
      devRound(c, 340, 1455, 6, '#3f78c7'); c.strokeStyle = '#3f78c7'; c.lineWidth = 6; c.beginPath(); c.moveTo(298, 1452); c.lineTo(392, 1452); c.moveTo(774, 1452); c.lineTo(868, 1452); c.stroke();
      devStar(c, 302, 1508, 22, '#ee9dbb'); devStar(c, 860, 1525, 22, '#a678cf');
      for (const [x, col, dir] of [[177, '#2f8a6d', 1], [1000, '#b43d49', -1]] as Array<[number, string, number]>) { c.strokeStyle = col; c.lineWidth = 15; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 24 * dir, 1490); c.quadraticCurveTo(x + 8 * dir, 1490, x + 26 * dir, 1540); c.stroke(); }
      key(228, 1558, 228, 92, '1', 'oo'); key(460, 1608, 258, 92, '2', 'abc'); key(722, 1558, 228, 92, '3', 'def', 'r');
      key(228, 1652, 228, 92, '4', 'ghi'); key(460, 1702, 258, 92, '5', 'jkl'); key(722, 1652, 228, 92, '6', 'mno', 'r');
      key(228, 1746, 228, 92, '7', 'pqrs'); key(460, 1796, 258, 92, '8', 'tuv'); key(722, 1746, 228, 92, '9', 'wxyz', 'r');
      key(228, 1840, 228, 76, '*', '+'); key(460, 1890, 258, 26, '', ''); key(722, 1840, 228, 76, '#', '', 'r');
      c.save(); c.shadowColor = 'rgba(40,40,50,.4)'; c.shadowBlur = 12;
      c.beginPath(); c.ellipse(592, 1510, 148, 112, 0, 0, 7); c.fillStyle = '#d9dce3'; c.fill(); c.strokeStyle = '#17171e'; c.lineWidth = 8; c.stroke(); c.restore();
      c.beginPath(); c.ellipse(592, 1510, 100, 86, 0, 0, 7); c.fillStyle = '#eef0f4'; c.fill(); c.strokeStyle = '#9a9ca6'; c.lineWidth = 3; c.stroke();
      gemHeart(c, 592, 1516, 1.7);
      devStar(c, 696, 1826, 26, '#7fdcd6');
      gemHeart(c, 585, 1752, .9);
    },
    after(c, words) {
      c.save(); devPath(c, 200, 295, 785, 975, 8); c.clip();
      c.fillStyle = 'rgba(16,10,26,.55)'; c.fillRect(200, 295, 785, 62);
      c.fillStyle = '#fff'; [0, 1, 2, 3].forEach(i => c.fillRect(226 + i * 16, 340 - i * 9, 10, 8 + i * 9));
      devText(c, 'New picture message', 592, 340, '800 32px Nunito, sans-serif', '#fff');
      c.strokeStyle = '#fff'; c.lineWidth = 4; c.strokeRect(902, 314, 58, 28); c.fillStyle = '#8df04a'; c.fillRect(908, 320, 38, 16);
      c.font = '800 38px Nunito, sans-serif';
      const rows = devLines(c, words.caption, 720, 3), tall = 62 + rows.length * 46;
      c.fillStyle = 'rgba(16,10,26,.68)'; c.fillRect(200, 1270 - tall, 785, tall);
      devText(c, 'From: ' + words.name, 226, 1270 - tall + 46, '800 32px Nunito, sans-serif', '#ff9ed0', 'left', 730);
      rows.forEach((row, i) => devText(c, row, 226, 1270 - tall + 94 + i * 46, '800 38px Nunito, sans-serif', '#fff', 'left'));
      c.restore();
    },
  },
  {
    id: 'tv', name: 'Retro TV', noun: 'TV moment', hint: 'You go on air, with scan lines, a channel number and your name across the bottom.',
    w: 1015, h: 655, s: 1, sx: 85, sy: 60, sw: 660, sh: 548, sr: 80, clear: [.12, .81, .8],
    body(c) {
      devPath(c, 6, 6, 1003, 643, 16); c.fillStyle = devFill(c, 0, 6, 0, 649, [0, '#f49ac3'], [1, '#e77aad']); c.fill(); c.strokeStyle = '#a1477c'; c.lineWidth = 3; c.stroke();
      devPath(c, 46, 34, 736, 600, 34); c.fillStyle = devFill(c, 46, 34, 46, 634, [0, '#d44a94'], [.5, '#ea6dab'], [1, '#cc4190']); c.fill(); c.strokeStyle = '#a42e72'; c.lineWidth = 3; c.stroke();
      devPath(c, 64, 46, 700, 576, 88); c.fillStyle = '#8a2666'; c.fill();
      devPath(c, 82, 57, 666, 554, 82); c.fillStyle = '#100a14'; c.fill(); c.strokeStyle = '#88808a'; c.lineWidth = 5; c.stroke();
      c.strokeStyle = '#b85690'; c.lineWidth = 3; c.beginPath(); c.moveTo(804, 8); c.lineTo(804, 647); c.moveTo(804, 44); c.lineTo(1009, 44); c.moveTo(860, 44); c.lineTo(860, 350); c.moveTo(804, 350); c.lineTo(1009, 350); c.moveTo(804, 628); c.lineTo(1009, 628); c.stroke();
      for (const y of [130, 262]) {
        devRound(c, 942, y, 54, devFill(c, 888, y - 54, 996, y + 54, [0, '#f5d4e4'], [1, '#b3688f']), '#7f3d62', 2.5);
        devRound(c, 942, y, 40, devFill(c, 942, y - 40, 942, y + 40, [0, '#c37aa0'], [1, '#e9bfd4']), '#7f3d62', 2);
        devRound(c, 942, y, 24, devFill(c, 942, y - 24, 942, y + 24, [0, '#fbeef4'], [1, '#c98aab']), '#7f3d62', 2);
        devText(c, 'PUSH', 942, y + 5, '800 12px Nunito, sans-serif', '#6b2f52');
      }
      for (const y of [258, 310]) { devRound(c, 833, y, 14, devFill(c, 833, y - 14, 833, y + 14, [0, '#c7b6c2'], [1, '#5e4b58']), '#4a3844', 2); devRound(c, 833, y, 6, '#3e2d38'); }
      c.fillStyle = '#b64d88'; for (let y = 372; y < 620; y += 15) c.fillRect(816, y, 186, 8);
      /* stickers */
      c.save(); c.translate(820, 116); c.rotate(-.1);
      devRound(c, 0, 0, 40, '#f8cf3a', 'rgba(120,80,0,.4)', 1.5);
      c.fillStyle = '#7a3a10'; devRound(c, -14, -12, 4, '#7a3a10'); devRound(c, 14, -12, 4, '#7a3a10'); devRound(c, 0, 0, 9, '#f25a6c', '#7a3a10', 1.5);
      c.strokeStyle = '#7a3a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(-22, 16); c.quadraticCurveTo(-14, 8, -8, 16); c.quadraticCurveTo(0, 24, 8, 16); c.quadraticCurveTo(14, 8, 22, 16); c.stroke();
      c.restore();
      devStar(c, 782, 38, 16, '#62c7ea', .3); devStar(c, 835, 152, 18, '#7fe08a', -.2); devStar(c, 884, 76, 15, '#8a6ad8', .1);
      c.save(); c.translate(869, 206); c.rotate(-.07); c.fillStyle = '#f6e04a'; c.fillRect(-28, -13, 56, 26); devText(c, '13 FEB', 0, 5, '800 13px Nunito, sans-serif', '#5a4a00'); c.restore();
      const mine = (x: number, y: number, s: number, turn: number) => { c.save(); c.translate(x, y); c.rotate(turn); devHeart(c, 0, 0, s, devFill(c, 0, -24 * s, 0, 18 * s, [0, '#ee4d95'], [1, '#b81464']), '#f9b5d6', 3); devText(c, 'MINE', 0, -1 * s, '800 ' + 11 * s + 'px Nunito, sans-serif', '#ffe3f0'); c.restore(); };
      mine(939, 432, 2, -.05); mine(865, 543, 1.7, -.2); mine(918, 568, 1.9, .06);
    },
    after(c, words) {
      c.save(); devPath(c, 85, 60, 660, 548, 80); c.clip();
      c.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 60; y < 608; y += 4) c.fillRect(85, y, 660, 1.5);
      const g = c.createRadialGradient(415, 334, 210, 415, 334, 420); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.58)'); c.fillStyle = g; c.fillRect(85, 60, 660, 548);
      c.fillStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.moveTo(85, 60); c.lineTo(500, 60); c.quadraticCurveTo(300, 150, 85, 340); c.closePath(); c.fill();
      devText(c, 'CH 13', 696, 118, '800 30px Nunito, sans-serif', '#8df04a', 'right');
      devRound(c, 148, 108, 9, '#ff2f4d'); devText(c, 'ON AIR', 164, 117, '800 26px Nunito, sans-serif', '#fff', 'left');
      c.fillStyle = 'rgba(255,31,143,.92)'; c.fillRect(110, 505, 610, 48);
      c.fillStyle = '#17101c'; c.fillRect(110, 553, 610, 28);
      devText(c, words.name.toUpperCase(), 124, 540, '800 30px Nunito, sans-serif', '#fff', 'left', 580);
      devText(c, words.caption || 'Live from Mumtea High', 124, 574, '700 19px Nunito, sans-serif', '#ffd0e8', 'left', 580);
      c.restore();
      devPath(c, 85, 60, 660, 548, 80); c.strokeStyle = 'rgba(190,190,200,.7)'; c.lineWidth = 3; c.stroke();
    },
  },
  {
    id: 'music', name: 'Music player', noun: 'album cover', hint: 'You become the album cover. Your caption is the song title.',
    w: 736, h: 1308, s: .9, sx: 101, sy: 203, sw: 533, sh: 533, sr: 10,
    body(c) {
      c.save(); c.shadowColor = 'rgba(120,40,80,.25)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
      devPath(c, 61, 163, 614, 984, 78); c.fillStyle = devFill(c, 0, 163, 0, 1147, [0, '#7c4158'], [1, '#8c4563']); c.fill(); c.restore();
      c.save(); c.shadowColor = 'rgba(30,5,20,.5)'; c.shadowBlur = 34; c.shadowOffsetY = 18; devPath(c, 101, 203, 533, 533, 10); c.fillStyle = '#25101c'; c.fill(); c.restore();
      devText(c, '1:30', 125, 890, '500 19px Nunito, sans-serif', '#f6a8c6');
      devText(c, '-1:27', 603, 890, '500 19px Nunito, sans-serif', '#f6a8c6');
      devPath(c, 168, 877, 387, 13, 6); c.fillStyle = '#ff7fa8'; c.fill();
      devPath(c, 168, 877, 197, 13, 6); c.fillStyle = '#f9c2d4'; c.fill();
      c.fillStyle = '#fff';
      const tri = (x: number, y: number, dir: number, r: number) => { c.beginPath(); c.moveTo(x + r * dir, y); c.lineTo(x - r * dir * .9, y - r); c.lineTo(x - r * dir * .9, y + r); c.closePath(); c.fill(); };
      tri(240, 974, -1, 16); tri(267, 974, -1, 16); tri(466, 974, 1, 16); tri(494, 974, 1, 16);
      devPath(c, 348, 948, 16, 54, 4); c.fill(); devPath(c, 372, 948, 16, 54, 4); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; [10, 17, 24].forEach(r => { c.beginPath(); c.arc(593, 978, r, Math.PI, 0); c.stroke(); });
      c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.moveTo(593, 972); c.lineTo(609, 996); c.lineTo(577, 996); c.closePath(); c.fill();
      devPath(c, 158, 1059, 420, 12, 6); c.fillStyle = '#f9c2d4'; c.fill();
      devText(c, '◀', 120, 1072, '500 20px Nunito, sans-serif', '#ff7fa8'); devText(c, '▶))', 612, 1072, '500 20px Nunito, sans-serif', '#ff7fa8');
    },
    after(c, words) {
      devText(c, words.caption || 'Say Fangs', 109, 794, '800 34px Nunito, sans-serif', '#fff', 'left', 520);
      devText(c, words.name + ' — Mumtea High', 109, 832, '600 24px Nunito, sans-serif', '#f6a8c6', 'left', 520);
    },
  },
];
const camDevice = (id: string): CamDevice => CAM_DEVICES.find(d => d.id === id) || CAM_DEVICES[0];
const deviceBodies: Record<string, HTMLCanvasElement> = {};
/* The body stays ready-made, since the fur alone is thousands of strokes. */
function deviceBody(d: CamDevice): HTMLCanvasElement {
  if (deviceBodies[d.id]) return deviceBodies[d.id];
  const cv = document.createElement('canvas'); cv.width = Math.round(d.w * d.s); cv.height = Math.round(d.h * d.s);
  const c = cv.getContext('2d') as CanvasRenderingContext2D;
  c.scale(d.s, d.s); d.body(c);
  deviceBodies[d.id] = cv;
  return cv;
}
function drawDeviceShot(d: CamDevice, photo: HTMLCanvasElement | null, words: ShotWords): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = Math.round(d.w * d.s); cv.height = Math.round(d.h * d.s);
  const c = cv.getContext('2d') as CanvasRenderingContext2D;
  c.drawImage(deviceBody(d), 0, 0);
  c.scale(d.s, d.s);
  if (photo) {
    c.save(); devPath(c, d.sx, d.sy, d.sw, d.sh, d.sr); c.clip();
    c.drawImage(photo, d.sx, d.sy, d.sw, d.sh);
    c.restore();
  }
  d.after?.(c, words);
  return cv;
}
